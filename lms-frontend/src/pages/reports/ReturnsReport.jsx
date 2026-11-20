import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUndo,
  FaBook,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaMoneyBillWave,
  FaSearch,
  FaFilter,
  FaSyncAlt,
  FaCalendarAlt,
  FaArrowLeft,
  FaEye,
  FaChartPie,
  FaExclamationTriangle,
} from "react-icons/fa";

import { useReports } from "../../context/ReportContext";

const ReturnsReport = () => {
  const navigate = useNavigate();

  const {
    returnsReport,
    getReturnsReport,
    loading,
    error,
  } = useReports();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    getReturnsReport();
  }, []);

  const report = returnsReport?.report || returnsReport || {};

  const returns = Array.isArray(report?.returns)
    ? report.returns
    : Array.isArray(report?.data)
    ? report.data
    : Array.isArray(report?.data?.returns)
    ? report.data.returns
    : [];

  const summary = report?.summary || report?.stats || {};

  const getNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  };

  const getReturnStatus = (returnItem) => {
    const rawStatus = String(
      returnItem?.status ||
        returnItem?.returnStatus ||
        returnItem?.state ||
        ""
    ).toLowerCase();

    if (
      rawStatus === "pending" ||
      rawStatus.includes("pending") ||
      rawStatus === "requested" ||
      rawStatus.includes("request")
    ) {
      return "Pending";
    }

    if (
      rawStatus === "completed" ||
      rawStatus === "complete" ||
      rawStatus === "returned" ||
      rawStatus === "approved" ||
      rawStatus === "confirmed"
    ) {
      return "Completed";
    }

    if (rawStatus === "") {
      return "Pending";
    }

    return (
      returnItem?.status ||
      returnItem?.returnStatus ||
      "Pending"
    );
  };

  const getStudentName = (returnItem) => {
    const student = returnItem?.student;

    if (typeof student === "object" && student) {
      return (
        student.name ||
        student.fullName ||
        student.username ||
        student.email ||
        "Unknown Student"
      );
    }

    return (
      returnItem?.studentName ||
      returnItem?.userName ||
      student ||
      "Unknown Student"
    );
  };

  const getStudentEmail = (returnItem) => {
    const student = returnItem?.student;

    if (typeof student === "object" && student) {
      return student.email || "";
    }

    return (
      returnItem?.studentEmail ||
      returnItem?.email ||
      ""
    );
  };

  const getBookTitle = (returnItem) => {
    const book = returnItem?.book;

    if (typeof book === "object" && book) {
      return (
        book.title ||
        book.name ||
        book.bookName ||
        "Unknown Book"
      );
    }

    return (
      returnItem?.bookTitle ||
      returnItem?.bookName ||
      book ||
      "Unknown Book"
    );
  };

  const getReturnDate = (returnItem) => {
    return (
      returnItem?.returnDate ||
      returnItem?.returnedAt ||
      returnItem?.completedAt ||
      returnItem?.createdAt ||
      returnItem?.date ||
      null
    );
  };

  const getFineAmount = (returnItem) => {
    if (
      typeof returnItem?.fine === "object" &&
      returnItem?.fine
    ) {
      return (
        getNumber(returnItem.fine.amount) ||
        getNumber(returnItem.fine.total) ||
        0
      );
    }

    return (
      getNumber(returnItem?.fine) ||
      getNumber(returnItem?.fineAmount) ||
      getNumber(returnItem?.amount) ||
      0
    );
  };

  const totalReturns =
    getNumber(summary?.totalReturns) ||
    getNumber(report?.totalReturns) ||
    returns.length;

  const pendingReturns =
    getNumber(summary?.pendingReturns) ||
    getNumber(summary?.pending) ||
    getNumber(report?.pendingReturns) ||
    getNumber(report?.pending) ||
    returns.filter(
      (item) =>
        getReturnStatus(item) === "Pending"
    ).length;

  const completedReturns =
    getNumber(summary?.completedReturns) ||
    getNumber(summary?.completed) ||
    getNumber(report?.completedReturns) ||
    getNumber(report?.completed) ||
    returns.filter(
      (item) =>
        getReturnStatus(item) === "Completed"
    ).length;

  const totalFine =
    getNumber(summary?.totalFine) ||
    getNumber(summary?.totalFines) ||
    getNumber(report?.totalFine) ||
    getNumber(report?.totalFines) ||
    returns.reduce(
      (total, item) =>
        total + getFineAmount(item),
      0
    );

  const completedPercentage =
    totalReturns > 0
      ? Math.round(
          (completedReturns / totalReturns) * 100
        )
      : 0;

  const pendingPercentage =
    totalReturns > 0
      ? Math.round(
          (pendingReturns / totalReturns) * 100
        )
      : 0;

  const statusStats = useMemo(() => {
    const statusMap = {};

    returns.forEach((returnItem) => {
      const status =
        getReturnStatus(returnItem);

      if (!statusMap[status]) {
        statusMap[status] = 0;
      }

      statusMap[status] += 1;
    });

    return Object.entries(statusMap)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [returns]);

  const reportStatusStats = Array.isArray(
    report?.statusStats
  )
    ? report.statusStats
    : Array.isArray(report?.statuses)
    ? report.statuses
    : statusStats;

  const filteredReturns = useMemo(() => {
    return returns.filter((returnItem) => {
      const studentName =
        getStudentName(returnItem).toLowerCase();

      const studentEmail =
        getStudentEmail(returnItem).toLowerCase();

      const bookTitle =
        getBookTitle(returnItem).toLowerCase();

      const search =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        studentName.includes(search) ||
        studentEmail.includes(search) ||
        bookTitle.includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        getReturnStatus(returnItem) ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    returns,
    searchTerm,
    statusFilter,
  ]);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (
      Number.isNaN(parsedDate.getTime())
    ) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatCurrency = (amount) => {
    return `Rs. ${getNumber(
      amount
    ).toLocaleString()}`;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const reloadReport = () => {
    getReturnsReport();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 md:p-6 mt-10 relative overflow-hidden">

      {/* =====================================================
          BACKGROUND DECORATIONS
      ====================================================== */}

      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#890C25]/10 blur-3xl pointer-events-none" />

      <div className="absolute top-[35%] -right-40 w-[28rem] h-[28rem] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="absolute bottom-0 left-[35%] w-96 h-64 rounded-full bg-[#890C25]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* =====================================================
            HERO
        ====================================================== */}

        <div
          className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-[#890C25]/20 mb-6"
          style={{
            background:
              "linear-gradient(135deg, #890C25 0%, #6f091e 55%, #420512 100%)",
          }}
        >

          {/* Top animated line */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D58A98] to-transparent animate-pulse" />

          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full border border-white/10" />

          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full border border-white/10" />

          <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full border border-white/10" />

          <div className="absolute top-12 right-[35%] w-16 h-16 rounded-full bg-white/5 animate-pulse" />

          <div className="absolute bottom-8 right-20 w-10 h-10 rounded-full bg-[#D58A98]/10" />

          <div className="relative p-6 md:p-8">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div>

                <button
                  onClick={() =>
                    navigate("/reports")
                  }
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-5 transition"
                >
                  <FaArrowLeft />
                  Back to Reports
                </button>

                <div className="flex items-center gap-4">

                  <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center shadow-xl">
                    <FaUndo className="text-2xl text-white" />
                  </div>

                  <div>

                    <span className="text-xs uppercase tracking-[0.2em] text-[#D58A98] font-semibold">
                      Return Analytics
                    </span>

                    <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">
                      Returns Report
                    </h1>

                    <p className="text-white/65 mt-1 text-sm md:text-base">
                      Complete book return and fine analytics
                    </p>

                  </div>

                </div>

              </div>

              <button
                onClick={reloadReport}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white text-[#890C25] font-semibold hover:bg-slate-100 disabled:opacity-60 transition shadow-xl"
              >
                <FaSyncAlt
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh Report
              </button>

            </div>

            {/* Hero summary */}
            <div className="mt-7 pt-5 border-t border-white/10 flex flex-wrap gap-5 text-xs text-white/60">

              <span className="flex items-center gap-2">
                <FaUndo className="text-[#D58A98]" />
                Total Returns: {totalReturns}
              </span>

              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-green-300" />
                Completed: {completedReturns}
              </span>

              <span className="flex items-center gap-2">
                <FaClock className="text-[#D58A98]" />
                Pending: {pendingReturns}
              </span>

              <span className="flex items-center gap-2">
                <FaMoneyBillWave className="text-amber-300" />
                Fine: {formatCurrency(totalFine)}
              </span>

            </div>

          </div>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-red-700 shadow-sm">

            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
              <FaExclamationTriangle />
            </div>

            <span className="font-medium">
              {error}
            </span>

          </div>
        )}

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading && !returnsReport ? (
          <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-14 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#890C25]/10 flex items-center justify-center mb-5">
              <FaSyncAlt className="text-3xl text-[#890C25] animate-spin" />
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              Loading Returns Report
            </h3>

            <p className="text-slate-500 mt-2">
              Please wait while return analytics are being loaded...
            </p>

          </div>
        ) : (
          <>

            {/* =====================================================
                STAT CARDS
            ====================================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

              {/* Total Returns */}
              <div
                className="relative overflow-hidden rounded-[1.5rem] p-5 shadow-xl shadow-[#890C25]/15 group"
                style={{
                  background:
                    "linear-gradient(145deg, #890C25, #65081b)",
                }}
              >

                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full border border-white/10" />

                <div className="absolute -right-5 -bottom-12 w-28 h-28 rounded-full bg-white/5" />

                <div className="absolute top-0 left-0 w-full h-[3px] bg-[#D58A98] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div className="relative flex items-center justify-between">

                  <div>

                    <p className="text-white/65 text-sm">
                      Total Returns
                    </p>

                    <h2 className="text-3xl font-bold text-white mt-2">
                      {totalReturns}
                    </h2>

                    <p className="text-xs text-[#D58A98] mt-2">
                      All return records
                    </p>

                  </div>

                  <div className="w-[52px] h-[52px] rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                    <FaUndo className="text-white text-xl" />
                  </div>

                </div>
              </div>

              {/* Completed */}
              <div
                className="relative overflow-hidden rounded-[1.5rem] p-5 shadow-xl shadow-[#890C25]/10 group"
                style={{
                  background:
                    "linear-gradient(145deg, #890C25, #65081b)",
                }}
              >

                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full border border-green-300/10" />

                <div className="absolute -left-12 -bottom-16 w-36 h-36 rounded-full bg-green-400/5" />

                <div className="absolute top-0 left-0 w-full h-[3px] bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div className="relative flex items-center justify-between">

                  <div>

                    <p className="text-white/65 text-sm">
                      Completed Returns
                    </p>

                    <h2 className="text-3xl font-bold text-white mt-2">
                      {completedReturns}
                    </h2>

                    <p className="text-xs text-green-300 mt-2">
                      {completedPercentage}% completed
                    </p>

                  </div>

                  <div className="w-[52px] h-[52px] rounded-2xl bg-green-400/10 border border-green-300/10 flex items-center justify-center">
                    <FaCheckCircle className="text-green-300 text-xl" />
                  </div>

                </div>
              </div>

              {/* Pending */}
              <div
                className="relative overflow-hidden rounded-[1.5rem] p-5 shadow-xl shadow-[#890C25]/15 group"
                style={{
                  background:
                    "linear-gradient(145deg, #890C25, #65081b)",
                }}
              >

                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full border border-[#D58A98]/10" />

                <div className="absolute -left-10 -bottom-12 w-32 h-32 rounded-full bg-white/5" />

                <div className="absolute top-0 left-0 w-full h-[3px] bg-[#D58A98] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div className="relative flex items-center justify-between">

                  <div>

                    <p className="text-white/65 text-sm">
                      Pending Returns
                    </p>

                    <h2 className="text-3xl font-bold text-white mt-2">
                      {pendingReturns}
                    </h2>

                    <p className="text-xs text-[#D58A98] mt-2">
                      {pendingPercentage}% pending
                    </p>

                  </div>

                  <div className="w-[52px] h-[52px] rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                    <FaClock className="text-[#D58A98] text-xl" />
                  </div>

                </div>
              </div>

              {/* Fine */}
              <div
                className="relative overflow-hidden rounded-[1.5rem] p-5 shadow-xl shadow-[#890C25]/15 group"
                style={{
                  background:
                    "linear-gradient(145deg, #890C25, #65081b)",
                }}
              >

                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full border border-amber-300/10" />

                <div className="absolute -left-10 -bottom-12 w-32 h-32 rounded-full bg-amber-400/5" />

                <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div className="relative flex items-center justify-between">

                  <div>

                    <p className="text-white/65 text-sm">
                      Total Fine
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-2">
                      {formatCurrency(totalFine)}
                    </h2>

                    <p className="text-xs text-amber-300 mt-2">
                      Return-related fines
                    </p>

                  </div>

                  <div className="w-[52px] h-[52px] rounded-2xl bg-amber-400/10 border border-amber-300/10 flex items-center justify-center">
                    <FaMoneyBillWave className="text-amber-300 text-xl" />
                  </div>

                </div>
              </div>

            </div>

            {/* =====================================================
                ANALYTICS
            ====================================================== */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

              {/* Return Status */}
              <div className="relative overflow-hidden rounded-[1.75rem] bg-white border border-slate-200 shadow-xl group">

                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#890C25] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

                <div className="p-6">

                  <div className="flex items-center gap-3 mb-7">

                    <div className="w-12 h-12 rounded-2xl bg-[#890C25]/10 flex items-center justify-center">
                      <FaChartPie className="text-[#890C25] text-lg" />
                    </div>

                    <div>
                      <h2 className="font-bold text-lg text-slate-800">
                        Return Status
                      </h2>

                      <p className="text-sm text-slate-500">
                        Completed and pending distribution
                      </p>
                    </div>

                  </div>

                  <div className="space-y-6">

                    {/* Completed */}
                    <div>

                      <div className="flex justify-between mb-2">

                        <span className="text-sm font-medium text-slate-600">
                          Completed Returns
                        </span>

                        <span className="text-sm font-bold text-green-600">
                          {completedReturns} ({completedPercentage}%)
                        </span>

                      </div>

                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                        <div
                          className="h-full bg-green-500 rounded-full transition-all duration-700"
                          style={{
                            width: `${completedPercentage}%`,
                          }}
                        />

                      </div>

                    </div>

                    {/* Pending */}
                    <div>

                      <div className="flex justify-between mb-2">

                        <span className="text-sm font-medium text-slate-600">
                          Pending Returns
                        </span>

                        <span className="text-sm font-bold text-[#890C25]">
                          {pendingReturns} ({pendingPercentage}%)
                        </span>

                      </div>

                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                        <div
                          className="h-full bg-[#890C25] rounded-full transition-all duration-700"
                          style={{
                            width: `${pendingPercentage}%`,
                          }}
                        />

                      </div>

                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-7">

                    <div className="rounded-xl bg-green-50 border border-green-100 p-3">

                      <p className="text-xs text-green-600">
                        Completed
                      </p>

                      <p className="text-xl font-bold text-green-700 mt-1">
                        {completedReturns}
                      </p>

                    </div>

                    <div className="rounded-xl bg-[#890C25]/5 border border-[#890C25]/10 p-3">

                      <p className="text-xs text-[#890C25]">
                        Pending
                      </p>

                      <p className="text-xl font-bold text-[#890C25] mt-1">
                        {pendingReturns}
                      </p>

                    </div>

                  </div>

                </div>
              </div>

              {/* Status Breakdown */}
              <div className="relative overflow-hidden rounded-[1.75rem] bg-white border border-slate-200 shadow-xl group">

                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-blue-600 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

                <div className="p-6">

                  <div className="flex items-center gap-3 mb-7">

                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                      <FaUndo className="text-blue-600 text-lg" />
                    </div>

                    <div>
                      <h2 className="font-bold text-lg text-slate-800">
                        Status Breakdown
                      </h2>

                      <p className="text-sm text-slate-500">
                        Returns grouped by status
                      </p>
                    </div>

                  </div>

                  {reportStatusStats.length === 0 ? (
                    <div className="text-center py-8">

                      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                        <FaUndo className="text-slate-400 text-xl" />
                      </div>

                      <p className="text-slate-500 text-sm">
                        No status data available
                      </p>

                    </div>
                  ) : (
                    <div className="space-y-5 max-h-60 overflow-y-auto pr-2">

                      {reportStatusStats.map(
                        (item, index) => {

                          const name =
                            item?.name ||
                            item?.status ||
                            item?._id ||
                            "Unknown";

                          const count =
                            getNumber(
                              item?.count
                            ) ||
                            getNumber(
                              item?.total
                            );

                          const percentage =
                            totalReturns > 0
                              ? Math.round(
                                  (count /
                                    totalReturns) *
                                    100
                                )
                              : 0;

                          const isCompleted =
                            String(name)
                              .toLowerCase()
                              .includes(
                                "complete"
                              ) ||
                            String(name)
                              .toLowerCase()
                              .includes(
                                "return"
                              );

                          return (
                            <div
                              key={`${name}-${index}`}
                            >

                              <div className="flex justify-between mb-2">

                                <span className="text-sm font-medium text-slate-600">
                                  {name}
                                </span>

                                <span
                                  className={
                                    isCompleted
                                      ? "text-green-600 text-sm font-bold"
                                      : "text-[#890C25] text-sm font-bold"
                                  }
                                >
                                  {count}
                                </span>

                              </div>

                              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                                <div
                                  className={
                                    isCompleted
                                      ? "h-full bg-green-500 rounded-full transition-all duration-700"
                                      : "h-full bg-[#890C25] rounded-full transition-all duration-700"
                                  }
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
                  )}

                </div>
              </div>

            </div>

            {/* =====================================================
                FILTERS
            ====================================================== */}

            <div className="relative overflow-hidden rounded-[1.75rem] bg-white border border-slate-200 shadow-xl p-5 md:p-6 mb-6">

              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#890C25] to-transparent" />

              <div className="flex items-center justify-between gap-3 mb-5">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-[#890C25]/10 flex items-center justify-center">
                    <FaFilter className="text-[#890C25]" />
                  </div>

                  <div>

                    <h2 className="font-bold text-slate-800">
                      Search & Filters
                    </h2>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Find specific return records
                    </p>

                  </div>

                </div>

                {(searchTerm ||
                  statusFilter !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-semibold text-[#890C25] hover:text-[#65081b] transition"
                  >
                    Clear Filters
                  </button>
                )}

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Search */}
                <div className="relative">

                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    placeholder="Search student, email, or book..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/10 transition"
                  />

                </div>

                {/* Status */}
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-700 outline-none focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/10 transition"
                >

                  <option value="all">
                    All Status
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                </select>

              </div>

            </div>

            {/* =====================================================
                RETURNS TABLE
            ====================================================== */}

            <div className="relative overflow-hidden rounded-[1.75rem] bg-white border border-slate-200 shadow-xl">

              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#890C25] to-transparent" />

              <div className="p-5 md:p-6 border-b border-slate-200">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-[#890C25]/10 flex items-center justify-center">
                        <FaUndo className="text-[#890C25]" />
                      </div>

                      <div>

                        <h2 className="text-lg font-bold text-slate-800">
                          Returns List
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                          Showing{" "}
                          {filteredReturns.length}{" "}
                          of {returns.length} returns
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#890C25] bg-[#890C25]/5 border border-[#890C25]/10 px-4 py-2 rounded-xl">
                    <FaUndo />
                    {filteredReturns.length} Results
                  </div>

                </div>

              </div>

              {filteredReturns.length === 0 ? (
                <div className="py-16 text-center">

                  <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <FaUndo className="text-2xl text-slate-400" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-700">
                    No Returns Found
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Try changing your search or filters.
                  </p>

                </div>
              ) : (
                <div className="overflow-x-auto">

                  <table className="w-full min-w-[1100px]">

                    <thead>
                      <tr className="bg-[#890C25] text-left text-xs uppercase tracking-wider text-white">

                        <th className="px-5 py-4">
                          #
                        </th>

                        <th className="px-5 py-4">
                          Student
                        </th>

                        <th className="px-5 py-4">
                          Book
                        </th>

                        <th className="px-5 py-4">
                          Return Date
                        </th>

                        <th className="px-5 py-4">
                          Fine
                        </th>

                        <th className="px-5 py-4">
                          Status
                        </th>

                        <th className="px-5 py-4">
                          Action
                        </th>

                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {filteredReturns.map(
                        (returnItem, index) => {

                          const studentName =
                            getStudentName(
                              returnItem
                            );

                          const studentEmail =
                            getStudentEmail(
                              returnItem
                            );

                          const bookTitle =
                            getBookTitle(
                              returnItem
                            );

                          const returnDate =
                            getReturnDate(
                              returnItem
                            );

                          const fineAmount =
                            getFineAmount(
                              returnItem
                            );

                          const status =
                            getReturnStatus(
                              returnItem
                            );

                          return (
                            <tr
                              key={
                                returnItem?._id ||
                                returnItem?.id ||
                                index
                              }
                              className="group hover:bg-[#890C25]/[0.025] transition"
                            >

                              {/* Number */}
                              <td className="px-5 py-4 text-slate-400 text-sm font-medium">
                                {index + 1}
                              </td>

                              {/* Student */}
                              <td className="px-5 py-4">

                                <div className="flex items-center gap-3">

                                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                    <FaUser className="text-blue-600" />
                                  </div>

                                  <div>

                                    <p className="font-semibold text-slate-800 max-w-[190px] truncate">
                                      {studentName}
                                    </p>

                                    {studentEmail && (
                                      <p className="text-xs text-slate-400 mt-1 max-w-[190px] truncate">
                                        {studentEmail}
                                      </p>
                                    )}

                                  </div>

                                </div>

                              </td>

                              {/* Book */}
                              <td className="px-5 py-4">

                                <div className="flex items-center gap-3">

                                  <div className="w-10 h-10 rounded-xl bg-[#890C25]/10 border border-[#890C25]/10 flex items-center justify-center flex-shrink-0">
                                    <FaBook className="text-[#890C25]" />
                                  </div>

                                  <p className="font-semibold text-slate-700 max-w-[220px] truncate">
                                    {bookTitle}
                                  </p>

                                </div>

                              </td>

                              {/* Return Date */}
                              <td className="px-5 py-4 text-slate-500 text-sm">

                                <span className="inline-flex items-center gap-2">
                                  <FaCalendarAlt className="text-[#890C25]" />
                                  {formatDate(
                                    returnDate
                                  )}
                                </span>

                              </td>

                              {/* Fine */}
                              <td className="px-5 py-4">

                                <span
                                  className={
                                    fineAmount > 0
                                      ? "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold"
                                      : "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-semibold"
                                  }
                                >

                                  <FaMoneyBillWave />

                                  {formatCurrency(
                                    fineAmount
                                  )}

                                </span>

                              </td>

                              {/* Status */}
                              <td className="px-5 py-4">

                                {status ===
                                "Completed" ? (
                                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
                                    <FaCheckCircle />
                                    Completed
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#890C25]/10 border border-[#890C25]/20 text-[#890C25] text-xs font-semibold">
                                    <FaClock />
                                    Pending
                                  </span>
                                )}

                              </td>

                              {/* Action */}
                              <td className="px-5 py-4">

                                <button
                                  onClick={() => {
                                    if (
                                      returnItem?._id
                                    ) {
                                      navigate(
                                        `/return-books/view/${returnItem._id}`
                                      );
                                    }
                                  }}
                                  disabled={
                                    !returnItem?._id
                                  }
                                  className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center disabled:opacity-30"
                                  title="View Return"
                                >
                                  <FaEye />
                                </button>

                              </td>

                            </tr>
                          );
                        }
                      )}

                    </tbody>
                  </table>

                </div>
              )}

              {/* Footer */}
              {filteredReturns.length > 0 && (
                <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">

                  <span className="text-slate-500">
                    Total displayed:{" "}
                    <span className="text-slate-800 font-bold">
                      {filteredReturns.length}
                    </span>
                  </span>

                  <div className="flex flex-wrap items-center gap-5">

                    <span className="text-slate-500">
                      Completed:{" "}
                      <span className="text-green-600 font-bold">
                        {completedReturns}
                      </span>
                    </span>

                    <span className="text-slate-500">
                      Pending:{" "}
                      <span className="text-[#890C25] font-bold">
                        {pendingReturns}
                      </span>
                    </span>

                    <span className="text-slate-500">
                      Fine:{" "}
                      <span className="text-amber-600 font-bold">
                        {formatCurrency(
                          totalFine
                        )}
                      </span>
                    </span>

                  </div>

                </div>
              )}

            </div>

          </>
        )}

      </div>
    </div>
  );
};

export default ReturnsReport;

