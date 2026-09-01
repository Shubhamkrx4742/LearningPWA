const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Database = require("better-sqlite3");

const router = express.Router();

// ==================================================
// DATABASE
// ==================================================

const db = new Database("./data/learnhub.db");

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ==================================================
// VALIDATION
// ==================================================

function validateName(name) {
  return (
    typeof name === "string" &&
    name.trim().length >= 2 &&
    name.trim().length <= 50
  );
}

function validateEmail(email) {
  if (typeof email !== "string") {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim().toLowerCase()
  );
}

function validatePassword(password) {
  if (typeof password !== "string") {
    return false;
  }

  return (
    password.length >= 8 &&
    password.length <= 100 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

// ==================================================
// JWT
// ==================================================

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

// ==================================================
// REGISTER
// POST /api/auth/register
// ==================================================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const cleanName =
      typeof name === "string"
        ? name.trim()
        : "";

    const cleanEmail =
      typeof email === "string"
        ? email.trim().toLowerCase()
        : "";

    // ----------------------------------------------
    // VALIDATION
    // ----------------------------------------------

    const errors = {};

    if (!validateName(cleanName)) {
      errors.name =
        "Name must contain between 2 and 50 characters.";
    }

    if (!validateEmail(cleanEmail)) {
      errors.email =
        "Please enter a valid email address.";
    }

    if (!validatePassword(password)) {
      errors.password =
        "Password must be 8-100 characters and contain uppercase, lowercase and a number.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please fix the validation errors.",
        errors,
      });
    }

    // ----------------------------------------------
    // CHECK EXISTING USER
    // ----------------------------------------------

    const existingUser = db
      .prepare(
        "SELECT id FROM users WHERE email = ?"
      )
      .get(cleanEmail);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
        errors: {
          email:
            "This email is already registered.",
        },
      });
    }

    // ----------------------------------------------
    // HASH PASSWORD
    // ----------------------------------------------

    const hashedPassword =
      await bcrypt.hash(password, 12);

    // ----------------------------------------------
    // CREATE USER
    // ----------------------------------------------

    const result = db
      .prepare(
        `
        INSERT INTO users
        (name, email, password)
        VALUES (?, ?, ?)
        `
      )
      .run(
        cleanName,
        cleanEmail,
        hashedPassword
      );

    const user = {
      id: result.lastInsertRowid,
      name: cleanName,
      email: cleanEmail,
    };

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user,
    });
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create your account.",
    });
  }
});

// ==================================================
// LOGIN
// POST /api/auth/login
// ==================================================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const cleanEmail =
      typeof email === "string"
        ? email.trim().toLowerCase()
        : "";

    // ----------------------------------------------
    // VALIDATION
    // ----------------------------------------------

    if (!validateEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address.",
      });
    }

    if (
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password is required.",
      });
    }

    // ----------------------------------------------
    // FIND USER
    // ----------------------------------------------

    const user = db
      .prepare(
        `
        SELECT *
        FROM users
        WHERE email = ?
        `
      )
      .get(cleanEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // ----------------------------------------------
    // CHECK PASSWORD
    // ----------------------------------------------

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // ----------------------------------------------
    // CREATE TOKEN
    // ----------------------------------------------

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = createToken(
      safeUser
    );

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to login right now.",
    });
  }
});

// ==================================================
// GET CURRENT USER
// GET /api/auth/me
// ==================================================

router.get("/me", (req, res) => {
  try {
    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token =
      authorization.substring(7);

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    const user = db
      .prepare(
        `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = ?
        `
      )
      .get(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired session.",
    });
  }
});

module.exports = router;