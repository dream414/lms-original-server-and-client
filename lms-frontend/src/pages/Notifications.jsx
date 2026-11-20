import { useEffect, useMemo } from "react";

import {
  FaBell,
  FaEnvelope,
  FaCheckCircle,
  FaTrash,
  FaExclamationTriangle,
  FaRedo,
} from "react-icons/fa";

import {
  useNotifications,
} from "../context/NotificationContext";

// =====================================================
// NOTIFICATIONS PAGE
// =====================================================

const Notifications = () => {
  const {
    notifications,
    loading,
    error,
    unreadCount,
    getNotifications,
    markAsRead,
    deleteNotification,
    clearError,
  } = useNotifications();

  // =====================================================
  // BRAND COLORS
  // =====================================================

  const brandColor = "#890C25";
  const brandLight = "#D58A98";

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    getNotifications();
  }, []);

  // =====================================================
  // NOTIFICATION ICON
  // =====================================================

  const getNotificationIcon = (type) => {
    switch (type) {
      case "Request":
        return "📋";

      case "Issue":
        return "📚";

      case "Return":
        return "🔄";

      case "Fine":
        return "💰";

      case "Course":
        return "🎓";

      default:
        return "🔔";
    }
  };

  // =====================================================
  // NOTIFICATION COLOR
  // =====================================================

  const getNotificationStyle = (type) => {
    switch (type) {
      case "Request":
        return "bg-blue-50 text-blue-600";

      case "Issue":
        return "bg-purple-50 text-purple-600";

      case "Return":
        return "bg-green-50 text-green-600";

      case "Fine":
        return "bg-red-50 text-red-600";

      case "Course":
        return "bg-yellow-50 text-yellow-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // =====================================================
  // SORT NOTIFICATIONS
  // =====================================================

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );
  }, [notifications]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString(
      "en-PK",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  // =====================================================
  // MARK AS READ
  // =====================================================

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (err) {
      console.error(
        "MARK AS READ ERROR:",
        err
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
    } catch (err) {
      console.error(
        "DELETE NOTIFICATION ERROR:",
        err
      );
    }
  };

  // =====================================================
  // RETRY
  // =====================================================

  const handleRetry = async () => {
    clearError();

    try {
      await getNotifications();
    } catch (err) {
      console.error(
        "RETRY NOTIFICATIONS ERROR:",
        err
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 pb-12 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">

        <div className="mx-auto max-w-7xl">

          <div className="flex min-h-[60vh] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#890C25]/10 bg-white shadow-2xl">

                <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#890C25]/20 border-t-[#890C25]" />

              </div>

              <h3 className="mt-5 text-xl font-black text-slate-800">
                Loading notifications...
              </h3>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-12 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HERO
        ================================================= */}

        <div className="group/hero relative mb-7 overflow-hidden rounded-[2rem] bg-[#890C25] shadow-[0_20px_50px_rgba(137,12,37,0.28)]">

          {/* DECORATIVE CIRCLES */}

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10 bg-white/5 transition duration-500 group-hover/hero:scale-110" />

          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-white/10 bg-white/5" />

          <div className="pointer-events-none absolute right-[25%] top-10 h-3 w-3 rounded-full bg-[#D58A98] shadow-[0_0_20px_rgba(213,138,152,0.8)]" />

          <div className="pointer-events-none absolute right-20 top-24 h-32 w-32 rounded-full bg-[#D58A98]/10 blur-3xl" />

          {/* HERO CONTENT */}

          <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}

            <div>

              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-300/30 bg-blue-600 text-white shadow-[0_10px_25px_rgba(37,99,235,0.35)] transition duration-300 hover:-translate-y-1">

                  <FaBell size={24} />

                </div>

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D58A98]">
                    LMS Notification Center
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    Learning Management System
                  </p>

                </div>

              </div>

              <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                Notifications
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
                Stay updated with your book requests, issued books, returns,
                fines and other library activities.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">

                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white/90 backdrop-blur-md">

                  <span className="h-2 w-2 rounded-full bg-green-400" />

                  Notification Center

                </div>

                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white/90 backdrop-blur-md">

                  {notifications.length} Notifications

                </div>

              </div>

            </div>

            {/* UNREAD BOX */}

            <div className="group/unread relative flex min-h-[175px] w-full items-center justify-center overflow-hidden rounded-3xl border border-blue-300/30 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-6 text-center shadow-xl transition duration-300 hover:-translate-y-1 lg:w-56">

              <div className="pointer-events-none absolute -bottom-14 -right-14 h-40 w-40 rounded-full border-2 border-blue-200/25 bg-blue-400/10 transition duration-500 group-hover/unread:scale-125" />

              <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full border border-white/10 bg-white/5" />

              <div className="relative">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-lg">

                  <FaEnvelope size={22} />

                </div>

                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-blue-100/80">
                  Unread
                </p>

                <p className="mt-2 text-4xl font-black leading-none text-white">
                  {unreadCount}
                </p>

                <div className="mx-auto mt-5 h-1 w-12 rounded-full bg-white/60 transition-all duration-500 group-hover/unread:w-20" />

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">

              <FaExclamationTriangle
                className="mt-0.5 shrink-0 text-red-600"
                size={17}
              />

              <div>

                <p className="text-sm font-black text-red-700">
                  Unable to load notifications
                </p>

                <p className="mt-1 text-xs font-semibold text-red-600">
                  {error}
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-red-700"
            >
              <FaRedo size={11} />

              Retry
            </button>

          </div>
        )}

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* TOTAL */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-[#890C25]/20 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1.5 w-16 rounded-br-full bg-[#890C25] transition-all duration-500 group-hover:w-full" />

            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#890C25]/5 transition duration-500 group-hover:scale-125" />

            <div className="relative flex items-center justify-between">

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#890C25]">
                  Total Notifications
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {notifications.length}
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-400">
                  All notifications
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#890C25]/10 text-[#890C25] transition duration-300 group-hover:bg-[#890C25] group-hover:text-white">

                <FaBell size={18} />

              </div>

            </div>

          </div>

          {/* UNREAD */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-[#890C25]/20 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1.5 w-16 rounded-br-full bg-[#890C25] transition-all duration-500 group-hover:w-full" />

            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#890C25]/5 transition duration-500 group-hover:scale-125" />

            <div className="relative flex items-center justify-between">

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#890C25]">
                  Unread Notifications
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {unreadCount}
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Pending to read
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#890C25]/10 text-[#890C25] transition duration-300 group-hover:bg-[#890C25] group-hover:text-white">

                <FaEnvelope size={18} />

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            NOTIFICATIONS HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="h-10 w-1.5 rounded-full bg-[#890C25]" />

              <div>

                <h2 className="text-2xl font-black tracking-tight text-slate-800">
                  All Notifications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage your latest library activities.
                </p>

              </div>

            </div>

          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-[#890C25]/10 bg-white px-5 py-2.5 text-xs font-black text-[#890C25] shadow-sm">

            <span className="h-2 w-2 rounded-full bg-[#890C25]" />

            Showing {sortedNotifications.length}

          </div>

        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {sortedNotifications.length === 0 ? (

          <div className="relative overflow-hidden rounded-[2rem] border-2 border-dashed border-[#890C25]/20 bg-white px-6 py-16 text-center shadow-xl">

            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#890C25]/5" />

            <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#890C25]/5" />

            <div className="relative">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#890C25]/10 text-[#890C25]">

                <FaBell size={28} />

              </div>

              <h2 className="mt-6 text-xl font-black text-slate-800">
                No Notifications
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                You don't have any notifications yet. New library activities
                will appear here.
              </p>

            </div>

          </div>

        ) : (

          <div className="space-y-4">

            {sortedNotifications.map((notification) => (

              <div
                key={notification._id}
                className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                  notification.isRead
                    ? "border-slate-200"
                    : "border-[#D58A98]/40 shadow-md"
                }`}
              >

                {/* TOP ACCENT */}

                {!notification.isRead && (
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-[#890C25]" />
                )}

                {/* DECORATION */}

                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#890C25]/5 transition duration-500 group-hover:scale-125" />

                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">

                  {/* ICON */}

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${getNotificationStyle(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* CONTENT */}

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3
                          className={`text-sm font-extrabold ${
                            notification.isRead
                              ? "text-slate-700"
                              : "text-slate-900"
                          }`}
                        >
                          {notification.title}
                        </h3>

                        {notification.type && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            {notification.type}
                          </span>
                        )}

                        {!notification.isRead && (
                          <span className="rounded-full bg-[#890C25] px-2.5 py-1 text-[10px] font-bold text-white">
                            NEW
                          </span>
                        )}

                      </div>

                      <span className="shrink-0 text-[11px] font-medium text-slate-400">
                        {formatDate(notification.createdAt)}
                      </span>

                    </div>

                    {/* MESSAGE */}

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {notification.message}
                    </p>

                    {/* ACTIONS */}

                    <div className="mt-4 flex flex-wrap gap-2">

                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() =>
                            handleMarkAsRead(
                              notification._id
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-[#890C25]/20 bg-[#890C25]/5 px-3 py-2 text-xs font-bold text-[#890C25] transition hover:bg-[#890C25] hover:text-white"
                        >
                          <FaCheckCircle size={11} />

                          Mark as Read
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            notification._id
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        <FaTrash size={11} />

                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default Notifications;