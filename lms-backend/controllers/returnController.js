const IssueBook = require("../models/IssueBook");
const ReturnBook = require("../models/ReturnBook");
const Book = require("../models/Book");
const Fine = require("../models/Fine");
const calculateFine = require("../utils/calculateFine");
const { createNotification } = require("./notificationController");

// =====================================
// Return Book
// =====================================

exports.returnBook = async (req, res) => {

  try {

    const issue = await IssueBook.findById(req.params.id);

    if (!issue) {

      return res.status(404).json({

        message: "Issue Record Not Found"

      });

    }   

    // Update Issue Status
    issue.status = "Returned";

    await issue.save();

    // Increase Available Copies
    const book = await Book.findById(issue.book);

    if (!book) {

      return res.status(404).json({

        message: "Book Not Found"

      });

    }

    book.availableCopies += 1;

    await book.save();

    // Calculate Fine
    const result = calculateFine(

      issue.dueDate,

      new Date()

    );

    // Save Return Record
    await ReturnBook.create({

      issue: issue._id,

      returnDate: new Date(),

      fine: result.amount

    });

    // Book Returned Notification
    await createNotification(

      issue.student,

      "Book Returned",

      "Thank you for returning the book.",

      "Return"

    );

    // Create Fine (if late)
    if (result.amount > 0) {

      await Fine.create({

        student: issue.student,

        issue: issue._id,

        amount: result.amount,

        daysLate: result.daysLate

      });

      // Fine Notification
      await createNotification(

        issue.student,

        "Fine Added",

        `Fine of Rs.${result.amount} has been added to your account.`,

        "Fine"

      );

    }

    res.json({

      message: "Book Returned Successfully",

      fine: result.amount

    });

  } catch (err) {

    res.status(500).json({

      message: err.message

    });

  }

};