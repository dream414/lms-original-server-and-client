import {
  createContext,
  useContext,
  useState,
} from "react";

import API from "../api/api";

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [currentReview, setCurrentReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // CREATE REVIEW
  // =====================================================

  const createReview = async (reviewData) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.post(
        "/reviews/create",
        {
          name: reviewData.name,
          email: reviewData.email,
          rating: reviewData.rating,
          message: reviewData.comment,
        }
      );

      return response.data;
    } catch (err) {
      console.error(
        "CREATE REVIEW FULL ERROR:",
        err
      );

      console.error(
        "CREATE REVIEW RESPONSE:",
        err.response?.data
      );

      console.error(
        "CREATE REVIEW STATUS:",
        err.response?.status
      );

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to submit review.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET ALL REVIEWS
  // =====================================================

  const getAllReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/reviews/all"
      );

      const data = response.data;

      const reviewList =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.reviews)
          ? data.reviews
          : Array.isArray(data?.data)
          ? data.data
          : [];

      setReviews(reviewList);

      return reviewList;
    } catch (err) {
      console.error(
        "GET ALL REVIEWS ERROR:",
        err
      );

      console.error(
        "GET ALL REVIEWS RESPONSE:",
        err.response?.data
      );

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch reviews.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET SINGLE REVIEW
  // =====================================================

  const getSingleReview = async (id) => {
    try {
      setLoading(true);
      setError("");

      // Clear previous review first
      setCurrentReview(null);

      console.log(
        "================================="
      );

      console.log(
        "GET SINGLE REVIEW ID:",
        id
      );

      console.log(
        "GET SINGLE REVIEW URL:",
        `/reviews/${id}`
      );

      console.log(
        "================================="
      );

      if (!id) {
        const message =
          "Review ID is missing.";

        setError(message);

        throw new Error(message);
      }

      const response = await API.get(
        `/reviews/${id}`
      );

      console.log(
        "GET SINGLE REVIEW RESPONSE:",
        response.data
      );

      const data = response.data;

      /*
       * Backend response:
       * {
       *   success: true,
       *   review: {...}
       * }
       */

      const review =
        data?.review ||
        data?.data ||
        null;

      console.log(
        "EXTRACTED REVIEW:",
        review
      );

      if (!review) {
        const message =
          "Review data was not found in API response.";

        setError(message);

        throw new Error(message);
      }

      setCurrentReview(review);

      return review;
    } catch (err) {
      console.error(
        "GET SINGLE REVIEW ERROR:",
        err
      );

      console.error(
        "GET SINGLE REVIEW RESPONSE:",
        err.response?.data
      );

      console.error(
        "GET SINGLE REVIEW STATUS:",
        err.response?.status
      );

      setCurrentReview(null);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch review.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UPDATE REVIEW STATUS
  // =====================================================

  const updateReviewStatus = async (
    id,
    status
  ) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.put(
        `/reviews/status/${id}`,
        {
          status,
        }
      );

      const updatedReview =
        response.data?.review ||
        response.data?.data ||
        response.data;

      setCurrentReview(updatedReview);

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          String(review._id) === String(id) ||
          String(review.id) === String(id)
            ? updatedReview
            : review
        )
      );

      return response.data;
    } catch (err) {
      console.error(
        "UPDATE REVIEW STATUS ERROR:",
        err
      );

      console.error(
        "UPDATE REVIEW STATUS RESPONSE:",
        err.response?.data
      );

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update review status.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RESPOND TO REVIEW
  // =====================================================

  const respondToReview = async (
    id,
    responseData
  ) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.put(
        `/reviews/response/${id}`,
        responseData
      );

      console.log(
        "RESPOND REVIEW RESPONSE:",
        response.data
      );

      const updatedReview =
        response.data?.review ||
        response.data?.data ||
        response.data;

      setCurrentReview(updatedReview);

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          String(review._id) === String(id) ||
          String(review.id) === String(id)
            ? updatedReview
            : review
        )
      );

      return response.data;
    } catch (err) {
      console.error(
        "RESPOND REVIEW ERROR:",
        err
      );

      console.error(
        "RESPOND REVIEW RESPONSE:",
        err.response?.data
      );

      console.error(
        "RESPOND REVIEW STATUS:",
        err.response?.status
      );

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to send response.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE REVIEW
  // =====================================================

  const deleteReview = async (id) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.delete(
        `/reviews/${id}`
      );

      setReviews((prevReviews) =>
        prevReviews.filter(
          (review) =>
            String(review._id) !== String(id) &&
            String(review.id) !== String(id)
        )
      );

      setCurrentReview(null);

      return response.data;
    } catch (err) {
      console.error(
        "DELETE REVIEW ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to delete review.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CLEAR CURRENT REVIEW
  // =====================================================

  const clearCurrentReview = () => {
    setCurrentReview(null);
  };

  // =====================================================
  // CLEAR ERROR
  // =====================================================

  const clearError = () => {
    setError("");
  };

  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        currentReview,
        loading,
        error,

        createReview,
        getAllReviews,
        getSingleReview,
        updateReviewStatus,
        respondToReview,
        deleteReview,

        clearCurrentReview,
        clearError,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

// =====================================================
// USE REVIEW
// =====================================================

export const useReview = () => {
  const context = useContext(
    ReviewContext
  );

  if (!context) {
    throw new Error(
      "useReview must be used inside ReviewProvider"
    );
  }

  return context;
};

export default ReviewContext;