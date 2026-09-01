const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const db = require("../database/database");
const authenticateToken = require("../middleware/auth");

const chaptersPath = path.join(
  __dirname,
  "..",
  "data",
  "chapters.json"
);

function readChapters() {
  const raw = fs.readFileSync(chaptersPath, "utf-8");
  return JSON.parse(raw);
}

// ==================================================
// GET COURSE PROGRESS
// ==================================================

router.get(
  "/course/:courseId",
  authenticateToken,
  (req, res) => {
    try {
      const userId = req.user.id;
      const courseId = Number(req.params.courseId);

      if (!Number.isInteger(courseId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID",
        });
      }

      const chapters = readChapters()
        .filter(
          (chapter) =>
            Number(chapter.course_id) === courseId
        )
        .sort(
          (a, b) =>
            Number(a.chapter_number) -
            Number(b.chapter_number)
        );

      const progress = db
        .prepare(`
          SELECT
            chapter_id,
            completed,
            completed_at
          FROM chapter_progress
          WHERE user_id = ?
            AND course_id = ?
        `)
        .all(userId, courseId);

      const reviews = db
        .prepare(`
          SELECT
            chapter_id,
            rating,
            feedback,
            created_at
          FROM chapter_reviews
          WHERE user_id = ?
            AND course_id = ?
        `)
        .all(userId, courseId);

      const progressMap = new Map(
        progress.map((item) => [
          Number(item.chapter_id),
          item,
        ])
      );

      const reviewMap = new Map(
        reviews.map((item) => [
          Number(item.chapter_id),
          item,
        ])
      );

      const chapterProgress = chapters.map(
        (chapter, index) => {
          const savedProgress =
            progressMap.get(Number(chapter.id));

          const review =
            reviewMap.get(Number(chapter.id));

          const previousChapter =
            index > 0 ? chapters[index - 1] : null;

          const previousCompleted =
            previousChapter
              ? Boolean(
                  progressMap.get(
                    Number(previousChapter.id)
                  )?.completed
                )
              : true;

          return {
            chapterId: chapter.id,
            chapterNumber: chapter.chapter_number,
            title: chapter.title,

            completed:
              Boolean(savedProgress?.completed),

            completedAt:
              savedProgress?.completed_at || null,

            locked: !previousCompleted,

            previousChapterId:
              previousChapter?.id || null,

            review: review
              ? {
                  rating: review.rating,
                  feedback: review.feedback,
                  createdAt: review.created_at,
                }
              : null,
          };
        }
      );

      const completedCount =
        chapterProgress.filter(
          (item) => item.completed
        ).length;

      return res.json({
        success: true,

        progress,

        reviews,

        chapters: chapterProgress,

        completedCount,

        totalChapters: chapters.length,

        courseCompleted:
          chapters.length > 0 &&
          completedCount === chapters.length,
      });
    } catch (error) {
      console.error("Progress error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to load course progress",
      });
    }
  }
);

// ==================================================
// COMPLETE CHAPTER + SAVE REVIEW
// ==================================================

router.post(
  "/course/:courseId/chapters/:chapterId/complete",
  authenticateToken,
  (req, res) => {
    try {
      const userId = req.user.id;

      const courseId = Number(
        req.params.courseId
      );

      const chapterId = Number(
        req.params.chapterId
      );

      const { rating, feedback } = req.body;

      // ----------------------------------------------
      // VALIDATE IDs
      // ----------------------------------------------

      if (
        !Number.isInteger(courseId) ||
        !Number.isInteger(chapterId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid course or chapter ID",
        });
      }

      // ----------------------------------------------
      // VALIDATE RATING
      // ----------------------------------------------

      const numericRating = Number(rating);

      if (
        !Number.isInteger(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide a rating between 1 and 5",
        });
      }

      // ----------------------------------------------
      // VALIDATE FEEDBACK
      // ----------------------------------------------

      const cleanFeedback =
        typeof feedback === "string"
          ? feedback.trim()
          : "";

      if (cleanFeedback.length > 1000) {
        return res.status(400).json({
          success: false,
          message:
            "Feedback must be 1000 characters or less",
        });
      }

      // ----------------------------------------------
      // LOAD COURSE CHAPTERS
      // ----------------------------------------------

      const chapters = readChapters()
        .filter(
          (chapter) =>
            Number(chapter.course_id) === courseId
        )
        .sort(
          (a, b) =>
            Number(a.chapter_number) -
            Number(b.chapter_number)
        );

      if (!chapters.length) {
        return res.status(404).json({
          success: false,
          message: "No chapters found for this course",
        });
      }

      // ----------------------------------------------
      // FIND CURRENT CHAPTER
      // ----------------------------------------------

      const currentIndex = chapters.findIndex(
        (chapter) =>
          Number(chapter.id) === chapterId
      );

      if (currentIndex === -1) {
        return res.status(404).json({
          success: false,
          message:
            "Chapter does not belong to this course",
        });
      }

      // ----------------------------------------------
      // CHECK PREVIOUS CHAPTER
      // ----------------------------------------------

      if (currentIndex > 0) {
        const previousChapter =
          chapters[currentIndex - 1];

        const previousProgress = db
          .prepare(`
            SELECT completed
            FROM chapter_progress
            WHERE user_id = ?
              AND course_id = ?
              AND chapter_id = ?
              AND completed = 1
          `)
          .get(
            userId,
            courseId,
            previousChapter.id
          );

        if (!previousProgress) {
          return res.status(403).json({
            success: false,
            message:
              `Complete "${previousChapter.title}" before continuing.`,
            locked: true,
            previousChapterId:
              previousChapter.id,
          });
        }
      }

      // ----------------------------------------------
      // SAVE PROGRESS + REVIEW
      // ----------------------------------------------

      const transaction = db.transaction(() => {
        db.prepare(`
          INSERT INTO chapter_reviews (
            user_id,
            course_id,
            chapter_id,
            rating,
            feedback
          )
          VALUES (?, ?, ?, ?, ?)

          ON CONFLICT(
            user_id,
            course_id,
            chapter_id
          )
          DO UPDATE SET
            rating = excluded.rating,
            feedback = excluded.feedback,
            created_at = CURRENT_TIMESTAMP
        `).run(
          userId,
          courseId,
          chapterId,
          numericRating,
          cleanFeedback
        );

        db.prepare(`
          INSERT INTO chapter_progress (
            user_id,
            course_id,
            chapter_id,
            completed,
            completed_at
          )
          VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)

          ON CONFLICT(
            user_id,
            course_id,
            chapter_id
          )
          DO UPDATE SET
            completed = 1,
            completed_at = CURRENT_TIMESTAMP
        `).run(
          userId,
          courseId,
          chapterId
        );
      });

      transaction();

      // ----------------------------------------------
      // CHECK COURSE COMPLETION
      // ----------------------------------------------

      const completedCount = db
        .prepare(`
          SELECT COUNT(*) AS count
          FROM chapter_progress
          WHERE user_id = ?
            AND course_id = ?
            AND completed = 1
        `)
        .get(userId, courseId);

      const courseCompleted =
        completedCount.count === chapters.length;

      return res.json({
        success: true,

        message:
          "Chapter completed successfully.",

        chapterId,

        courseCompleted,

        completedCount:
          completedCount.count,

        totalChapters:
          chapters.length,
      });
    } catch (error) {
      console.error(
        "Complete chapter error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to complete chapter",
        error: error.message,
      });
    }
  }
);

module.exports = router;