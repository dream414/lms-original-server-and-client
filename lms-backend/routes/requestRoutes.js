
const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createRequest,
  myRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
} = require("../controllers/requestController");

// =====================================================
// STUDENT — CREATE BOOK REQUEST
// POST /api/requests
// =====================================================

router.post(
  "/",
  protect,
  authorize("student"),
  createRequest
);

// =====================================================
// STUDENT — MY REQUESTS
// GET /api/requests/my
// =====================================================

router.get(
  "/my",
  protect,
  authorize("student"),
  myRequests
);

// =====================================================
// SUPER ADMIN + ADMIN — GET ALL REQUESTS
// GET /api/requests
// =====================================================

router.get(
  "/",
  protect,
  authorize("superadmin", "admin","librarian"),
  getAllRequests
);

// =====================================================
// SUPER ADMIN + ADMIN — APPROVE REQUEST
// PUT /api/requests/:id/approve
// =====================================================

router.put(
  "/:id/approve",
  protect,
  authorize("superadmin", "admin"),
  approveRequest
);

// =====================================================
// SUPER ADMIN + ADMIN — REJECT REQUEST
// PUT /api/requests/:id/reject
// =====================================================

router.put(
  "/:id/reject",
  protect,
  authorize("superadmin", "admin"),
  rejectRequest
);

module.exports = router;
