const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
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
    // BOOK
    // =====================================

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    // =====================================
    // ISSUE RECORD
    // =====================================

    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IssueBook",
      required: true,
    },

    // =====================================
    // RETURN DATE
    // =====================================

    returnDate: {
      type: Date,
      default: null,
    },

    // =====================================
    // FINE
    // =====================================

    fine: {
      type: Number,
      default: 0,
    },

    // =====================================
    // RETURN STATUS
    // =====================================

    status: {
      type: String,
      enum: ["Pending", "Returned", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ReturnBook", returnSchema);