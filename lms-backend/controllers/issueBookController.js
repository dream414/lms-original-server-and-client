
const IssueBook = require("../models/IssueBook");
const BookRequest = require("../models/BookRequest");
const Book = require("../models/Book");

// ==========================================
// ISSUE BOOK
// Librarian issues an approved request
// ==========================================

exports.issueBook = async (req, res) => {
  try {
    const { requestId, dueDate } = req.body;

    // ========================================
    // VALIDATION
    // ========================================

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        success: false,
        message: "Due date is required",
      });
    }

    // ========================================
    // ISSUE DATE
    // ========================================

    const issue = new Date();

    // ========================================
    // FIND REQUEST
    // ========================================

    const request = await BookRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Book request not found",
      });
    }

    // ========================================
    // CHECK REQUEST STATUS
    // ========================================

    if (request.status !== "Approved") {
      return res.status(400).json({
        success: false,
        message: "Only approved book requests can be issued",
      });
    }

    // ========================================
    // CHECK IF ALREADY ISSUED
    // ========================================

    const alreadyIssued = await IssueBook.findOne({
      request: request._id,
      status: "Issued",
    });

    if (alreadyIssued) {
      return res.status(400).json({
        success: false,
        message: "This book request has already been issued",
      });
    }

    // ========================================
    // FIND BOOK
    // ========================================

    const book = await Book.findById(request.book);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // ========================================
    // CHECK AVAILABLE COPIES
    // ========================================

    if (
      typeof book.availableCopies !== "number" ||
      book.availableCopies <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "This book is currently not available",
      });
    }

    // ========================================
    // VALIDATE DUE DATE
    // ========================================

    const due = new Date(dueDate);

    if (isNaN(due.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date",
      });
    }

    // ========================================
    // DUE DATE MUST BE AFTER ISSUE DATE
    // ========================================

    const issueDay = new Date(issue);
    issueDay.setHours(0, 0, 0, 0);

    const dueDay = new Date(due);
    dueDay.setHours(0, 0, 0, 0);

    if (dueDay <= issueDay) {
      return res.status(400).json({
        success: false,
        message: "Due date must be after issue date",
      });
    }

    // ========================================
    // CREATE ISSUE BOOK RECORD
    // ========================================

    const issuedBook = await IssueBook.create({
      student: request.student,
      book: request.book,
      request: request._id,
      issueDate: issue,
      dueDate: due,
      status: "Issued",

      received: false,
      receivedAt: null,

      returnRequested: false,
      returnRequestedAt: null,
    });

    // ========================================
    // DECREASE AVAILABLE COPIES
    // ========================================

    book.availableCopies = book.availableCopies - 1;

    await book.save();

    // ========================================
    // UPDATE REQUEST STATUS
    // ========================================

    request.status = "Issued";

    await request.save();

    // ========================================
    // POPULATE RESPONSE
    // ========================================

    const populatedIssue = await IssueBook.findById(
      issuedBook._id
    )
      .populate("student", "name email")
      .populate("book", "title author availableCopies")
      .populate("request");

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(201).json({
      success: true,
      message: "Book issued successfully",
      issueBook: populatedIssue,
    });
  } catch (error) {
    console.error("ISSUE BOOK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to issue book",
    });
  }
};

// ==========================================
// RECEIVE BOOK
// Student confirms receiving the book
// ==========================================

exports.receiveBook = async (req, res) => {
  try {
    const issueId = req.params.id;

    // ========================================
    // IMPORTANT
    // JWT contains "id", not "_id"
    // ========================================

    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in authentication token",
      });
    }

    // ========================================
    // FIND ISSUE
    // ========================================

    const issue = await IssueBook.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    // ========================================
    // CHECK STUDENT OWNERSHIP
    // ========================================

    if (issue.student.toString() !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to receive this book",
      });
    }

    // ========================================
    // CHECK ALREADY RETURNED
    // ========================================

    if (issue.status === "Returned") {
      return res.status(400).json({
        success: false,
        message: "This book has already been returned",
      });
    }

    // ========================================
    // CHECK ALREADY RECEIVED
    // ========================================

    if (issue.received === true) {
      return res.status(400).json({
        success: false,
        message: "You have already received this book",
      });
    }

    // ========================================
    // MARK AS RECEIVED
    // ========================================

    issue.received = true;
    issue.receivedAt = new Date();

    await issue.save();

    // ========================================
    // POPULATE RESPONSE
    // ========================================

    const populatedIssue = await IssueBook.findById(issue._id)
      .populate("student", "name email")
      .populate("book", "title author availableCopies")
      .populate("request");

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      message: "Book received successfully",
      issueBook: populatedIssue,
    });
  } catch (error) {
    console.error("RECEIVE BOOK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to receive book",
    });
  }
};

// ==========================================
// GET ALL ISSUED BOOKS
// Librarian
// ==========================================

exports.getAllIssuedBooks = async (req, res) => {
  try {
    const issuedBooks = await IssueBook.find()
      .populate("student", "name email")
      .populate("book", "title author availableCopies")
      .populate("request")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: issuedBooks.length,
      issues: issuedBooks,
    });
  } catch (error) {
    console.error("GET ISSUED BOOKS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get issued books",
    });
  }
};

// ==========================================
// GET SINGLE ISSUED BOOK
// ==========================================

exports.getIssuedBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const issuedBook = await IssueBook.findById(id)
      .populate("student", "name email")
      .populate("book", "title author availableCopies")
      .populate("request");

    if (!issuedBook) {
      return res.status(404).json({
        success: false,
        message: "Issued book record not found",
      });
    }

    return res.status(200).json({
      success: true,
      issueBook: issuedBook,
    });
  } catch (error) {
    console.error("GET SINGLE ISSUE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get issued book",
    });
  }
};

// ==========================================
// GET MY ISSUED BOOKS
// Student
// ==========================================

exports.getMyIssuedBooks = async (req, res) => {
  try {
    // ========================================
    // IMPORTANT FIX
    // generateToken() stores:
    //
    // {
    //   id,
    //   role
    // }
    //
    // Therefore use req.user.id
    // NOT req.user._id
    // ========================================

    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in authentication token",
      });
    }

    console.log("MY ISSUED BOOKS - STUDENT ID:", studentId);

    // ========================================
    // FIND STUDENT'S ISSUED BOOKS
    // ========================================

    const issuedBooks = await IssueBook.find({
      student: studentId,
    })
      .populate("student", "name email")
      .populate("book", "title author availableCopies")
      .populate("request")
      .sort({
        createdAt: -1,
      });

    // ========================================
    // DEBUG
    // ========================================

    console.log(
      "MY ISSUED BOOKS - COUNT:",
      issuedBooks.length
    );

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      count: issuedBooks.length,
      issues: issuedBooks,
    });
  } catch (error) {
    console.error("GET MY ISSUED BOOKS ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to get your issued books",
    });
  }
};

