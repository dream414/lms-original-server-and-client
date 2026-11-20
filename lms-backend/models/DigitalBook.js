const mongoose = require("mongoose");

const digitalBookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    isbn: {
      type: String,
      trim: true,
      default: "",
    },

    publisher: {
      type: String,
      trim: true,
      default: "",
    },

    publicationYear: {
      type: Number,
      default: null,
    },

    language: {
      type: String,
      trim: true,
      default: "English",
    },

    coverImage: {
      type: String,
      default: "",
    },

    digitalFile: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      default: "PDF",
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reads: {
  type: Number,
  default: 0,
},

    views: {
      type: Number,
      default: 0,
    },

    downloads: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DigitalBook", digitalBookSchema);