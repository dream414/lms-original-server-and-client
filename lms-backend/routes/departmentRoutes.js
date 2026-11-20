
const express = require("express");

const {
  createDepartment,
  getAllDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================================
// GET ALL DEPARTMENTS
// GET /api/departments
// =====================================================

router.get(
  "/",
  protect,
  getAllDepartments
);

// =====================================================
// GET SINGLE DEPARTMENT
// GET /api/departments/:id
// =====================================================

router.get(
  "/:id",
  protect,
  getDepartment
);

// =====================================================
// CREATE DEPARTMENT
// POST /api/departments
// =====================================================

router.post(
  "/",
  protect,
  authorize("superadmin", "admin", "hod"),
  createDepartment
);

// =====================================================
// UPDATE DEPARTMENT
// PUT /api/departments/:id
// =====================================================

router.put(
  "/:id",
  protect,
  authorize("superadmin", "admin", "hod"),
  updateDepartment
);

// =====================================================
// DELETE DEPARTMENT
// DELETE /api/departments/:id
// =====================================================

router.delete(
  "/:id",
  protect,
  authorize("superadmin", "admin", "hod"),
  deleteDepartment
);

module.exports = router;

