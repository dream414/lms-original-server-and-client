const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      required: true,
      trim: true,
    },

    visitorEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    response: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);