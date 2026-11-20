import { useEffect } from "react";
import { Link } from "react-router-dom";

import {
  FaBook,
  FaBookOpen,
  FaDownload,
  FaEye,
  FaChartLine,
  FaPlus,
  FaArrowRight,
  FaLayerGroup,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import { useDigitalBooks } from "../../context/DigitalBookContext";
import { useDigitalBookActivities } from "../../context/DigitalBookActivityContext";
import API from "../../api/api";

const DigitalDashboard = () => {
  const {
    digitalBooks,
    loading: booksLoading,
    getDigitalBooks,
  } = useDigitalBooks();

  const {
    activityStats,
    allActivities,
    loading: activityLoading,
    getActivityStats,
    getAllActivities,
  } = useDigitalBookActivities();

  useEffect(() => {
    getDigitalBooks();
    getActivityStats();
    getAllActivities();
  }, []);

  // ==========================================
  // VIEW DIGITAL BOOK
  // ==========================================

  const handleViewBook = async (id) => {
    try {
      const response = await API.get(
        `/digital-books/${id}/view`,
        {
          responseType: "blob",
        }
      );

      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], {
          type:
            response.headers["content-type"] ||
            "application/pdf",
        })
      );

      window.open(fileURL, "_blank");

      await getDigitalBooks();
      await getActivityStats();

      setTimeout(() => {
        window.URL.revokeObjectURL(fileURL);
      }, 10000);
    } catch (error) {
      console.error("View digital book error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to view digital book."
      );
    }
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalBooks = digitalBooks?.length || 0;

  const activeBooks =
    digitalBooks?.filter(
      (book) => book.status === "Active"
    ).length || 0;

  const inactiveBooks =
    digitalBooks?.filter(
      (book) => book.status === "Inactive"
    ).length || 0;

  const totalViews = (digitalBooks || []).reduce(
    (total, book) =>
      total + (Number(book.views) || 0),
    0
  );

  const totalReads = activityStats?.totalReads || 0;
  const totalDownloads =
    activityStats?.totalDownloads || 0;
  const totalActivities =
    activityStats?.totalActivities || 0;

  const activePercentage =
    totalBooks > 0
      ? Math.round((activeBooks / totalBooks) * 100)
      : 0;

  // ==========================================
  // RECENT BOOKS
  // ==========================================

  const recentBooks = [...(digitalBooks || [])]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5);

  // ==========================================
  // RECENT ACTIVITIES
  // ==========================================

  const recentActivities = [
    ...(allActivities || []),
  ].slice(0, 6);

  // ==========================================
  // HELPERS
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatNumber = (value) =>
    Number(value || 0).toLocaleString();

  const getActivityLabel = (type) => {
    switch (type) {
      case "view":
        return "Viewed";

      case "read":
        return "Read";

      case "download":
        return "Downloaded";

      default:
        return "Activity";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "view":
        return <FaEye className="text-blue-600" />;

      case "read":
        return (
          <FaBookOpen className="text-green-600" />
        );

      case "download":
        return (
          <FaDownload className="text-[#890C25]" />
        );

      default:
        return (
          <FaChartLine className="text-blue-600" />
        );
    }
  };

  const loading = booksLoading || activityLoading;

  // ==========================================
  // REUSABLE STAT CARD
  // ==========================================

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    color = "maroon",
  }) => {
    const isBlue = color === "blue";

    return (
      <div
        className={`relative group overflow-hidden rounded-3xl p-5 text-white 
        ${
          isBlue
            ? "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 shadow-blue-500/15"
            : "bg-gradient-to-br from-[#890C25] via-[#72091F] to-[#430512] shadow-[#890C25]/15"
        } 
        shadow-lg hover:-translate-y-1 hover:shadow-xl 
        transition-all duration-300`}
      >
        {/* Animated Top Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
          <div
            className="h-full w-0 bg-white/70 
            group-hover:w-full transition-all duration-700"
          />
        </div>

        {/* Decorative Circles */}
        <div
          className="absolute -right-10 -top-10 w-36 h-36 
          rounded-full bg-white/10 
          group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute -left-8 -bottom-10 w-28 h-28 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white/70">
                {title}
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                {formatNumber(value)}
              </h2>
            </div>

            <div
              className="w-12 h-12 shrink-0 rounded-2xl 
              bg-white/15 border border-white/10 
              flex items-center justify-center 
              group-hover:scale-110 transition-transform duration-300"
            >
              {icon}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-white/70">
            <FaChartLine />
            <span>{subtitle}</span>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // SECTION HEADER
  // ==========================================

  const SectionHeading = ({
    icon,
    title,
    subtitle,
    link,
    linkText,
  }) => (
    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-6 py-5 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#890C25]/10 border border-[#D58A98]/20 flex items-center justify-center text-[#890C25]">
          {icon}
        </div>

        <div>
          <h2 className="font-bold text-slate-800 text-lg">
            {title}
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      {link && (
        <Link
          to={link}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#890C25] hover:text-[#5f0719] transition group/link"
        >
          {linkText}

          <FaArrowRight className="text-xs group-hover/link:translate-x-1 transition-transform duration-300" />
        </Link>
      )}
    </div>
  );

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100">

      {/* BACKGROUND DECORATION */}

      <div className="pointer-events-none absolute -top-28 -right-24 w-96 h-96 rounded-full bg-[#890C25]/10 blur-3xl" />

      <div className="pointer-events-none absolute top-[28%] -left-40 w-96 h-96 rounded-full bg-[#D58A98]/10 blur-3xl" />

      <div className="pointer-events-none absolute top-[58%] right-[10%] w-80 h-80 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 -right-20 w-80 h-80 rounded-full bg-[#890C25]/5 blur-3xl" />

      {/* MAIN WRAPPER */}

      <div className="relative z-10 px-4 pb-10 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">

        {/* HERO HEADER — MAROON */}

        <div className="relative group mb-8 overflow-hidden rounded-[2rem] border border-[#D58A98]/20 bg-gradient-to-br from-[#890C25] via-[#72091F] to-[#430512] p-5 shadow-xl shadow-[#890C25]/20 backdrop-blur-xl sm:p-7 lg:p-8">

          {/* Animated Top Line */}

          <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
            <div className="h-full w-0 bg-gradient-to-r from-white/30 via-white to-white/30 group-hover:w-full transition-all duration-1000" />
          </div>

          {/* Decorative Circles */}

          <div className="absolute -right-16 -top-16 w-52 h-52 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div className="absolute -left-20 bottom-[-80px] w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

            {/* LEFT SIDE */}

            <div className="min-w-0">
              <div className="flex items-center gap-4 mb-4">

                <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/15 border border-white/10 flex items-center justify-center shadow-lg">
                  <FaBookOpen className="text-white text-2xl" />
                </div>

                <div>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/70">
                    Digital Library
                  </p>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1">
                    Digital Dashboard
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-white/70">
                Manage your digital library, monitor reading
                activity, downloads and digital resources
                from one place.
              </p>

              {/* Header Mini Status */}

              <div className="flex flex-wrap gap-3 mt-5">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Digital Library Active
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white">
                  <FaLayerGroup />
                  {formatNumber(totalBooks)} Resources
                </div>

              </div>
            </div>

            {/* HEADER ACTIONS */}

            <div className="flex flex-wrap gap-3">

              <Link
                to="/digital-library/books"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15 hover:shadow-md"
              >
                <FaBook />
                View Books
              </Link>

              <Link
                to="/digital-library/add"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#890C25] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-xl"
              >
                <FaPlus />
                Add Digital Book
              </Link>

            </div>
          </div>
        </div>

        {/* LOADING INDICATOR */}

        {loading && (
          <div className="relative group mb-7 overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-4 shadow-md backdrop-blur-xl">
            <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25] group-hover:w-full transition-all duration-700" />

            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-[#890C25] border-t-transparent animate-spin" />

              <p className="text-sm text-slate-500">
                Loading digital library data...
              </p>
            </div>
          </div>
        )}

        {/* ==========================================
            MAIN STATISTICS
        ========================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-7">

          {/* FIRST BOX — MAROON */}

          <StatCard
            title="Total Digital Books"
            value={totalBooks}
            subtitle="All library resources"
            icon={<FaBook className="text-xl" />}
            color="maroon"
          />

          {/* SECOND BOX — BLUE */}

          <StatCard
            title="Active Books"
            value={activeBooks}
            subtitle="Currently available"
            icon={<FaCheckCircle className="text-xl" />}
            color="blue"
          />

          {/* THIRD BOX — MAROON */}

          <StatCard
            title="Total Downloads"
            value={totalDownloads}
            subtitle="Digital file downloads"
            icon={<FaDownload className="text-xl" />}
            color="maroon"
          />

          {/* LAST BOX — MAROON */}

          <StatCard
            title="Total Views"
            value={totalViews}
            subtitle="Library engagement"
            icon={<FaEye className="text-xl" />}
            color="maroon"
          />

        </div>

        {/* ==========================================
            SECONDARY STATISTICS
        ========================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">

          {/* TOTAL READS */}

          <div className="relative group overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-5 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl">

            <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-green-600 via-emerald-400 to-green-600 group-hover:w-full transition-all duration-700" />

            <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-green-500/5 blur-xl" />

            <div className="relative z-10 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-green-100 bg-green-50 transition-transform duration-300 group-hover:scale-110">
                <FaBookOpen className="text-xl text-green-600" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Total Reads
                </p>

                <h3 className="mt-1 text-2xl font-bold text-slate-800">
                  {formatNumber(totalReads)}
                </h3>

                <p className="mt-1 text-xs text-green-600">
                  Reading activity
                </p>
              </div>
            </div>
          </div>

          {/* INACTIVE BOOKS */}

          <div className="relative group overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-5 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl">

            <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25] group-hover:w-full transition-all duration-700" />

            <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-[#890C25]/5 blur-xl" />

            <div className="relative z-10 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 transition-transform duration-300 group-hover:scale-110">
                <FaTimesCircle className="text-xl text-[#890C25]" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Inactive Books
                </p>

                <h3 className="mt-1 text-2xl font-bold text-slate-800">
                  {formatNumber(inactiveBooks)}
                </h3>

                <p className="mt-1 text-xs text-[#890C25]">
                  Currently inactive
                </p>
              </div>
            </div>
          </div>

          {/* TOTAL ACTIVITIES */}

          <div className="relative group overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-5 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">

            <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-600 group-hover:w-full transition-all duration-700" />

            <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-blue-500/5 blur-xl" />

            <div className="relative z-10 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 transition-transform duration-300 group-hover:scale-110">
                <FaChartLine className="text-xl text-blue-600" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Total Activities
                </p>

                <h3 className="mt-1 text-2xl font-bold text-slate-800">
                  {formatNumber(totalActivities)}
                </h3>

                <p className="mt-1 text-xs text-blue-600">
                  All recorded activity
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ==========================================
            BOOKS + QUICK ACTIONS
        ========================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* RECENT DIGITAL BOOKS */}

          <div className="relative group overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 shadow-xl shadow-slate-200/60 backdrop-blur-xl xl:col-span-2">

            <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-slate-100">
              <div className="h-full w-0 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25] group-hover:w-full transition-all duration-1000" />
            </div>

            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#890C25]/5 blur-2xl pointer-events-none" />

            <div className="absolute -left-20 bottom-10 h-44 w-44 rounded-full bg-blue-500/5 blur-2xl pointer-events-none" />

            <SectionHeading
              icon={<FaBook />}
              title="Recent Digital Books"
              subtitle="Latest resources added to your library"
              link="/digital-library/books"
              linkText="View All"
            />

            <div className="relative z-10 p-5 sm:p-6">

              {recentBooks.length === 0 ? (
                <div className="py-12 text-center">

                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100">
                    <FaBook className="text-2xl text-slate-400" />
                  </div>

                  <h3 className="font-semibold text-slate-700">
                    No Digital Books Yet
                  </h3>

                  <p className="mt-1 mb-5 text-sm text-slate-500">
                    Start building your digital library.
                  </p>

                  <Link
                    to="/digital-library/add"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#890C25] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#6f091e]"
                  >
                    <FaPlus />
                    Add First Book
                  </Link>

                </div>
              ) : (
                <div className="space-y-3">

                  {recentBooks.map((book) => (
                    <div
                      key={book._id}
                      className="relative group/book flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D58A98]/40 hover:bg-white hover:shadow-md sm:flex-row sm:items-center"
                    >

                      <div className="absolute top-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#890C25] via-[#D58A98] to-[#890C25] group-hover/book:w-full transition-all duration-700" />

                      <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#890C25] to-[#520617] shadow-sm">

                        {book.coverImage ? (
                          <img
                            src={`http://localhost:5000${book.coverImage}`}
                            alt={book.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FaBookOpen className="text-2xl text-white" />
                        )}

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-bold text-slate-800 transition-colors group-hover/book:text-[#890C25]">
                            {book.title}
                          </h3>

                          <span
                            className={`rounded-full border px-2 py-1 text-[10px] font-bold ${
                              book.status === "Active"
                                ? "border-green-100 bg-green-50 text-green-600"
                                : "border-red-100 bg-red-50 text-red-600"
                            }`}
                          >
                            {book.status}
                          </span>
                        </div>

                        <p className="truncate text-sm text-slate-500">
                          {book.author || "Unknown Author"}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span>
                            {book.category || "General"}
                          </span>

                          <span>•</span>

                          <span>
                            {formatDate(book.createdAt)}
                          </span>
                        </div>

                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">

                        <div className="min-w-[52px] text-center">
                          <div className="flex items-center justify-center gap-1 text-blue-600">
                            <FaEye className="text-xs" />

                            <span className="text-sm font-bold">
                              {formatNumber(book.views || 0)}
                            </span>
                          </div>

                          <p className="mt-1 text-[10px] text-slate-400">
                            Views
                          </p>
                        </div>

                        <div className="min-w-[65px] text-center">
                          <div className="flex items-center justify-center gap-1 text-[#890C25]">
                            <FaDownload className="text-xs" />

                            <span className="text-sm font-bold">
                              {formatNumber(book.downloads || 0)}
                            </span>
                          </div>

                          <p className="mt-1 text-[10px] text-slate-400">
                            Downloads
                          </p>
                        </div>

                        <Link
                          to={`/digital-library/books/${book._id}`}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-300 hover:scale-105 hover:border-[#890C25] hover:bg-[#890C25] hover:text-white"
                          aria-label={`View ${book.title}`}
                        >
                          <FaArrowRight className="text-xs" />
                        </Link>

                      </div>
                    </div>
                  ))}

                </div>
              )}

            </div>
          </div>

          {/* QUICK ACTIONS */}

          <div className="relative group overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#172554] via-blue-800 to-blue-950 p-6 text-white shadow-xl shadow-blue-900/20 sm:p-7">

            <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
              <div className="h-full w-0 bg-gradient-to-r from-white/30 via-white to-white/30 group-hover:w-full transition-all duration-1000" />
            </div>

            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 transition-transform duration-700 group-hover:scale-110" />

            <div className="absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-white/5" />

            <div className="absolute right-10 bottom-16 h-20 w-20 rounded-full bg-blue-300/10 blur-xl" />

            <div className="relative z-10">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <FaChartLine className="text-xl" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
                    Library Tools
                  </p>

                  <h2 className="text-xl font-bold">
                    Quick Actions
                  </h2>

                  <p className="mt-1 text-xs text-white/60">
                    Manage digital resources
                  </p>
                </div>
              </div>

              <div className="space-y-3">

                <Link
                  to="/digital-library/add"
                  className="group/action flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/15"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 transition-transform duration-300 group-hover/action:scale-110">
                    <FaPlus />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">
                      Add Digital Book
                    </p>

                    <p className="mt-1 text-xs text-white/55">
                      Upload a new resource
                    </p>
                  </div>

                  <FaArrowRight className="text-xs text-white/50 transition-all duration-300 group-hover/action:translate-x-1 group-hover/action:text-white" />
                </Link>

                <Link
                  to="/digital-library/manage"
                  className="group/action flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/15"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 transition-transform duration-300 group-hover/action:scale-110">
                    <FaBook />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">
                      Manage Books
                    </p>

                    <p className="mt-1 text-xs text-white/55">
                      Edit and manage resources
                    </p>
                  </div>

                  <FaArrowRight className="text-xs text-white/50 transition-all duration-300 group-hover/action:translate-x-1 group-hover/action:text-white" />
                </Link>

                <Link
                  to="/digital-library/books"
                  className="group/action flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/15"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 transition-transform duration-300 group-hover/action:scale-110">
                    <FaBookOpen />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">
                      Browse Library
                    </p>

                    <p className="mt-1 text-xs text-white/55">
                      Explore digital books
                    </p>
                  </div>

                  <FaArrowRight className="text-xs text-white/50 transition-all duration-300 group-hover/action:translate-x-1 group-hover/action:text-white" />
                </Link>

              </div>

              <div className="mt-7 border-t border-white/10 pt-5">

                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs text-white/60">
                    Active Library
                  </span>

                  <span className="text-sm font-bold">
                    {activePercentage}%
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-300 to-white transition-all duration-700"
                    style={{
                      width: `${activePercentage}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-white/50">
                  {formatNumber(activeBooks)} active out of{" "}
                  {formatNumber(totalBooks)} digital books
                </p>

              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            RECENT ACTIVITY — MAROON
        ========================================== */}

        <div className="relative group mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#890C25] via-[#72091F] to-[#430512] shadow-xl shadow-[#890C25]/20 backdrop-blur-xl">

          <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-white/10">
            <div className="h-full w-0 bg-gradient-to-r from-white/30 via-white to-white/30 group-hover:w-full transition-all duration-1000" />
          </div>

          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-6 py-5 border-b border-white/10">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white">
                <FaClock />
              </div>

              <div>
                <h2 className="font-bold text-white text-lg">
                  Recent Activity
                </h2>

                <p className="text-xs text-white/60 mt-1">
                  Latest digital library activity
                </p>
              </div>

            </div>

            <Link
              to="/digital-library/my-books"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition group/link"
            >
              My Digital Books

              <FaArrowRight className="text-xs group-hover/link:translate-x-1 transition-transform duration-300" />
            </Link>

          </div>

          <div className="relative z-10 p-5 sm:p-6">

            {recentActivities.length === 0 ? (
              <div className="py-10 text-center">

                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <FaChartLine className="text-xl text-white/60" />
                </div>

                <p className="text-sm font-semibold text-white/80">
                  No recent activity
                </p>

                <p className="mt-1 text-xs text-white/50">
                  Digital book activity will appear here.
                </p>

              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

                {recentActivities.map((activity, index) => (
                  <div
                    key={
                      activity._id ||
                      `${activity.digitalBook?._id}-${index}`
                    }
                    className="relative group/activity-card flex items-start gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/15 hover:shadow-md"
                  >

                    <div className="absolute top-0 left-0 h-0.5 w-0 bg-gradient-to-r from-white/30 via-white to-white/30 group-hover/activity-card:w-full transition-all duration-700" />

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-sm">
                      {getActivityIcon(
                        activity.activityType
                      )}
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-sm text-white/80">
                        <span className="font-bold text-white">
                          {activity.user?.name || "User"}
                        </span>{" "}

                        {getActivityLabel(
                          activity.activityType
                        )}
                      </p>

                      <p className="mt-1 truncate text-xs font-medium text-white/60">
                        {activity.digitalBook?.title ||
                          "Digital Book"}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-[10px] text-white/50">
                        <FaClock />

                        <span>
                          {formatDate(
                            activity.createdAt
                          )}
                        </span>
                      </div>

                    </div>

                    <div className="absolute right-3 top-3">
                      <span className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white/50">
                        {activity.activityType ||
                          "Activity"}
                      </span>
                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        </div>

        {/* FOOTER */}

        <div className="mt-7 flex flex-col items-center justify-between gap-3 px-2 pb-3 sm:flex-row">

          <p className="text-xs text-slate-400">
            Digital Library Management System
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Digital Library Active
          </div>

        </div>

      </div>
    </div>
  );
};

export default DigitalDashboard;