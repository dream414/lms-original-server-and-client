
import {
  createContext,
  useContext,
  useState,
} from "react";

import api from "../api/api";

// ==========================================
// CREATE CONTEXT
// ==========================================

const NotificationContext = createContext();

// ==========================================
// PROVIDER
// ==========================================

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // GET MY NOTIFICATIONS
  // GET /api/notifications
  // ==========================================

  const getNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications");

      const data = response.data;

      // Backend directly array return کرے یا
      // { notifications: [] } دونوں handle ہوں گے
      const notificationList = Array.isArray(data)
        ? data
        : data?.notifications || [];

      setNotifications(notificationList);

      return notificationList;
    } catch (err) {
      console.error(
        "GET NOTIFICATIONS ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to fetch notifications.";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // MARK NOTIFICATION AS READ
  // PUT /api/notifications/:id
  // ==========================================

  const markAsRead = async (id) => {
    try {
      setError("");

      const response = await api.put(
        `/notifications/${id}`
      );

      const updatedNotification =
        response.data;

      // Local state update
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                ...updatedNotification,
                isRead: true,
              }
            : notification
        )
      );

      return updatedNotification;
    } catch (err) {
      console.error(
        "MARK NOTIFICATION READ ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to mark notification as read.";

      setError(message);

      throw new Error(message);
    }
  };

  // ==========================================
  // DELETE NOTIFICATION
  // DELETE /api/notifications/:id
  // ==========================================

  const deleteNotification = async (id) => {
    try {
      setError("");

      await api.delete(
        `/notifications/${id}`
      );

      // Remove from local state
      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification._id !== id
        )
      );

      return true;
    } catch (err) {
      console.error(
        "DELETE NOTIFICATION ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to delete notification.";

      setError(message);

      throw new Error(message);
    }
  };

  // ==========================================
  // CLEAR NOTIFICATIONS
  // ==========================================

  const clearNotifications = () => {
    setNotifications([]);
  };

  // ==========================================
  // CLEAR ERROR
  // ==========================================

  const clearError = () => {
    setError("");
  };

  // ==========================================
  // UNREAD COUNT
  // ==========================================

  const unreadCount = notifications.filter(
    (notification) =>
      !notification.isRead
  ).length;

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {
    notifications,
    loading,
    error,
    unreadCount,

    getNotifications,
    markAsRead,
    deleteNotification,

    clearNotifications,
    clearError,
  };

  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <NotificationContext.Provider
      value={value}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// ==========================================
// CUSTOM HOOK
// ==========================================

export const useNotifications = () => {
  const context = useContext(
    NotificationContext
  );

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
};

