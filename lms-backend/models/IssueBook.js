
const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    // ==========================================
    // STUDENT
    // ==========================================

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // BOOK
    // ==========================================

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    // ==========================================
    // BOOK REQUEST
    // ==========================================

    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookRequest",
    },

    // ==========================================
    // ISSUE DATE
    // ==========================================

    issueDate: {
      type: Date,
      required: true,
    },

    // ==========================================
    // DUE DATE
    // ==========================================

    dueDate: {
      type: Date,
      required: true,
    },

    // ==========================================
    // ISSUE STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["Issued", "Returned"],
      default: "Issued",
    },

    // ==========================================
    // STUDENT RECEIVE
    // ==========================================

    received: {
      type: Boolean,
      default: false,
    },

    receivedAt: {
      type: Date,
      default: null,
    },

    // ==========================================
    // RETURN REQUEST
    // ==========================================

    returnRequested: {
      type: Boolean,
      default: false,
    },

    returnRequestedAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "IssueBook",
  issueSchema
);

