const express = require("express");

const router = express.Router();

// =====================================
// Controllers
// =====================================

const {
  getAllUsers,
  getUsersByRole,
  getUserById,
  changeRole,
  deleteUser,
} = require("../controllers/userController");

// =====================================
// Middleware
// =====================================

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// =====================================
// GET ALL USERS
//
// SuperAdmin → All
// Admin      → All
// HOD        → Students + Teachers + Staff
// Teacher    → Students Only
//
// GET /api/users
// =====================================

router.get(
  "/",
  protect,
  authorize(
    "admin",
    "superadmin",
    "hod",
    "teacher"
  ),
  getAllUsers
);

// =====================================
// GET USERS BY ROLE
//
// SuperAdmin → Any Role
// Admin      → Any Role
// HOD        → Student / Teacher / Staff
// Teacher    → Student Only
//
// Examples:
//
// GET /api/users/role/teacher
// GET /api/users/role/student
// GET /api/users/role/staff
// GET /api/users/role/librarian
// GET /api/users/role/hod
//
// =====================================

router.get(
  "/role/:role",
  protect,
  authorize(
    "admin",
    "superadmin",
    "hod",
    "teacher"
  ),
  getUsersByRole
);

// =====================================
// GET SINGLE USER
//
// Authenticated Users
//
// GET /api/users/:id
// =====================================

router.get(
  "/:id",
  protect,
  getUserById
);

// =====================================
// CHANGE USER ROLE
//
// Admin + SuperAdmin
//
// PUT /api/users/change-role/:id
// =====================================

router.put(
  "/change-role/:id",
  protect,
  authorize(
    "admin",
    "superadmin"
  ),
  changeRole
);

// =====================================
// DELETE USER
//
// Admin + SuperAdmin
//
// DELETE /api/users/:id
// =====================================

router.delete(
  "/:id",
  protect,
  authorize(
    "admin",
    "superadmin"
  ),
  deleteUser
);

// =====================================
// EXPORT ROUTER
// =====================================

module.exports = router;