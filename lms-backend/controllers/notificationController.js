
const Notification = require("../models/Notification");

// =====================================
// CREATE NOTIFICATION
// =====================================
// This function is used by other controllers
// such as Request, Issue, Return and Fine.
// =====================================

exports.createNotification = async (
  user,
  title,
  message,
  type = "General"
) => {
  try {
    if (!user) {
      console.log(
        "CREATE NOTIFICATION: User ID missing"
      );

      return null;
    }

    const notification =
      await Notification.create({
        user,
        title,
        message,
        type,
      });

    return notification;
  } catch (err) {
    console.error(
      "CREATE NOTIFICATION ERROR:",
      err.message
    );

    return null;
  }
};

// =====================================
// GET MY NOTIFICATIONS
// =====================================
// GET /api/notifications
//
// User can see only their own notifications.
// =====================================

exports.getNotifications = async (
  req,
  res
) => {
  try {
    const notifications =
      await Notification.find({
        user: req.user.id,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (err) {
    console.error(
      "GET NOTIFICATIONS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to get notifications",
    });
  }
};

// =====================================
// MARK NOTIFICATION AS READ
// =====================================
// PUT /api/notifications/:id
//
// User can mark only their own notification.
// =====================================

exports.markAsRead = async (
  req,
  res
) => {
  try {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user.id,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Notification Marked As Read",
      notification,
    });
  } catch (err) {
    console.error(
      "MARK NOTIFICATION READ ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to update notification",
    });
  }
};

// =====================================
// DELETE NOTIFICATION
// =====================================
// DELETE /api/notifications/:id
//
// User can delete only their own notification.
// =====================================

exports.deleteNotification = async (
  req,
  res
) => {
  try {
    const notification =
      await Notification.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Notification Deleted Successfully",
    });
  } catch (err) {
    console.error(
      "DELETE NOTIFICATION ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to delete notification",
    });
  }
};

