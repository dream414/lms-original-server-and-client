
const express = require("express");

const router = express.Router();

const {
  getMyFine,
  getAllFines,
  payFine,
} = require("../controllers/fineController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// =====================================
// STUDENT - MY FINES
// =====================================
//
// GET /api/fines/my
//
// Student can see only their own fines
//
// =====================================

router.get(
  "/my",
  protect,
  authorize("student"),
  getMyFine
);

// =====================================
// GET ALL FINES
// =====================================
//
// GET /api/fines
//
// Admin
// SuperAdmin
// Accountant
// Librarian
//
// =====================================

router.get(
  "/",
  protect,
  authorize(
    "admin",
    "superadmin",
    "accountant",
    "librarian"
  ),
  getAllFines
);

// =====================================
// PAY FINE
// =====================================
//
// PUT /api/fines/pay/:id
//
// Admin
// SuperAdmin
// Accountant
//
// =====================================

router.put(
  "/pay/:id",
  protect,
  authorize(
    "admin",
    "superadmin",
    "accountant"
  ),
  payFine
);

module.exports = router;

