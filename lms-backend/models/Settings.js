const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    // ==============================
    // General Settings
    // ==============================

    lmsName: {
      type: String,
      default: "Learning Management System",
      trim: true,
    },

    institutionName: {
      type: String,
      default: "",
      trim: true,
    },

    logo: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    // ==============================
    // Library Settings
    // ==============================

    maxBooksPerStudent: {
      type: Number,
      default: 3,
      min: 0,
    },

    issueDurationDays: {
      type: Number,
      default: 14,
      min: 0,
    },

    finePerDay: {
      type: Number,
      default: 10,
      min: 0,
    },

    allowBookRenewal: {
      type: Boolean,
      default: true,
    },

    maxRenewals: {
      type: Number,
      default: 2,
      min: 0,
    },

    // ==============================
    // Notification Settings
    // ==============================

    emailNotifications: {
      type: Boolean,
      default: true,
    },

    issueNotifications: {
      type: Boolean,
      default: true,
    },

    returnNotifications: {
      type: Boolean,
      default: true,
    },

    fineNotifications: {
      type: Boolean,
      default: true,
    },

    announcementNotifications: {
      type: Boolean,
      default: true,
    },

    // ==============================
    // Registration Settings
    // ==============================

    allowStudentRegistration: {
      type: Boolean,
      default: true,
    },

    allowTeacherRegistration: {
      type: Boolean,
      default: false,
    },

    // ==============================
    // Security Settings
    // ==============================

    requireStrongPassword: {
      type: Boolean,
      default: true,
    },

    sessionTimeoutMinutes: {
      type: Number,
      default: 60,
      min: 1,
    },

    // ==============================
    // System Status
    // ==============================

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    maintenanceMessage: {
      type: String,
      default:
        "The LMS is currently under maintenance. Please try again later.",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);