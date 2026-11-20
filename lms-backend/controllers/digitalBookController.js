const DigitalBook = require("../models/DigitalBook");
const DigitalBookActivity = require("../models/DigitalBookActivity");
const path = require("path");
const fs = require("fs");

// =====================================================
// CREATE DIGITAL BOOK
// =====================================================

const createDigitalBook = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      category,
      isbn,
      publisher,
      publicationYear,
      language,
    } = req.body;

    const uploadedCover = req.files?.coverImage?.[0];
    const uploadedDigitalFile = req.files?.digitalFile?.[0];

    const coverImage = uploadedCover
      ? `/uploads/digital-books/covers/${uploadedCover.filename}`
      : "";

    const digitalFile = uploadedDigitalFile
      ? `/uploads/digital-books/files/${uploadedDigitalFile.filename}`
      : "";

    const fileType =
      uploadedDigitalFile?.mimetype || "PDF";

    const fileSize =
      uploadedDigitalFile?.size || 0;

    if (!title || !author || !category || !digitalFile) {
      return res.status(400).json({
        success: false,
        message:
          "Title, author, category and digital file are required",
      });
    }

    const digitalBook = await DigitalBook.create({
      title,
      author,
      description,
      category,
      isbn,
      publisher,
      publicationYear,
      language,
      coverImage,
      digitalFile,
      fileType,
      fileSize,
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Digital book created successfully",
      digitalBook,
    });
  } catch (error) {
    console.error(
      "Create Digital Book Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create digital book",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL DIGITAL BOOKS
// =====================================================

const getDigitalBooks = async (req, res) => {
  try {
    const digitalBooks = await DigitalBook.find()
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: digitalBooks.length,
      digitalBooks,
    });
  } catch (error) {
    console.error(
      "Get Digital Books Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch digital books",
      error: error.message,
    });
  }
};

// =====================================================
// GET DIGITAL BOOK BY ID
// =====================================================

const getDigitalBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const digitalBook =
      await DigitalBook.findById(id).populate(
        "uploadedBy",
        "name email role"
      );

    if (!digitalBook) {
      return res.status(404).json({
        success: false,
        message: "Digital book not found",
      });
    }

    res.status(200).json({
      success: true,
      digitalBook,
    });
  } catch (error) {
    console.error(
      "Get Digital Book By ID Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch digital book",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE DIGITAL BOOK
// =====================================================

const updateDigitalBook = async (req, res) => {
  try {
    const { id } = req.params;

    const digitalBook =
      await DigitalBook.findById(id);

    if (!digitalBook) {
      return res.status(404).json({
        success: false,
        message: "Digital book not found",
      });
    }

    const {
      title,
      author,
      description,
      category,
      isbn,
      publisher,
      publicationYear,
      language,
      status,
    } = req.body;

    if (title !== undefined) {
      digitalBook.title = title;
    }

    if (author !== undefined) {
      digitalBook.author = author;
    }

    if (description !== undefined) {
      digitalBook.description = description;
    }

    if (category !== undefined) {
      digitalBook.category = category;
    }

    if (isbn !== undefined) {
      digitalBook.isbn = isbn;
    }

    if (publisher !== undefined) {
      digitalBook.publisher = publisher;
    }

    if (publicationYear !== undefined) {
      digitalBook.publicationYear = publicationYear;
    }

    if (language !== undefined) {
      digitalBook.language = language;
    }

    if (status !== undefined) {
      digitalBook.status = status;
    }

    // =================================================
    // UPDATE COVER IMAGE
    // =================================================

    if (req.files?.coverImage?.[0]) {
      const uploadedCover =
        req.files.coverImage[0];

      digitalBook.coverImage =
        `/uploads/digital-books/covers/${uploadedCover.filename}`;
    }

    // =================================================
    // UPDATE DIGITAL FILE
    // =================================================

    if (req.files?.digitalFile?.[0]) {
      const uploadedDigitalFile =
        req.files.digitalFile[0];

      digitalBook.digitalFile =
        `/uploads/digital-books/files/${uploadedDigitalFile.filename}`;

      digitalBook.fileType =
        uploadedDigitalFile.mimetype ||
        digitalBook.fileType;

      digitalBook.fileSize =
        uploadedDigitalFile.size ||
        digitalBook.fileSize;
    }

    await digitalBook.save();

    res.status(200).json({
      success: true,
      message: "Digital book updated successfully",
      digitalBook,
    });
  } catch (error) {
    console.error(
      "Update Digital Book Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update digital book",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE DIGITAL BOOK
// =====================================================

const deleteDigitalBook = async (req, res) => {
  try {
    const { id } = req.params;

    const digitalBook =
      await DigitalBook.findById(id);

    if (!digitalBook) {
      return res.status(404).json({
        success: false,
        message: "Digital book not found",
      });
    }

    await DigitalBook.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Digital book deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Digital Book Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete digital book",
      error: error.message,
    });
  }
};

// =====================================================
// TOGGLE DIGITAL BOOK STATUS
// =====================================================

const toggleDigitalBookStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const digitalBook =
      await DigitalBook.findById(id);

    if (!digitalBook) {
      return res.status(404).json({
        success: false,
        message: "Digital book not found",
      });
    }

    digitalBook.status =
      digitalBook.status === "Active"
        ? "Inactive"
        : "Active";

    await digitalBook.save();

    res.status(200).json({
      success: true,
      message: `Digital book ${digitalBook.status.toLowerCase()} successfully`,
      digitalBook,
    });
  } catch (error) {
    console.error(
      "Toggle Digital Book Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update digital book status",
      error: error.message,
    });
  }
};

