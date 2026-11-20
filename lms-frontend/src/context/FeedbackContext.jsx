import { createContext, useContext, useState } from "react";
import API from "../api/api";

// ==========================================
// CREATE CONTEXT
// ==========================================

const FeedbackContext = createContext();

// ==========================================
// FEEDBACK PROVIDER
// ==========================================

export const FeedbackProvider = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==========================================
  // CREATE FEEDBACK
  // STUDENT
  // ==========================================

  const createFeedback = async (feedbackData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.post(
        "/feedback/create",
        feedbackData
      );

      const newFeedback =
        response.data.feedback || response.data;

      setMyFeedbacks((prevFeedbacks) => [
        newFeedback,
        ...prevFeedbacks,
      ]);

      return response.data;
    } catch (err) {
      console.error(
        "Create Feedback Error:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to submit feedback";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET MY FEEDBACK
  // STUDENT
  // ==========================================

  const getMyFeedback = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get(
        "/feedback/my-feedback"
      );

      const feedbackData =
        response.data.feedbacks || [];

      setMyFeedbacks(feedbackData);

      return feedbackData;
    } catch (err) {
      console.error(
        "Get My Feedback Error:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to fetch your feedback";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET ALL FEEDBACK
  // ADMIN / LIBRARIAN / SUPERADMIN
  // ==========================================

  const getAllFeedback = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get(
        "/feedback/all"
      );

      const feedbackData =
        response.data.feedbacks || [];

      setFeedbacks(feedbackData);

      return feedbackData;
    } catch (err) {
      console.error(
        "Get All Feedback Error:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to fetch feedback";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET SINGLE FEEDBACK
  // ==========================================

  const getSingleFeedback = async (id) => {
    try {
      setError(null);

      const response = await API.get(
        `/feedback/${id}`
      );

      return response.data.feedback || response.data;
    } catch (err) {
      console.error(
        "Get Single Feedback Error:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to fetch feedback";

      setError(message);

      throw new Error(message);
    }
  };

  // ==========================================
  // REVIEW / RESPOND TO FEEDBACK
  // ADMIN / LIBRARIAN / SUPERADMIN
  // ==========================================

  const reviewFeedback = async (
    id,
    responseMessage
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.put(
        `/feedback/review/${id}`,
        {
          response: responseMessage,
        }
      );

      const updatedFeedback =
        response.data.feedback || response.data;

      // ======================================
      // UPDATE ALL FEEDBACK STATE
      // ======================================

      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((feedback) =>
          feedback._id === id
            ? updatedFeedback
            : feedback
        )
      );

      // ======================================
      // UPDATE MY FEEDBACK STATE
      // ======================================

      setMyFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((feedback) =>
          feedback._id === id
            ? updatedFeedback
            : feedback
        )
      );

      return response.data;
    } catch (err) {
      console.error(
        "Review Feedback Error:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to review feedback";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE FEEDBACK
  // ADMIN / SUPERADMIN
  // ==========================================

  const deleteFeedback = async (id) => {
    try {
      setLoading(true);
      setError(null);

      await API.delete(
        `/feedback/${id}`
      );

      // ======================================
      // REMOVE FROM ALL FEEDBACK STATE
      // ======================================

      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.filter(
          (feedback) => feedback._id !== id
        )
      );

      // ======================================
      // REMOVE FROM MY FEEDBACK STATE
      // ======================================

      setMyFeedbacks((prevFeedbacks) =>
        prevFeedbacks.filter(
          (feedback) => feedback._id !== id
        )
      );

      return true;
    } catch (err) {
      console.error(
        "Delete Feedback Error:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to delete feedback";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {
    feedbacks,
    myFeedbacks,
    loading,
    error,

    createFeedback,
    getMyFeedback,
    getAllFeedback,
    getSingleFeedback,
    reviewFeedback,
    deleteFeedback,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};

// ==========================================
// CUSTOM HOOK
// ==========================================

export const useFeedback = () => {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error(
      "useFeedback must be used inside FeedbackProvider"
    );
  }

  return context;
};