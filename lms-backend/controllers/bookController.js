const Book = require("../models/Book");

// =====================================================
// ADD BOOK
// =====================================================

exports.addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      category,
      isbn,
      quantity,
      description,
    } = req.body;

    // ==========================================
    // REQUIRED FIELD CHECK
    // ==========================================

    if (!title || !author || !category || !isbn) {
      return res.status(400).json({
        message:
          "Title, author, category and ISBN are required.",
      });
    }

    // ==========================================
    // QUANTITY
    // ==========================================

    const totalQuantity = Number(quantity) || 1;

    if (totalQuantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1.",
      });
    }

    // ==========================================
    // CHECK DUPLICATE ISBN
    // ==========================================

    const existingBook = await Book.findOne({
      isbn: isbn.trim(),
    });

    if (existingBook) {
      return res.status(400).json({
        message: "A book with this ISBN already exists.",
      });
    }

    // ==========================================
    // IMAGE
    // ==========================================

    const image = req.file
      ? req.file.filename
      : "";

    // ==========================================
    // CREATE BOOK
    // ==========================================

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      isbn: isbn.trim(),
      quantity: totalQuantity,
      availableCopies: totalQuantity,
      description: description || "",
      image,
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(201).json({
      message: "Book added successfully.",
      book,
    });
  } catch (error) {
    console.error("ADD BOOK ERROR:", error);

    // Duplicate ISBN
    if (error.code === 11000) {
      return res.status(400).json({
        message: "A book with this ISBN already exists.",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL BOOKS
// =====================================================

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("GET BOOKS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// GET SINGLE BOOK
// =====================================================

exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found.",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("GET BOOK ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE BOOK
// =====================================================

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found.",
      });
    }

    const {
      title,
      author,
      category,
      isbn,
      quantity,
      description,
      image,
    } = req.body;

    // ==========================================
    // BASIC FIELDS
    // ==========================================

    if (title !== undefined) {
      book.title = title.trim();
    }

    if (author !== undefined) {
      book.author = author.trim();
    }

    if (category !== undefined) {
      book.category = category.trim();
    }

    if (isbn !== undefined) {
      const existingISBN = await Book.findOne({
        isbn: isbn.trim(),
        _id: { $ne: book._id },
      });

      if (existingISBN) {
        return res.status(400).json({
          message:
            "Another book with this ISBN already exists.",
        });
      }

      book.isbn = isbn.trim();
    }

    if (description !== undefined) {
      book.description = description;
    }

    // ==========================================
    // QUANTITY LOGIC
    // ==========================================

    if (quantity !== undefined) {
      const newQuantity = Number(quantity);

      if (newQuantity < 1) {
        return res.status(400).json({
          message: "Quantity must be at least 1.",
        });
      }

      // Currently issued copies
      const issuedCopies =
        book.quantity - book.availableCopies;

      if (newQuantity < issuedCopies) {
        return res.status(400).json({
          message:
            `Quantity cannot be less than currently issued copies (${issuedCopies}).`,
        });
      }

      book.quantity = newQuantity;

      // Preserve currently issued copies
      book.availableCopies =
        newQuantity - issuedCopies;
    }

    // ==========================================
    // IMAGE
    // ==========================================

    if (req.file) {
      book.image = req.file.filename;
    } else if (image !== undefined) {
      book.image = image;
    }

    // ==========================================
    // SAVE
    // ==========================================

    await book.save();

    res.status(200).json({
      message: "Book updated successfully.",
      book,
    });
  } catch (error) {
    console.error("UPDATE BOOK ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "A book with this ISBN already exists.",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// DELETE BOOK
// =====================================================

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found.",
      });
    }

    // ==========================================
    // CHECK ISSUED COPIES
    // ==========================================

    const issuedCopies =
      book.quantity - book.availableCopies;

    if (issuedCopies > 0) {
      return res.status(400).json({
        message:
          "This book cannot be deleted because some copies are currently issued.",
      });
    }

    // ==========================================
    // DELETE
    // ==========================================

    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Book deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE BOOK ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// SEARCH BOOK
// =====================================================

exports.searchBook = async (req, res) => {
  try {
    const keyword =
      req.query.keyword?.trim() || "";

    if (!keyword) {
      return res.status(400).json({
        message: "Please enter a search keyword.",
      });
    }

    const books = await Book.find({
      $or: [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          author: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          category: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          isbn: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("SEARCH BOOK ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};