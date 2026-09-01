const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

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
// GET ALL CHAPTERS FOR COURSE
// ==================================================

router.get("/course/:courseId", (req, res) => {
  try {
    const courseId = Number(req.params.courseId);

    if (!Number.isInteger(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const chapters = readChapters();

    const courseChapters = chapters
      .filter((chapter) => Number(chapter.course_id) === courseId)
      .sort(
        (a, b) =>
          Number(a.chapter_number) -
          Number(b.chapter_number)
      );

    return res.json({
      success: true,
      data: courseChapters,
    });
  } catch (error) {
    console.error("Get chapters error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load chapters",
    });
  }
});

// ==================================================
// GET SINGLE CHAPTER
// ==================================================

router.get("/:chapterId", (req, res) => {
  try {
    const chapterId = Number(req.params.chapterId);

    if (!Number.isInteger(chapterId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chapter ID",
      });
    }

    const chapters = readChapters();

    const chapter = chapters.find(
      (item) => Number(item.id) === chapterId
    );

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    return res.json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    console.error("Get chapter error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load chapter",
    });
  }
});

module.exports = router;