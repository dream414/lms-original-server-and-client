const IssueBook = require("../models/IssueBook");
const ReturnBook = require("../models/ReturnBook");
const Book = require("../models/Book");
const Fine = require("../models/Fine");

const calculateFine = require("../utils/calculateFine");

const {
  createNotification,
} = require("./notificationController");


// =========================================================
// STUDENT — REQUEST BOOK RETURN
// =========================================================

exports.requestReturnBook = async (req, res) => {
  try {
    const { issueId } = req.params;

    // -------------------------------------------------------
    // FIND ISSUE
    // -------------------------------------------------------

    const issue = await IssueBook.findById(issueId)
      .populate("book", "title author coverImage");

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue record not found",
      });
    }

    // -------------------------------------------------------
    // CHECK STUDENT OWNERSHIP
    // -------------------------------------------------------

    if (
      issue.student.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to return this book",
      });
    }

    // -------------------------------------------------------
    // ALREADY RETURNED
    // -------------------------------------------------------

    if (issue.status === "Returned") {
      return res.status(400).json({
        success: false,
        message:
          "This book has already been returned",
      });
    }

    // -------------------------------------------------------
    // BOOK MUST BE RECEIVED
    // -------------------------------------------------------

    if (!issue.received) {
      return res.status(400).json({
        success: false,
        message:
          "Please receive the book before requesting return",
      });
    }

    // -------------------------------------------------------
    // REQUEST ALREADY SUBMITTED
    // -------------------------------------------------------

    if (issue.returnRequested === true) {
      return res.status(400).json({
        success: false,
        message:
          "Return request has already been submitted",
      });
    }

    // =======================================================
    // IMPORTANT
    // =======================================================
    //
    // DO NOT CREATE ReturnBook HERE.
    //
    // Student click only marks the IssueBook as
    // returnRequested.
    //
    // ReturnBook document will be created ONLY after
    // librarian confirms the return.
    // =======================================================

    issue.returnRequested = true;
    issue.returnRequestedAt = new Date();

    await issue.save();

    // -------------------------------------------------------
    // NOTIFICATION
    // -------------------------------------------------------

    await createNotification(
      issue.student,
      "Return Request Submitted",
      "Your return request has been sent to the librarian for confirmation.",
      "Return"
    );

    // -------------------------------------------------------
    // RESPONSE
    // -------------------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Return request sent to librarian successfully.",
      issueBook: issue,
    });

  } catch (error) {
    console.error(
      "REQUEST RETURN BOOK ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to submit return request",
    });
  }
};


// =========================================================
// LIBRARIAN — GET PENDING RETURN REQUESTS
// =========================================================
//
// IMPORTANT:
//
// Pending requests are NOT stored in ReturnBook.
//
// They are IssueBook records where:
// returnRequested === true
//
// =========================================================

exports.getAllReturnRequests = async (req, res) => {
  try {

    const pendingRequests =
      await IssueBook.find({
        status: "Issued",
        returnRequested: true,
      })
        .populate(
          "student",
          "name email"
        )
        .populate(
          "book",
          "title author coverImage"
        )
        .sort({
          returnRequestedAt: -1,
        });

    // -------------------------------------------------------
    // GET PROCESSED RETURNS
    // -------------------------------------------------------

    const processedRequests =
      await ReturnBook.find()
        .populate(
          "student",
          "name email"
        )
        .populate(
          "book",
          "title author coverImage"
        )
        .populate({
          path: "issue",
          populate: [
            {
              path: "student",
              select: "name email",
            },
            {
              path: "book",
              select: "title author coverImage",
            },
          ],
        })
        .sort({
          createdAt: -1,
        });

    // -------------------------------------------------------
    // CONVERT PENDING ISSUE RECORDS INTO RETURN REQUEST SHAPE
    // -------------------------------------------------------

    const pendingFormatted =
      pendingRequests.map((issue) => ({
        _id: issue._id,

        issue: issue,

        student: issue.student,

        book: issue.book,

        status: "Pending",

        createdAt:
          issue.returnRequestedAt ||
          issue.updatedAt,

        requestDate:
          issue.returnRequestedAt ||
          issue.updatedAt,

        isPendingRequest: true,
      }));

    // -------------------------------------------------------
    // PROCESSED RETURN RECORDS
    // -------------------------------------------------------

    const processedFormatted =
      processedRequests.map((request) => ({
        ...request.toObject(),

        isPendingRequest: false,
      }));

    // -------------------------------------------------------
    // COMBINE
    // -------------------------------------------------------

    const allRequests = [
      ...pendingFormatted,
      ...processedFormatted,
    ];

    return res.status(200).json({
      success: true,
      count: allRequests.length,
      returns: allRequests,
    });

  } catch (error) {
    console.error(
      "GET RETURN REQUESTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get return requests",
    });
  }
};


// =========================================================
// STUDENT — GET MY RETURN REQUESTS
// =========================================================
//
// Pending requests come from IssueBook.
// Processed requests come from ReturnBook.
// =========================================================

