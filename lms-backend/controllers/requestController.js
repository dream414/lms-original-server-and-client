const BookRequest = require("../models/BookRequest");
const IssueBook = require("../models/IssueBook");
const Book = require("../models/Book");
const { createNotification } = require("./notificationController");

// ===============================
// Student Request Book
// ===============================

exports.createRequest = async (req, res) => {
  try {

    const request = await BookRequest.create({

      student: req.user.id,
      book: req.body.book,
      issueDate: req.body.issueDate,
      returnDate: req.body.returnDate,

    });

    // Notification
    await createNotification(

      req.user.id,

      "Book Request Submitted",

      "Your book request has been submitted successfully and is waiting for approval.",

      "Request"

    );

    res.status(201).json({

      message: "Request Sent Successfully",

      request,

    });

  } catch (err) {

    res.status(500).json({

      message: err.message,

    });

  }

};

// ===============================
// Student My Requests
// ===============================

exports.myRequests = async (req, res) => {

  try {

    const requests = await BookRequest.find({

      student: req.user.id,

    })

      .populate("book")

      .populate("student", "name email");

    res.json(requests);

  } catch (err) {

    res.status(500).json({

      message: err.message,

    });

  }

};

// ===============================
// Get All Requests
// ===============================

exports.getAllRequests = async (req, res) => {

  try {

    const requests = await BookRequest.find()

      .populate("student", "name email")

      .populate("book");

    res.json(requests);

  } catch (err) {

    res.status(500).json({

      message: err.message,

    });

  }

};

// ===============================
// Approve Request
// ===============================

exports.approveRequest = async (req, res) => {

  try {

    const request = await BookRequest.findById(req.params.id);

    if (!request) {

      return res.status(404).json({

        message: "Request Not Found",

      });

    }

    const book = await Book.findById(request.book);

    if (!book) {

      return res.status(404).json({

        message: "Book Not Found",

      });

    }

    if (book.availableCopies <= 0) {

      return res.status(400).json({

        message: "Book Out Of Stock",

      });

    }

    // Approve Request
    request.status = "Approved";

    await request.save();

    // Create Issue Record
    await IssueBook.create({

      student: request.student,

      book: request.book,

      request: request._id,

      issueDate: request.issueDate,

      dueDate: request.returnDate,

    });

    // Reduce Available Copies
    book.availableCopies -= 1;

    await book.save();

    // Notification
    await createNotification(

      request.student,

      "Book Approved",

      "Your book request has been approved. Please collect your book from the library.",

      "Request"

    );

    res.json({

      message: "Book Issued Successfully",

    });

  } catch (err) {

    res.status(500).json({

      message: err.message,

    });

  }

};

// ===============================
// Reject Request
// ===============================

exports.rejectRequest = async (req, res) => {

  try {

    const request = await BookRequest.findById(req.params.id);

    if (!request) {

      return res.status(404).json({

        message: "Request Not Found",

      });

    }

    request.status = "Rejected";

    request.remarks = req.body.remarks || "";

    await request.save();

    // Notification
    await createNotification(

      request.student,

      "Book Rejected",

      "Sorry! Your book request has been rejected.",

      "Request"

    );

    res.json({

      message: "Request Rejected Successfully",

      request,

    });

  } catch (err) {

    res.status(500).json({

      message: err.message,

    });

  }

};