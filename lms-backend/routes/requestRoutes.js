const express = require("express");

const router = express.Router();


const {
  createRequest,
  myRequests,
  getAllRequests,
  approveRequest,
  rejectRequest
} = require("../controllers/requestController");


const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");


// =================================
// Student Create Book Request
// =================================

router.post(
  "/",
  protect,
  createRequest
);


// =================================
// Student My Requests
// =================================

router.get(
  "/my",
  protect,
  myRequests
);


// =================================
// Admin + SuperAdmin View All Requests
// =================================

router.get(
  "/",
  protect,
  authorize("admin", "superadmin"),
  getAllRequests
);


// =================================
// Approve Request
// Admin + SuperAdmin
// =================================

router.put(
  "/approve/:id",
  protect,
  authorize("admin", "superadmin"),
  approveRequest
);


// =================================
// Reject Request
// Admin + SuperAdmin
// =================================

router.put(
  "/reject/:id",
  protect,
  authorize("admin", "superadmin"),
  rejectRequest
);


module.exports = router;