const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

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
// GET ALL COURSES
// ==================================================

router.get("/", (req, res) => {
  try {
    const courses = readJson(coursesPath);

    return res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error(
      "Get courses error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load courses",
    });
  }
});

// ==================================================
// GET SINGLE COURSE
// ==================================================

router.get("/:courseId", (req, res) => {
  try {
    const courseId = Number(
      req.params.courseId
    );

    if (!Number.isInteger(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const courses = readJson(coursesPath);

    const chapters = readJson(chaptersPath);

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

    const courseChapters = chapters
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

    return res.json({
      success: true,

      data: {
        ...course,

        chapters: courseChapters,
      },
    });
  } catch (error) {
    console.error(
      "Get course error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load course",
    });
  }
});

module.exports = router;