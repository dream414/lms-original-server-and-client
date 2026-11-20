const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    // ==========================================
    // BOOK TITLE
    // ==========================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // AUTHOR
    // ==========================================

    author: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // CATEGORY
    // ==========================================

    category: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // ISBN
    // ==========================================

    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // ==========================================
    // TOTAL QUANTITY
    // ==========================================

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    // ==========================================
    // AVAILABLE COPIES
    // ==========================================

    availableCopies: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },

    // ==========================================
    // DESCRIPTION
    // ==========================================

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================
    // BOOK IMAGE
    // ==========================================

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);