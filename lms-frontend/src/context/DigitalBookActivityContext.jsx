import {
  createContext,
  useContext,
  useState,
} from "react";

import API from "../api/api";

const DigitalBookActivityContext =
  createContext();

export const DigitalBookActivityProvider = ({
  children,
}) => {
  // ==========================================
  // STATES
  // ==========================================

  const [myActivities, setMyActivities] =
    useState([]);

  const [allActivities, setAllActivities] =
    useState([]);

  const [bookActivities, setBookActivities] =
    useState([]);

  const [activityStats, setActivityStats] =
    useState({
      totalActivities: 0,
      totalViews: 0,
      totalReads: 0,
      totalDownloads: 0,
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // GET MY ACTIVITIES
  // ==========================================

  const getMyActivities = async () => {
    try {
      setLoading(true);
      setError("");

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

      setError(
        error.response?.data?.message ||
          "Failed to fetch your activities."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET ALL ACTIVITIES
  // ==========================================

  const getAllActivities = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/digital-book-activities"
      );

      setAllActivities(
        response.data.activities || []
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get all digital activities error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to fetch all activities."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET ACTIVITIES OF SPECIFIC BOOK
  // ==========================================

  const getBookActivities = async (
    digitalBookId
  ) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        `/digital-book-activities/book/${digitalBookId}`
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

      setError(
        error.response?.data?.message ||
          "Failed to fetch book activities."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET ACTIVITY STATISTICS
  // ==========================================

  const getActivityStats = async () => {
    try {
      setLoading(true);
      setError("");

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

      setError(
        error.response?.data?.message ||
          "Failed to fetch activity statistics."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CLEAR ACTIVITIES
  // ==========================================

  const clearActivities = () => {
    setMyActivities([]);
    setAllActivities([]);
    setBookActivities([]);
  };

  // ==========================================
  // CLEAR ERROR
  // ==========================================

  const clearError = () => {
    setError("");
  };

  // ==========================================
  // CONTEXT PROVIDER
  // ==========================================

  return (
    <DigitalBookActivityContext.Provider
      value={{
        // My Activities
        myActivities,
        setMyActivities,

        // All Activities
        allActivities,
        setAllActivities,

        // Book Activities
        bookActivities,
        setBookActivities,

        // Statistics
        activityStats,
        setActivityStats,

        // Common
        loading,
        error,

        // Functions
        getMyActivities,
        getAllActivities,
        getBookActivities,
        getActivityStats,

        clearActivities,
        clearError,
      }}
    >
      {children}
    </DigitalBookActivityContext.Provider>
  );
};

// ==========================================
// CUSTOM HOOK
// ==========================================

export const useDigitalBookActivities = () => {
  const context = useContext(
    DigitalBookActivityContext
  );

  if (!context) {
    throw new Error(
      "useDigitalBookActivities must be used inside DigitalBookActivityProvider"
    );
  }

  return context;
};