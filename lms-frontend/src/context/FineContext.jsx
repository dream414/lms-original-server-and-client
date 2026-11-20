
import {
  createContext,
  useContext,
  useState,
} from "react";

import api from "../api/api";

// ==========================================
// CREATE CONTEXT
// ==========================================

const FineContext = createContext();

// ==========================================
// PROVIDER
// ==========================================

export const FineProvider = ({ children }) => {
  const [fines, setFines] = useState([]);
  const [myFines, setMyFines] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // GET ALL FINES
  // Admin / SuperAdmin / Accountant / Librarian
  // ==========================================

  const getAllFines = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/fines");

      const data = response.data;

      // Backend currently returns array directly
      const fineList = Array.isArray(data)
        ? data
        : data?.fines || [];

      setFines(fineList);

      return fineList;
    } catch (err) {
      console.error(
        "GET ALL FINES ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to fetch fines.";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET MY FINES
  // Student
  // ==========================================

  const getMyFines = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/fines/my"
      );

      const data = response.data;

      const fineList = Array.isArray(data)
        ? data
        : data?.fines || [];

      setMyFines(fineList);

      return fineList;
    } catch (err) {
      console.error(
        "GET MY FINES ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to fetch your fines.";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PAY FINE
  // ==========================================

  const payFine = async (id) => {
    try {
      setLoading(true);
      setError("");

      if (!id) {
        throw new Error(
          "Fine ID is required."
        );
      }

      const response = await api.put(
        `/fines/pay/${id}`
      );

      // ========================================
      // UPDATE ALL FINES
      // ========================================

      setFines((prev) =>
        prev.map((fine) =>
          fine._id === id
            ? {
                ...fine,
                status: "Paid",
                paidDate: new Date(),
              }
            : fine
        )
      );

      // ========================================
      // UPDATE MY FINES
      // ========================================

      setMyFines((prev) =>
        prev.map((fine) =>
          fine._id === id
            ? {
                ...fine,
                status: "Paid",
                paidDate: new Date(),
              }
            : fine
        )
      );

      return response.data;
    } catch (err) {
      console.error(
        "PAY FINE ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to pay fine.";

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
    fines,
    myFines,

    loading,
    error,

    getAllFines,
    getMyFines,
    payFine,

    clearError,
  };

  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <FineContext.Provider value={value}>
      {children}
    </FineContext.Provider>
  );
};

// ==========================================
// CUSTOM HOOK
// ==========================================

export const useFines = () => {
  const context = useContext(
    FineContext
  );

  if (!context) {
    throw new Error(
      "useFines must be used inside FineProvider"
    );
  }

  return context;
};

