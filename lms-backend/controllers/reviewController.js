const Review = require("../models/Review");

// CREATE REVIEW
const createReview = async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;

    if (!name || !email || !rating || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, rating and message are required.",
      });
    }

    const numericRating = Number(rating);

    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const review = await Review.create({
      visitorName: name.trim(),
      visitorEmail: email.trim().toLowerCase(),
      rating: numericRating,
      message: message.trim(),
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Your review has been submitted successfully.",
      review,
    });
  } catch (error) {
    console.error("Create Review Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit review.",
    });
  }
};

// GET ALL REVIEWS
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get All Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch reviews.",
    });
  }
};

// GET SINGLE REVIEW
const getSingleReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    return res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Get Single Review Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch review.",
    });
  }
};

// UPDATE REVIEW STATUS
const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Reviewed",
      "Approved",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review status.",
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    review.status = status;

    await review.save();

    return res.status(200).json({
      success: true,
      message: "Review status updated successfully.",
      review,
    });
  } catch (error) {
    console.error("Update Review Status Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update review status.",
    });
  }
};

// RESPOND TO REVIEW
const respondToReview = async (req, res) => {
  try {
    const { response } = req.body;

    if (!response || !response.trim()) {
      return res.status(400).json({
        success: false,
        message: "Response is required.",
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    review.response = response.trim();
    review.status = "Reviewed";

    await review.save();

    return res.status(200).json({
      success: true,
      message: "Response sent successfully.",
      review,
    });
  } catch (error) {
    console.error("Respond To Review Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send response.",
    });
  }
};

// DELETE REVIEW
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    await review.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete review.",
    });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReviewStatus,
  respondToReview,
  deleteReview,
};