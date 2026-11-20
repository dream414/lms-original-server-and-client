
const express = require("express");

const router = express.Router();

// =====================================================
// MIDDLEWARE
// =====================================================

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// =====================================================
// CONTROLLER
// =====================================================

const {
  addBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  searchBook,
} = require("../controllers/bookController");

// =====================================================
// GET ALL BOOKS
// =====================================================
// All authenticated users can view books.
// =====================================================

router.get(
  "/",
  protect,
  getBooks
);

// =====================================================
// SEARCH BOOK
// =====================================================
// All authenticated users can search books.
// =====================================================

router.get(
  "/search",
  protect,
  searchBook
);

// =====================================================
// GET SINGLE BOOK
// =====================================================
// All authenticated users can view book details.
//
// IMPORTANT:
// This route must come after "/search"
// so "/search" is not treated as an ID.
//
// View permission is intentionally NOT restricted
// to Admin/Librarian/SuperAdmin.
// =====================================================

router.get(
  "/:id",
  protect,
  getBook
);

// =====================================================
// ADD BOOK
// =====================================================
// Only Admin, Librarian and SuperAdmin can add books.
// =====================================================

router.post(
  "/",
  protect,
  authorize(
    "admin",
    "librarian",
    "superadmin"
  ),
  upload.bookUpload.single("image"),
  addBook
);

// =====================================================
// UPDATE BOOK
// =====================================================
// Only Admin, Librarian and SuperAdmin can update books.
// =====================================================

router.put(
  "/:id",
  protect,
  authorize(
    "admin",
    "librarian",
    "superadmin"
  ),
  upload.bookUpload.single("image"),
  updateBook
);

// =====================================================
// DELETE BOOK
// =====================================================
// Only Admin, Librarian and SuperAdmin can delete books.
// =====================================================

router.delete(
  "/:id",
  protect,
  authorize(
    "admin",
    "librarian",
    "superadmin"
  ),
  deleteBook
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;

