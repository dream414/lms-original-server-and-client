const Fine = require("../models/Fine");
const { createNotification } = require("./notificationController");

// ==============================
// Get My Fines
// ==============================

exports.getMyFine = async (req, res) => {

  try {

    const fines = await Fine.find({

      student: req.user.id

    }).populate("issue");

    res.json(fines);

  } catch (err) {

    res.status(500).json({

      message: err.message

    });

  }

};

// ==============================
// Get All Fines
// ==============================

exports.getAllFines = async (req, res) => {

  try {

    const fines = await Fine.find()

      .populate("student", "name email")

      .populate("issue");

    res.json(fines);

  } catch (err) {

    res.status(500).json({

      message: err.message

    });

  }

};

// ==============================
// Pay Fine
// ==============================

exports.payFine = async (req, res) => {

  try {

    const fine = await Fine.findById(req.params.id);

    if (!fine) {

      return res.status(404).json({

        message: "Fine Not Found"

      });

    }

    fine.status = "Paid";
    fine.paidDate = new Date();

    await fine.save();

    // Notification
    await createNotification(

      fine.student,

      "Fine Paid",

      `Your fine of Rs.${fine.amount} has been marked as paid.`,

      "Fine"

    );

    res.json({

      message: "Fine Paid Successfully"

    });

  } catch (err) {

    res.status(500).json({

      message: err.message

    });

  }

};