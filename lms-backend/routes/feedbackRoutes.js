const express = require("express");

const router = express.Router();

const {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
  getSingleFeedback,
  reviewFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");


// =================================
// CREATE FEEDBACK
// STUDENT ONLY
// =================================

router.post(
  "/create",
  protect,
  authorize("student"),
  createFeedback
);


// =================================
// GET MY FEEDBACK
// STUDENT ONLY
// =================================

router.get(
  "/my-feedback",
  protect,
  authorize("student"),
  getMyFeedback
);


// =================================
// GET ALL FEEDBACK
// ADMIN / LIBRARIAN / SUPERADMIN
// =================================

router.get(
  "/all",
  protect,
  authorize("admin", "librarian", "superadmin"),
  getAllFeedback
);


// =================================
// GET SINGLE FEEDBACK
// AUTHENTICATED USERS
// =================================

router.get(
  "/:id",
  protect,
  getSingleFeedback
);


// =================================
// REVIEW FEEDBACK
// ADMIN / LIBRARIAN / SUPERADMIN
// =================================

router.put(
  "/review/:id",
  protect,
  authorize("admin", "librarian", "superadmin"),
  reviewFeedback
);


// =================================
// DELETE FEEDBACK
// ADMIN / SUPERADMIN
// =================================

router.delete(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  deleteFeedback
);


module.exports = router;