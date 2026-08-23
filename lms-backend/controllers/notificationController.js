const Notification = require("../models/Notification");

// ==================================
// Create Notification
// ==================================

exports.createNotification = async (

  user,
  title,
  message,
  type

) => {

  try {

    await Notification.create({

      user,
      title,
      message,
      type

    });

  } catch (err) {

    console.log(err.message);

  }

};

// ==================================
// Get My Notifications
// ==================================

exports.getNotifications = async (req, res) => {

  try {

    const notifications = await Notification.find({

      user: req.user.id

    }).sort({

      createdAt: -1

    });

    res.json(notifications);

  } catch (err) {

    res.status(500).json({

      message: err.message

    });

  }

};

// ==================================
// Mark Notification As Read
// ==================================

exports.markAsRead = async (req, res) => {

  try {

    const notification = await Notification.findByIdAndUpdate(

      req.params.id,

      {

        isRead: true

      },

      {

        new: true

      }

    );

    if (!notification) {

      return res.status(404).json({

        message: "Notification Not Found"

      });

    }

    res.json(notification);

  } catch (err) {

    res.status(500).json({

      message: err.message

    });

  }

};

// ==================================
// Delete Notification
// ==================================

exports.deleteNotification = async (req, res) => {

  try {

    const notification = await Notification.findByIdAndDelete(

      req.params.id

    );

    if (!notification) {

      return res.status(404).json({

        message: "Notification Not Found"

      });

    }

    res.json({

      message: "Notification Deleted Successfully"

    });

  } catch (err) {

    res.status(500).json({

      message: err.message

    });

  }

};