const express = require("express");

const router = express.Router();


const {
  getMyFine,
  getAllFines,
  payFine
} = require("../controllers/fineController");


const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");


// =====================================
// Student - My Fines
// =====================================

router.get(
  "/my",
  protect,
  getMyFine
);


// =====================================
// All Fines
// Admin + SuperAdmin + Accountant + Librarian
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
// Pay / Update Fine
// Admin + SuperAdmin + Accountant
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