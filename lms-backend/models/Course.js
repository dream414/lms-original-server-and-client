const mongoose = require("mongoose");


const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
    },

    department: {
      type: String,
      required: true,
    },

    semester: {
      type: Number,
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    description: String,

    material: String,

    
  },
  {
    timestamps: true,
  }
);




module.exports = mongoose.model("Course", courseSchema);