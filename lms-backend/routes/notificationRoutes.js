
const express = require("express");

const router = express.Router();

const {
  getNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

// =====================================
// GET MY NOTIFICATIONS
// =====================================
//
// GET /api/notifications
//
// All logged-in users can see
// their own notifications.
//
// =====================================

router.get(
  "/",
  protect,
  getNotifications
);

// =====================================
// MARK NOTIFICATION AS READ
// =====================================
//
// PUT /api/notifications/:id
//
// User can update only their own
// notification.
//
// =====================================

router.put(
  "/:id",
  protect,
  markAsRead
);

// =====================================
// DELETE NOTIFICATION
// =====================================
//
// DELETE /api/notifications/:id
//
// User can delete only their own
// notification.
//
// =====================================

router.delete(
  "/:id",
  protect,
  deleteNotification
);

module.exports = router;

