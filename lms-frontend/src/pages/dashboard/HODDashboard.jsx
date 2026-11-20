import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaUsers,
  FaUserTie,
  FaBook,
  FaBookOpen,
  FaExchangeAlt,
  FaUndoAlt,
  FaChartLine,
  FaSyncAlt,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaLayerGroup,
  FaDownload,
  FaEye,
  FaLaptop,
  FaClipboardList,
  FaUniversity,
  FaUserGraduate,
  FaUserShield,
  FaCalendarAlt,
  FaExclamationCircle,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { useReports } from "../../context/ReportContext";

const HODDashboard = () => {
  const { user } = useAuth();

  const {
    overviewReport,
    usersReport,
    booksReport,
    issuesReport,
    returnsReport,
    digitalLibraryReport,
    getOverviewReport,
    getUsersReport,
    getBooksReport,
    getIssuesReport,
    getReturnsReport,
    getDigitalLibraryReport,
    loading,
  } = useReports();

  const [refreshing, setRefreshing] = useState(false);

  // Prevent duplicate refresh clicks
  const refreshLock = useRef(false);

  // ============================================================
  // INITIAL DATA LOAD
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    const loadDashboardData = async () => {
      try {
        await Promise.all([
          getOverviewReport(),
          getUsersReport(),
          getBooksReport(),
          getIssuesReport(),
          getReturnsReport(),
          getDigitalLibraryReport(),
        ]);
      } catch (error) {
        if (!cancelled) {
          console.error(
            "HOD Dashboard loading error:",
            error
          );
        }
      }
    };

    loadDashboardData();

    return () => {
      cancelled = true;
    };

    // IMPORTANT:
    // Initial dashboard load only.
    // We intentionally don't put the report functions
    // in this dependency array because some contexts
    // can recreate function references.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================
  // REFRESH DATA WITHOUT PAGE RELOAD
  // ============================================================

  const handleRefresh = async (event) => {
    // Stop browser/form default behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Don't allow another refresh while one is running
    if (refreshLock.current) {
      return;
    }

    refreshLock.current = true;
    setRefreshing(true);

    try {
      await Promise.all([
        getOverviewReport(),
        getUsersReport(),
        getBooksReport(),
        getIssuesReport(),
        getReturnsReport(),
        getDigitalLibraryReport(),
      ]);
    } catch (error) {
      console.error(
        "HOD Dashboard refresh error:",
        error
      );
    } finally {
      refreshLock.current = false;
      setRefreshing(false);
    }
  };

  // ============================================================
  // REPORT DATA
  // ============================================================

  const overview = overviewReport || {};
  const usersSummary = usersReport?.summary || {};
  const booksSummary = booksReport?.summary || {};
  const issuesSummary = issuesReport?.summary || {};
  const returnsSummary = returnsReport?.summary || {};
  const digitalSummary =
    digitalLibraryReport?.summary || {};

  // ============================================================
  // MAIN COUNTS
  // ============================================================

  const totalUsers =
    overview?.users?.total ??
    usersSummary?.totalUsers ??
    0;

  const totalBooks =
    overview?.books?.total ??
    booksSummary?.totalBooks ??
    0;

  const activeBooks =
    overview?.books?.active ??
    booksSummary?.activeBooks ??
    0;

  const inactiveBooks =
    overview?.books?.inactive ??
    booksSummary?.inactiveBooks ??
    0;

  const totalIssues =
    overview?.issues?.total ??
    issuesSummary?.totalIssues ??
    0;

  const pendingIssues =
    overview?.issues?.pending ??
    issuesSummary?.pending ??
    0;

  const totalReturns =
    overview?.returns?.total ??
    returnsSummary?.totalReturns ??
    0;

  const pendingReturns =
    overview?.returns?.pending ??
    returnsSummary?.pending ??
    0;

  const digitalBooks =
    overview?.digitalLibrary?.total ??
    digitalSummary?.totalBooks ??
    0;

  const digitalViews =
    overview?.digitalLibrary?.totalViews ??
    digitalSummary?.totalViews ??
    0;

  const digitalDownloads =
    overview?.digitalLibrary?.totalDownloads ??
    digitalSummary?.totalDownloads ??
    0;

  const totalQuantity =
    booksSummary?.totalQuantity ?? 0;

  const availableCopies =
    booksSummary?.availableCopies ?? 0;

  const completedReturns =
    returnsSummary?.completed ?? 0;

  const rejectedReturns =
    returnsSummary?.rejected ?? 0;

  // ============================================================
  // USER ROLE DISTRIBUTION
  // ============================================================

  const roleStats = useMemo(() => {
    const stats = usersSummary?.roleStats;

    if (!stats) {
      return [];
    }

    if (Array.isArray(stats)) {
      return stats;
    }

    return Object.entries(stats).map(
      ([role, count]) => ({
        role,
        count,
      })
    );
  }, [usersSummary]);

  const normalizedRoleStats = useMemo(() => {
    return roleStats
      .map((item) => ({
        role:
          item?.role ||
          item?._id ||
          item?.name ||
          "Unknown",

        count:
          item?.count ??
          item?.total ??
          item?.value ??
          0,
      }))
      .sort(
        (a, b) =>
          Number(b.count) -
          Number(a.count)
      );
  }, [roleStats]);

  // ============================================================
  // PERCENTAGES
  // ============================================================

  const issuePendingPercentage =
    totalIssues > 0
      ? Math.min(
          (pendingIssues / totalIssues) * 100,
          100
        )
      : 0;

  const returnPendingPercentage =
    totalReturns > 0
      ? Math.min(
          (pendingReturns / totalReturns) * 100,
          100
        )
      : 0;

  const bookAvailabilityPercentage =
    totalQuantity > 0
      ? Math.min(
          (availableCopies /
            totalQuantity) *
            100,
          100
        )
      : 0;

  const activeBookPercentage =
    totalBooks > 0
      ? Math.min(
          (activeBooks / totalBooks) *
            100,
          100
        )
      : 0;

  // ============================================================
  // FORMAT ROLE
  // ============================================================

  const formatRole = (role) => {
    if (!role) {
      return "Unknown";
    }

    return String(role)
      .replace(/[-_]/g, " ")
      .replace(
        /\b\w/g,
        (letter) => letter.toUpperCase()
      );
  };

  // ============================================================
  // ROLE ICON
  // ============================================================

  const getRoleIcon = (role) => {
    const normalized =
      String(role).toLowerCase();

    if (
      normalized.includes("student")
    ) {
      return <FaUserGraduate />;
    }

    if (
      normalized.includes("teacher") ||
      normalized.includes("hod")
    ) {
      return <FaUserTie />;
    }

    if (
      normalized.includes("admin") ||
      normalized.includes("superadmin")
    ) {
      return <FaUserShield />;
    }

    return <FaUsers />;
  };

  // ============================================================
  // STAT CARDS
  // ============================================================

  const statCards = [
    {
      title: "Total Users",
      value: totalUsers,
      subtitle: "System users",
      icon: <FaUsers />,
      gradient:
        "from-[#890C25] via-[#76091F] to-[#5F0719]",
    },

    {
      title: "Total Books",
      value: totalBooks,
      subtitle: `${activeBooks} active books`,
      icon: <FaBook />,
      gradient:
        "from-[#2563EB] via-[#1D4ED8] to-[#1E3A8A]",
    },

    {
      title: "Book Issues",
      value: totalIssues,
      subtitle: `${pendingIssues} pending`,
      icon: <FaExchangeAlt />,
      gradient:
        "from-[#890C25] via-[#76091F] to-[#5F0719]",
    },

    {
      title: "Book Returns",
      value: totalReturns,
      subtitle: `${pendingReturns} pending`,
      icon: <FaUndoAlt />,
      gradient:
        "from-[#2563EB] via-[#1D4ED8] to-[#1E3A8A]",
    },
  ];

  // ============================================================
  // QUICK ACTIONS
  // ============================================================

  const quickActions = [
    {
      title: "View Reports",
      description:
        "Review system analytics",
      icon: <FaChartLine />,
      path: "/reports",
      iconClass: "text-[#890C25]",
      bgClass: "bg-[#890C25]/10",
    },

    {
      title: "Manage Users",
      description:
        "View registered users",
      icon: <FaUsers />,
      path: "/users",
      iconClass: "text-blue-600",
      bgClass: "bg-blue-50",
    },

    {
      title: "Library Books",
      description:
        "Explore book collection",
      icon: <FaBookOpen />,
      path: "/books",
      iconClass: "text-[#890C25]",
      bgClass: "bg-[#890C25]/10",
    },

    {
      title: "Digital Library",
      description:
        "View digital resources",
      icon: <FaLaptop />,
      path: "/digital-library/books",
      iconClass: "text-blue-600",
      bgClass: "bg-blue-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8   ">
      <div className="mx-auto max-w-7xl space-y-6  mt-6">

        {/* ======================================================
            HERO HEADER
        ======================================================= */}

        <section className="group relative overflow-hidden rounded-3xl border border-[#D58A98]/30 bg-gradient-to-br from-[#890C25] via-[#76091F] to-[#5F0719] p-6 shadow-xl md:p-8">

          {/* Top Animation */}

          <div className="absolute left-0 top-0 h-1 w-0 bg-white transition-all duration-700 group-hover:w-full" />

          <div className="absolute left-0 top-1 h-1 w-0 bg-[#D58A98] transition-all delay-150 duration-700 group-hover:w-full" />

          {/* Decorative Circles */}

          <div className="absolute -right-20 -top-20 h-56 w-56 animate-pulse rounded-full border border-white/10 bg-white/5" />

          <div className="absolute -bottom-28 right-28 h-64 w-64 rounded-full border border-[#D58A98]/20 bg-[#D58A98]/5" />

          <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full border border-blue-300/10 bg-blue-300/5" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Header Content */}

            <div className="flex items-start gap-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl text-white shadow-lg backdrop-blur-md">
                <FaUniversity />
              </div>

              <div>

                <p className="mb-1 text-sm font-medium uppercase tracking-[0.2em] text-[#D58A98]">
                  Department Overview
                </p>

                <h1 className="text-2xl font-bold text-white md:text-4xl">
                  HOD Dashboard
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75 md:text-base">
                  Welcome back,{" "}
                  <span className="font-semibold text-white">
                    {user?.name ||
                      user?.fullName ||
                      "HOD"}
                  </span>
                  . Monitor users, library
                  activity, resources and
                  overall academic system
                  performance from one place.
                </p>

              </div>
            </div>

            {/* ==================================================
                REFRESH BUTTON
            =================================================== */}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={
                refreshing ||
                loading
              }
              aria-label="Refresh dashboard data"
              className="group/refresh inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#890C25] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#FDF2F4] disabled:cursor-not-allowed disabled:opacity-60"
            >

              <FaSyncAlt
                className={
                  refreshing ||
                  loading
                    ? "animate-spin"
                    : "transition-transform duration-300 group-hover/refresh:rotate-180"
                }
              />

              {refreshing ||
              loading
                ? "Refreshing..."
                : "Refresh Data"}

            </button>

          </div>
        </section>

        {/* ======================================================
            STAT CARDS
        ======================================================= */}

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {statCards.map(
            (card, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
              >

                {/* Animated Line */}

                <div className="absolute left-0 top-0 h-1 w-0 bg-white/90 transition-all duration-500 group-hover:w-full" />

                {/* Circle */}

                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-white/10 bg-white/5 transition-transform duration-500 group-hover:scale-150" />

                <div className="relative z-10 flex items-start justify-between">

                  <div>

                    <p className="text-sm font-medium text-white/70">
                      {card.title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-white">
                      {Number(
                        card.value
                      ).toLocaleString()}
                    </h2>

                    <p className="mt-1 text-xs text-white/70">
                      {card.subtitle}
                    </p>

                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-xl text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    {card.icon}
                  </div>

                </div>
              </div>
            )
          )}

        </section>

        {/* ======================================================
            SECONDARY OVERVIEW
        ======================================================= */}

        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* Active Books */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-[#890C25] transition-all duration-500 group-hover:w-full" />

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Active Books
                </p>

                <h3 className="mt-1 text-2xl font-bold text-slate-800">
                  {activeBooks.toLocaleString()}
                </h3>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                <FaBookOpen />
              </div>

            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-[#890C25] transition-all duration-700"
                style={{
                  width: `${activeBookPercentage}%`,
                }}
              />

            </div>

            <p className="mt-2 text-xs text-slate-500">
              {activeBookPercentage.toFixed(
                0
              )}
              % of total books are active
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {inactiveBooks.toLocaleString()} inactive
            </p>

          </div>

          {/* Available Copies */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Available Copies
                </p>

                <h3 className="mt-1 text-2xl font-bold text-slate-800">
                  {availableCopies.toLocaleString()}
                </h3>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FaLayerGroup />
              </div>

            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-700"
                style={{
                  width: `${bookAvailabilityPercentage}%`,
                }}
              />

            </div>

            <p className="mt-2 text-xs text-slate-500">
              {bookAvailabilityPercentage.toFixed(
                0
              )}
              % copies currently available
            </p>

          </div>

          {/* Digital Resources */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-[#890C25] transition-all duration-500 group-hover:w-full" />

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Digital Resources
                </p>

                <h3 className="mt-1 text-2xl font-bold text-slate-800">
                  {digitalBooks.toLocaleString()}
                </h3>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                <FaLaptop />
              </div>

            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">

              <span className="inline-flex items-center gap-1">
                <FaEye className="text-blue-600" />
                {digitalViews.toLocaleString()} views
              </span>

              <span className="inline-flex items-center gap-1">
                <FaDownload className="text-[#890C25]" />
                {digitalDownloads.toLocaleString()} downloads
              </span>

            </div>

          </div>

        </section>

        {/* ======================================================
            ANALYTICS
        ======================================================= */}

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Issue Overview */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />

            <div className="mb-6 flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Library Activity
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  Issue Overview
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FaExchangeAlt />
              </div>

            </div>

            <div className="space-y-5">

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-sm font-medium text-slate-600">
                    Total Issues
                  </span>

                  <span className="font-bold text-slate-800">
                    {totalIssues.toLocaleString()}
                  </span>

                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

                  <div className="h-full w-full rounded-full bg-blue-600" />

                </div>

              </div>

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                    <FaClock className="text-amber-500" />
                    Pending Issues
                  </span>

                  <span className="font-bold text-amber-600">
                    {pendingIssues.toLocaleString()}
                  </span>

                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-700"
                    style={{
                      width: `${issuePendingPercentage}%`,
                    }}
                  />

                </div>

              </div>

              <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                    <FaCheckCircle />
                  </div>

                  <div>

                    <p className="text-xs text-slate-500">
                      Processed
                    </p>

                    <p className="font-semibold text-slate-800">
                      {Math.max(
                        totalIssues -
                          pendingIssues,
                        0
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

                <FaArrowRight className="text-blue-400" />

              </div>

            </div>
          </div>

          {/* Return Overview */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-[#890C25] transition-all duration-500 group-hover:w-full" />

            <div className="mb-6 flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-[#890C25]">
                  Return Activity
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  Return Overview
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                <FaUndoAlt />
              </div>

            </div>

            <div className="space-y-5">

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-sm font-medium text-slate-600">
                    Total Returns
                  </span>

                  <span className="font-bold text-slate-800">
                    {totalReturns.toLocaleString()}
                  </span>

                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

                  <div className="h-full w-full rounded-full bg-[#890C25]" />

                </div>

              </div>

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                    <FaClock className="text-amber-500" />
                    Pending Returns
                  </span>

                  <span className="font-bold text-amber-600">
                    {pendingReturns.toLocaleString()}
                  </span>

                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-700"
                    style={{
                      width: `${returnPendingPercentage}%`,
                    }}
                  />

                </div>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-emerald-50 p-4">

                  <div className="flex items-center gap-2 text-emerald-600">

                    <FaCheckCircle />

                    <span className="text-xs font-medium">
                      Completed
                    </span>

                  </div>

                  <p className="mt-2 text-xl font-bold text-slate-800">
                    {completedReturns.toLocaleString()}
                  </p>

                </div>

                <div className="rounded-xl bg-red-50 p-4">

                  <div className="flex items-center gap-2 text-red-600">

                    <FaExclamationCircle />

                    <span className="text-xs font-medium">
                      Rejected
                    </span>

                  </div>

                  <p className="mt-2 text-xl font-bold text-slate-800">
                    {rejectedReturns.toLocaleString()}
                  </p>

                </div>

              </div>

            </div>
          </div>

        </section>

        {/* ======================================================
            USER DISTRIBUTION + DIGITAL LIBRARY
        ======================================================= */}

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* User Distribution */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-[#890C25] transition-all duration-500 group-hover:w-full" />

            <div className="mb-6 flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-[#890C25]">
                  People
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  User Distribution
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                <FaUsers />
              </div>

            </div>

            {normalizedRoleStats.length >
            0 ? (
              <div className="space-y-4">

                {normalizedRoleStats
                  .slice(0, 6)
                  .map(
                    (item, index) => {

                      const percentage =
                        totalUsers > 0
                          ? Math.min(
                              (Number(
                                item.count
                              ) /
                                totalUsers) *
                                100,
                              100
                            )
                          : 0;

                      return (
                        <div
                          key={`${item.role}-${index}`}
                        >

                          <div className="mb-2 flex items-center justify-between">

                            <div className="flex items-center gap-2">

                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm text-[#890C25]">
                                {getRoleIcon(
                                  item.role
                                )}
                              </div>

                              <span className="text-sm font-medium text-slate-700">
                                {formatRole(
                                  item.role
                                )}
                              </span>

                            </div>

                            <span className="text-sm font-bold text-slate-800">
                              {Number(
                                item.count
                              ).toLocaleString()}
                            </span>

                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                            <div
                              className={`h-full rounded-full ${
                                index % 2 ===
                                0
                                  ? "bg-[#890C25]"
                                  : "bg-blue-600"
                              } transition-all duration-700`}
                              style={{
                                width: `${percentage}%`,
                              }}
                            />

                          </div>

                        </div>
                      );
                    }
                  )}

              </div>
            ) : (
              <div className="flex min-h-[220px] flex-col items-center justify-center text-center">

                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400">
                  <FaUsers />
                </div>

                <p className="font-medium text-slate-600">
                  No role distribution data available
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  User statistics will appear
                  here when available.
                </p>

              </div>
            )}

          </div>

          {/* Digital Library */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />

            <div className="mb-6 flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Digital Resources
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  Digital Library Snapshot
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FaLaptop />
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:bg-blue-50">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <FaBookOpen />
                </div>

                <p className="mt-4 text-xs font-medium text-slate-500">
                  Digital Books
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-800">
                  {digitalBooks.toLocaleString()}
                </p>

              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:bg-[#FDF2F4]">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#890C25] shadow-sm">
                  <FaEye />
                </div>

                <p className="mt-4 text-xs font-medium text-slate-500">
                  Total Views
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-800">
                  {digitalViews.toLocaleString()}
                </p>

              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:bg-[#FDF2F4]">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#890C25] shadow-sm">
                  <FaDownload />
                </div>

                <p className="mt-4 text-xs font-medium text-slate-500">
                  Downloads
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-800">
                  {digitalDownloads.toLocaleString()}
                </p>

              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:bg-blue-50">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <FaChartLine />
                </div>

                <p className="mt-4 text-xs font-medium text-slate-500">
                  Total Engagement
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-800">
                  {(
                    digitalViews +
                    digitalDownloads
                  ).toLocaleString()}
                </p>

              </div>

            </div>
          </div>

        </section>

        {/* ======================================================
            QUICK ACTIONS
        ======================================================= */}

        <section className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">

          <div className="absolute left-0 top-0 h-1 w-0 bg-[#890C25] transition-all duration-500 group-hover:w-full" />

          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-[#890C25]">
                Quick Navigation
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">
                Quick Actions
              </h2>

            </div>

            <FaClipboardList className="text-xl text-slate-300" />

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {quickActions.map(
              (action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className="group/action relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:bg-white hover:shadow-lg"
                >

                  <div className="absolute left-0 top-0 h-1 w-0 bg-[#890C25] transition-all duration-500 group-hover/action:w-full" />

                  <div className="flex items-center justify-between">

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.bgClass} ${action.iconClass} text-lg transition-transform duration-300 group-hover/action:scale-110`}
                    >
                      {action.icon}
                    </div>

                    <FaArrowRight className="text-slate-300 transition-all duration-300 group-hover/action:translate-x-1 group-hover/action:text-[#890C25]" />

                  </div>

                  <h3 className="mt-4 font-semibold text-slate-800">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {action.description}
                  </p>

                </Link>
              )
            )}

          </div>
        </section>

        {/* ======================================================
            ACADEMIC OVERSIGHT
        ======================================================= */}

        <section className="relative overflow-hidden rounded-3xl border border-[#D58A98]/20 bg-gradient-to-r from-[#FDF2F4] via-white to-blue-50 p-6 shadow-sm md:p-7">

          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-[#890C25]/10 bg-[#890C25]/5" />

          <div className="absolute -bottom-12 left-1/3 h-40 w-40 rounded-full border border-blue-500/10 bg-blue-500/5" />

          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                <FaUniversity />
              </div>

              <div>

                <h3 className="text-lg font-bold text-slate-800">
                  Academic & Resource Oversight
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  Use the available reports and
                  system analytics to monitor
                  users, learning resources,
                  library activity and digital
                  engagement across the
                  institution.
                </p>

              </div>

            </div>

            <Link
              to="/reports"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#890C25] px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#76091F]"
            >
              Open Analytics
              <FaArrowRight />
            </Link>

          </div>
        </section>

        {/* ======================================================
            FOOTER
        ======================================================= */}

        <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row">

          <div className="flex items-center gap-2">
            <FaUniversity className="text-[#890C25]" />

            <span>
              Learning Management System
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FaCalendarAlt />

            <span>
              HOD Academic Overview
            </span>
          </div>

        </footer>

      </div>
    </div>
  );
};

export default HODDashboard;