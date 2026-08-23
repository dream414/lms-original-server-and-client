const Course = require("../models/Course");
const { createNotification } = require("./notificationController");

// ===============================
// Create Course
// ===============================

exports.createCourse = async (req, res) => {

  try {

    const course = await Course.create({

      title: req.body.title,
      code: req.body.code,
      department: req.body.department,
      semester: req.body.semester,
      teacher: req.user.id,
      description: req.body.description,
      material: req.body.material

    });

    // Notification
    await createNotification(

      req.user.id,

      "Course Uploaded",

      `Course "${course.title}" has been uploaded successfully.`,

      "Course"

    );

    res.status(201).json(course);

  } catch (err) {

    res.status(500).json({

      message: err.message

    });

  }

};

// ===============================
// Get All Courses
// ===============================

exports.getCourses = async (req, res) => {

  try {

    const courses = await Course.find()

      .populate("teacher", "name email");

    res.json(courses);

  } catch (err) {

    res.status(500).json({

      message: err.message

    });

  }

};

// ===============================
// Get Single Course
// ===============================

exports.getCourse = async (req, res) => {

  try {

    const course = await Course.findById(req.params.id)

      .populate("teacher", "name email");

    if (!course) {

      return res.status(404).json({

        message: "Course not found"

      });

    }

    res.json(course);

  } catch (err) {

    res.status(500).json({

      message: err.message

    });

  }

};

// ===============================
// Update Course
// ===============================

exports.updateCourse = async (req, res) => {

  try {

    const course = await Course.findByIdAndUpdate(

      req.params.id,

      req.body,

      { new: true }

    );

    res.json(course);

  } catch (err) {

    res.status(500).json({

      message: err.message

    });

  }

};

// ===============================
// Delete Course
// ===============================

exports.deleteCourse = async (req, res) => {

  try {

    await Course.findByIdAndDelete(req.params.id);

    res.json({

      message: "Course Deleted Successfully"

    });

  } catch (err) {

    res.status(500).json({

      message: err.message

    });

  }

};