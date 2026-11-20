
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import {
  FaBook,
  FaBookOpen,
  FaExchangeAlt,
  FaUndoAlt,
  FaChartBar,
  FaUserTie,
  FaBell,
  FaArrowRight,
  FaUsers,
  FaChartLine,
  FaClock,
  FaUniversity,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { useReports } from "../../context/ReportContext";

const StaffDashboard = () => {
  const { user } = useAuth();

  // =====================================================
  // REPORT CONTEXT
  // =====================================================

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
  } = useReports();

  // =====================================================
  // LOAD DASHBOARD REPORTS
  // =====================================================

  useEffect(() => {
    const loadDashboard = async () => {
      const reportRequests = [
        getOverviewReport(),
        getUsersReport(),
        getBooksReport(),
        getIssuesReport(),
        getReturnsReport(),
        getDigitalLibraryReport(),
      ];

      const results = await Promise.allSettled(reportRequests);

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(
            `Staff Dashboard report ${index + 1} error:`,
            result.reason
          );
        }
      });
    };

    loadDashboard();
  }, [
    getOverviewReport,
    getUsersReport,
    getBooksReport,
    getIssuesReport,
    getReturnsReport,
    getDigitalLibraryReport,
  ]);

  // =====================================================
  // SAFE NUMBER HELPER
  // =====================================================

  const getNumber = (...values) => {
    for (const value of values) {
      if (
        typeof value === "number" &&
        !Number.isNaN(value)
      ) {
        return value;
      }

      if (
        typeof value === "string" &&
        value.trim() !== ""
      ) {
        const number = Number(value);

        if (!Number.isNaN(number)) {
          return number;
        }
      }
    }

    return 0;
  };

  // =====================================================
  // FORMAT NUMBER
  // =====================================================

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString();
  };

  // =====================================================
  // REPORT STRUCTURES
  // =====================================================

  const overview = useMemo(() => {
    return (
      overviewReport?.report ||
      overviewReport ||
      {}
    );
  }, [overviewReport]);

  const usersSummary = useMemo(() => {
    return (
      usersReport?.summary ||
      usersReport?.report?.summary ||
      usersReport?.data?.summary ||
      {}
    );
  }, [usersReport]);

  const booksSummary = useMemo(() => {
    return (
      booksReport?.summary ||
      booksReport?.report?.summary ||
      booksReport?.data?.summary ||
      {}
    );
  }, [booksReport]);

  const issuesSummary = useMemo(() => {
    return (
      issuesReport?.summary ||
      issuesReport?.report?.summary ||
      issuesReport?.data?.summary ||
      {}
    );
  }, [issuesReport]);

  const returnsSummary = useMemo(() => {
    return (
      returnsReport?.summary ||
      returnsReport?.report?.summary ||
      returnsReport?.data?.summary ||
      {}
    );
  }, [returnsReport]);

  const digitalSummary = useMemo(() => {
    return (
      digitalLibraryReport?.summary ||
      digitalLibraryReport?.report?.summary ||
      digitalLibraryReport?.data?.summary ||
      {}
    );
  }, [digitalLibraryReport]);

  // =====================================================
  // DASHBOARD DATA
  // =====================================================

  const totalUsers = getNumber(
    overview?.users?.total,
    usersSummary?.totalUsers
  );

  const totalBooks = getNumber(
    overview?.books?.total,
    booksSummary?.totalBooks
  );

  const availableBooks = getNumber(
    booksSummary?.availableCopies,
    overview?.books?.availableCopies
  );

  const totalIssues = getNumber(
    overview?.issues?.total,
    issuesSummary?.totalIssues
  );

  const pendingIssues = getNumber(
    overview?.issues?.pending,
    issuesSummary?.pending
  );

  const totalReturns = getNumber(
    overview?.returns?.total,
    returnsSummary?.totalReturns
  );

  const pendingReturns = getNumber(
    overview?.returns?.pending,
    returnsSummary?.pending
  );

  const completedReturns = getNumber(
    overview?.returns?.completed,
    returnsSummary?.completed,
    totalReturns - pendingReturns
  );

  const digitalBooks = getNumber(
    overview?.digitalLibrary?.total,
    digitalSummary?.totalBooks
  );

  const digitalViews = getNumber(
    overview?.digitalLibrary?.totalViews,
    digitalSummary?.totalViews
  );

  // =====================================================
  // MAIN STAT CARDS
  // =====================================================

  const statCards = [
    {
      title: "Total Books",
      value: formatNumber(totalBooks),
      subtitle: "Library collection",
      icon: FaBook,
      bg: "from-[#890C25] to-[#5f0719]",
      iconBg: "bg-white/15",
    },
    {
      title: "Available Books",
      value: formatNumber(availableBooks),
      subtitle: "Currently available",
      icon: FaBookOpen,
      bg: "from-blue-600 to-blue-800",
      iconBg: "bg-white/15",
    },
    {
      title: "Book Issues",
      value: formatNumber(totalIssues),
      subtitle: `${formatNumber(
        pendingIssues
      )} pending`,
      icon: FaExchangeAlt,
      bg: "from-slate-700 to-slate-900",
      iconBg: "bg-white/10",
    },
    {
      title: "Returns",
      value: formatNumber(totalReturns),
      subtitle: `${formatNumber(
        pendingReturns
      )} pending`,
      icon: FaUndoAlt,
      bg: "from-[#D58A98] to-[#a94f64]",
      iconBg: "bg-white/20",
    },
  ];

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="relative w-full min-w-0 overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">

      {/* =================================================
          BACKGROUND CIRCLES
      ================================================= */}

      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#890C25]/10 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#D58A98]/10 blur-3xl" />

      <div className="pointer-events-none absolute right-[12%] bottom-[18%] h-52 w-52 rounded-full border border-[#890C25]/10 bg-[#890C25]/5 backdrop-blur-sm" />

      <div className="pointer-events-none absolute left-[8%] top-[45%] h-32 w-32 rounded-full border border-blue-500/10 bg-blue-500/5 backdrop-blur-sm" />

      <div className="relative z-10 mx-auto w-full mt-6 max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="group relative mb-6   overflow-hidden rounded-3xl border border-[#D58A98]/30 bg-gradient-to-br from-[#890C25] via-[#76091F] to-[#5F0719] p-6 shadow-xl">

          <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-white via-[#D58A98] to-blue-400 transition-all duration-700 group-hover:w-full  " />

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between ">

            <div>

              <div className="mb-2 flex items-center gap-3 ">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl text-white shadow-lg backdrop-blur-sm">
                  <FaUserTie />
                </div>

                <div>

                  <p className="text-sm font-semibold uppercase tracking-wider text-[#D58A98]">
                    Learning Management System
                  </p>

                  <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
                    Staff Dashboard
                  </h1>

                </div>

              </div>

              <p className="text-sm text-white/80 sm:text-base">
                Welcome back,{" "}
                <span className="font-semibold text-white">
                  {user?.name || "Staff Member"}
                </span>
              </p>

              <p className="mt-1 text-sm text-white/60">
                Monitor library activities, books,
                issues and returns from your staff portal.
              </p>

            </div>

            {/* TOTAL USERS */}

            <div className="group/users relative shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/10 px-7 py-5 text-center shadow-lg backdrop-blur-sm">

              <div className="absolute left-0 top-0 h-1 w-0 bg-blue-400 transition-all duration-500 group-hover/users:w-full" />

              <FaUsers className="mx-auto mb-2 text-2xl text-green-400" />

              <p className="text-xs uppercase tracking-wider text-white/60">
                Total Users
              </p>

              <p className="mt-1 text-3xl font-bold text-white">
                {formatNumber(totalUsers)}
              </p>

            </div>

          </div>
        </div>

        {/* =================================================
            MAIN STATS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {statCards.map((stat) => {

            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${stat.bg} p-6 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
              >

                <div className="absolute left-0 top-0 h-1 w-0 bg-white transition-all duration-500 group-hover:w-full" />

                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-150" />

                <div className="relative z-10">

                  <div className="mb-5 flex items-center justify-between">

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.iconBg} text-xl text-white`}
                    >
                      <Icon />
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      Staff
                    </span>

                  </div>

                  <p className="text-sm font-medium text-white/75">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-extrabold text-white">
                    {stat.value}
                  </h2>

                  <p className="mt-2 text-xs text-white/70">
                    {stat.subtitle}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

        {/* =================================================
            SECONDARY STATS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL ISSUES */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-[#890C25] transition-all duration-500 group-hover:w-full" />

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                <FaExchangeAlt />
              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Issues
                </p>

                <p className="text-2xl font-bold text-slate-800">
                  {formatNumber(totalIssues)}
                </p>

              </div>

            </div>
          </div>

          {/* PENDING ISSUES */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                <FaClock />
              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Pending Issues
                </p>

                <p className="text-2xl font-bold text-slate-800">
                  {formatNumber(pendingIssues)}
                </p>

              </div>

            </div>
          </div>

          {/* TOTAL RETURNS */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-[#890C25] transition-all duration-500 group-hover:w-full" />

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                <FaUndoAlt />
              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Returns
                </p>

                <p className="text-2xl font-bold text-slate-800">
                  {formatNumber(totalReturns)}
                </p>

              </div>

            </div>
          </div>

          {/* TOTAL BOOKS */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                <FaBookOpen />
              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Books
                </p>

                <p className="text-2xl font-bold text-slate-800">
                  {formatNumber(totalBooks)}
                </p>

              </div>

            </div>
          </div>

        </div>

        {/* =================================================
            ACTIVITY OVERVIEW
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* LIBRARY ACTIVITY */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg lg:col-span-2">

            <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-[#890C25] to-[#D58A98] transition-all duration-500 group-hover:w-full" />

            <div className="mb-6 flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-widest text-[#890C25]">
                  Library Overview
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  Current Library Activity
                </h2>

              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                <FaChartLine />
              </div>

            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

              {/* USERS */}

              <div className="rounded-2xl bg-slate-50 p-5">

                <div className="mb-3 flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                    <FaUsers />
                  </div>

                  <span className="text-sm font-semibold text-slate-500">
                    Registered Users
                  </span>

                </div>

                <p className="text-2xl font-extrabold text-slate-800">
                  {formatNumber(totalUsers)}
                </p>

              </div>

              {/* BOOKS */}

              <div className="rounded-2xl bg-blue-50 p-5">

                <div className="mb-3 flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                    <FaBookOpen />
                  </div>

                  <span className="text-sm font-semibold text-slate-500">
                    Library Books
                  </span>

                </div>

                <p className="text-2xl font-extrabold text-slate-800">
                  {formatNumber(totalBooks)}
                </p>

              </div>

              {/* AVAILABLE */}

              <div className="rounded-2xl bg-rose-50 p-5">

                <div className="mb-3 flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D58A98]/20 text-[#890C25]">
                    <FaBook />
                  </div>

                  <span className="text-sm font-semibold text-slate-500">
                    Available Books
                  </span>

                </div>

                <p className="text-2xl font-extrabold text-slate-800">
                  {formatNumber(availableBooks)}
                </p>

              </div>

            </div>

          </div>

          {/* DIGITAL LIBRARY */}

          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#890C25] via-[#76091f] to-slate-950 p-6 shadow-xl">

            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-125" />

            <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-125" />

            <div className="relative z-10">

              <div className="mb-6 flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                    Digital Library
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white">
                    Digital Activity
                  </h2>

                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                  <FaBookOpen />
                </div>

              </div>

              <div className="space-y-4">

                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">

                  <p className="text-xs font-medium text-white/60">
                    Digital Books
                  </p>

                  <p className="mt-1 text-3xl font-extrabold text-white">
                    {formatNumber(digitalBooks)}
                  </p>

                </div>

                <div className="rounded-2xl bg-white/10 p-4">

                  <p className="text-xs text-white/60">
                    Total Views
                  </p>

                  <p className="mt-1 text-2xl font-bold text-white">
                    {formatNumber(digitalViews)}
                  </p>

                </div>

              </div>

            </div>
          </div>

        </div>

        {/* =================================================
            ACTIVITY ANALYTICS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* ISSUES */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">

            <div className="absolute left-0 top-0 h-1 w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />

            <div className="mb-6 flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  Issue Analytics
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  Library Issue Activity
                </h2>

              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                <FaExchangeAlt />
              </div>

            </div>

            <div className="space-y-5">

              {/* TOTAL */}

              <div>

                <div className="mb-2 flex justify-between">

                  <span className="text-sm font-semibold text-slate-600">
                    Total Issues
                  </span>

                  <span className="font-bold text-slate-800">
                    {formatNumber(totalIssues)}
                  </span>

                </div>

                <div className="h-2.5 rounded-full bg-slate-100">

                  <div className="h-full w-full rounded-full bg-blue-600" />

                </div>

              </div>

              {/* PENDING */}

              <div>

                <div className="mb-2 flex justify-between">

                  <span className="text-sm font-semibold text-slate-600">
                    Pending Issues
                  </span>

                  <span className="font-bold text-[#890C25]">
                    {formatNumber(pendingIssues)}
                  </span>

                </div>

                <div className="h-2.5 rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-[#890C25] transition-all duration-700"
                    style={{
                      width: `${
                        totalIssues
                          ? Math.min(
                              (pendingIssues /
                                totalIssues) *
                                100,
                              100
                            )
                          : 0
                      }%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* RETURNS */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">

            <div className="absolute left-0 top-0 h-1 w-0 bg-[#890C25] transition-all duration-500 group-hover:w-full" />

            <div className="mb-6 flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-widest text-[#890C25]">
                  Return Analytics
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  Book Return Activity
                </h2>

              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                <FaUndoAlt />
              </div>

            </div>

            <div className="grid grid-cols-3 gap-3">

              {/* TOTAL */}

              <div className="rounded-2xl bg-slate-50 p-4 text-center">

                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                  <FaUndoAlt />
                </div>

                <p className="text-xl font-extrabold text-slate-800">
                  {formatNumber(totalReturns)}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Total
                </p>

              </div>

              {/* PENDING */}

              <div className="rounded-2xl bg-blue-50 p-4 text-center">

                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                  <FaClock />
                </div>

                <p className="text-xl font-extrabold text-slate-800">
                  {formatNumber(pendingReturns)}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Pending
                </p>

              </div>

              {/* COMPLETED */}

              <div className="rounded-2xl bg-rose-50 p-4 text-center">

                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#D58A98]/20 text-[#890C25]">
                  <FaChartBar />
                </div>

                <p className="text-xl font-extrabold text-slate-800">
                  {formatNumber(
                    completedReturns >= 0
                      ? completedReturns
                      : 0
                  )}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Completed
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            STAFF PROFILE
        ================================================= */}

        <div className="mb-6 group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">

          <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-[#890C25] via-[#D58A98] to-blue-600 transition-all duration-500 group-hover:w-full" />

          <div className="mb-6 flex items-center justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-widest text-[#890C25]">
                Staff Profile
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">
                Staff Portal Information
              </h2>

            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
              <FaUserTie />
            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            {/* NAME */}

            <div className="rounded-2xl bg-slate-50 p-5">

              <div className="mb-3 flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                  <FaUserTie />
                </div>

                <span className="text-sm font-semibold text-slate-500">
                  Staff Name
                </span>

              </div>

              <p className="text-xl font-extrabold text-slate-800">
                {user?.name || "Staff Member"}
              </p>

            </div>

            {/* ROLE */}

            <div className="rounded-2xl bg-blue-50 p-5">

              <div className="mb-3 flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                  <FaUniversity />
                </div>

                <span className="text-sm font-semibold text-slate-500">
                  Role
                </span>

              </div>

              <p className="text-xl font-extrabold capitalize text-slate-800">
                {user?.role || "Staff"}
              </p>

            </div>

            {/* PENDING ACTIVITY */}

            <div className="rounded-2xl bg-rose-50 p-5">

              <div className="mb-3 flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D58A98]/20 text-[#890C25]">
                  <FaChartBar />
                </div>

                <span className="text-sm font-semibold text-slate-500">
                  Pending Activity
                </span>

              </div>

              <p className="text-2xl font-extrabold text-slate-800">
                {formatNumber(
                  pendingIssues +
                    pendingReturns
                )}
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="mb-6">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-widest text-[#890C25]">
                Quick Access
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">
                Staff Actions
              </h2>

            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
              <FaBell />
            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

            {/* BOOKS */}

            <Link
              to="/books"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#890C25] to-[#65091b] p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >

              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-150" />

              <div className="relative z-10 flex items-center justify-between gap-4">

                <div>

                  <p className="text-lg font-bold text-white">
                    Books
                  </p>

                  <p className="mt-1 text-sm text-white/60">
                    Browse library collection
                  </p>

                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition-transform duration-300 group-hover:translate-x-1">
                  <FaArrowRight />
                </div>

              </div>

            </Link>

            {/* ISSUES */}

            <Link
              to="/issues"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >

              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-150" />

              <div className="relative z-10 flex items-center justify-between gap-4">

                <div>

                  <p className="text-lg font-bold text-white">
                    Issues
                  </p>

                  <p className="mt-1 text-sm text-white/60">
                    Monitor book issue activity
                  </p>

                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition-transform duration-300 group-hover:translate-x-1">
                  <FaArrowRight />
                </div>

              </div>

            </Link>

            {/* RETURNS */}

            <Link
              to="/return-books"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#890C25] to-[#65091b] p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >

              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-150" />

              <div className="relative z-10 flex items-center justify-between gap-4">

                <div>

                  <p className="text-lg font-bold text-white">
                    Returns
                  </p>

                  <p className="mt-1 text-sm text-white/60">
                    Monitor return activity
                  </p>

                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition-transform duration-300 group-hover:translate-x-1">
                  <FaArrowRight />
                </div>

              </div>

            </Link>

            {/* DIGITAL LIBRARY */}

            <Link
              to="/digital-library"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >

              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-150" />

              <div className="relative z-10 flex items-center justify-between gap-4">

                <div>

                  <p className="text-lg font-bold text-white">
                    Digital Library
                  </p>

                  <p className="mt-1 text-sm text-white/60">
                    Access digital resources
                  </p>

                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition-transform duration-300 group-hover:translate-x-1">
                  <FaArrowRight />
                </div>

              </div>

            </Link>

          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="pb-4 text-center">

          <p className="text-xs font-medium text-slate-400">
            LMS Staff Dashboard • Powered by Existing Reports
          </p>

        </div>

      </div>
    </div>
  );
};

export default StaffDashboard;

