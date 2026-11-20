import {
  createContext,
  useContext,
  useState,
} from "react";

import api from "../api/api";

const ReturnBookContext = createContext();

export const ReturnBookProvider = ({ children }) => {

  const [returns, setReturns] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ===================================================
  // STUDENT — REQUEST RETURN
  // ===================================================

  const requestReturnBook = async (issueId) => {
    try {

      setLoading(true);
      setError("");

      const response =
        await api.post(
          `/returns/request/${issueId}`
        );

      return response.data;

    } catch (err) {

      console.error(
        "REQUEST RETURN ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to submit return request.";

      setError(message);

      throw new Error(message);

    } finally {

      setLoading(false);

    }
  };


  // ===================================================
  // STUDENT — GET MY RETURN REQUESTS
  // ===================================================

  const getMyReturnRequests = async () => {
    try {

      setLoading(true);
      setError("");

      const response =
        await api.get("/returns/my");

      const data =
        response.data?.returns || [];

      setReturns(data);

      return data;

    } catch (err) {

      console.error(
        "GET MY RETURNS ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to fetch return requests.";

      setError(message);

      throw new Error(message);

    } finally {

      setLoading(false);

    }
  };


  // ===================================================
  // LIBRARIAN — GET RETURN REQUESTS
  // ===================================================

  const getAllReturnRequests = async () => {
    try {

      setLoading(true);
      setError("");

      const response =
        await api.get("/returns");

      const data =
        response.data?.returns || [];

      setReturns(data);

      return data;

    } catch (err) {

      console.error(
        "GET ALL RETURNS ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to fetch return requests.";

      setError(message);

      throw new Error(message);

    } finally {

      setLoading(false);

    }
  };


  // ===================================================
  // LIBRARIAN — CONFIRM RETURN
  // ===================================================

  const confirmReturnBook = async (issueId) => {
    try {

      setLoading(true);
      setError("");

      const response =
        await api.put(
          `/returns/${issueId}/confirm`
        );

      const returnRequest =
        response.data?.returnRequest;

      // -----------------------------------------------
      // REMOVE PENDING REQUEST FROM LOCAL STATE
      // -----------------------------------------------

      setReturns((prev) =>
        prev.filter(
          (item) =>
            item._id !== issueId
        )
      );

      return response.data;

    } catch (err) {

      console.error(
        "CONFIRM RETURN ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to confirm return.";

      setError(message);

      throw new Error(message);

    } finally {

      setLoading(false);

    }
  };


  // ===================================================
  // LIBRARIAN — REJECT RETURN REQUEST
  // ===================================================

  const rejectReturnRequest = async (issueId) => {
    try {

      setLoading(true);
      setError("");

      const response =
        await api.put(
          `/returns/${issueId}/reject`
        );

      // -----------------------------------------------
      // REMOVE PENDING REQUEST FROM LOCAL STATE
      // -----------------------------------------------

      setReturns((prev) =>
        prev.filter(
          (item) =>
            item._id !== issueId
        )
      );

      return response.data;

    } catch (err) {

      console.error(
        "REJECT RETURN ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to reject return request.";

      setError(message);

      throw new Error(message);

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
  // CONTEXT VALUE
  // ===================================================

  const value = {
    returns,
    loading,
    error,

    requestReturnBook,
    getMyReturnRequests,
    getAllReturnRequests,

    confirmReturnBook,
    rejectReturnRequest,

    clearError,
  };


  return (
    <ReturnBookContext.Provider
      value={value}
    >
      {children}
    </ReturnBookContext.Provider>
  );
};


export const useReturnBooks = () => {

  const context =
    useContext(ReturnBookContext);

  if (!context) {
    throw new Error(
      "useReturnBooks must be used inside ReturnBookProvider"
    );
  }

  return context;
};