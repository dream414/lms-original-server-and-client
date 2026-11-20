
const express = require("express");

const router = express.Router();

// =====================================================
// CONTROLLERS
// =====================================================

const {
  requestReturnBook,
  getAllReturnRequests,
  getMyReturnRequests,
  confirmReturnBook,
  rejectReturnRequest,
} = require("../controllers/returnController");

// =====================================================
// MIDDLEWARE
// =====================================================

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// =====================================================
// STUDENT — REQUEST BOOK RETURN
// POST /api/returns/request/:issueId
// =====================================================

router.post(
  "/request/:issueId",
  protect,
  authorize("student"),
  requestReturnBook
);

// =====================================================
// STUDENT — GET MY RETURN REQUESTS
// GET /api/returns/my
// =====================================================

router.get(
  "/my",
  protect,
  authorize("student"),
  getMyReturnRequests
);

// =====================================================
// LIBRARIAN — GET ALL RETURN REQUESTS
// GET /api/returns
// =====================================================

router.get(
  "/",
  protect,
  authorize("librarian"),
  getAllReturnRequests
);

// =====================================================
// LIBRARIAN — CONFIRM RETURN
// PUT /api/returns/:id/confirm
// =====================================================

router.put(
  "/:id/confirm",
  protect,
  authorize("librarian"),
  confirmReturnBook
);

// =====================================================
// LIBRARIAN — REJECT RETURN REQUEST
// PUT /api/returns/:id/reject
// =====================================================

router.put(
  "/:id/reject",
  protect,
  authorize("librarian"),
  rejectReturnRequest
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;

