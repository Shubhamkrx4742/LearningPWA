const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const coursesRouter = require("./routes/courses");
const chaptersRouter = require("./routes/chapters");
const tutorRouter = require("./routes/tutor");
const authRouter = require("./routes/auth");
const progressRouter = require("./routes/progress");
const certificatesRouter = require("./routes/certificates");

const app = express();

const PORT = process.env.PORT || 8000;

// ==================================================
// CORS
// ==================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(
        "CORS blocked origin:",
        origin
      );

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ==================================================
// BODY PARSER
// ==================================================

app.use(
  express.json({
    limit: "1mb",
  })
);

// ==================================================
// HEALTH CHECK
// ==================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LearnHub backend is healthy",
  });
});

// ==================================================
// AUTH
// ==================================================

app.use(
  "/api/auth",
  authRouter
);

// ==================================================
// COURSES
// ==================================================

app.use(
  "/api/courses",
  coursesRouter
);

// ==================================================
// CHAPTERS
// ==================================================

app.use(
  "/api/chapters",
  chaptersRouter
);

// ==================================================
// AI TUTOR
// ==================================================

app.use(
  "/api/tutor",
  tutorRouter
);

// ==================================================
// PROGRESS
// ==================================================

app.use(
  "/api/progress",
  progressRouter
);

// ==================================================
// CERTIFICATES
// ==================================================

app.use(
  "/api/certificates",
  certificatesRouter
);

// ==================================================
// 404
// ==================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ==================================================
// ERROR HANDLER
// ==================================================

app.use(
  (err, req, res, next) => {
    console.error(
      "Backend Error:",
      err
    );

    if (
      err.message ===
      "Not allowed by CORS"
    ) {
      return res.status(403).json({
        success: false,
        message: "CORS error",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
);

// ==================================================
// START SERVER
// ==================================================

app.listen(PORT, () => {
  console.log(
    "================================="
  );

  console.log(
    "LearnHub Backend Started"
  );

  console.log(
    `Server: http://localhost:${PORT}`
  );

  console.log(
    `API: http://localhost:${PORT}/api`
  );

  console.log(
    "================================="
  );
});