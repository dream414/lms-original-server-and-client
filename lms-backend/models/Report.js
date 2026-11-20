
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      required: true,
      enum: [
        "users",
        "books",
        "issues",
        "returns",
        "fines",
        "digital-library",
        "requests",
        "feedback",
        "reviews",
        "activities",
        "overview",
      ],
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    filters: {
      dateFrom: {
        type: Date,
        default: null,
      },

      dateTo: {
        type: Date,
        default: null,
      },

      role: {
        type: String,
        default: null,
      },

      department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        default: null,
      },

      category: {
        type: String,
        default: null,
      },

      status: {
        type: String,
        default: null,
      },
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    summary: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    format: {
      type: String,
      enum: ["json", "pdf", "excel"],
      default: "json",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);

