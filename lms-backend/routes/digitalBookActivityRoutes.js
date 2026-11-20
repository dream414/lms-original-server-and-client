const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getMyActivities,
  getAllActivities,
  getBookActivities,
  getActivityStats,
} = require("../controllers/digitalBookActivityController");

// =================================
// My Activities
// =================================
router.get(
  "/my",
  protect,
  getMyActivities
);

// =================================
// Activity Statistics
// =================================
router.get(
  "/stats",
  protect,
  authorize("digital", "admin", "superadmin"),
  getActivityStats
);

// =================================
// Activities of Specific Book
// =================================
router.get(
  "/book/:id",
  protect,
  authorize("digital", "admin", "superadmin"),
  getBookActivities
);

// =================================
// All Activities
// =================================
router.get(
  "/",
  protect,
  authorize("digital", "admin", "superadmin"),
  getAllActivities
);

module.exports = router;