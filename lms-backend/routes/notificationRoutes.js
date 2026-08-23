const express = require("express");

const router = express.Router();

const {
  getNotifications,
  markAsRead,
  deleteNotification
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");


router.get(
  "/",
  protect,
  getNotifications
);


router.put(
  "/:id",
  protect,
  markAsRead
);


router.delete(
  "/:id",
  protect,
  deleteNotification
);


module.exports = router;