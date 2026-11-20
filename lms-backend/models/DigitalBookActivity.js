const mongoose = require("mongoose");

const digitalBookActivitySchema = new mongoose.Schema(
  {
    digitalBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DigitalBook",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    activityType: {
      type: String,
      enum: [
        "view",
        "read",
        "download",
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "DigitalBookActivity",
  digitalBookActivitySchema
);