// =====================================================
// GET DIGITAL BOOK FILE PATH
// =====================================================

const getDigitalBookFilePath = (digitalFile) => {
  if (!digitalFile) {
    return null;
  }

  let cleanPath = String(digitalFile).trim();

  // Remove domain if database accidentally contains full URL
  cleanPath = cleanPath.replace(
    /^https?:\/\/[^/]+/i,
    ""
  );

  // Remove leading slash
  cleanPath = cleanPath.replace(/^\/+/, "");

  // ---------------------------------------------------
  // New correct database path
  // Example:
  // uploads/digital-books/files/book.pdf
  // ---------------------------------------------------

  if (
    cleanPath.startsWith(
      "uploads/digital-books/files/"
    )
  ) {
    return path.resolve(
      __dirname,
      "..",
      cleanPath
    );
  }

  // ---------------------------------------------------
  // Backward compatibility
  // Old records may contain:
  // /uploads/book.pdf
  // ---------------------------------------------------

  const fileName = path.basename(cleanPath);

  return path.resolve(
    __dirname,
    "..",
    "uploads",
    "digital-books",
    "files",
    fileName
  );
};

// =====================================================
// VIEW DIGITAL BOOK
// =====================================================

const viewDigitalBook = async (req, res) => {
  try {
    const { id } = req.params;

    const digitalBook =
      await DigitalBook.findById(id);

    if (!digitalBook) {
      return res.status(404).json({
        success: false,
        message: "Digital book not found",
      });
    }

    if (digitalBook.status !== "Active") {
      return res.status(403).json({
        success: false,
        message:
          "This digital book is currently inactive",
      });
    }

    if (!digitalBook.digitalFile) {
      return res.status(404).json({
        success: false,
        message:
          "Digital book file is not available",
      });
    }

    const filePath = getDigitalBookFilePath(
      digitalBook.digitalFile
    );

    console.log(
      "Digital Book View Path:",
      filePath
    );

    if (!filePath || !fs.existsSync(filePath)) {
      console.error(
        "Digital Book View File Missing:",
        filePath
      );

      return res.status(404).json({
        success: false,
        message: "Digital book file not found",
      });
    }

    // Increase views
    digitalBook.views =
      (digitalBook.views || 0) + 1;

    await digitalBook.save();

    // Save activity
    await DigitalBookActivity.create({
      digitalBook: digitalBook._id,
      user: req.user.id,
      activityType: "view",
    });

    return res.sendFile(filePath);
  } catch (error) {
    console.error(
      "View Digital Book Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to view digital book",
      error: error.message,
    });
  }
};

// =====================================================
// READ DIGITAL BOOK
// =====================================================

