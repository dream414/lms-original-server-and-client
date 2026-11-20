
const mongoose = require("mongoose");

const fineSchema = new mongoose.Schema(
  {
    // =====================================
    // STUDENT
    // =====================================

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =====================================
    // ISSUE BOOK
    // =====================================

    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IssueBook",
      required: true,
    },

    // =====================================
    // FINE AMOUNT
    // =====================================

    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // =====================================
    // DAYS LATE
    // =====================================

    daysLate: {
      type: Number,
      min: 0,
      default: 0,
    },

    // =====================================
    // PAYMENT STATUS
    // =====================================

    status: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },

    // =====================================
    // PAID DATE
    // =====================================

    paidDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Fine", fineSchema);

