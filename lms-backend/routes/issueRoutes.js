
const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  issueBook,
  getAllIssuedBooks,
  getIssuedBookById,
  getMyIssuedBooks,
  receiveBook,
} = require("../controllers/issueBookController");

// ==========================================
// ISSUE BOOK
// ==========================================
// Librarian approved request ko issue karega
// POST /api/issues

router.post(
  "/",
  protect,
  authorize("librarian"),
  issueBook
);

// ==========================================
// GET ALL ISSUED BOOKS
// ==========================================
// Librarian apni issued books list dekhega
// GET /api/issues

router.get(
  "/",
  protect,
  authorize("librarian"),
  getAllIssuedBooks
);

// ==========================================
// GET MY ISSUED BOOKS
// ==========================================
// Student apni issued books dekhega
// GET /api/issues/my

router.get(
  "/my",
  protect,
  authorize("student"),
  getMyIssuedBooks
);

// ==========================================
// RECEIVE BOOK
// ==========================================
// Student apni issued book receive karega
// PATCH /api/issues/:id/receive

router.patch(
  "/:id/receive",
  protect,
  authorize("student"),
  receiveBook
);

// ==========================================
// GET SINGLE ISSUED BOOK
// ==========================================
// Librarian issued book details dekhega
// GET /api/issues/:id

router.get(
  "/:id",
  protect,
  authorize("librarian"),
  getIssuedBookById
);

module.exports = router;

