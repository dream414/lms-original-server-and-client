const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    // ==========================================
    // STUDENT WHO SUBMITTED FEEDBACK
    // ==========================================
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // FEEDBACK TYPE
    // ==========================================
    feedbackType: {
      type: String,
      enum: ["Book", "Library"],
      required: true,
    },

    // ==========================================
    // BOOK
    // Only required for Book feedback
    // ==========================================
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      default: null,
    },

    // ==========================================
    // RATING
    // ==========================================
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // ==========================================
    // FEEDBACK MESSAGE
    // ==========================================
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },

    // ==========================================
    // FEEDBACK STATUS
    // ==========================================
    status: {
      type: String,
      enum: ["Pending", "Reviewed"],
      default: "Pending",
    },

    // ==========================================
    // ADMIN / LIBRARIAN RESPONSE
    // ==========================================
    response: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================
    // WHO REVIEWED FEEDBACK
    // ==========================================
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);