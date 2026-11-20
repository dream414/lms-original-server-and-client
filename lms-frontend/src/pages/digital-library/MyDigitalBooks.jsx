import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaBook,
  FaBookOpen,
  FaDownload,
  FaEye,
  FaHistory,
  FaSearch,
  FaSpinner,
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaTags,
  FaInfoCircle,
} from "react-icons/fa";

import { useDigitalBooks } from "../../context/DigitalBookContext";

import {
  useDigitalBookActivities,
} from "../../context/DigitalBookActivityContext";

const MyDigitalBooks = () => {
  const navigate = useNavigate();

  const {
    digitalBooks,
    loading: booksLoading,
    getDigitalBooks,
  } = useDigitalBooks();

  const {
    myActivities,
    loading: activitiesLoading,
    error: activityError,
    getMyActivities,
  } = useDigitalBookActivities();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("books");

  // =========================================
  // LOAD DIGITAL BOOKS + MY ACTIVITIES
  // =========================================

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          getDigitalBooks(),
          getMyActivities(),
        ]);
      } catch (error) {
        console.error(
          "Failed to load digital library data:",
          error
        );
      }
    };

    loadData();
  }, []);

  // =========================================
  // NORMALIZE ACTIVITIES
  // =========================================

  const activities = useMemo(() => {
    if (!Array.isArray(myActivities)) {
      return [];
    }

    return myActivities;
  }, [myActivities]);

  // =========================================
  // FILTER BOOKS
  // =========================================

  const filteredBooks = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return digitalBooks || [];
    }

    return (digitalBooks || []).filter((book) => {
      return (
        book.title?.toLowerCase().includes(search) ||
        book.author?.toLowerCase().includes(search) ||
        book.category?.toLowerCase().includes(search)
      );
    });
  }, [digitalBooks, searchTerm]);

  // =========================================
  // MY READS
  // =========================================
  // IMPORTANT:
  // Count only activities belonging to the
  // currently logged-in user's activity list.
  // =========================================

  const totalReads = useMemo(() => {
    return activities.filter((activity) => {
      return (
        activity?.activityType?.toLowerCase() === "read"
      );
    }).length;
  }, [activities]);

  // =========================================
  // MY DOWNLOADS
  // =========================================

  const totalDownloads = useMemo(() => {
    return activities.filter((activity) => {
      return (
        activity?.activityType?.toLowerCase() ===
        "download"
      );
    }).length;
  }, [activities]);

  // =========================================
  // MY VIEWS
  // =========================================
  // Count only user's "view" activities.
  // Do NOT sum book.views because book.views
  // represents global views.
  // =========================================

  const totalViews = useMemo(() => {
    return activities.filter((activity) => {
      return (
        activity?.activityType?.toLowerCase() === "view"
      );
    }).length;
  }, [activities]);

  // =========================================
  // TOTAL ACTIVITIES
  // =========================================

  const totalActivities = activities.length;

  // =========================================
  // DATE FORMAT
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // =========================================
  // ACTIVITY LABEL
  // =========================================

  const formatActivityType = (type) => {
    if (!type) {
      return "Activity";
    }

    const normalizedType = type.toLowerCase();

    if (normalizedType === "read") {
      return "Read";
    }

    if (normalizedType === "view") {
      return "Viewed";
    }

    if (normalizedType === "download") {
      return "Downloaded";
    }

    return (
      type.charAt(0).toUpperCase() +
      type.slice(1)
    );
  };

  // =========================================
  // ACTIVITY ICON
  // =========================================

  const getActivityIcon = (type) => {
    const normalizedType = type?.toLowerCase();

    if (normalizedType === "download") {
      return <FaDownload />;
    }

    if (normalizedType === "read") {
      return <FaBookOpen />;
    }

    if (normalizedType === "view") {
      return <FaEye />;
    }

    return <FaHistory />;
  };

  // =========================================
  // ACTIVITY STYLE
  // =========================================

  const getActivityStyle = (type) => {
    const normalizedType = type?.toLowerCase();

    if (normalizedType === "download") {
      return "bg-blue-50 text-blue-600";
    }

    if (normalizedType === "read") {
      return "bg-[#890C25]/10 text-[#890C25]";
    }

    if (normalizedType === "view") {
      return "bg-green-50 text-green-600";
    }

    return "bg-slate-100 text-slate-600";
  };

  // =========================================
  // LOADING
  // =========================================

  const loading =
    booksLoading || activitiesLoading;

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8">

      {/* ========================================= */}
      {/* DECORATIVE CIRCLES */}
      {/* ========================================= */}

      <div className="absolute -top-28 -left-28 w-80 h-80 bg-[#890C25]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#D58A98]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="bg-gradient-to-r from-[#890C25] via-[#890C25] to-[#6f091e] rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 mt-6 text-white">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/digital-library/books"
                  )
                }
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition mb-4"
              >
                <FaArrowLeft />
                Back to Digital Library
              </button>

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">

                  <FaBook className="text-2xl" />

                </div>

                <div>

                  <p className="text-white/65 text-sm">
                    Digital Library
                  </p>

                  <h1 className="text-3xl sm:text-4xl font-extrabold">
                    My Digital Books
                  </h1>

                </div>

              </div>

              <p className="text-white/75 mt-4 max-w-2xl leading-6">
                Explore digital books and keep track
                of your reading and download activity.
              </p>

            </div>

            <Link
              to="/digital-library/books"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-[#890C25] font-bold hover:bg-slate-100 transition shadow-lg"
            >
              <FaBook />
              Browse Digital Library
            </Link>

          </div>

        </div>

        {/* ========================================= */}
        {/* STATISTICS */}
        {/* ========================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* Available Books */}

          <div className="bg-blue-600 rounded-2xl shadow-lg p-5 text-white">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-white/70 text-sm">
                  Available Books
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {digitalBooks?.length || 0}
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">

                <FaBook className="text-xl" />

              </div>

            </div>

          </div>

          {/* My Reads */}

          <div className="bg-[#890C25] rounded-2xl shadow-lg p-5 text-white">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-white/70 text-sm">
                  My Reads
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {totalReads}
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">

                <FaBookOpen className="text-xl" />

              </div>

            </div>

          </div>

          {/* Downloads */}

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500 text-sm">
                  Downloads
                </p>

                <h2 className="text-3xl font-bold text-slate-800 mt-1">
                  {totalDownloads}
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">

                <FaDownload className="text-xl text-blue-600" />

              </div>

            </div>

          </div>

          {/* Activities */}

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500 text-sm">
                  Activities
                </p>

                <h2 className="text-3xl font-bold text-slate-800 mt-1">
                  {totalActivities}
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">

                <FaHistory className="text-xl text-green-600" />

              </div>

            </div>

          </div>

        </div>

        {/* ========================================= */}
        {/* MY ACTIVITY SUMMARY */}
        {/* ========================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

          {/* Reads */}

          <div className="relative group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 overflow-hidden">

            <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25] transition-all duration-700 group-hover:w-full" />

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-[#890C25]/10 flex items-center justify-center">

                <FaBookOpen className="text-[#890C25] text-xl" />

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Total Reads
                </p>

                <h3 className="text-2xl font-bold text-slate-800">
                  {totalReads}
                </h3>

              </div>

            </div>

          </div>

          {/* Downloads */}

          <div className="relative group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 overflow-hidden">

            <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25] transition-all duration-700 group-hover:w-full" />

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">

                <FaDownload className="text-blue-600 text-xl" />

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  My Downloads
                </p>

                <h3 className="text-2xl font-bold text-slate-800">
                  {totalDownloads}
                </h3>

              </div>

            </div>

          </div>

          {/* Views */}

          <div className="relative group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 overflow-hidden">

            <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-600 transition-all duration-700 group-hover:w-full" />

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">

                <FaEye className="text-blue-600 text-xl" />

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  My Views
                </p>

                <h3 className="text-2xl font-bold text-slate-800">
                  {totalViews}
                </h3>

              </div>

            </div>

          </div>

        </div>

        {/* ========================================= */}
        {/* TABS */}
        {/* ========================================= */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 mb-6">

          <div className="grid grid-cols-2 gap-2">

            <button
              type="button"
              onClick={() =>
                setActiveTab("books")
              }
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${
                activeTab === "books"
                  ? "bg-[#890C25] text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <FaBook />
              My Books
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab("activity")
              }
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${
                activeTab === "activity"
                  ? "bg-[#890C25] text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <FaHistory />
              Activity History
            </button>

          </div>

        </div>

        {/* ========================================= */}
        {/* SEARCH */}
        {/* ========================================= */}

        {activeTab === "books" && (

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">

            <div className="relative">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search by title, author or category..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/20 outline-none transition"
              />

            </div>

          </div>

        )}

        {/* ========================================= */}
        {/* LOADING */}
        {/* ========================================= */}

        {loading && (

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center mb-6">

            <FaSpinner className="text-4xl text-[#890C25] animate-spin mx-auto mb-4" />

            <p className="font-semibold text-slate-700">
              Loading your digital library...
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Please wait a moment.
            </p>

          </div>

        )}

        {/* ========================================= */}
        {/* BOOKS TAB */}
        {/* ========================================= */}

        {!loading &&
          activeTab === "books" && (

            <>

              {filteredBooks.length === 0 ? (

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">

                  <div className="w-20 h-20 rounded-2xl bg-[#890C25]/10 flex items-center justify-center mx-auto mb-5">

                    <FaBook className="text-4xl text-[#890C25]" />

                  </div>

                  <h2 className="text-2xl font-bold text-slate-800">
                    No Digital Books Found
                  </h2>

                  <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    {searchTerm
                      ? "No books match your search."
                      : "There are currently no digital books available."}
                  </p>

                  {searchTerm && (

                    <button
                      type="button"
                      onClick={() =>
                        setSearchTerm("")
                      }
                      className="mt-5 px-5 py-3 rounded-xl bg-[#890C25] text-white font-semibold hover:bg-[#6f091e] transition"
                    >
                      Clear Search
                    </button>

                  )}

                </div>

              ) : (

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                  {filteredBooks.map((book) => (

                    <div
                      key={book._id}
                      className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                    >

                      {/* Cover */}

                      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">

                        {book.coverImage ? (

                          <img
                            src={`http://localhost:5000${book.coverImage}`}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />

                        ) : (

                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">

                            <FaBook className="text-6xl mb-3" />

                            <span className="text-sm">
                              No Cover
                            </span>

                          </div>

                        )}

                        <div className="absolute top-3 left-3">

                          <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#890C25] text-xs font-bold shadow">

                            {book.category ||
                              "Uncategorized"}

                          </span>

                        </div>

                        {book.status === "Inactive" && (

                          <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">

                            <span className="px-4 py-2 rounded-full bg-white text-red-600 font-bold text-sm">
                              Inactive
                            </span>

                          </div>

                        )}

                      </div>

                      {/* Content */}

                      <div className="p-5">

                        <h3 className="text-lg font-bold text-slate-800 line-clamp-2">
                          {book.title}
                        </h3>

                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">

                          <FaUser className="text-[#890C25]" />

                          <span className="truncate">
                            {book.author ||
                              "Unknown Author"}
                          </span>

                        </div>

                        <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">

                          <span className="flex items-center gap-1">

                            <FaEye className="text-blue-600" />

                            {book.views || 0}

                          </span>

                          <span className="flex items-center gap-1">

                            <FaDownload className="text-[#890C25]" />

                            {book.downloads || 0}

                          </span>

                        </div>

                        <Link
                          to={`/digital-library/books/${book._id}`}
                          className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#890C25] text-white font-semibold hover:bg-[#6f091e] transition"
                        >
                          <FaBookOpen />
                          Open Book
                        </Link>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </>

          )}

        {/* ========================================= */}
        {/* ACTIVITY TAB */}
        {/* ========================================= */}

        {!loading &&
          activeTab === "activity" && (

            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">

              {/* Header */}

              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                  <div>

                    <h2 className="text-xl font-bold text-slate-800">
                      My Activity History
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Your recent digital library activities.
                    </p>

                  </div>

                  <div className="w-11 h-11 rounded-xl bg-[#890C25]/10 text-[#890C25] flex items-center justify-center">
                    <FaHistory />
                  </div>

                </div>

              </div>

              {/* Error */}

              {activityError && (

                <div className="m-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">

                  <FaInfoCircle className="mt-1 shrink-0" />

                  <p className="text-sm">
                    {activityError}
                  </p>

                </div>

              )}

              {/* No Activity */}

              {activities.length === 0 ? (

                <div className="p-12 text-center">

                  <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-5">

                    <FaHistory className="text-4xl text-slate-400" />

                  </div>

                  <h3 className="text-xl font-bold text-slate-800">
                    No Activity Yet
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Your reading and download activity will
                    appear here.
                  </p>

                  <Link
                    to="/digital-library/books"
                    className="inline-flex items-center gap-2 mt-5 px-5 py-3 rounded-xl bg-[#890C25] text-white font-semibold hover:bg-[#6f091e] transition"
                  >
                    <FaBook />
                    Browse Books
                  </Link>

                </div>

              ) : (

                <div className="divide-y divide-slate-100">

                  {activities.map(
                    (activity, index) => {

                      const book =
                        activity?.digitalBook;

                      const activityType =
                        activity?.activityType?.toLowerCase();

                      return (

                        <div
                          key={
                            activity?._id ||
                            `${activityType}-${activity?.createdAt}-${index}`
                          }
                          className="p-5 sm:p-6 hover:bg-slate-50 transition"
                        >

                          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

                            {/* Icon */}

                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getActivityStyle(
                                activityType
                              )}`}
                            >
                              {getActivityIcon(
                                activityType
                              )}
                            </div>

                            {/* Book */}

                            <div className="flex-1 min-w-0">

                              <div className="flex flex-wrap items-center gap-2">

                                <span className="text-xs font-bold uppercase tracking-wide text-[#890C25]">

                                  {formatActivityType(
                                    activityType
                                  )}

                                </span>

                                <span className="text-slate-300">
                                  •
                                </span>

                                <span className="text-xs text-slate-500 flex items-center gap-1">

                                  <FaCalendarAlt />

                                  {formatDate(
                                    activity?.createdAt
                                  )}

                                </span>

                              </div>

                              <h3 className="text-lg font-bold text-slate-800 mt-2">

                                {book?.title ||
                                  "Digital Book"}

                              </h3>

                              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">

                                <span className="flex items-center gap-1.5">

                                  <FaUser className="text-[#890C25]" />

                                  {book?.author ||
                                    "Unknown Author"}

                                </span>

                                <span className="flex items-center gap-1.5">

                                  <FaTags className="text-blue-600" />

                                  {book?.category ||
                                    "Uncategorized"}

                                </span>

                              </div>

                            </div>

                            {/* Action */}

                            {book?._id && (

                              <Link
                                to={`/digital-library/books/${book._id}`}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:border-[#890C25] hover:text-[#890C25] transition"
                              >
                                <FaBookOpen />
                                View Book
                              </Link>

                            )}

                          </div>

                        </div>

                      );
                    }
                  )}

                </div>

              )}

            </div>

          )}

        {/* ========================================= */}
        {/* FOOTER INFO */}
        {/* ========================================= */}

        <div className="relative group mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 overflow-hidden">

          {/* Animated Top Line */}

          <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25] transition-all duration-700 ease-out group-hover:w-full z-20" />

          <div className="flex items-start gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">

              <FaInfoCircle />

            </div>

            <div>

              <h3 className="font-bold text-slate-800">
                Digital Library Activity
              </h3>

              <p className="text-sm text-slate-500 mt-1 leading-6">
                Your reading, viewing and download actions
                are recorded in your digital library activity
                history so you can easily keep track of your
                learning resources.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default MyDigitalBooks;