import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../api/api";

const DigitalBookContext = createContext();

export const DigitalBookProvider = ({ children }) => {
  const [digitalBooks, setDigitalBooks] = useState([]);
  const [currentDigitalBook, setCurrentDigitalBook] =
    useState(null);

  const [myActivities, setMyActivities] = useState([]);
  const [bookActivities, setBookActivities] = useState([]);

  const [activityStats, setActivityStats] = useState({
    totalActivities: 0,
    totalViews: 0,
    totalReads: 0,
    totalDownloads: 0,
  });

  const [loading, setLoading] = useState(false);
  const [activityLoading, setActivityLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [activityError, setActivityError] = useState("");

  // ==========================================
  // HELPER: GET ERROR MESSAGE FROM BLOB
  // ==========================================

  const getBlobErrorMessage = async (
    error,
    fallbackMessage
  ) => {
    try {
      const responseData =
        error?.response?.data;

      if (responseData instanceof Blob) {
        const text = await responseData.text();

        if (text) {
          try {
            const parsed = JSON.parse(text);

            return (
              parsed?.message ||
              parsed?.error ||
              fallbackMessage
            );
          } catch {
            return text || fallbackMessage;
          }
        }
      }

      if (
        error?.response?.data?.message
      ) {
        return error.response.data.message;
      }

      if (
        error?.response?.data?.error
      ) {
        return error.response.data.error;
      }

      if (error?.message) {
        return error.message;
      }

      return fallbackMessage;
    } catch (parseError) {
      console.error(
        "Error parsing backend error:",
        parseError
      );

      return fallbackMessage;
    }
  };

  // ==========================================
  // GET ALL DIGITAL BOOKS
  // ==========================================

  const getDigitalBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/digital-books"
      );

      setDigitalBooks(
        response.data.digitalBooks || []
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get digital books error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to fetch digital books."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET DIGITAL BOOK BY ID
  // ==========================================

  const getDigitalBookById = async (id) => {
    try {
      setLoading(true);
      setError("");

      if (!id) {
        setError(
          "Digital book ID is missing."
        );

        return null;
      }

      const response = await API.get(
        `/digital-books/${id}`
      );

      setCurrentDigitalBook(
        response.data.digitalBook || null
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get digital book error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to fetch digital book."
      );

      setCurrentDigitalBook(null);

      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VIEW DIGITAL BOOK
  // ==========================================

  const viewDigitalBook = async (id) => {
    try {
      setActivityError("");

      if (!id) {
        return null;
      }

      const response = await API.get(
        `/digital-books/${id}/view`,
        {
          responseType: "blob",
        }
      );

      const contentType =
        response.headers[
          "content-type"
        ] || "";

      // Backend error returned as JSON Blob
      if (
        contentType.includes(
          "application/json"
        )
      ) {
        const text =
          await response.data.text();

        let errorData = {};

        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = {};
        }

        const message =
          errorData?.message ||
          "Failed to record digital book view.";

        setActivityError(message);

        throw new Error(message);
      }

      return response.data;
    } catch (error) {
      console.error(
        "View digital book error:",
        error
      );

      const message =
        await getBlobErrorMessage(
          error,
          "Failed to record digital book view."
        );

      setActivityError(message);

      return null;
    }
  };

  // ==========================================
  // CREATE DIGITAL BOOK
  // ==========================================

  const createDigitalBook = async (
    formData
  ) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.post(
        "/digital-books",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      if (response.data.digitalBook) {
        setDigitalBooks((prevBooks) => [
          response.data.digitalBook,
          ...prevBooks,
        ]);
      }

      return response.data;
    } catch (error) {
      console.error(
        "Create digital book error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create digital book."
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UPDATE DIGITAL BOOK
  // ==========================================

  const updateDigitalBook = async (
    id,
    formData
  ) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.put(
        `/digital-books/${id}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      const updatedBook =
        response.data.digitalBook;

      if (updatedBook) {
        setDigitalBooks((prevBooks) =>
          prevBooks.map((book) =>
            book._id === id
              ? updatedBook
              : book
          )
        );

        setCurrentDigitalBook(
          updatedBook
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        "Update digital book error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update digital book."
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE DIGITAL BOOK
  // ==========================================

  const deleteDigitalBook = async (id) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.delete(
        `/digital-books/${id}`
      );

      setDigitalBooks((prevBooks) =>
        prevBooks.filter(
          (book) => book._id !== id
        )
      );

      if (
        currentDigitalBook?._id === id
      ) {
        setCurrentDigitalBook(null);
      }

      return response.data;
    } catch (error) {
      console.error(
        "Delete digital book error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete digital book."
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // TOGGLE DIGITAL BOOK STATUS
  // ==========================================

  const toggleDigitalBookStatus = async (
    id
  ) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.patch(
        `/digital-books/${id}/status`
      );

      const updatedBook =
        response.data.digitalBook;

      if (updatedBook) {
        setDigitalBooks((prevBooks) =>
          prevBooks.map((book) =>
            book._id === id
              ? updatedBook
              : book
          )
        );

        if (
          currentDigitalBook?._id === id
        ) {
          setCurrentDigitalBook(
            updatedBook
          );
        }
      }

      return response.data;
    } catch (error) {
      console.error(
        "Toggle digital book status error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update digital book status."
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // READ DIGITAL BOOK
  // ==========================================

  const readDigitalBook = async (id) => {
    try {
      setLoading(true);
      setError("");

      if (!id) {
        const message =
          "Digital book ID is missing.";

        setError(message);

        return null;
      }

      const response = await API.get(
        `/digital-books/${id}/read`,
        {
          responseType: "blob",
        }
      );

      const contentType =
        response.headers[
          "content-type"
        ] || "";

      // ========================================
      // BACKEND RETURNED JSON ERROR
      // ========================================

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        const text =
          await response.data.text();

        let errorData = {};

        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = {};
        }

        const message =
          errorData?.message ||
          "Failed to open digital book.";

        setError(message);

        throw new Error(message);
      }

      // ========================================
      // CREATE PDF BLOB
      // ========================================

      const blob = new Blob(
        [response.data],
        {
          type:
            contentType ||
            "application/pdf",
        }
      );

      const fileURL =
        window.URL.createObjectURL(blob);

      return fileURL;
    } catch (error) {
      console.error(
        "Read digital book error:",
        error
      );

      const message =
        await getBlobErrorMessage(
          error,
          "Failed to open digital book."
        );

      setError(message);

      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DOWNLOAD DIGITAL BOOK
  // ==========================================

  const downloadDigitalBook = async (
    id
  ) => {
    try {
      setLoading(true);
      setError("");

      if (!id) {
        const message =
          "Digital book ID is missing.";

        setError(message);

        return null;
      }

      const response = await API.get(
        `/digital-books/${id}/download`,
        {
          responseType: "blob",
        }
      );

      const contentType =
        response.headers[
          "content-type"
        ] || "";

      // ========================================
      // BACKEND RETURNED JSON ERROR
      // ========================================

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        const text =
          await response.data.text();

        let errorData = {};

        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = {};
        }

        const message =
          errorData?.message ||
          "Failed to download digital book.";

        setError(message);

        throw new Error(message);
      }

      // ========================================
      // CREATE DOWNLOAD BLOB
      // ========================================

      const blob = new Blob(
        [response.data],
        {
          type:
            contentType ||
            "application/pdf",
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      // ========================================
      // GET FILE NAME
      // ========================================

      const contentDisposition =
        response.headers[
          "content-disposition"
        ];

      let fileName =
        "digital-book.pdf";

      if (contentDisposition) {
        const match =
          contentDisposition.match(
            /filename="?([^"]+)"?/i
          );

        if (match?.[1]) {
          fileName = match[1];
        }
      }

      link.setAttribute(
        "download",
        fileName
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      // Give browser time to start download
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

      return response.data;
    } catch (error) {
      console.error(
        "Download digital book error:",
        error
      );

      const message =
        await getBlobErrorMessage(
          error,
          "Failed to download digital book."
        );

      setError(message);

      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET MY ACTIVITIES
  // ==========================================

  const getMyActivities = async () => {
    try {
      setActivityLoading(true);
      setActivityError("");

      const response = await API.get(
        "/digital-book-activities/my"
      );

      setMyActivities(
        response.data.activities || []
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get my digital activities error:",
        error
      );

      setActivityError(
        error.response?.data?.message ||
          "Failed to fetch your activities."
      );

      return null;
    } finally {
      setActivityLoading(false);
    }
  };

  // ==========================================
  // GET ALL ACTIVITIES
  // ==========================================

  const getAllActivities = async () => {
    try {
      setActivityLoading(true);
      setActivityError("");

      const response = await API.get(
        "/digital-book-activities"
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get all digital activities error:",
        error
      );

      setActivityError(
        error.response?.data?.message ||
          "Failed to fetch all activities."
      );

      return null;
    } finally {
      setActivityLoading(false);
    }
  };

  // ==========================================
  // GET BOOK ACTIVITIES
  // ==========================================

  const getBookActivities = async (id) => {
    try {
      setActivityLoading(true);
      setActivityError("");

      if (!id) {
        return null;
      }

      const response = await API.get(
        `/digital-book-activities/book/${id}`
      );

      setBookActivities(
        response.data.activities || []
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get book activities error:",
        error
      );

      setActivityError(
        error.response?.data?.message ||
          "Failed to fetch book activities."
      );

      return null;
    } finally {
      setActivityLoading(false);
    }
  };

  // ==========================================
  // GET ACTIVITY STATS
  // ==========================================

  const getActivityStats = async () => {
    try {
      setActivityLoading(true);
      setActivityError("");

      const response = await API.get(
        "/digital-book-activities/stats"
      );

      setActivityStats(
        response.data.stats || {
          totalActivities: 0,
          totalViews: 0,
          totalReads: 0,
          totalDownloads: 0,
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get digital activity stats error:",
        error
      );

      setActivityError(
        error.response?.data?.message ||
          "Failed to fetch activity statistics."
      );

      return null;
    } finally {
      setActivityLoading(false);
    }
  };

  // ==========================================
  // CLEAR ERRORS
  // ==========================================

  const clearError = () => {
    setError("");
  };

  const clearActivityError = () => {
    setActivityError("");
  };

  // ==========================================
  // CLEAR CURRENT BOOK
  // ==========================================

  const clearCurrentDigitalBook = () => {
    setCurrentDigitalBook(null);
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    getDigitalBooks();
  }, []);

  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <DigitalBookContext.Provider
      value={{
        // ======================================
        // DIGITAL BOOKS
        // ======================================

        digitalBooks,
        setDigitalBooks,

        currentDigitalBook,
        setCurrentDigitalBook,

        loading,
        error,

        getDigitalBooks,
        getDigitalBookById,

        createDigitalBook,
        updateDigitalBook,
        deleteDigitalBook,

        toggleDigitalBookStatus,

        // ======================================
        // BOOK ACTIVITY ACTIONS
        // ======================================

        viewDigitalBook,
        readDigitalBook,
        downloadDigitalBook,

        // ======================================
        // ERROR HANDLING
        // ======================================

        clearError,
        clearCurrentDigitalBook,

        // ======================================
        // ACTIVITIES
        // ======================================

        myActivities,
        setMyActivities,

        bookActivities,
        setBookActivities,

        activityStats,
        setActivityStats,

        activityLoading,
        activityError,

        getMyActivities,
        getAllActivities,
        getBookActivities,
        getActivityStats,

        clearActivityError,
      }}
    >
      {children}
    </DigitalBookContext.Provider>
  );
};

// ==========================================
// CUSTOM HOOK
// ==========================================

export const useDigitalBooks = () => {
  const context =
    useContext(DigitalBookContext);

  if (!context) {
    throw new Error(
      "useDigitalBooks must be used inside DigitalBookProvider"
    );
  }

  return context;
};