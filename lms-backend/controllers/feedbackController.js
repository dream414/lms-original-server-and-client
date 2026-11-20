const Feedback = require("../models/Feedback");
const Book = require("../models/Book");

// ======================================================
// CREATE FEEDBACK
// ======================================================

const createFeedback = async (req, res) => {
  try {
    const { feedbackType, bookName, rating, message } = req.body;

    // --------------------------------------------------
    // DEBUG LOGS
    // --------------------------------------------------

    console.log("========== CREATE FEEDBACK ==========");
    console.log("REQ USER:", req.user);
    console.log("REQ BODY:", req.body);

    // --------------------------------------------------
    // CHECK USER
    // --------------------------------------------------

    if (!req.user || !req.user.id) {
      console.error("USER ID NOT FOUND:", req.user);

      return res.status(401).json({
        success: false,
        message: "User information not found. Please login again.",
      });
    }

    // --------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------

    if (!feedbackType || !rating || !message) {
      return res.status(400).json({
        success: false,
        message: "Feedback type, rating and message are required.",
      });
    }

    // --------------------------------------------------
    // CHECK FEEDBACK TYPE
    // --------------------------------------------------

    if (!["Book", "Library"].includes(feedbackType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback type.",
      });
    }

    // --------------------------------------------------
    // CHECK RATING
    // --------------------------------------------------

    const numericRating = Number(rating);

    if (
      Number.isNaN(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    // --------------------------------------------------
    // CHECK MESSAGE LENGTH
    // --------------------------------------------------

    const cleanMessage = message.trim();

    if (cleanMessage.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Feedback message must be at least 5 characters.",
      });
    }

    // --------------------------------------------------
    // BOOK FEEDBACK
    // --------------------------------------------------

    let bookId = null;

    if (feedbackType === "Book") {
      if (!bookName || !bookName.trim()) {
        return res.status(400).json({
          success: false,
          message: "Book name is required for book feedback.",
        });
      }

      // Escape special regex characters
      const escapedBookName = bookName
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const existingBook = await Book.findOne({
        title: {
          $regex: `^${escapedBookName}$`,
          $options: "i",
        },
      });

      if (!existingBook) {
        return res.status(404).json({
          success: false,
          message: "Book not found.",
        });
      }

      bookId = existingBook._id;
    }

    // --------------------------------------------------
    // DEBUG BOOK ID
    // --------------------------------------------------

    console.log("BOOK ID:", bookId);
    console.log("STUDENT ID:", req.user.id);

    // --------------------------------------------------
    // CREATE FEEDBACK
    // --------------------------------------------------

    const feedback = await Feedback.create({
      student: req.user.id,
      feedbackType,
      book: bookId,
      rating: numericRating,
      message: cleanMessage,
    });

    // --------------------------------------------------
    // SUCCESS LOG
    // --------------------------------------------------

    console.log("FEEDBACK CREATED:", feedback._id);
    console.log("====================================");

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      feedback,
    });
  } catch (error) {
    // --------------------------------------------------
    // DETAILED ERROR LOG
    // --------------------------------------------------

    console.error("========== CREATE FEEDBACK ERROR ==========");
    console.error("MESSAGE:", error.message);
    console.error("STACK:", error.stack);
    console.error("===========================================");

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET MY FEEDBACK
// ======================================================

const getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      student: req.user.id,
    })
      .populate("book", "title author category")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    console.error("GET MY FEEDBACK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get your feedback.",
      error: error.message,
    });
  }
};

// ======================================================
// GET ALL FEEDBACK
// ======================================================

const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("student", "name email role")
      .populate("book", "title author category")
      .populate("reviewedBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    console.error("GET ALL FEEDBACK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get feedback.",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE FEEDBACK
// ======================================================

const getSingleFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate("student", "name email role")
      .populate("book", "title author category")
      .populate("reviewedBy", "name email role");

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    // --------------------------------------------------
    // STUDENT CAN ONLY VIEW OWN FEEDBACK
    // --------------------------------------------------

    if (
      req.user.role === "student" &&
      feedback.student &&
      feedback.student._id.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this feedback.",
      });
    }

    return res.status(200).json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("GET SINGLE FEEDBACK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get feedback.",
      error: error.message,
    });
  }
};

// ======================================================
// REVIEW FEEDBACK
// ======================================================

const reviewFeedback = async (req, res) => {
  try {
    const { response } = req.body;

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    // --------------------------------------------------
    // UPDATE FEEDBACK
    // --------------------------------------------------

    feedback.status = "Reviewed";
    feedback.response = response || "";
    feedback.reviewedBy = req.user.id;

    await feedback.save();

    // --------------------------------------------------
    // GET UPDATED FEEDBACK
    // --------------------------------------------------

    const updatedFeedback = await Feedback.findById(feedback._id)
      .populate("student", "name email role")
      .populate("book", "title author category")
      .populate("reviewedBy", "name email role");

    return res.status(200).json({
      success: true,
      message: "Feedback reviewed successfully.",
      feedback: updatedFeedback,
    });
  } catch (error) {
    console.error("REVIEW FEEDBACK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to review feedback.",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE FEEDBACK
// ======================================================

const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    await feedback.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE FEEDBACK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete feedback.",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
  getSingleFeedback,
  reviewFeedback,
  deleteFeedback,
};