exports.getMyReturnRequests = async (
  req,
  res
) => {
  try {

    // -------------------------------------------------------
    // PENDING
    // -------------------------------------------------------

    const pendingIssues =
      await IssueBook.find({
        student: req.user.id,
        status: "Issued",
        returnRequested: true,
      })
        .populate(
          "book",
          "title author coverImage"
        )
        .sort({
          returnRequestedAt: -1,
        });

    // -------------------------------------------------------
    // PROCESSED
    // -------------------------------------------------------

    const processedReturns =
      await ReturnBook.find({
        student: req.user.id,
      })
        .populate(
          "book",
          "title author coverImage"
        )
        .populate("issue")
        .sort({
          createdAt: -1,
        });

    // -------------------------------------------------------
    // FORMAT PENDING
    // -------------------------------------------------------

    const pendingFormatted =
      pendingIssues.map((issue) => ({
        _id: issue._id,

        issue: issue,

        student: req.user.id,

        book: issue.book,

        status: "Pending",

        createdAt:
          issue.returnRequestedAt,

        requestDate:
          issue.returnRequestedAt,

        isPendingRequest: true,
      }));

    // -------------------------------------------------------
    // FORMAT PROCESSED
    // -------------------------------------------------------

    const processedFormatted =
      processedReturns.map((request) => ({
        ...request.toObject(),

        isPendingRequest: false,
      }));

    // -------------------------------------------------------
    // COMBINE
    // -------------------------------------------------------

    const requests = [
      ...pendingFormatted,
      ...processedFormatted,
    ];

    return res.status(200).json({
      success: true,
      count: requests.length,
      returns: requests,
    });

  } catch (error) {
    console.error(
      "GET MY RETURN REQUESTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get your return requests",
    });
  }
};


// =========================================================
// LIBRARIAN — CONFIRM RETURN
// =========================================================
//
// IMPORTANT:
//
// confirm endpoint receives ISSUE ID,
// not ReturnBook ID.
//
// ReturnBook is CREATED HERE for the first time.
// =========================================================

exports.confirmReturnBook = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    // -------------------------------------------------------
    // FIND ISSUE
    // -------------------------------------------------------

    const issue =
      await IssueBook.findById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message:
          "Issue record not found",
      });
    }

    // -------------------------------------------------------
    // MUST HAVE RETURN REQUEST
    // -------------------------------------------------------

    if (issue.returnRequested !== true) {
      return res.status(400).json({
        success: false,
        message:
          "This book does not have a pending return request",
      });
    }

    // -------------------------------------------------------
    // ALREADY RETURNED
    // -------------------------------------------------------

    if (issue.status === "Returned") {
      return res.status(400).json({
        success: false,
        message:
          "This book has already been returned",
      });
    }

    // -------------------------------------------------------
    // FIND BOOK
    // -------------------------------------------------------

    const book =
      await Book.findById(issue.book);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // -------------------------------------------------------
    // RETURN DATE
    // -------------------------------------------------------

    const returnDate = new Date();

    // -------------------------------------------------------
    // CALCULATE FINE
    // -------------------------------------------------------

    const result =
      calculateFine(
        issue.dueDate,
        returnDate
      );

    // =======================================================
    // CREATE ReturnBook NOW
    // =======================================================

    const returnRequest =
      await ReturnBook.create({
        issue: issue._id,
        student: issue.student,
        book: issue.book,
        returnDate: returnDate,
        fine: result.amount,
        status: "Returned",
      });

    // -------------------------------------------------------
    // UPDATE ISSUE
    // -------------------------------------------------------

    issue.status = "Returned";

    issue.returnRequested = false;

    issue.returnRequestedAt = null;

    await issue.save();

    // -------------------------------------------------------
    // INCREASE AVAILABLE COPIES
    // -------------------------------------------------------

    book.availableCopies =
      (book.availableCopies || 0) + 1;

    // -------------------------------------------------------
    // SAFETY CHECK
    // -------------------------------------------------------

    if (
      typeof book.quantity === "number" &&
      book.availableCopies > book.quantity
    ) {
      book.availableCopies =
        book.quantity;
    }

    await book.save();

    // -------------------------------------------------------
    // CREATE FINE
    // -------------------------------------------------------

    if (result.amount > 0) {

      await Fine.create({
        student: issue.student,
        issue: issue._id,
        amount: result.amount,
        daysLate: result.daysLate,
      });

      await createNotification(
        issue.student,
        "Fine Added",
        `Fine of Rs.${result.amount} has been added to your account.`,
        "Fine"
      );
    }

    // -------------------------------------------------------
    // RETURN NOTIFICATION
    // -------------------------------------------------------

    await createNotification(
      issue.student,
      "Book Returned",
      "Your book return has been confirmed successfully by the librarian.",
      "Return"
    );

    // -------------------------------------------------------
    // RESPONSE
    // -------------------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Book returned successfully",
      fine: result.amount,
      daysLate: result.daysLate,
      returnRequest,
    });

  } catch (error) {
    console.error(
      "CONFIRM RETURN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to confirm book return",
    });
  }
};


// =========================================================
// LIBRARIAN — REJECT RETURN REQUEST
// =========================================================
//
// IMPORTANT:
//
// Since pending request is stored in IssueBook,
// reject receives ISSUE ID.
//
// NO ReturnBook document is created.
// =========================================================

exports.rejectReturnRequest = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    // -------------------------------------------------------
    // FIND ISSUE
    // -------------------------------------------------------

    const issue =
      await IssueBook.findById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message:
          "Issue record not found",
      });
    }

    // -------------------------------------------------------
    // CHECK REQUEST
    // -------------------------------------------------------

    if (issue.returnRequested !== true) {
      return res.status(400).json({
        success: false,
        message:
          "This book does not have a pending return request",
      });
    }

    // -------------------------------------------------------
    // RESET REQUEST
    // -------------------------------------------------------

    issue.returnRequested = false;

    issue.returnRequestedAt = null;

    await issue.save();

    // -------------------------------------------------------
    // NOTIFICATION
    // -------------------------------------------------------

    await createNotification(
      issue.student,
      "Return Request Rejected",
      "Your book return request was rejected by the librarian.",
      "Return"
    );

    // -------------------------------------------------------
    // RESPONSE
    // -------------------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Return request rejected successfully",
      issueBook: issue,
    });

  } catch (error) {
    console.error(
      "REJECT RETURN REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to reject return request",
    });
  }
};