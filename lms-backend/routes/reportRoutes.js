
const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

const {
  getOverviewReport,
  getUsersReport,
  getBooksReport,
  getIssuesReport,
  getReturnsReport,
  getFinesReport,
  getDigitalLibraryReport,
  getReports,
  getReportById,
  createReport,
  deleteReport,
} = require("../controllers/reportController");

// =====================================================
// REPORT ACCESS ROLES
// =====================================================

const reportRoles = [
  "superadmin",
  "student",
  "admin",
  "hod",
  "teacher",
  "librarian",
  "library",
  "accountant",
  "digital",
  "staff",
];

// =====================================================
// OVERVIEW
// GET /api/reports/overview
// =====================================================

router.get(
  "/overview",
  protect,
  authorize(...reportRoles),
  getOverviewReport
);

// =====================================================
// USERS REPORT
// GET /api/reports/users
// =====================================================

router.get(
  "/users",
  protect,
  authorize(...reportRoles),
  getUsersReport
);

// =====================================================
// BOOKS REPORT
// GET /api/reports/books
// =====================================================

router.get(
  "/books",
  protect,
  authorize(...reportRoles),
  getBooksReport
);

// =====================================================
// ISSUES REPORT
// GET /api/reports/issues
// =====================================================

router.get(
  "/issues",
  protect,
  authorize(...reportRoles),
  getIssuesReport
);

// =====================================================
// RETURNS REPORT
// GET /api/reports/returns
// =====================================================

router.get(
  "/returns",
  protect,
  authorize(...reportRoles),
  getReturnsReport
);

// =====================================================
// FINES REPORT
// GET /api/reports/fines
// =====================================================

router.get(
  "/fines",
  protect,
  authorize(...reportRoles),
  getFinesReport
);

// =====================================================
// DIGITAL LIBRARY REPORT
// GET /api/reports/digital-library
// =====================================================

router.get(
  "/digital-library",
  protect,
  authorize(...reportRoles),
  getDigitalLibraryReport
);

// =====================================================
// SAVED REPORTS
// GET /api/reports
// =====================================================

router.get(
  "/",
  protect,
  authorize(...reportRoles),
  getReports
);

// =====================================================
// CREATE / SAVE REPORT
// POST /api/reports
// =====================================================

router.post(
  "/",
  protect,
  authorize(...reportRoles),
  createReport
);

// =====================================================
// SINGLE REPORT
// GET /api/reports/:id
// =====================================================

router.get(
  "/:id",
  protect,
  authorize(...reportRoles),
  getReportById
);

// =====================================================
// DELETE REPORT
// DELETE /api/reports/:id
// =====================================================

router.delete(
  "/:id",
  protect,
  authorize(
    "superadmin",
    "admin"
  ),
  deleteReport
);

module.exports = router;

