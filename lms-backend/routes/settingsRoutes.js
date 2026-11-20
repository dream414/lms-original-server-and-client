const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

// ========================================
// Get Settings
// ========================================

router.get(
  "/",
  protect,
  authorize("superadmin", "admin"),
  getSettings
);

// ========================================
// Update Settings
// ========================================

router.put(
  "/",
  protect,
  authorize("superadmin", "admin"),
  updateSettings
);

module.exports = router;