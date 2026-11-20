const express = require("express");
const router = express.Router();

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReviewStatus,
  respondToReview,
  deleteReview,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post(
  "/create",
  protect,
  authorize("visitor"),
  createReview
);

router.get(
  "/all",
  protect,
  authorize("admin", "librarian", "superadmin"),
  getAllReviews
);

router.get(
  "/:id",
  protect,
  authorize("admin", "librarian", "superadmin"),
  getSingleReview
);

router.put(
  "/status/:id",
  protect,
  authorize("admin", "librarian", "superadmin"),
  updateReviewStatus
);

router.put(
  "/response/:id",
  protect,
  authorize("admin", "librarian", "superadmin"),
  respondToReview
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "librarian", "superadmin"),
  deleteReview
);

module.exports = router;