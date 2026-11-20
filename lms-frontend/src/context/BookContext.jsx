
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../api/api";

// =====================================================
// BOOK CONTEXT
// =====================================================

const BookContext = createContext();

// =====================================================
// BACKEND URL
// =====================================================

const BACKEND_URL = "http://localhost:5000";

// =====================================================
// NORMALIZE BOOK ARRAY
// =====================================================

const getBooksArray = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.books)) {
    return data.books;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.data?.books)) {
    return data.data.books;
  }

  return [];
};

// =====================================================
// BOOK IMAGE URL
// =====================================================

export const getBookImageUrl = (image) => {
  if (!image) {
    return null;
  }

  const cleanImage = String(image)
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  // Already complete URL
  if (
    cleanImage.startsWith("http://") ||
    cleanImage.startsWith("https://")
  ) {
    return cleanImage;
  }

  // Already contains uploads/books/
  if (cleanImage.startsWith("uploads/books/")) {
    return `${BACKEND_URL}/${cleanImage}`;
  }

  // Starts with books/
  if (cleanImage.startsWith("books/")) {
    return `${BACKEND_URL}/uploads/${cleanImage}`;
  }

  // Starts with /uploads/books/
  if (cleanImage.startsWith("uploads/")) {
    return `${BACKEND_URL}/${cleanImage}`;
  }

  // Database currently stores only filename
  // Example:
  // 1787921911236-me.png
  //
  // Actual location:
  // uploads/books/1787921911236-me.png

  return `${BACKEND_URL}/uploads/books/${cleanImage}`;
};

// =====================================================
// BOOK PROVIDER
// =====================================================

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===================================================
  // GET ALL BOOKS
  // ===================================================

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/books");

      console.log(
        "📚 BOOKS API RESPONSE:",
        response.data
      );

      const booksArray = getBooksArray(response.data);

      console.log(
        "📚 NORMALIZED BOOKS:",
        booksArray
      );

      setBooks(booksArray);

      return booksArray;
    } catch (err) {
      console.error(
        "FETCH BOOKS ERROR:",
        err.response?.data || err.message
      );

      setBooks([]);

      setError(
        err.response?.data?.message ||
          "Failed to fetch books."
      );

      return [];
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // GET SINGLE BOOK
  // ===================================================

  const fetchBook = async (id) => {
    try {
      setLoading(true);
      setError("");

      if (!id) {
        throw new Error("Book ID is missing.");
      }

      console.log(
        "📖 FETCHING BOOK:",
        id
      );

      const response = await API.get(
        `/books/${id}`
      );

      console.log(
        "📖 SINGLE BOOK RESPONSE:",
        response.data
      );

      const singleBook =
        response.data?.book ||
        response.data?.data ||
        response.data;

      if (!singleBook || !singleBook._id) {
        throw new Error(
          "Invalid book data received from server."
        );
      }

      setBook(singleBook);

      return singleBook;
    } catch (err) {
      console.error(
        "FETCH BOOK ERROR:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch book."
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // ADD BOOK
  // ===================================================

  const addBook = async (formData) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.post(
        "/books",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "📚 ADD BOOK RESPONSE:",
        response.data
      );

      const newBook =
        response.data?.book ||
        response.data?.data ||
        response.data;

      if (
        newBook &&
        typeof newBook === "object"
      ) {
        setBooks((prevBooks) => {
          const safeBooks =
            Array.isArray(prevBooks)
              ? prevBooks
              : [];

          return [
            newBook,
            ...safeBooks,
          ];
        });
      }

      return newBook;
    } catch (err) {
      console.error(
        "ADD BOOK ERROR:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to add book."
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // UPDATE BOOK
  // ===================================================

  const updateBook = async (
    id,
    formData
  ) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.put(
        `/books/${id}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "📚 UPDATE BOOK RESPONSE:",
        response.data
      );

      const updatedBook =
        response.data?.book ||
        response.data?.data ||
        response.data;

      setBooks((prevBooks) => {
        const safeBooks =
          Array.isArray(prevBooks)
            ? prevBooks
            : [];

        return safeBooks.map((item) =>
          item._id === id
            ? updatedBook
            : item
        );
      });

      setBook(updatedBook);

      return updatedBook;
    } catch (err) {
      console.error(
        "UPDATE BOOK ERROR:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to update book."
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // DELETE BOOK
  // ===================================================

  const deleteBook = async (id) => {
    try {
      setLoading(true);
      setError("");

      await API.delete(
        `/books/${id}`
      );

      setBooks((prevBooks) => {
        const safeBooks =
          Array.isArray(prevBooks)
            ? prevBooks
            : [];

        return safeBooks.filter(
          (item) => item._id !== id
        );
      });

      setBook((prevBook) =>
        prevBook?._id === id
          ? null
          : prevBook
      );

      return true;
    } catch (err) {
      console.error(
        "DELETE BOOK ERROR:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete book."
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // SEARCH BOOKS
  // ===================================================

  const searchBooks = async (
    keyword
  ) => {
    try {
      setLoading(true);
      setError("");

      if (!keyword?.trim()) {
        return await fetchBooks();
      }

      const response = await API.get(
        "/books/search",
        {
          params: {
            keyword:
              keyword.trim(),
          },
        }
      );

      console.log(
        "🔎 SEARCH BOOK RESPONSE:",
        response.data
      );

      const booksArray =
        getBooksArray(
          response.data
        );

      setBooks(booksArray);

      return booksArray;
    } catch (err) {
      console.error(
        "SEARCH BOOK ERROR:",
        err.response?.data ||
          err.message
      );

      setBooks([]);

      setError(
        err.response?.data?.message ||
          "Failed to search books."
      );

      return [];
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // CLEAR ERROR
  // ===================================================

  const clearError = () => {
    setError("");
  };

  // ===================================================
  // CLEAR BOOK
  // ===================================================

  const clearBook = () => {
    setBook(null);
  };

  // ===================================================
  // IMPORTANT:
  // getBook alias
  //
  // EditBook.jsx getBook() use karta hai.
  // Isliye fetchBook ka alias bhi provide kar rahe hain.
  // ===================================================

  const getBook = fetchBook;

  // ===================================================
  // LOAD BOOKS
  // ===================================================

  useEffect(() => {
    fetchBooks();
  }, []);

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value = {
    books,
    book,
    loading,
    error,

    fetchBooks,

    // Both names available
    fetchBook,
    getBook,

    addBook,
    updateBook,
    deleteBook,
    searchBooks,

    clearError,
    clearBook,

    getBookImageUrl,
  };

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};

// =====================================================
// CUSTOM HOOK
// =====================================================

export const useBooks = () => {
  const context =
    useContext(BookContext);

  if (!context) {
    throw new Error(
      "useBooks must be used inside BookProvider"
    );
  }

  return context;
};

export default BookContext;

