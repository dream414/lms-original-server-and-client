
const User = require("../models/User");
const Book = require("../models/Book");
const IssueBook = require("../models/IssueBook");
const ReturnBook = require("../models/ReturnBook");
const Fine = require("../models/Fine");
const DigitalBook = require("../models/DigitalBook");
const Report = require("../models/Report");

// =====================================================
// GET OVERVIEW REPORT
// GET /api/reports/overview
// =====================================================

exports.getOverviewReport = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBooks,
      totalIssued,
      totalReturned,
      totalFines,
      totalDigitalBooks,
    ] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
      IssueBook.countDocuments(),
      ReturnBook.countDocuments(),
      Fine.countDocuments(),
      DigitalBook.countDocuments(),
    ]);

    // -------------------------------------------------
    // BOOK AVAILABILITY
    // Book model does NOT have status field.
    // availableCopies > 0 = Active/Available
    // availableCopies === 0 = Inactive/Unavailable
    // -------------------------------------------------

    const books = await Book.find()
      .select("quantity availableCopies")
      .lean();

    const activeBooks = books.filter(
      (book) => Number(book.availableCopies) > 0
    ).length;

    const inactiveBooks = books.filter(
      (book) => Number(book.availableCopies) <= 0
    ).length;

    // -------------------------------------------------
    // ISSUES
    // -------------------------------------------------

    const pendingIssues = await IssueBook.countDocuments({
      status: {
        $ne: "Returned",
      },
    });

    // -------------------------------------------------
    // RETURNS
    // -------------------------------------------------

    const pendingReturns = await ReturnBook.countDocuments({
      status: "Pending",
    });

    // -------------------------------------------------
    // DIGITAL LIBRARY
    // -------------------------------------------------

    const digitalBooks = await DigitalBook.find()
      .select(
        "status views downloads"
      )
      .lean();

    const digitalActiveBooks =
      digitalBooks.filter(
        (book) => book.status === "Active"
      ).length;

    const digitalInactiveBooks =
      digitalBooks.filter(
        (book) => book.status === "Inactive"
      ).length;

    const totalDigitalViews =
      digitalBooks.reduce(
        (total, book) =>
          total + (Number(book.views) || 0),
        0
      );

    const totalDigitalDownloads =
      digitalBooks.reduce(
        (total, book) =>
          total + (Number(book.downloads) || 0),
        0
      );

    // -------------------------------------------------
    // FINES
    // -------------------------------------------------

    const fineAmountResult = await Fine.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalFineAmount =
      fineAmountResult[0]?.totalAmount || 0;

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      report: {
        users: {
          total: totalUsers,
        },

        books: {
          total: totalBooks,
          active: activeBooks,
          inactive: inactiveBooks,
        },

        issues: {
          total: totalIssued,
          pending: pendingIssues,
        },

        returns: {
          total: totalReturned,
          pending: pendingReturns,
        },

        fines: {
          total: totalFines,
          totalAmount: totalFineAmount,
        },

        digitalLibrary: {
          total: totalDigitalBooks,
          active: digitalActiveBooks,
          inactive: digitalInactiveBooks,
          totalViews: totalDigitalViews,
          totalDownloads: totalDigitalDownloads,
        },
      },
    });
  } catch (error) {
    console.error(
      "GET OVERVIEW REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate overview report",
    });
  }
};

// =====================================================
// GET USERS REPORT
// GET /api/reports/users
// =====================================================

exports.getUsersReport = async (req, res) => {
  try {
    // User model does NOT contain department.
    const users = await User.find()
      .select(
        "name email role status createdAt"
      )
      .sort({
        createdAt: -1,
      });

    const totalUsers = users.length;

    const roleStats = {};

    users.forEach((user) => {
      const role = user.role || "unknown";

      if (!roleStats[role]) {
        roleStats[role] = 0;
      }

      roleStats[role]++;
    });

    return res.status(200).json({
      success: true,

      summary: {
        totalUsers,
        roleStats,
      },

      users,
    });
  } catch (error) {
    console.error(
      "GET USERS REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate users report",
    });
  }
};

// =====================================================
// GET BOOKS REPORT
// GET /api/reports/books
// =====================================================

exports.getBooksReport = async (req, res) => {
  try {
    // Book model:
    // category = String
    // status = DOES NOT EXIST

    const books = await Book.find()
      .sort({
        createdAt: -1,
      });

    const totalBooks = books.length;

    // Available = Active
    const activeBooks = books.filter(
      (book) =>
        Number(book.availableCopies) > 0
    ).length;

    // No available copy = Inactive/Unavailable
    const inactiveBooks = books.filter(
      (book) =>
        Number(book.availableCopies) <= 0
    ).length;

    const totalQuantity = books.reduce(
      (total, book) =>
        total +
        (Number(book.quantity) || 0),
      0
    );

    const availableCopies = books.reduce(
      (total, book) =>
        total +
        (Number(book.availableCopies) || 0),
      0
    );

    return res.status(200).json({
      success: true,

      summary: {
        totalBooks,
        activeBooks,
        inactiveBooks,
        totalQuantity,
        availableCopies,
      },

      books,
    });
  } catch (error) {
    console.error(
      "GET BOOKS REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate books report",
    });
  }
};

// =====================================================
// GET ISSUES REPORT
// GET /api/reports/issues
// =====================================================

