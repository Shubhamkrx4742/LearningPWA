const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// ==================================================
// DATABASE DIRECTORY
// ==================================================

const databaseDirectory = path.join(__dirname);

if (!fs.existsSync(databaseDirectory)) {
  fs.mkdirSync(databaseDirectory, {
    recursive: true,
  });
}

// ==================================================
// DATABASE FILE
// ==================================================

const databasePath = path.join(
  databaseDirectory,
  "learnhub.db"
);

const db = new Database(databasePath);

// ==================================================
// SQLITE SETTINGS
// ==================================================

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ==================================================
// USERS
// ==================================================

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    email TEXT NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    created_at DATETIME
      DEFAULT CURRENT_TIMESTAMP
  );
`);

// ==================================================
// CHAPTER PROGRESS
// ==================================================

db.exec(`
  CREATE TABLE IF NOT EXISTS chapter_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    course_id INTEGER NOT NULL,

    chapter_id INTEGER NOT NULL,

    completed INTEGER NOT NULL DEFAULT 0,

    completed_at DATETIME,

    created_at DATETIME
      DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (
      user_id,
      course_id,
      chapter_id
    ),

    FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
  );
`);

// ==================================================
// CHAPTER REVIEWS
// ==================================================

db.exec(`
  CREATE TABLE IF NOT EXISTS chapter_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    course_id INTEGER NOT NULL,

    chapter_id INTEGER NOT NULL,

    rating INTEGER NOT NULL,

    feedback TEXT DEFAULT "",

    created_at DATETIME
      DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (
      user_id,
      course_id,
      chapter_id
    ),

    FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
  );
`);

// ==================================================
// CERTIFICATES
// ==================================================

db.exec(`
  CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    certificate_id TEXT NOT NULL UNIQUE,

    user_id INTEGER NOT NULL,

    course_id INTEGER NOT NULL,

    user_name TEXT NOT NULL,

    user_email TEXT NOT NULL,

    course_title TEXT NOT NULL,

    issued_at DATETIME
      DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (
      user_id,
      course_id
    ),

    FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
  );
`);

// ==================================================
// INDEXES
// ==================================================

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_progress_user_course
  ON chapter_progress (
    user_id,
    course_id
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_progress_chapter
  ON chapter_progress (
    user_id,
    course_id,
    chapter_id
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_reviews_user_course
  ON chapter_reviews (
    user_id,
    course_id
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_certificates_user_course
  ON certificates (
    user_id,
    course_id
  );
`);

// ==================================================
// DATABASE READY
// ==================================================

console.log(
  "LearnHub SQLite database ready:"
);

console.log(databasePath);

// ==================================================
// EXPORT
// ==================================================

module.exports = db;