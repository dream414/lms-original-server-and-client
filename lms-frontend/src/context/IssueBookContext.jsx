
import {
  createContext,
  useContext,
  useState,
} from "react";

import api from "../api/api";

// ==========================================
// CREATE CONTEXT
// ==========================================

const IssueBookContext = createContext();

// ==========================================
// PROVIDER
// ==========================================

export const IssueBookProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // GET ALL ISSUED BOOKS
  // Librarian
  // ==========================================

  const getAllIssuedBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/issues");

      const allIssues = Array.isArray(
        response.data?.issues
      )
        ? response.data.issues
        : [];

      setIssues(allIssues);

      return allIssues;
    } catch (err) {
      console.error(
        "GET ISSUED BOOKS ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to fetch issued books.";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ISSUE BOOK
  // Librarian
  // ==========================================

  const issueBook = async (
    requestId,
    dueDate
  ) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post(
        "/issues",
        {
          requestId,
          dueDate,
        }
      );

      if (response.data?.issueBook) {
        setIssues((prev) => [
          response.data.issueBook,
          ...prev,
        ]);
      }

      return response.data;
    } catch (err) {
      console.error(
        "ISSUE BOOK ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to issue book.";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET SINGLE ISSUED BOOK
  // ==========================================

  const getIssuedBookById = async (id) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/issues/${id}`
      );

      return response.data?.issueBook;
    } catch (err) {
      console.error(
        "GET ISSUED BOOK ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to fetch issued book.";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET MY ISSUED BOOKS
  // Student
  // ==========================================

  const getMyIssuedBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/issues/my"
      );

      const myIssues = Array.isArray(
        response.data?.issues
      )
        ? response.data.issues
        : [];

      console.log(
        "MY ISSUED BOOKS RESPONSE:",
        response.data
      );

      console.log(
        "MY ISSUED BOOKS:",
        myIssues
      );

      setIssues(myIssues);

      return myIssues;
    } catch (err) {
      console.error(
        "GET MY ISSUED BOOKS ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to fetch your issued books.";

      setError(message);

      // Important:
      // Error ki situation mein purana
      // data screen par nahi rehna chahiye.
      setIssues([]);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RECEIVE BOOK
  // Student
  // ==========================================

  const receiveBook = async (issueId) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.patch(
        `/issues/${issueId}/receive`
      );

      if (response.data?.issueBook) {
        setIssues((prev) =>
          prev.map((issue) =>
            issue._id === issueId
              ? response.data.issueBook
              : issue
          )
        );
      }

      return response.data;
    } catch (err) {
      console.error(
        "RECEIVE BOOK ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to receive book.";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CLEAR ERROR
  // ==========================================

  const clearError = () => {
    setError("");
  };

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {
    issues,
    loading,
    error,

    getAllIssuedBooks,
    issueBook,
    getIssuedBookById,
    getMyIssuedBooks,
    receiveBook,

    clearError,
  };

  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <IssueBookContext.Provider value={value}>
      {children}
    </IssueBookContext.Provider>
  );
};

// ==========================================
// CUSTOM HOOK
// ==========================================

export const useIssueBooks = () => {
  const context = useContext(
    IssueBookContext
  );

  if (!context) {
    throw new Error(
      "useIssueBooks must be used inside IssueBookProvider"
    );
  }

  return context;
};

