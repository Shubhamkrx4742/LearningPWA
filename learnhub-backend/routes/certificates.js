const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const router = express.Router();

const db = require("../database/database");
const authenticateToken = require("../middleware/auth");

const coursesPath = path.join(
  __dirname,
  "..",
  "data",
  "courses.json"
);

const chaptersPath = path.join(
  __dirname,
  "..",
  "data",
  "chapters.json"
);

function readJson(filePath) {
  return JSON.parse(
    fs.readFileSync(filePath, "utf-8")
  );
}

// ==================================================
// GET /api/certificates/course/:courseId
// ==================================================

router.get(
  "/course/:courseId",
  authenticateToken,
  (req, res) => {
    try {
      const userId = req.user.id;

      const courseId = Number(
        req.params.courseId
      );

      if (!Number.isInteger(courseId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID",
        });
      }

      // ----------------------------------------------
      // CHECK EXISTING CERTIFICATE
      // ----------------------------------------------

      const existingCertificate = db
        .prepare(`
          SELECT *
          FROM certificates
          WHERE user_id = ?
            AND course_id = ?
          LIMIT 1
        `)
        .get(userId, courseId);

      if (existingCertificate) {
        return res.json({
          success: true,
          eligible: true,
          certificate: existingCertificate,
        });
      }

      // ----------------------------------------------
      // LOAD COURSE
      // ----------------------------------------------

      const courses = readJson(coursesPath);

      const course = courses.find(
        (item) =>
          Number(item.id) === courseId
      );

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      // ----------------------------------------------
      // LOAD CHAPTERS
      // ----------------------------------------------

      const chapters = readJson(chaptersPath)
        .filter(
          (chapter) =>
            Number(chapter.course_id) ===
            courseId
        )
        .sort(
          (a, b) =>
            Number(a.chapter_number) -
            Number(b.chapter_number)
        );

      if (!chapters.length) {
        return res.status(404).json({
          success: false,
          message:
            "No chapters found for this course",
        });
      }

      // ----------------------------------------------
      // CHECK COMPLETION
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

      const completed =
        Number(completedCount.count);

      const total = chapters.length;

      const isComplete =
        completed === total;

      if (!isComplete) {
        return res.json({
          success: true,

          eligible: false,

          completed,

          total,

          message:
            "Complete all chapters to receive your certificate.",
        });
      }

      // ----------------------------------------------
      // GET USER
      // ----------------------------------------------

      const user = db
        .prepare(`
          SELECT
            id,
            name,
            email
          FROM users
          WHERE id = ?
          LIMIT 1
        `)
        .get(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // ----------------------------------------------
      // CREATE CERTIFICATE ID
      // ----------------------------------------------

      const certificateId =
        `LH-${Date.now()}-${crypto
          .randomBytes(4)
          .toString("hex")
          .toUpperCase()}`;

      // ----------------------------------------------
      // SAVE CERTIFICATE
      // ----------------------------------------------

      db.prepare(`
        INSERT INTO certificates (
          certificate_id,
          user_id,
          course_id,
          user_name,
          user_email,
          course_title
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        certificateId,
        user.id,
        course.id,
        user.name,
        user.email,
        course.title
      );

      // ----------------------------------------------
      // GET CREATED CERTIFICATE
      // ----------------------------------------------

      const certificate = db
        .prepare(`
          SELECT *
          FROM certificates
          WHERE certificate_id = ?
          LIMIT 1
        `)
        .get(certificateId);

      return res.json({
        success: true,

        eligible: true,

        certificate,
      });
    } catch (error) {
      console.error(
        "Certificate error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to generate certificate",
        error: error.message,
      });
    }
  }
);

module.exports = router;