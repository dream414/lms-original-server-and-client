import { useEffect } from "react";
import { Link } from "react-router-dom";

import {
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaExclamationCircle,
  FaCheckCircle,
  FaBook,
  FaBookOpen,
  FaClipboardList,
  FaUndo,
  FaArrowRight,
  FaSyncAlt,
  FaChartLine,
  FaClock,
  FaUniversity,
  FaCoins,
  FaHandHoldingUsd,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { useReports } from "../../context/ReportContext";

const AccountantDashboard = () => {
  const { user } = useAuth();

  const {
    overviewReport,
    issuesReport,
    returnsReport,
    finesReport,
    loading,
    error,
    getOverviewReport,
    getIssuesReport,
    getReturnsReport,
    getFinesReport,
  } = useReports();

  // =====================================================
  // LOAD REPORT DATA
  // =====================================================

  useEffect(() => {
    const loadAccountantReports = async () => {
      await Promise.all([
        getOverviewReport(),
        getIssuesReport(),
        getReturnsReport(),
        getFinesReport(),
      ]);
    };

    loadAccountantReports();
  }, []);

  // =====================================================
  // DATA
  // =====================================================

  const overview = overviewReport || {};

  const totalUsers =
    overview.users?.total || 0;

  const totalBooks =
    overview.books?.total || 0;

  const totalIssues =
    overview.issues?.total ||
    issuesReport?.summary?.totalIssues ||
    0;

  const pendingIssues =
    overview.issues?.pending ||
    issuesReport?.summary?.pending ||
    0;

  const totalReturns =
    overview.returns?.total ||
    returnsReport?.summary?.totalReturns ||
    0;

  const pendingReturns =
    overview.returns?.pending ||
    returnsReport?.summary?.pending ||
    0;

  const totalFines =
    overview.fines?.total ||
    finesReport?.summary?.totalFines ||
    0;

  const totalFineAmount =
    overview.fines?.totalAmount ||
    finesReport?.summary?.totalAmount ||
    0;

  const paidFines =
    finesReport?.summary?.paidFines || 0;

  const unpaidFines =
    finesReport?.summary?.unpaidFines || 0;

  const totalReturnFine =
    returnsReport?.summary?.totalFine || 0;

  const completedReturns =
    returnsReport?.summary?.completed || 0;

  const rejectedReturns =
    returnsReport?.summary?.rejected || 0;

  // =====================================================
  // HELPERS
  // =====================================================

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString();
  };

  const formatAmount = (value) => {
    return `Rs. ${Number(value || 0).toLocaleString()}`;
  };

  const getPercentage = (value, total) => {
    if (!total) return 0;

    return Math.round(
      (Number(value || 0) / Number(total)) * 100
    );
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const refreshDashboard = async () => {
    await Promise.all([
      getOverviewReport(),
      getIssuesReport(),
      getReturnsReport(),
      getFinesReport(),
    ]);
  };

  // =====================================================
  // STATS
  // =====================================================

  const stats = [
    {
      title: "Total Fine Amount",
      value: formatAmount(totalFineAmount),
      subtitle: "Total recorded fines",
      icon: FaMoneyBillWave,
      bg: "from-[#890C25] to-[#5f0719]",
      iconBg: "bg-white/15",
      text: "text-white",
    },
    {
      title: "Paid Fines",
      value: formatNumber(paidFines),
      subtitle: `${getPercentage(
        paidFines,
        totalFines
      )}% of total fines`,
      icon: FaCheckCircle,
      bg: "from-blue-600 to-blue-800",
      iconBg: "bg-white/15",
      text: "text-white",
    },
    {
      title: "Unpaid Fines",
      value: formatNumber(unpaidFines),
      subtitle: `${getPercentage(
        unpaidFines,
        totalFines
      )}% of total fines`,
      icon: FaExclamationCircle,
      bg: "from-slate-700 to-slate-900",
      iconBg: "bg-white/10",
      text: "text-white",
    },
    {
      title: "Total Fines",
      value: formatNumber(totalFines),
      subtitle: "Fine records",
      icon: FaFileInvoiceDollar,
      bg: "from-[#D58A98] to-[#a94f64]",
      iconBg: "bg-white/20",
      text: "text-white",
    },
  ];

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8  mt-6">

      {/* =================================================
          BACKGROUND CIRCLES
      ================================================= */}

      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#890C25]/10 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#D58A98]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

       <div className="group relative mb-6 overflow-hidden rounded-3xl border border-[#D58A98]/30 bg-gradient-to-br from-[#890C25] via-[#76091F] to-[#5F0719] p-6 shadow-xl backdrop-blur-xl">

  {/* Animated top line */}

  <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-white via-[#D58A98] to-blue-400 transition-all duration-700 group-hover:w-full" />

  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

    <div>
      <div className="mb-2 flex items-center gap-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl text-white shadow-lg backdrop-blur-sm">
          <FaUniversity />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#D58A98]">
            Library Management System
          </p>

          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
            Accountant Dashboard
          </h1>
        </div>

      </div>

      <p className="text-sm text-white/80 sm:text-base">
        Welcome back,{" "}
        <span className="font-semibold text-white">
          {user?.name || "Accountant"}
        </span>
      </p>

      <p className="mt-1 text-sm text-white/60">
        Monitor fines, payments status and library
        financial activity from reports.
      </p>
    </div>

    <button
      onClick={refreshDashboard}
      disabled={loading}
      className="group/refresh inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#890C25] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#F8E8EC] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <FaSyncAlt
        className={
          loading
            ? "animate-spin"
            : "transition-transform duration-300 group-hover/refresh:rotate-180"
        }
      />

      {loading ? "Refreshing..." : "Refresh Reports"}
    </button>

  </div>
</div>



        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 shadow-sm">
            <FaExclamationCircle />

            <div>
              <p className="font-semibold">
                Unable to load report data
              </p>

              <p className="text-sm">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            MAIN STATS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${stat.bg} p-6 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
              >

                {/* Animated top line */}

                <div className="absolute left-0 top-0 h-1 w-0 bg-white transition-all duration-500 group-hover:w-full" />

                {/* Decorative circle */}

                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-150" />

                <div className="relative z-10">

                  <div className="mb-5 flex items-center justify-between">

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.iconBg} text-xl ${stat.text}`}
                    >
                      <Icon />
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      Report
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

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-[#890C25] transition-all duration-500 group-hover:w-full" />

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                <FaClipboardList />
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

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
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

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-[#890C25] transition-all duration-500 group-hover:w-full" />

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                <FaUndo />
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

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
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
            FINANCIAL OVERVIEW
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Fine Overview */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg lg:col-span-2">

            <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-[#890C25] to-[#D58A98] transition-all duration-500 group-hover:w-full" />

            <div className="mb-6 flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#890C25]">
                  Financial Overview
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  Fine Collection Summary
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                <FaChartLine />
              </div>

            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

              <div className="rounded-2xl bg-slate-50 p-5">

                <div className="mb-3 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                    <FaCoins />
                  </div>

                  <span className="text-sm font-semibold text-slate-500">
                    Total Amount
                  </span>

                </div>

                <p className="text-2xl font-extrabold text-slate-800">
                  {formatAmount(totalFineAmount)}
                </p>

              </div>

              <div className="rounded-2xl bg-blue-50 p-5">

                <div className="mb-3 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                    <FaCheckCircle />
                  </div>

                  <span className="text-sm font-semibold text-slate-500">
                    Paid Records
                  </span>

                </div>

                <p className="text-2xl font-extrabold text-slate-800">
                  {formatNumber(paidFines)}
                </p>

              </div>

              <div className="rounded-2xl bg-rose-50 p-5">

                <div className="mb-3 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                    <FaExclamationCircle />
                  </div>

                  <span className="text-sm font-semibold text-slate-500">
                    Unpaid Records
                  </span>

                </div>

                <p className="text-2xl font-extrabold text-slate-800">
                  {formatNumber(unpaidFines)}
                </p>

              </div>

            </div>

            {/* Fine Progress */}

            <div className="mt-6">

              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-semibold text-slate-600">
                  Paid Fine Records
                </span>

                <span className="text-sm font-bold text-[#890C25]">
                  {getPercentage(
                    paidFines,
                    totalFines
                  )}
                  %
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#890C25] to-[#D58A98] transition-all duration-700"
                  style={{
                    width: `${getPercentage(
                      paidFines,
                      totalFines
                    )}%`,
                  }}
                />

              </div>

            </div>

          </div>

          {/* Return Fine */}

          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#890C25] via-[#76091f] to-slate-950 p-6 shadow-xl">

            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-125" />

            <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-125" />

            <div className="relative z-10">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                    Return Activity
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white">
                    Return Summary
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                  <FaHandHoldingUsd />
                </div>

              </div>

              <div className="space-y-4">

                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">

                  <p className="text-xs font-medium text-white/60">
                    Return Fine
                  </p>

                  <p className="mt-1 text-2xl font-extrabold text-white">
                    {formatAmount(totalReturnFine)}
                  </p>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div className="rounded-2xl bg-white/10 p-4">

                    <p className="text-xs text-white/60">
                      Completed
                    </p>

                    <p className="mt-1 text-xl font-bold text-white">
                      {formatNumber(
                        completedReturns
                      )}
                    </p>

                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">

                    <p className="text-xs text-white/60">
                      Pending
                    </p>

                    <p className="mt-1 text-xl font-bold text-white">
                      {formatNumber(
                        pendingReturns
                      )}
                    </p>

                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>

        {/* =================================================
            ACTIVITY ANALYTICS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Issues */}

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

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                <FaClipboardList />
              </div>

            </div>

            <div className="space-y-5">

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
                      width: `${getPercentage(
                        pendingIssues,
                        totalIssues
                      )}%`,
                    }}
                  />

                </div>
              </div>

            </div>

          </div>

          {/* Returns */}

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

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                <FaUndo />
              </div>

            </div>

            <div className="grid grid-cols-3 gap-3">

              <div className="rounded-2xl bg-slate-50 p-4 text-center">

                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                  <FaUndo />
                </div>

                <p className="text-xl font-extrabold text-slate-800">
                  {formatNumber(totalReturns)}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Total
                </p>

              </div>

              <div className="rounded-2xl bg-blue-50 p-4 text-center">

                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                  <FaCheckCircle />
                </div>

                <p className="text-xl font-extrabold text-slate-800">
                  {formatNumber(completedReturns)}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Completed
                </p>

              </div>

              <div className="rounded-2xl bg-amber-50 p-4 text-center">

                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                  <FaClock />
                </div>

                <p className="text-xl font-extrabold text-slate-800">
                  {formatNumber(pendingReturns)}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Pending
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            LIBRARY SNAPSHOT
        ================================================= */}

        <div className="mb-6 group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">

          <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-[#890C25] via-[#D58A98] to-blue-600 transition-all duration-500 group-hover:w-full" />

          <div className="mb-6 flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#890C25]">
                Library Snapshot
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800">
                Current System Activity
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
              <FaBook />
            </div>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

              <div className="mb-3 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                  <FaUniversity />
                </div>

                <span className="text-sm font-semibold text-slate-500">
                  Registered Users
                </span>

              </div>

              <p className="text-2xl font-extrabold text-slate-800">
                {formatNumber(totalUsers)}
              </p>

            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

              <div className="mb-3 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
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

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

              <div className="mb-3 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D58A98]/20 text-[#890C25]">
                  <FaFileInvoiceDollar />
                </div>

                <span className="text-sm font-semibold text-slate-500">
                  Fine Records
                </span>

              </div>

              <p className="text-2xl font-extrabold text-slate-800">
                {formatNumber(totalFines)}
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">

          <Link
            to="/reports"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#890C25] to-[#65091b] p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-150" />

            <div className="relative z-10 flex items-center justify-between">

              <div>

                <p className="text-lg font-bold text-white">
                  View Reports
                </p>

                <p className="mt-1 text-sm text-white/60">
                  Explore complete system reports
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition-transform duration-300 group-hover:translate-x-1">
                <FaArrowRight />
              </div>

            </div>

          </Link>

          <Link
            to="/fines"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-150" />

            <div className="relative z-10 flex items-center justify-between">

              <div>

                <p className="text-lg font-bold text-white">
                  Fine Management
                </p>

                <p className="mt-1 text-sm text-white/60">
                  Review library fine records
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition-transform duration-300 group-hover:translate-x-1">
                <FaArrowRight />
              </div>

            </div>

          </Link>

          <Link
            to="/returns"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-700 to-slate-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-150" />

            <div className="relative z-10 flex items-center justify-between">

              <div>

                <p className="text-lg font-bold text-white">
                  Return Records
                </p>

                <p className="mt-1 text-sm text-white/60">
                  Monitor return and fine activity
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition-transform duration-300 group-hover:translate-x-1">
                <FaArrowRight />
              </div>

            </div>

          </Link>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="pb-4 text-center">

          <p className="text-xs font-medium text-slate-400">
            LMS Accountant Analytics • Powered by
            Existing Reports
          </p>

        </div>

      </div>
    </div>
  );
};

export default AccountantDashboard;