const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const { digitalBookUpload } = require("../middleware/uploadMiddleware");

const {
  createDigitalBook,
  getDigitalBooks,
  getDigitalBookById,
  updateDigitalBook,
  deleteDigitalBook,
  toggleDigitalBookStatus,
  viewDigitalBook,
  readDigitalBook,
  downloadDigitalBook,
  getDigitalBookStats,
} = require("../controllers/digitalBookController");

// ==========================================
// DIGITAL BOOK STATS
// ==========================================
router.get(
  "/stats",
  protect,
  authorize("digital", "admin", "superadmin"),
  getDigitalBookStats
);

// ==========================================
// CREATE DIGITAL BOOK
// ==========================================
router.post(
  "/",
  protect,
  authorize("digital", "admin", "superadmin"),
  digitalBookUpload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "digitalFile",
      maxCount: 1,
    },
  ]),
  createDigitalBook
);

// ==========================================
// GET ALL DIGITAL BOOKS
// ==========================================
router.get("/", protect, getDigitalBooks);

// ==========================================
// VIEW DIGITAL BOOK
// ==========================================
// IMPORTANT:
// Keep this BEFORE /:id so "view" is not treated as an ID.
router.get("/:id/view", protect, viewDigitalBook);

// ==========================================
// READ DIGITAL BOOK
// ==========================================
router.get("/:id/read", protect, readDigitalBook);

// ==========================================
// DOWNLOAD DIGITAL BOOK
// ==========================================
router.get("/:id/download", protect, downloadDigitalBook);

// ==========================================
// GET DIGITAL BOOK BY ID
// ==========================================
router.get("/:id", protect, getDigitalBookById);

// ==========================================
// UPDATE DIGITAL BOOK
// ==========================================
router.put(
  "/:id",
  protect,
  authorize("digital", "admin", "superadmin"),
  digitalBookUpload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "digitalFile",
      maxCount: 1,
    },
  ]),
  updateDigitalBook
);

// ==========================================
// DELETE DIGITAL BOOK
// ==========================================
router.delete(
  "/:id",
  protect,
  authorize("digital", "admin", "superadmin"),
  deleteDigitalBook
);

// ==========================================
// TOGGLE DIGITAL BOOK STATUS
// ==========================================
router.patch(
  "/:id/status",
  protect,
  authorize("digital", "admin", "superadmin"),
  toggleDigitalBookStatus
);

module.exports = router;