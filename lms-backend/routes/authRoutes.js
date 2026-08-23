const express = require("express");

const router = express.Router();

const {
  register,
  login,
  logout,
  getMe,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");


// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Current User
router.get("/me", protect, getMe);

// Logout
router.post("/logout", logout);

module.exports = router;