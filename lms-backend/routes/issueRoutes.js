const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");


// =================================
// Get Issued Books
// Admin + SuperAdmin + Librarian
// =================================

router.get(
  "/",
  protect,
  authorize(
    "admin",
    "superadmin",
    "librarian"
  ),
  async (req,res)=>{

    res.json({
      message:"Issue Books List"
    });

  }
);


module.exports = router;