const readDigitalBook = async (req, res) => {
  try {
    const { id } = req.params;

    const digitalBook =
      await DigitalBook.findById(id);

    if (!digitalBook) {
      return res.status(404).json({
        success: false,
        message: "Digital book not found",
      });
    }

    if (digitalBook.status !== "Active") {
      return res.status(403).json({
        success: false,
        message:
          "This digital book is currently inactive",
      });
    }

    if (!digitalBook.digitalFile) {
      return res.status(404).json({
        success: false,
        message:
          "Digital book file is not available",
      });
    }

    const filePath = getDigitalBookFilePath(
      digitalBook.digitalFile
    );

    console.log(
      "Digital Book Read Path:",
      filePath
    );

    if (!filePath || !fs.existsSync(filePath)) {
      console.error(
        "Digital Book Read File Missing:",
        filePath
      );

      return res.status(404).json({
        success: false,
        message: "Digital book file not found",
      });
    }

    // Increase reads
    digitalBook.reads =
      (digitalBook.reads || 0) + 1;

    await digitalBook.save();

    // Save activity
    await DigitalBookActivity.create({
      digitalBook: digitalBook._id,
      user: req.user.id,
      activityType: "read",
    });

    return res.sendFile(filePath);
  } catch (error) {
    console.error(
      "Read Digital Book Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to read digital book",
      error: error.message,
    });
  }
};

// =====================================================
// DOWNLOAD DIGITAL BOOK
// =====================================================

const downloadDigitalBook = async (req, res) => {
  try {
    const { id } = req.params;

    const digitalBook =
      await DigitalBook.findById(id);

    if (!digitalBook) {
      return res.status(404).json({
        success: false,
        message: "Digital book not found",
      });
    }

    if (digitalBook.status !== "Active") {
      return res.status(403).json({
        success: false,
        message:
          "This digital book is currently inactive",
      });
    }

    if (!digitalBook.digitalFile) {
      return res.status(404).json({
        success: false,
        message:
          "Digital book file is not available",
      });
    }

    const filePath = getDigitalBookFilePath(
      digitalBook.digitalFile
    );

    console.log(
      "Digital Book Download Path:",
      filePath
    );

    if (!filePath || !fs.existsSync(filePath)) {
      console.error(
        "Digital Book Download File Missing:",
        filePath
      );

      return res.status(404).json({
        success: false,
        message: "Digital book file not found",
      });
    }

    // Increase downloads
    digitalBook.downloads =
      (digitalBook.downloads || 0) + 1;

    await digitalBook.save();

    // Save activity
    await DigitalBookActivity.create({
      digitalBook: digitalBook._id,
      user: req.user.id,
      activityType: "download",
    });

    return res.download(
      filePath,
      path.basename(filePath)
    );
  } catch (error) {
    console.error(
      "Download Digital Book Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to download digital book",
      error: error.message,
    });
  }
};

// =====================================================
// GET DIGITAL BOOK STATS
// =====================================================

const getDigitalBookStats = async (req, res) => {
  try {
    const totalBooks =
      await DigitalBook.countDocuments();

    const activeBooks =
      await DigitalBook.countDocuments({
        status: "Active",
      });

    const inactiveBooks =
      await DigitalBook.countDocuments({
        status: "Inactive",
      });

    const viewResult =
      await DigitalBook.aggregate([
        {
          $group: {
            _id: null,

            totalViews: {
              $sum: {
                $ifNull: ["$views", 0],
              },
            },

            totalReads: {
              $sum: {
                $ifNull: ["$reads", 0],
              },
            },

            totalDownloads: {
              $sum: {
                $ifNull: ["$downloads", 0],
              },
            },
          },
        },
      ]);

    const totalViews =
      viewResult.length > 0
        ? viewResult[0].totalViews
        : 0;

    const totalReads =
      viewResult.length > 0
        ? viewResult[0].totalReads
        : 0;

    const totalDownloads =
      viewResult.length > 0
        ? viewResult[0].totalDownloads
        : 0;

    const categories =
      await DigitalBook.distinct("category");

    const recentBooks =
      await DigitalBook.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "title author category coverImage status createdAt views reads downloads"
        );

    res.status(200).json({
      success: true,

      stats: {
        totalBooks,
        activeBooks,
        inactiveBooks,
        totalViews,
        totalReads,
        totalDownloads,
        totalCategories: categories.length,
        categories,
        recentBooks,
      },
    });
  } catch (error) {
    console.error(
      "Get Digital Book Stats Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch digital book statistics",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
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
};