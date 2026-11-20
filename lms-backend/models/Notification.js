
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // =====================================
    // USER
    // =====================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },

    // =====================================
    // TITLE
    // =====================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================
    // MESSAGE
    // =====================================

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================
    // NOTIFICATION TYPE
    // =====================================

    type: {
      type: String,
      enum: [
        "Request",
        "Issue",
        "Return",
        "Fine",
        "Course",
        "General",
      ],
      default: "General",
    },

    // =====================================
    // READ STATUS
    // =====================================

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);

