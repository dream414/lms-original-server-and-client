import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaBookOpen,
  FaClipboardList,
  FaUndo,
  FaMoneyBillWave,
  FaUsers,
  FaChartLine,
  FaArrowRight,
  FaSyncAlt,
  FaCheckCircle,
  FaClock,
  FaLayerGroup,
  FaExclamationCircle,
  FaPlus,
  FaSearch,
  FaCalendarAlt,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { useReports } from "../../context/ReportContext";

const LibrarianDashboard = () => {
  const { user } = useAuth();

  const {
    overviewReport,
    issuesReport,
    returnsReport,
    finesReport,
    booksReport,
    getOverviewReport,
    getIssuesReport,
    getReturnsReport,
    getFinesReport,
    getBooksReport,
    loading,
  } = useReports();

  useEffect(() => {
    getOverviewReport();
    getIssuesReport();
    getReturnsReport();
    getFinesReport();
    getBooksReport();
  }, []);

  const overview = overviewReport || {};
  const issues = issuesReport?.summary || {};
  const returns = returnsReport?.summary || {};
  const fines = finesReport?.summary || {};
  const books = booksReport?.summary || {};

  const formatNumber = (value) =>
    Number(value || 0).toLocaleString();

  const formatAmount = (value) =>
    `Rs. ${Number(value || 0).toLocaleString()}`;

  const totalBooks =
    books.totalBooks ?? overview.books?.total ?? 0;

  const activeBooks =
    books.activeBooks ?? overview.books?.active ?? 0;

  const inactiveBooks =
    books.inactiveBooks ?? overview.books?.inactive ?? 0;

  const availableCopies =
    books.availableCopies ?? 0;

  const totalQuantity =
    books.totalQuantity ?? 0;

  const totalIssues =
    issues.totalIssues ?? overview.issues?.total ?? 0;

  const pendingIssues =
    issues.pending ?? overview.issues?.pending ?? 0;

  const returnedIssues =
    issues.returned ?? 0;

  const totalReturns =
    returns.totalReturns ?? overview.returns?.total ?? 0;

  const pendingReturns =
    returns.pending ?? overview.returns?.pending ?? 0;

  const completedReturns =
    returns.completed ?? 0;

  const rejectedReturns =
    returns.rejected ?? 0;

  const totalFines =
    fines.totalFines ?? overview.fines?.total ?? 0;

  const totalFineAmount =
    fines.totalAmount ??
    overview.fines?.totalAmount ??
    0;

  const paidFines =
    fines.paidFines ?? 0;

  const unpaidFines =
    fines.unpaidFines ?? 0;

  const totalUsers =
    overview.users?.total ?? 0;

  const issueCompletion = useMemo(() => {
    if (!totalIssues) return 0;

    return Math.round(
      ((totalIssues - pendingIssues) / totalIssues) * 100
    );
  }, [totalIssues, pendingIssues]);

  const returnCompletion = useMemo(() => {
    if (!totalReturns) return 0;

    return Math.round(
      (completedReturns / totalReturns) * 100
    );
  }, [totalReturns, completedReturns]);

  const availablePercentage = useMemo(() => {
    if (!totalQuantity) return 0;

    return Math.min(
      Math.round((availableCopies / totalQuantity) * 100),
      100
    );
  }, [availableCopies, totalQuantity]);

  const refreshDashboard = async () => {
    await Promise.all([
      getOverviewReport(),
      getIssuesReport(),
      getReturnsReport(),
      getFinesReport(),
      getBooksReport(),
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#FFF5F7] px-4 py-6 sm:px-6 lg:px-8 mt-6 ">

      {/* =====================================================
          HERO HEADER
      ====================================================== */}
      <section className="group relative mb-8 overflow-hidden rounded-[30px] border border-[#D58A98]/30 bg-gradient-to-br from-[#890C25] via-[#76091F] to-[#520615] p-6 shadow-[0_20px_60px_rgba(137,12,37,0.20)] sm:p-8 lg:p-9">

        {/* Animated Top Line */}
        <div className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden">
          <div className="h-full w-0 bg-gradient-to-r from-white via-[#D58A98] to-blue-400 transition-all duration-700 group-hover:w-full" />
        </div>

        {/* Decorative Circles */}
        <div className="absolute -right-20 -top-20 h-64 w-64 animate-pulse rounded-full border border-white/10 bg-white/5 blur-2xl" />

        <div className="absolute -bottom-24 left-[35%] h-64 w-64 rounded-full border border-[#D58A98]/10 bg-[#D58A98]/10 blur-3xl" />

        <div className="absolute right-[25%] top-10 h-24 w-24 rounded-full bg-blue-400/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-5">

            <div className="relative">

              <div className="absolute inset-0 rounded-3xl bg-white/20 blur-xl" />

              <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-3xl border border-white/20 bg-white/15 text-3xl text-white shadow-xl backdrop-blur-md">
                <FaBook />
              </div>

            </div>

            <div>

              <div className="mb-2 flex items-center gap-2">

                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F3C4CE]">
                  Library Management System
                </span>

              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Librarian Dashboard
              </h1>

              <p className="mt-2 text-sm text-white/75">
                Welcome back,{" "}
                <span className="font-bold text-white">
                  {user?.name ||
                    user?.fullName ||
                    "Librarian"}
                </span>
                . Manage your library efficiently.
              </p>

            </div>

          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 backdrop-blur-md">

              <FaCalendarAlt className="text-[#D58A98]" />

              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/50">
                  Dashboard
                </p>

                <p className="text-sm font-semibold text-white">
                  Library Overview
                </p>
              </div>

            </div>

            <button
              onClick={refreshDashboard}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#890C25] shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-[#FBECEF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaSyncAlt
                className={loading ? "animate-spin" : ""}
              />
              {loading ? "Refreshing..." : "Refresh"}
            </button>

          </div>

        </div>
      </section>

      {/* =====================================================
          STAT CARDS
      ====================================================== */}
      <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL BOOKS */}
        <Link
          to="/books"
          className="group relative overflow-hidden rounded-[26px] border border-blue-100 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(37,99,235,0.12)]"
        >

          <div className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden">
            <div className="h-full w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />
          </div>

          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl transition duration-500 group-hover:scale-150" />

          <div className="relative z-10 flex items-start justify-between">

            <div>

              <p className="text-sm font-semibold text-slate-500">
                Total Books
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-800">
                {formatNumber(totalBooks)}
              </h2>

              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-blue-600">
                <FaCheckCircle />
                Active library collection
              </div>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl text-blue-600 shadow-inner transition duration-300 group-hover:rotate-6 group-hover:scale-110">
              <FaBook />
            </div>

          </div>

          <div className="relative mt-5 flex items-center gap-2 text-xs font-bold text-slate-400 transition group-hover:text-blue-600">
            View Books
            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
          </div>

        </Link>

        {/* ISSUED BOOKS */}
        <Link
          to="/issues"
          className="group relative overflow-hidden rounded-[26px] border border-[#D58A98]/30 bg-gradient-to-br from-[#890C25] via-[#78091F] to-[#610718] p-6 shadow-[0_15px_40px_rgba(137,12,37,0.16)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(137,12,37,0.22)]"
        >

          <div className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-r from-white to-[#D58A98] transition-all duration-500 group-hover:w-full" />
          </div>

          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl transition duration-500 group-hover:scale-150" />

          <div className="relative z-10 flex items-start justify-between">

            <div>

              <p className="text-sm font-semibold text-white/65">
                Issued Books
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                {formatNumber(totalIssues)}
              </h2>

              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#F3C4CE]">
                <FaBookOpen />
                {formatNumber(pendingIssues)} pending issues
              </div>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-xl text-white backdrop-blur-md transition duration-300 group-hover:rotate-6 group-hover:scale-110">
              <FaBookOpen />
            </div>

          </div>

          <div className="relative mt-5 flex items-center gap-2 text-xs font-bold text-white/60 transition group-hover:text-white">
            Manage Issues
            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
          </div>

        </Link>

        {/* RETURNS */}
        <Link
          to="/returns"
          className="group relative overflow-hidden rounded-[26px] border border-blue-100 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(37,99,235,0.12)]"
        >

          <div className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden">
            <div className="h-full w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />
          </div>

          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl transition duration-500 group-hover:scale-150" />

          <div className="relative z-10 flex items-start justify-between">

            <div>

              <p className="text-sm font-semibold text-slate-500">
                Pending Returns
              </p>

              <h2 className="mt-3 text-3xl font-black text-blue-600">
                {formatNumber(pendingReturns)}
              </h2>

              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <FaClock className="text-blue-600" />
                Awaiting librarian action
              </div>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl text-blue-600 transition duration-300 group-hover:rotate-6 group-hover:scale-110">
              <FaUndo />
            </div>

          </div>

          <div className="relative mt-5 flex items-center gap-2 text-xs font-bold text-slate-400 transition group-hover:text-blue-600">
            Manage Returns
            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
          </div>

        </Link>

        {/* FINES */}
        <Link
          to="/fines"
          className="group relative overflow-hidden rounded-[26px] border border-[#D58A98]/30 bg-gradient-to-br from-[#890C25] via-[#78091F] to-[#610718] p-6 shadow-[0_15px_40px_rgba(137,12,37,0.16)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(137,12,37,0.22)]"
        >

          <div className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-r from-white to-blue-400 transition-all duration-500 group-hover:w-full" />
          </div>

          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl transition duration-500 group-hover:scale-150" />

          <div className="relative z-10 flex items-start justify-between">

            <div>

              <p className="text-sm font-semibold text-white/65">
                Fine Amount
              </p>

              <h2 className="mt-3 text-2xl font-black text-white">
                {formatAmount(totalFineAmount)}
              </h2>

              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#F3C4CE]">
                <FaMoneyBillWave />
                {formatNumber(unpaidFines)} unpaid
              </div>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-xl text-white backdrop-blur-md transition duration-300 group-hover:rotate-6 group-hover:scale-110">
              <FaMoneyBillWave />
            </div>

          </div>

          <div className="relative mt-5 flex items-center gap-2 text-xs font-bold text-white/60 transition group-hover:text-white">
            Manage Fines
            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
          </div>

        </Link>

      </section>

      {/* =====================================================
          SMALL INFORMATION CARDS
      ====================================================== */}
      <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">

        {[
          {
            title: "Active Books",
            value: activeBooks,
            icon: <FaCheckCircle />,
          },
          {
            title: "Available Copies",
            value: availableCopies,
            icon: <FaLayerGroup />,
          },
          {
            title: "Completed Returns",
            value: completedReturns,
            icon: <FaUndo />,
          },
          {
            title: "Library Users",
            value: totalUsers,
            icon: <FaUsers />,
          },
        ].map((item) => (
          <div
            key={item.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >

            <div className="absolute left-0 right-0 top-0 h-[2px]">
              <div className="h-full w-0 bg-[#890C25] transition-all duration-500 group-hover:w-full" />
            </div>

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25] transition group-hover:scale-110">
                {item.icon}
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  {item.title}
                </p>

                <p className="mt-1 text-xl font-black text-slate-800">
                  {formatNumber(item.value)}
                </p>
              </div>

            </div>

          </div>
        ))}

      </section>

      {/* =====================================================
          ANALYTICS
      ====================================================== */}
      <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* ISSUE ANALYTICS */}
        <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

          <div className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden">
            <div className="h-full w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />
          </div>

          <div className="mb-7 flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Analytics
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-800">
                Issue Performance
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Current book issue activity
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FaChartLine />
            </div>

          </div>

          <div className="grid grid-cols-3 gap-3">

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11px] font-medium text-slate-500">
                Total
              </p>

              <p className="mt-2 text-xl font-black text-slate-800">
                {formatNumber(totalIssues)}
              </p>
            </div>

            <div className="rounded-2xl bg-[#FFF3F5] p-4">
              <p className="text-[11px] font-medium text-slate-500">
                Pending
              </p>

              <p className="mt-2 text-xl font-black text-[#890C25]">
                {formatNumber(pendingIssues)}
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="text-[11px] font-medium text-slate-500">
                Returned
              </p>

              <p className="mt-2 text-xl font-black text-blue-600">
                {formatNumber(returnedIssues)}
              </p>
            </div>

          </div>

          <div className="mt-7">

            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Issue Completion
              </span>

              <span className="text-xs font-black text-blue-600">
                {issueCompletion}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-1000"
                style={{
                  width: `${issueCompletion}%`,
                }}
              />

            </div>

          </div>

        </div>

        {/* RETURN ANALYTICS */}
        <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

          <div className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden">
            <div className="h-full w-0 bg-[#890C25] transition-all duration-500 group-hover:w-full" />
          </div>

          <div className="mb-7 flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#890C25]">
                Analytics
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-800">
                Return Performance
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Current book return activity
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#890C25]/10 text-[#890C25]">
              <FaUndo />
            </div>

          </div>

          <div className="grid grid-cols-3 gap-3">

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11px] font-medium text-slate-500">
                Total
              </p>

              <p className="mt-2 text-xl font-black text-slate-800">
                {formatNumber(totalReturns)}
              </p>
            </div>

            <div className="rounded-2xl bg-[#FFF3F5] p-4">
              <p className="text-[11px] font-medium text-slate-500">
                Pending
              </p>

              <p className="mt-2 text-xl font-black text-[#890C25]">
                {formatNumber(pendingReturns)}
              </p>
            </div>

            <div className="rounded-2xl bg-green-50 p-4">
              <p className="text-[11px] font-medium text-slate-500">
                Completed
              </p>

              <p className="mt-2 text-xl font-black text-green-600">
                {formatNumber(completedReturns)}
              </p>
            </div>

          </div>

          <div className="mt-7">

            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Return Completion
              </span>

              <span className="text-xs font-black text-[#890C25]">
                {returnCompletion}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-[#890C25] transition-all duration-1000"
                style={{
                  width: `${returnCompletion}%`,
                }}
              />

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          LIBRARY STATUS + FINE STATUS
      ====================================================== */}
      <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* LIBRARY STATUS */}
        <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

          <div className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden">
            <div className="h-full w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />
          </div>

          <div className="mb-6 flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Library
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-800">
                Collection Status
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FaBook />
            </div>

          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs text-slate-500">
                Total Quantity
              </p>

              <p className="mt-2 text-2xl font-black text-slate-800">
                {formatNumber(totalQuantity)}
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-5">
              <p className="text-xs text-slate-500">
                Available
              </p>

              <p className="mt-2 text-2xl font-black text-blue-600">
                {formatNumber(availableCopies)}
              </p>
            </div>

          </div>

          <div>

            <div className="mb-2 flex justify-between text-xs">
              <span className="font-semibold text-slate-500">
                Available Copies
              </span>

              <span className="font-black text-blue-600">
                {availablePercentage}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-1000"
                style={{
                  width: `${availablePercentage}%`,
                }}
              />

            </div>

          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#FFF6F8] p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                <FaExclamationCircle />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Inactive Books
                </p>

                <p className="font-black text-[#890C25]">
                  {formatNumber(inactiveBooks)}
                </p>
              </div>

            </div>

            <Link
              to="/books"
              className="text-xs font-bold text-[#890C25] hover:underline"
            >
              View
            </Link>

          </div>

        </div>

        {/* FINE STATUS */}
        <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

          <div className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden">
            <div className="h-full w-0 bg-[#890C25] transition-all duration-500 group-hover:w-full" />
          </div>

          <div className="mb-6 flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#890C25]">
                Finance
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-800">
                Fine Status
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#890C25]/10 text-[#890C25]">
              <FaMoneyBillWave />
            </div>

          </div>

          <div className="mb-5 rounded-2xl bg-gradient-to-r from-[#890C25] to-[#6B081C] p-5 text-white shadow-lg">

            <p className="text-xs text-white/60">
              Total Fine Amount
            </p>

            <p className="mt-2 text-3xl font-black">
              {formatAmount(totalFineAmount)}
            </p>

            <p className="mt-2 text-xs text-white/60">
              {formatNumber(totalFines)} total fine records
            </p>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-2xl bg-green-50 p-5">

              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />

                <span className="text-xs font-semibold text-slate-500">
                  Paid
                </span>
              </div>

              <p className="mt-3 text-2xl font-black text-green-600">
                {formatNumber(paidFines)}
              </p>

            </div>

            <div className="rounded-2xl bg-[#FFF3F5] p-5">

              <div className="flex items-center gap-2">
                <FaClock className="text-[#890C25]" />

                <span className="text-xs font-semibold text-slate-500">
                  Unpaid
                </span>
              </div>

              <p className="mt-3 text-2xl font-black text-[#890C25]">
                {formatNumber(unpaidFines)}
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          QUICK ACTIONS
      ====================================================== */}
      <section className="mb-8">

        <div className="mb-5 flex items-end justify-between">

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#890C25]">
              Quick Access
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-800">
              Library Management
            </h2>
          </div>

          <div className="hidden items-center gap-2 text-xs font-medium text-slate-400 sm:flex">
            <FaSearch />
            Quick navigation
          </div>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {[
            {
              title: "Manage Books",
              description: "Add, update and manage library books",
              icon: <FaBook />,
              route: "/books",
              type: "blue",
            },
            {
              title: "Book Issues",
              description: "View and manage issued books",
              icon: <FaBookOpen />,
              route: "/issues",
              type: "maroon",
            },
            {
              title: "Return Requests",
              description: "Review pending book returns",
              icon: <FaUndo />,
              route: "/returns",
              type: "blue",
            },
            {
              title: "Fine Management",
              description: "Review library fine records",
              icon: <FaMoneyBillWave />,
              route: "/fines",
              type: "maroon",
            },
          ].map((action) => (
            <Link
              to={action.route}
              key={action.title}
              className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            >

              <div
                className={`absolute left-0 right-0 top-0 h-[3px] ${
                  action.type === "blue"
                    ? "bg-blue-600"
                    : "bg-[#890C25]"
                }`}
              />

              <div className="mb-5 flex items-center justify-between">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    action.type === "blue"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-[#890C25]/10 text-[#890C25]"
                  } text-lg transition duration-300 group-hover:scale-110 group-hover:rotate-6`}
                >
                  {action.icon}
                </div>

                <FaArrowRight
                  className={`text-sm text-slate-300 transition duration-300 group-hover:translate-x-1 ${
                    action.type === "blue"
                      ? "group-hover:text-blue-600"
                      : "group-hover:text-[#890C25]"
                  }`}
                />

              </div>

              <h3 className="font-black text-slate-800">
                {action.title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {action.description}
              </p>

            </Link>
          ))}

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="relative overflow-hidden rounded-[24px] border border-[#D58A98]/20 bg-gradient-to-r from-[#890C25]/5 via-white to-blue-600/5 p-5">

        <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#890C25]/5 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
              <FaBook />
            </div>

            <div>
              <p className="text-sm font-black text-slate-700">
                Librarian Control Center
              </p>

              <p className="text-xs text-slate-500">
                Manage your library operations from one dashboard.
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Reports connected
          </div>

        </div>

      </footer>

    </div>
  );
};

export default LibrarianDashboard;