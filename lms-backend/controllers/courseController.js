
const Course = require("../models/Course");
const { createNotification } = require("./notificationController");
const fs = require("fs");
const path = require("path");

// ===============================
// Create Course
// ===============================

exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      code,
      department,
      semester,
      description,
      teacher,
    } = req.body;

    // ---------------------------------
    // Decide Teacher
    // ---------------------------------

    let assignedTeacher;

    if (
      req.user.role === "admin" ||
      req.user.role === "superadmin" ||
      req.user.role === "hod"
    ) {
      // Admin/HOD/SuperAdmin can assign teacher
      assignedTeacher = teacher || req.user.id;
    } else {
      // Teacher can only assign himself
      assignedTeacher = req.user.id;
    }

    // ---------------------------------
    // Check Duplicate Course Code
    // ---------------------------------

    const existingCourse = await Course.findOne({ code });

    if (existingCourse) {
      return res.status(400).json({
        message: "Course code already exists",
      });
    }

    // ---------------------------------
    // Material
    // ---------------------------------

    const material = req.file
      ? `/uploads/courses/${req.file.filename}`
      : null;

    // ---------------------------------
    // Create Course
    // ---------------------------------

    const course = await Course.create({
      title,
      code,
      department,
      semester,
      teacher: assignedTeacher,
      description,
      material,
    });

    // ---------------------------------
    // Notification
    // ---------------------------------

    await createNotification(
      req.user.id,
      "Course Uploaded",
      `Course "${course.title}" has been uploaded successfully.`,
      "Course"
    );

    // ---------------------------------
    // Return populated course
    // ---------------------------------

    const populatedCourse = await Course.findById(course._id)
      .populate("teacher", "name email");

    res.status(201).json(populatedCourse);
  } catch (err) {
    console.error("Create Course Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// Get All Courses
// ===============================

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher", "name email")
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    console.error("Get Courses Error:", err);

    res.status(500).json({
      message: err.message,
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
        message: "Course not found",
      });
    }

    res.json(course);
  } catch (err) {
    console.error("Get Course Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// Update Course
// ===============================

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // ---------------------------------
    // Permission Check
    // ---------------------------------

    const userRole = req.user.role;

    const isAdmin =
      userRole === "admin" ||
      userRole === "superadmin";

    const isHOD = userRole === "hod";

    const isTeacher = userRole === "teacher";

    // Teacher can edit ONLY own course
    if (
      isTeacher &&
      course.teacher.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        message: "You can only edit your own courses",
      });
    }

    // ---------------------------------
    // Update Basic Fields
    // ---------------------------------

    if (req.body.title !== undefined) {
      course.title = req.body.title;
    }

    if (req.body.department !== undefined) {
      course.department = req.body.department;
    }

    if (req.body.semester !== undefined) {
      course.semester = req.body.semester;
    }

    if (req.body.description !== undefined) {
      course.description = req.body.description;
    }

    // ---------------------------------
    // Course Code
    // ---------------------------------

    if (
      req.body.code !== undefined &&
      req.body.code !== course.code
    ) {
      const duplicateCode = await Course.findOne({
        code: req.body.code,
        _id: { $ne: course._id },
      });

      if (duplicateCode) {
        return res.status(400).json({
          message: "Course code already exists",
        });
      }

      course.code = req.body.code;
    }

    // ---------------------------------
    // Teacher Assignment
    // ---------------------------------

    if (isAdmin || isHOD) {
      if (req.body.teacher) {
        course.teacher = req.body.teacher;
      }
    }

    // ---------------------------------
    // New Material
    // ---------------------------------

    if (req.file) {
      // Delete old material
      if (course.material) {
        const oldFilePath = path.join(
          __dirname,
          "..",
          course.material.replace(/^\/+/, "")
        );

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      course.material = `/uploads/courses/${req.file.filename}`;
    }

    // ---------------------------------
    // Save
    // ---------------------------------

    await course.save();

    // ---------------------------------
    // Populate Teacher
    // ---------------------------------

    await course.populate("teacher", "name email");

    // ---------------------------------
    // Notification
    // ---------------------------------

    await createNotification(
      req.user.id,
      "Course Updated",
      `Course "${course.title}" has been updated successfully.`,
      "Course"
    );

    res.json(course);
  } catch (err) {
    console.error("Update Course Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// Delete Course
// ===============================

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // ---------------------------------
    // Delete Material File
    // ---------------------------------

    if (course.material) {
      const filePath = path.join(
        __dirname,
        "..",
        course.material.replace(/^\/+/, "")
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // ---------------------------------
    // Delete Course
    // ---------------------------------

    await Course.findByIdAndDelete(req.params.id);

    // ---------------------------------
    // Notification
    // ---------------------------------

    await createNotification(
      req.user.id,
      "Course Deleted",
      `Course "${course.title}" has been deleted successfully.`,
      "Course"
    );

    res.json({
      message: "Course Deleted Successfully",
    });
  } catch (err) {
    console.error("Delete Course Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