exports.getIssuesReport = async (req, res) => {
  try {
    const issues = await IssueBook.find()
      .populate(
        "student",
        "name email"
      )
      .populate(
        "book",
        "title author category isbn"
      )
      .sort({
        createdAt: -1,
      });

    const totalIssues = issues.length;

    const returned = issues.filter(
      (issue) =>
        issue.status === "Returned"
    ).length;

    const pending = issues.filter(
      (issue) =>
        issue.status !== "Returned"
    ).length;

    return res.status(200).json({
      success: true,

      summary: {
        totalIssues,
        returned,
        pending,
      },

      issues,
    });
  } catch (error) {
    console.error(
      "GET ISSUES REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate issues report",
    });
  }
};

// =====================================================
// GET RETURNS REPORT
// GET /api/reports/returns
// =====================================================

exports.getReturnsReport = async (
  req,
  res
) => {
  try {
    const returns = await ReturnBook.find()
      .populate(
        "student",
        "name email"
      )
      .populate(
        "book",
        "title author category isbn"
      )
      .populate(
        "issue"
      )
      .sort({
        createdAt: -1,
      });

    const totalReturns =
      returns.length;

    const pending = returns.filter(
      (item) =>
        item.status === "Pending"
    ).length;

    const completed = returns.filter(
      (item) =>
        item.status === "Returned"
    ).length;

    const rejected = returns.filter(
      (item) =>
        item.status === "Rejected"
    ).length;

    const totalFine = returns.reduce(
      (total, item) =>
        total +
        (Number(item.fine) || 0),
      0
    );

    return res.status(200).json({
      success: true,

      summary: {
        totalReturns,
        pending,
        completed,
        rejected,
        totalFine,
      },

      returns,
    });
  } catch (error) {
    console.error(
      "GET RETURNS REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate returns report",
    });
  }
};

// =====================================================
// GET FINES REPORT
// GET /api/reports/fines
// =====================================================

exports.getFinesReport = async (
  req,
  res
) => {
  try {
    const fines = await Fine.find()
      .populate(
        "student",
        "name email"
      )
      .populate(
        "issue"
      )
      .sort({
        createdAt: -1,
      });

    const totalFines =
      fines.length;

    const totalAmount = fines.reduce(
      (total, fine) =>
        total +
        (Number(fine.amount) || 0),
      0
    );

    // Fine model has status:
    // "Unpaid" | "Paid"

    const paidFines = fines.filter(
      (fine) =>
        fine.status === "Paid"
    ).length;

    const unpaidFines = fines.filter(
      (fine) =>
        fine.status === "Unpaid"
    ).length;

    return res.status(200).json({
      success: true,

      summary: {
        totalFines,
        totalAmount,
        paidFines,
        unpaidFines,
      },

      fines,
    });
  } catch (error) {
    console.error(
      "GET FINES REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate fines report",
    });
  }
};

// =====================================================
// GET DIGITAL LIBRARY REPORT
// GET /api/reports/digital-library
// =====================================================

exports.getDigitalLibraryReport = async (
  req,
  res
) => {
  try {
    const digitalBooks =
      await DigitalBook.find()
        .sort({
          createdAt: -1,
        });

    const totalBooks =
      digitalBooks.length;

    const activeBooks =
      digitalBooks.filter(
        (book) =>
          book.status === "Active"
      ).length;

    const inactiveBooks =
      digitalBooks.filter(
        (book) =>
          book.status === "Inactive"
      ).length;

    const totalViews =
      digitalBooks.reduce(
        (total, book) =>
          total +
          (Number(book.views) || 0),
        0
      );

    const totalDownloads =
      digitalBooks.reduce(
        (total, book) =>
          total +
          (Number(book.downloads) || 0),
        0
      );

    return res.status(200).json({
      success: true,

      summary: {
        totalBooks,
        activeBooks,
        inactiveBooks,
        totalViews,
        totalDownloads,
      },

      digitalBooks,
    });
  } catch (error) {
    console.error(
      "GET DIGITAL LIBRARY REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate digital library report",
    });
  }
};

// =====================================================
// GET SAVED REPORTS
// GET /api/reports
// =====================================================

exports.getReports = async (
  req,
  res
) => {
  try {
    const reports =
      await Report.find()
        .populate(
          "generatedBy",
          "name email role"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error(
      "GET REPORTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch reports",
    });
  }
};

// =====================================================
// GET SINGLE REPORT
// GET /api/reports/:id
// =====================================================

exports.getReportById = async (
  req,
  res
) => {
  try {
    const report =
      await Report.findById(
        req.params.id
      ).populate(
        "generatedBy",
        "name email role"
      );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error(
      "GET REPORT BY ID ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch report",
    });
  }
};

// =====================================================
// SAVE REPORT
// POST /api/reports
// =====================================================

exports.createReport = async (
  req,
  res
) => {
  try {
    const {
      reportType,
      title,
      filters,
      data,
      summary,
      format,
    } = req.body;

    if (!reportType) {
      return res.status(400).json({
        success: false,
        message:
          "Report type is required",
      });
    }

    const report =
      await Report.create({
        reportType,

        title:
          title ||
          `${reportType} Report`,

        generatedBy: req.user.id,

        filters:
          filters || {},

        data:
          data || {},

        summary:
          summary || {},

        format:
          format || "json",
      });

    return res.status(201).json({
      success: true,
      message:
        "Report saved successfully",
      report,
    });
  } catch (error) {
    console.error(
      "CREATE REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to save report",
    });
  }
};

// =====================================================
// DELETE REPORT
// DELETE /api/reports/:id
// =====================================================

exports.deleteReport = async (
  req,
  res
) => {
  try {
    const report =
      await Report.findById(
        req.params.id
      );

    if (!report) {
      return res.status(404).json({
        success: false,
        message:
          "Report not found",
      });
    }

    await report.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Report deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete report",
    });
  }
};

