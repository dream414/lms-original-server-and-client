
const express = require("express");

const router = express.Router();

const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// =================================
// Create Course
// =================================

router.post(
  "/",
  protect,
  authorize("teacher", "admin", "superadmin", "hod"),
  upload.courseUpload.single("material"),
  createCourse
);

// =================================
// Get All Courses
// =================================

router.get(
  "/",
  protect,
  getCourses
);

// =================================
// Get Single Course
// =================================

router.get(
  "/:id",
  protect,
  getCourse
);

// =================================
// Update Course
// =================================

router.put(
  "/:id",
  protect,
  authorize("teacher", "admin", "superadmin", "hod"),
  upload.courseUpload.single("material"),
  updateCourse
);

// =================================
// Delete Course
// =================================

router.delete(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  deleteCourse
);

module.exports = router;

