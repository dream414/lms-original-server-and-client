
const Fine = require("../models/Fine");

const {
  createNotification,
} = require("./notificationController");

// =====================================
// GET MY FINES
// =====================================
// Student can see only their own fines
// GET /api/fines/my
// =====================================

exports.getMyFine = async (req, res) => {
  try {
    const fines = await Fine.find({
      student: req.user.id,
    })
      .populate({
        path: "issue",
        select: "book issueDate dueDate status",
        populate: {
          path: "book",
          select: "title author isbn",
        },
      })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: fines.length,
      fines,
    });
  } catch (err) {
    console.error(
      "GET MY FINES ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to get fines",
    });
  }
};

// =====================================
// GET ALL FINES
// =====================================
// Admin + SuperAdmin + Accountant + Librarian
// GET /api/fines
// =====================================

exports.getAllFines = async (req, res) => {
  try {
    const fines = await Fine.find()
      .populate(
        "student",
        "name email"
      )
      .populate({
        path: "issue",
        select:
          "book issueDate dueDate status",
        populate: {
          path: "book",
          select:
            "title author isbn",
        },
      })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: fines.length,
      fines,
    });
  } catch (err) {
    console.error(
      "GET ALL FINES ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to get fines",
    });
  }
};

// =====================================
// PAY FINE
// =====================================
// Admin + SuperAdmin + Accountant
// PUT /api/fines/pay/:id
// =====================================

exports.payFine = async (req, res) => {
  try {
    // =====================================
    // FIND FINE
    // =====================================

    const fine = await Fine.findById(
      req.params.id
    );

    if (!fine) {
      return res.status(404).json({
        success: false,
        message: "Fine Not Found",
      });
    }

    // =====================================
    // CHECK ALREADY PAID
    // =====================================

    if (fine.status === "Paid") {
      return res.status(400).json({
        success: false,
        message:
          "This fine has already been paid",
      });
    }

    // =====================================
    // UPDATE PAYMENT
    // =====================================

    fine.status = "Paid";
    fine.paidDate = new Date();

    await fine.save();

    // =====================================
    // NOTIFICATION
    // =====================================

    await createNotification(
      fine.student,
      "Fine Paid",
      `Your fine of Rs.${fine.amount} has been marked as paid.`,
      "Fine"
    );

    // =====================================
    // RESPONSE
    // =====================================

    return res.status(200).json({
      success: true,
      message:
        "Fine Paid Successfully",
      fine,
    });
  } catch (err) {
    console.error(
      "PAY FINE ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to pay fine",
    });
  }
};

