import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaUser,
  FaBook,
  FaSearch,
  FaFilter,
  FaSyncAlt,
  FaCalendarAlt,
  FaArrowLeft,
  FaEye,
  FaChartPie,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
} from "react-icons/fa";

import { useReports } from "../../context/ReportContext";

const FinesReport = () => {
  const navigate = useNavigate();

  const {
    finesReport,
    getFinesReport,
    loading,
    error,
  } = useReports();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    getFinesReport();
  }, []);

  const report = finesReport?.report || finesReport || {};

  const fines = Array.isArray(report?.fines)
    ? report.fines
    : Array.isArray(report?.data)
    ? report.data
    : Array.isArray(report?.data?.fines)
    ? report.data.fines
    : [];

  const summary = report?.summary || report?.stats || {};

  const getNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  };

  const getStudentName = (fine) => {
    const student =
      fine?.student ||
      fine?.user ||
      fine?.issuedTo;

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
      fine?.studentName ||
      fine?.userName ||
      fine?.name ||
      student ||
      "Unknown Student"
    );
  };

  const getStudentEmail = (fine) => {
    const student =
      fine?.student ||
      fine?.user ||
      fine?.issuedTo;

    if (typeof student === "object" && student) {
      return student.email || "";
    }

    return (
      fine?.studentEmail ||
      fine?.userEmail ||
      fine?.email ||
      ""
    );
  };

  const getBookTitle = (fine) => {
    const directBook = fine?.book;

    if (
      typeof directBook === "object" &&
      directBook
    ) {
      return (
        directBook.title ||
        directBook.name ||
        directBook.bookName ||
        "Unknown Book"
      );
    }

    const issue = fine?.issue;

    if (typeof issue === "object" && issue) {
      const issueBook = issue?.book;

      if (
        typeof issueBook === "object" &&
        issueBook
      ) {
        return (
          issueBook.title ||
          issueBook.name ||
          issueBook.bookName ||
          "Unknown Book"
        );
      }

      if (issue?.bookTitle) {
        return issue.bookTitle;
      }

      if (issue?.bookName) {
        return issue.bookName;
      }
    }

    return (
      fine?.bookTitle ||
      fine?.bookName ||
      fine?.title ||
      directBook ||
      "Unknown Book"
    );
  };

  const getIssueId = (fine) => {
    const issue = fine?.issue;

    if (
      typeof issue === "object" &&
      issue
    ) {
      return issue?._id || issue?.id || null;
    }

    return issue || fine?.issueId || null;
  };

  const getFineAmount = (fine) => {
    return getNumber(
      fine?.amount ??
        fine?.fineAmount ??
        fine?.totalAmount ??
        fine?.value ??
        0
    );
  };

  const getFineDate = (fine) => {
    return (
      fine?.createdAt ||
      fine?.fineDate ||
      fine?.date ||
      fine?.issuedAt ||
      fine?.updatedAt ||
      null
    );
  };

  const getFineStatus = (fine) => {
    const rawStatus = String(
      fine?.status ||
        fine?.paymentStatus ||
        fine?.fineStatus ||
        ""
    ).toLowerCase();

    if (
      rawStatus === "paid" ||
      rawStatus === "payment completed" ||
      rawStatus === "completed" ||
      rawStatus === "settled"
    ) {
      return "Paid";
    }

    if (
      rawStatus === "unpaid" ||
      rawStatus === "pending" ||
      rawStatus === "due" ||
      rawStatus === "not paid" ||
      rawStatus === ""
    ) {
      return "Unpaid";
    }

    if (
      fine?.paid === true ||
      fine?.isPaid === true
    ) {
      return "Paid";
    }

    if (
      fine?.paid === false ||
      fine?.isPaid === false
    ) {
      return "Unpaid";
    }

    return fine?.status || "Unpaid";
  };

  const totalFines =
    getNumber(summary?.totalFines) ||
    getNumber(summary?.total) ||
    getNumber(report?.totalFines) ||
    getNumber(report?.total) ||
    fines.length;

  const totalAmount =
    getNumber(summary?.totalAmount) ||
    getNumber(summary?.amount) ||
    getNumber(report?.totalAmount) ||
    getNumber(report?.amount) ||
    fines.reduce(
      (total, fine) =>
        total + getFineAmount(fine),
      0
    );

  const paidFines =
    getNumber(summary?.paidFines) ||
    getNumber(summary?.paid) ||
    getNumber(report?.paidFines) ||
    getNumber(report?.paid) ||
    fines.filter(
      (fine) => getFineStatus(fine) === "Paid"
    ).length;

  const unpaidFines =
    getNumber(summary?.unpaidFines) ||
    getNumber(summary?.unpaid) ||
    getNumber(report?.unpaidFines) ||
    getNumber(report?.unpaid) ||
    fines.filter(
      (fine) => getFineStatus(fine) === "Unpaid"
    ).length;

  const paidAmount = fines
    .filter(
      (fine) => getFineStatus(fine) === "Paid"
    )
    .reduce(
      (total, fine) =>
        total + getFineAmount(fine),
      0
    );

  const unpaidAmount = fines
    .filter(
      (fine) => getFineStatus(fine) === "Unpaid"
    )
    .reduce(
      (total, fine) =>
        total + getFineAmount(fine),
      0
    );

  const paidPercentage =
    totalFines > 0
      ? Math.round(
          (paidFines / totalFines) * 100
        )
      : 0;

  const unpaidPercentage =
    totalFines > 0
      ? Math.round(
          (unpaidFines / totalFines) * 100
        )
      : 0;

  const statusStats = useMemo(() => {
    const statusMap = {};

    fines.forEach((fine) => {
      const status = getFineStatus(fine);

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
      .sort(
        (a, b) => b.count - a.count
      );
  }, [fines]);

  const reportStatusStats = Array.isArray(
    report?.statusStats
  )
    ? report.statusStats
    : Array.isArray(report?.statuses)
    ? report.statuses
    : statusStats;

  const filteredFines = useMemo(() => {
    return fines.filter((fine) => {
      const studentName =
        getStudentName(fine).toLowerCase();

      const studentEmail =
        getStudentEmail(fine).toLowerCase();

      const bookTitle =
        getBookTitle(fine).toLowerCase();

      const status = String(
        getFineStatus(fine)
      ).toLowerCase();

      const search =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        studentName.includes(search) ||
        studentEmail.includes(search) ||
        bookTitle.includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        getFineStatus(fine) === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    fines,
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

    return parsedDate.toLocaleDateString();
  };

  const formatAmount = (amount) => {
    return `Rs. ${getNumber(amount).toLocaleString()}`;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const reloadReport = () => {
    getFinesReport();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-4 md:p-6 relative mt-10 overflow-hidden">

      {/* Background Decorative Circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#890C25]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-0 left-1/3 w-[30rem] h-48 bg-[#890C25]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div
          className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-[#890C25]/20 mb-6"
          style={{
            background:
              "linear-gradient(135deg, #890C25 0%, #6f091e 55%, #420512 100%)",
          }}
        >

          {/* Animated Top Line */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-white/80 to-transparent animate-pulse" />

          {/* Decorative Rings */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full border border-white/10" />

          <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full border border-white/10" />

          <div className="absolute top-10 right-1/3 w-16 h-16 rounded-full bg-white/5 animate-pulse" />

          <div className="absolute bottom-8 right-16 w-8 h-8 rounded-full bg-white/10 animate-pulse" />

          <div className="relative p-6 md:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <button
                onClick={() =>
                  navigate("/reports")
                }
                className="inline-flex items-center gap-2 text-white/75 hover:text-white mb-5 transition font-medium"
              >
                <FaArrowLeft />
                Back to Reports
              </button>

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/15 border border-white/15 flex items-center justify-center shadow-xl">
                  <FaMoneyBillWave className="text-white text-2xl md:text-3xl" />
                </div>

                <div>

                  <p className="text-white/65 text-xs md:text-sm font-semibold uppercase tracking-[0.18em]">
                    Reports & Analytics • Finance
                  </p>

                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-1">
                    Fines Report
                  </h1>

                  <p className="text-white/70 mt-1 text-sm md:text-base">
                    Complete fine collection and payment analytics
                  </p>

                </div>

              </div>

            </div>

            <button
              onClick={reloadReport}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[#890C25] hover:bg-slate-100 disabled:opacity-50 transition font-semibold shadow-xl"
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
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="mb-6 relative overflow-hidden rounded-2xl border border-red-200 bg-white shadow-lg p-4 flex items-center gap-3 text-red-600">

            <div className="absolute top-0 left-0 w-full h-[3px] bg-red-500" />

            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <FaExclamationTriangle />
            </div>

            <span className="font-medium">
              {error}
            </span>

          </div>
        )}

        {/* ================= LOADING ================= */}
        {loading && !finesReport ? (
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl p-14 text-center">

            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#890C25] to-transparent" />

            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#890C25]/10 flex items-center justify-center mb-5">
              <FaSyncAlt className="text-3xl text-[#890C25] animate-spin" />
            </div>

            <p className="text-slate-600 font-medium">
              Loading fines report...
            </p>

          </div>
        ) : (
          <>

            {/* ================= STATS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

              {/* Total Fines */}
              <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-lg p-5 group">

                <div className="absolute top-0 left-0 w-full h-[3px] bg-[#890C25] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-[#890C25]/5" />

                <div className="relative flex items-center justify-between">

                  <div>

                    <p className="text-slate-500 text-sm font-medium">
                      Total Fines
                    </p>

                    <h2 className="text-3xl font-bold text-slate-900 mt-2">
                      {totalFines}
                    </h2>

                    <p className="text-xs text-[#890C25] mt-2 font-medium">
                      All fine records
                    </p>

                  </div>

                  <div className="w-12 h-12 rounded-xl bg-[#890C25]/10 flex items-center justify-center">
                    <FaFileInvoiceDollar className="text-[#890C25] text-xl" />
                  </div>

                </div>
              </div>

              {/* Total Amount */}
              <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-lg p-5 group">

                <div className="absolute top-0 left-0 w-full h-[3px] bg-[#890C25] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-[#890C25]/5" />

                <div className="relative flex items-center justify-between">

                  <div>

                    <p className="text-slate-500 text-sm font-medium">
                      Total Amount
                    </p>

                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
                      {formatAmount(totalAmount)}
                    </h2>

                    <p className="text-xs text-[#890C25] mt-2 font-medium">
                      Total generated fines
                    </p>

                  </div>

                  <div className="w-12 h-12 rounded-xl bg-[#890C25]/10 flex items-center justify-center">
                    <FaMoneyBillWave className="text-[#890C25] text-xl" />
                  </div>

                </div>
              </div>

              {/* Paid */}
              <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-lg p-5 group">

                <div className="absolute top-0 left-0 w-full h-[3px] bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-green-500/5" />

                <div className="relative flex items-center justify-between">

                  <div>

                    <p className="text-slate-500 text-sm font-medium">
                      Paid Fines
                    </p>

                    <h2 className="text-3xl font-bold text-slate-900 mt-2">
                      {paidFines}
                    </h2>

                    <p className="text-xs text-green-600 mt-2 font-medium">
                      {formatAmount(paidAmount)}
                    </p>

                  </div>

                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                    <FaCheckCircle className="text-green-600 text-xl" />
                  </div>

                </div>
              </div>

              {/* Unpaid */}
              <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-lg p-5 group">

                <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-amber-500/5" />

                <div className="relative flex items-center justify-between">

                  <div>

                    <p className="text-slate-500 text-sm font-medium">
                      Unpaid Fines
                    </p>

                    <h2 className="text-3xl font-bold text-slate-900 mt-2">
                      {unpaidFines}
                    </h2>

                    <p className="text-xs text-amber-600 mt-2 font-medium">
                      {formatAmount(unpaidAmount)}
                    </p>

                  </div>

                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                    <FaClock className="text-amber-600 text-xl" />
                  </div>

                </div>
              </div>

            </div>

            {/* ================= ANALYTICS ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

              {/* Payment Status */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl p-6 group">

                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#890C25] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

                <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full border border-[#890C25]/5" />

                <div className="relative flex items-center gap-3 mb-6">

                  <div className="w-11 h-11 rounded-xl bg-[#890C25]/10 flex items-center justify-center">
                    <FaChartPie className="text-[#890C25]" />
                  </div>

                  <div>

                    <h2 className="font-bold text-lg text-slate-900">
                      Payment Status
                    </h2>

                    <p className="text-sm text-slate-500">
                      Paid vs unpaid fine records
                    </p>

                  </div>

                </div>

                <div className="relative space-y-6">

                  {/* Paid */}
                  <div>

                    <div className="flex justify-between mb-2">

                      <span className="text-sm text-slate-600 font-medium">
                        Paid
                      </span>

                      <span className="text-sm font-semibold text-green-600">
                        {paidFines} ({paidPercentage}%)
                      </span>

                    </div>

                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-700"
                        style={{
                          width: `${paidPercentage}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* Unpaid */}
                  <div>

                    <div className="flex justify-between mb-2">

                      <span className="text-sm text-slate-600 font-medium">
                        Unpaid
                      </span>

                      <span className="text-sm font-semibold text-amber-600">
                        {unpaidFines} ({unpaidPercentage}%)
                      </span>

                    </div>

                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-700"
                        style={{
                          width: `${unpaidPercentage}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>
              </div>

              {/* Status Breakdown */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl p-6 group">

                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-blue-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

                <div className="absolute -right-16 -bottom-16 w-40 h-40 rounded-full border border-blue-500/5" />

                <div className="relative flex items-center gap-3 mb-6">

                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                    <FaMoneyBillWave className="text-blue-600" />
                  </div>

                  <div>

                    <h2 className="font-bold text-lg text-slate-900">
                      Fine Breakdown
                    </h2>

                    <p className="text-sm text-slate-500">
                      Fine records grouped by payment status
                    </p>

                  </div>

                </div>

                {reportStatusStats.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    No status data available
                  </div>
                ) : (
                  <div className="space-y-5 max-h-56 overflow-y-auto pr-2">

                    {reportStatusStats.map(
                      (item, index) => {

                        const name =
                          item?.name ||
                          item?.status ||
                          item?._id ||
                          "Unknown";

                        const count =
                          getNumber(item?.count) ||
                          getNumber(item?.total);

                        const percentage =
                          totalFines > 0
                            ? Math.round(
                                (count / totalFines) * 100
                              )
                            : 0;

                        const isPaid =
                          String(name)
                            .toLowerCase()
                            .includes("paid") &&
                          !String(name)
                            .toLowerCase()
                            .includes("unpaid");

                        return (
                          <div
                            key={`${name}-${index}`}
                          >

                            <div className="flex justify-between mb-2">

                              <span className="text-sm text-slate-600 font-medium">
                                {name}
                              </span>

                              <span
                                className={
                                  isPaid
                                    ? "text-green-600 text-sm font-semibold"
                                    : "text-amber-600 text-sm font-semibold"
                                }
                              >
                                {count}
                              </span>

                            </div>

                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                              <div
                                className={
                                  isPaid
                                    ? "h-full bg-green-500 rounded-full transition-all duration-700"
                                    : "h-full bg-amber-500 rounded-full transition-all duration-700"
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

            {/* ================= FILTERS ================= */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl p-5 mb-6 group">

              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#890C25] to-transparent" />

              <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-[#890C25]/5" />

              <div className="relative">

                <div className="flex items-center gap-3 mb-5">

                  <div className="w-10 h-10 rounded-xl bg-[#890C25]/10 flex items-center justify-center">
                    <FaFilter className="text-[#890C25]" />
                  </div>

                  <div>

                    <h2 className="font-bold text-slate-900">
                      Search & Filters
                    </h2>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Find specific fine records quickly
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Search */}
                  <div className="relative">

                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(e.target.value)
                      }
                      placeholder="Search student, email, or book..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#890C25] focus:ring-4 focus:ring-[#890C25]/10 transition"
                    />

                  </div>

                  {/* Status */}
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value)
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 outline-none focus:border-[#890C25] focus:ring-4 focus:ring-[#890C25]/10 transition"
                  >

                    <option value="all">
                      All Status
                    </option>

                    <option value="Paid">
                      Paid
                    </option>

                    <option value="Unpaid">
                      Unpaid
                    </option>

                  </select>

                </div>

                {(searchTerm ||
                  statusFilter !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-sm font-semibold text-[#890C25] hover:text-[#6f091e] transition"
                  >
                    Clear all filters
                  </button>
                )}

              </div>

            </div>

            {/* ================= FINES TABLE ================= */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#890C25] to-transparent" />

              {/* Table Header */}
              <div className="p-5 md:p-6 border-b border-slate-200">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                  <div>

                    <h2 className="text-lg font-bold text-slate-900">
                      Fines List
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Showing {filteredFines.length} of{" "}
                      {fines.length} fine records
                    </p>

                  </div>

                  <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">

                    <div className="w-9 h-9 rounded-lg bg-[#890C25]/10 flex items-center justify-center">
                      <FaMoneyBillWave className="text-[#890C25]" />
                    </div>

                    {filteredFines.length} Results

                  </div>

                </div>

              </div>

              {filteredFines.length === 0 ? (
                <div className="py-16 text-center">

                  <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <FaMoneyBillWave className="text-2xl text-slate-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-slate-800">
                    No Fines Found
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
                          Book / Issue
                        </th>

                        <th className="px-5 py-4">
                          Date
                        </th>

                        <th className="px-5 py-4">
                          Amount
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

                      {filteredFines.map(
                        (fine, index) => {

                          const studentName =
                            getStudentName(fine);

                          const studentEmail =
                            getStudentEmail(fine);

                          const bookTitle =
                            getBookTitle(fine);

                          const fineDate =
                            getFineDate(fine);

                          const amount =
                            getFineAmount(fine);

                          const status =
                            getFineStatus(fine);

                          const issueId =
                            getIssueId(fine);

                          return (
                            <tr
                              key={
                                fine?._id ||
                                fine?.id ||
                                index
                              }
                              className="hover:bg-[#890C25]/[0.03] transition"
                            >

                              {/* Number */}
                              <td className="px-5 py-4 text-slate-400 font-medium">
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

                              {/* Book / Issue */}
                              <td className="px-5 py-4">

                                <div className="flex items-center gap-3">

                                  <div className="w-10 h-10 rounded-xl bg-[#890C25]/10 flex items-center justify-center flex-shrink-0">
                                    <FaBook className="text-[#890C25]" />
                                  </div>

                                  <div>

                                    <p className="font-medium text-slate-700 max-w-[220px] truncate">
                                      {bookTitle}
                                    </p>

                                    {issueId && (
                                      <p className="text-xs text-slate-400 mt-1">
                                        Issue linked
                                      </p>
                                    )}

                                  </div>

                                </div>

                              </td>

                              {/* Date */}
                              <td className="px-5 py-4 text-slate-500 text-sm">

                                <span className="inline-flex items-center gap-2">

                                  <FaCalendarAlt className="text-slate-400" />

                                  {formatDate(fineDate)}

                                </span>

                              </td>

                              {/* Amount */}
                              <td className="px-5 py-4">

                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#890C25]/10 border border-[#890C25]/15 text-[#890C25] font-semibold">

                                  <FaMoneyBillWave className="text-xs" />

                                  {formatAmount(amount)}

                                </span>

                              </td>

                              {/* Status */}
                              <td className="px-5 py-4">

                                {status === "Paid" ? (
                                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">

                                    <FaCheckCircle />

                                    Paid

                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">

                                    <FaClock />

                                    Unpaid

                                  </span>
                                )}

                              </td>

                              {/* Action */}
                              <td className="px-5 py-4">

                                <button
                                  onClick={() => {

                                    if (fine?._id) {

                                      navigate(
                                        `/fines/view/${fine._id}`
                                      );

                                    } else if (
                                      issueId
                                    ) {

                                      navigate(
                                        `/issues/view/${issueId}`
                                      );

                                    }

                                  }}
                                  disabled={
                                    !fine?._id &&
                                    !issueId
                                  }
                                  className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                                  title="View Fine"
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
              {filteredFines.length > 0 && (
                <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">

                  <span className="text-slate-500">
                    Total displayed:{" "}
                    <span className="text-slate-800 font-semibold">
                      {filteredFines.length}
                    </span>
                  </span>

                  <div className="flex flex-wrap items-center gap-4">

                    <span className="text-slate-500">
                      Total Amount:{" "}
                      <span className="text-[#890C25] font-semibold">
                        {formatAmount(totalAmount)}
                      </span>
                    </span>

                    <span className="text-slate-500">
                      Paid:{" "}
                      <span className="text-green-600 font-semibold">
                        {paidFines}
                      </span>
                    </span>

                    <span className="text-slate-500">
                      Unpaid:{" "}
                      <span className="text-amber-600 font-semibold">
                        {unpaidFines}
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

export default FinesReport;

