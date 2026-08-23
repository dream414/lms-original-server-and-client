const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  getUserById,
  changeRole,
  deleteUser,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// =====================================
// Get All Users
// Admin + SuperAdmin
// =====================================

router.get(
  "/",
  protect,
  authorize("admin", "superadmin"),
  getAllUsers
);

// =====================================
// Get Single User
// Authenticated Users
// =====================================

router.get(
  "/:id",
  protect,
  getUserById
);

// =====================================
// Change User Role
// Admin + SuperAdmin
// =====================================

router.put(
  "/change-role/:id",
  protect,
  authorize("admin", "superadmin"),
  changeRole
);

// =====================================
// Delete User
// Admin + SuperAdmin
// =====================================

router.delete(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  deleteUser
);

module.exports = router;