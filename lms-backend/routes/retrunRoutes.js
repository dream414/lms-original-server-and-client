const express = require("express");

const router = express.Router();

const {
  returnBook
} = require("../controllers/returnController");


const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");


// =====================================
// Return Book
// Admin + SuperAdmin + Librarian
// =====================================

router.put(
  "/:id",
  protect,
  authorize(
    "admin",
    "superadmin",
    "librarian"
  ),
  returnBook
);


module.exports = router;