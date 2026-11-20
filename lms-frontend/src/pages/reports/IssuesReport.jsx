import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaSyncAlt,
  FaCalendarAlt,
  FaUser,
  FaArrowLeft,
  FaEye,
  FaChartPie,
  FaExclamationTriangle,
  FaUndo,
} from "react-icons/fa";

import { useReports } from "../../context/ReportContext";

const IssuesReport = () => {
  const navigate = useNavigate();

  const {
    issuesReport,
    getIssuesReport,
    loading,
    error,
  } = useReports();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    getIssuesReport();
  }, []);

  const report = issuesReport?.report || issuesReport || {};

  const issues = Array.isArray(report?.issues)
    ? report.issues
    : Array.isArray(report?.data)
    ? report.data
    : Array.isArray(report?.data?.issues)
    ? report.data.issues
    : [];

  const summary = report?.summary || report?.stats || {};

  const getNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  };

  const getIssueStatus = (issue) => {
    const rawStatus = String(
      issue?.status ||
        issue?.issueStatus ||
        issue?.state ||
        ""
    ).toLowerCase();

    if (
      rawStatus.includes("return") ||
      rawStatus === "returned" ||
      rawStatus === "complete" ||
      rawStatus === "completed"
    ) {
      return "Returned";
    }

    if (
      rawStatus === "pending" ||
      rawStatus === "issued" ||
      rawStatus === "active" ||
      rawStatus === "not returned" ||
      rawStatus === ""
    ) {
      return "Pending";
    }

    return issue?.status || issue?.issueStatus || "Pending";
  };

  const getStudentName = (issue) => {
    const student = issue?.student;

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
      issue?.studentName ||
      issue?.userName ||
      student ||
      "Unknown Student"
    );
  };

  const getStudentEmail = (issue) => {
    const student = issue?.student;

    if (typeof student === "object" && student) {
      return student.email || "";
    }

    return issue?.studentEmail || issue?.email || "";
  };

  const getBookTitle = (issue) => {
    const book = issue?.book;

    if (typeof book === "object" && book) {
      return (
        book.title ||
        book.name ||
        book.bookName ||
        "Unknown Book"
      );
    }

    return (
      issue?.bookTitle ||
      issue?.bookName ||
      book ||
      "Unknown Book"
    );
  };

  const getIssueDate = (issue) => {
    return (
      issue?.issueDate ||
      issue?.issuedAt ||
      issue?.createdAt ||
      issue?.date ||
      null
    );
  };

  const getReturnDate = (issue) => {
    return (
      issue?.returnDate ||
      issue?.returnedAt ||
      issue?.actualReturnDate ||
      null
    );
  };

  const totalIssues =
    getNumber(summary?.totalIssues) ||
    getNumber(report?.totalIssues) ||
    issues.length;

  const returnedIssues =
    getNumber(summary?.returnedIssues) ||
    getNumber(summary?.returned) ||
    getNumber(report?.returnedIssues) ||
    getNumber(report?.returned) ||
    issues.filter(
      (issue) => getIssueStatus(issue) === "Returned"
    ).length;

  const pendingIssues =
    getNumber(summary?.pendingIssues) ||
    getNumber(summary?.pending) ||
    getNumber(report?.pendingIssues) ||
    getNumber(report?.pending) ||
    issues.filter(
      (issue) => getIssueStatus(issue) === "Pending"
    ).length;

  const returnedPercentage =
    totalIssues > 0
      ? Math.round((returnedIssues / totalIssues) * 100)
      : 0;

  const pendingPercentage =
    totalIssues > 0
      ? Math.round((pendingIssues / totalIssues) * 100)
      : 0;

  const statusStats = useMemo(() => {
    const statusMap = {};

    issues.forEach((issue) => {
      const status = getIssueStatus(issue);

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
  }, [issues]);

  const reportStatusStats = Array.isArray(
    report?.statusStats
  )
    ? report.statusStats
    : Array.isArray(report?.statuses)
    ? report.statuses
    : statusStats;

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const studentName =
        getStudentName(issue).toLowerCase();

      const studentEmail =
        getStudentEmail(issue).toLowerCase();

      const bookTitle =
        getBookTitle(issue).toLowerCase();

      const status = String(
        getIssueStatus(issue)
      ).toLowerCase();

      const search = searchTerm
        .toLowerCase()
        .trim();

      const matchesSearch =
        !search ||
        studentName.includes(search) ||
        studentEmail.includes(search) ||
        bookTitle.includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        getIssueStatus(issue) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [issues, searchTerm, statusFilter]);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysDifference = (startDate, endDate) => {
    if (!startDate) return null;

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return null;
    }

    const difference =
      end.getTime() - start.getTime();

    return Math.max(
      0,
      Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      )
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const reloadReport = () => {
    getIssuesReport();
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
            HERO HEADER
        ====================================================== */}

        <div
          className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-[#890C25]/20 mb-6"
          style={{
            background:
              "linear-gradient(135deg, #890C25 0%, #6f091e 55%, #420512 100%)",
          }}
        >

          {/* Top Animated Line */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D58A98] to-transparent animate-pulse" />

          {/* Decorative Circles */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full border border-white/10" />

          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full border border-white/10" />

          <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full border border-white/10" />

          <div className="absolute top-12 right-[35%] w-16 h-16 rounded-full bg-white/5 animate-pulse" />

          <div className="absolute bottom-8 right-20 w-10 h-10 rounded-full bg-[#D58A98]/10" />

          <div className="relative p-6 md:p-8">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div>

                {/* Back Button */}
                <button
                  onClick={() => navigate("/reports")}
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-5 transition"
                >
                  <FaArrowLeft />
                  Back to Reports
                </button>

                <div className="flex items-center gap-4">

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center shadow-xl">
                    <FaClipboardList className="text-2xl text-white" />
                  </div>

                  <div>

                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs uppercase tracking-[0.2em] text-[#D58A98] font-semibold">
                        Circulation Analytics
                      </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      Issues Report
                    </h1>

                    <p className="text-white/65 mt-1 text-sm md:text-base">
                      Complete book issue and circulation analytics
                    </p>

                  </div>

                </div>

              </div>

              {/* Refresh */}
              <button
                onClick={reloadReport}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white text-[#890C25] font-semibold hover:bg-slate-100 disabled:opacity-60 transition shadow-xl"
              >
                <FaSyncAlt
                  className={
                    loading ? "animate-spin" : ""
                  }
                />
                Refresh Report
              </button>

            </div>

            {/* Hero Bottom Mini Info */}
            <div className="mt-7 pt-5 border-t border-white/10 flex flex-wrap gap-5 text-xs text-white/60">

              <span className="flex items-center gap-2">
                <FaClipboardList className="text-[#D58A98]" />
                Total Issues: {totalIssues}
              </span>

              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-green-300" />
                Returned: {returnedIssues}
              </span>

              <span className="flex items-center gap-2">
                <FaClock className="text-[#D58A98]" />
                Pending: {pendingIssues}
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

        {loading && !issuesReport ? (
          <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-14 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#890C25]/10 flex items-center justify-center mb-5">
              <FaSyncAlt className="text-3xl text-[#890C25] animate-spin" />
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              Loading Issues Report
            </h3>

            <p className="text-slate-500 mt-2">
              Please wait while circulation analytics are being loaded...
            </p>

          </div>
        ) : (
          <>

            {/* =====================================================
                STAT CARDS
            ====================================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">

              {/* Total */}
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
                      Total Issues
                    </p>

                    <h2 className="text-3xl font-bold text-white mt-2">
                      {totalIssues}
                    </h2>

                    <p className="text-xs text-[#D58A98] mt-2">
                      All issued books
                    </p>
                  </div>

                  <div className="w-13 h-13 w-[52px] rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                    <FaClipboardList className="text-white text-xl" />
                  </div>

                </div>
              </div>

              {/* Returned */}
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
                      Returned
                    </p>

                    <h2 className="text-3xl font-bold text-white mt-2">
                      {returnedIssues}
                    </h2>

                    <p className="text-xs text-green-300 mt-2">
                      {returnedPercentage}% completed
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
                      Pending Issues
                    </p>

                    <h2 className="text-3xl font-bold text-white mt-2">
                      {pendingIssues}
                    </h2>

                    <p className="text-xs text-[#D58A98] mt-2">
                      {pendingPercentage}% still issued
                    </p>
                  </div>

                  <div className="w-[52px] h-[52px] rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                    <FaClock className="text-[#D58A98] text-xl" />
                  </div>

                </div>
              </div>

            </div>

            {/* =====================================================
                ANALYTICS
            ====================================================== */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

              {/* Issue Status */}
              <div className="relative overflow-hidden rounded-[1.75rem] bg-white border border-slate-200 shadow-xl group">

                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#890C25] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

                <div className="p-6">

                  <div className="flex items-center gap-3 mb-7">

                    <div className="w-12 h-12 rounded-2xl bg-[#890C25]/10 flex items-center justify-center">
                      <FaChartPie className="text-[#890C25] text-lg" />
                    </div>

                    <div>
                      <h2 className="font-bold text-lg text-slate-800">
                        Issue Status
                      </h2>

                      <p className="text-sm text-slate-500">
                        Returned vs pending circulation
                      </p>
                    </div>

                  </div>

                  <div className="space-y-6">

                    {/* Returned */}
                    <div>

                      <div className="flex justify-between mb-2">

                        <span className="text-sm font-medium text-slate-600">
                          Returned
                        </span>

                        <span className="text-sm font-bold text-green-600">
                          {returnedIssues} ({returnedPercentage}%)
                        </span>

                      </div>

                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                        <div
                          className="h-full bg-green-500 rounded-full transition-all duration-700"
                          style={{
                            width: `${returnedPercentage}%`,
                          }}
                        />

                      </div>

                    </div>

                    {/* Pending */}
                    <div>

                      <div className="flex justify-between mb-2">

                        <span className="text-sm font-medium text-slate-600">
                          Pending
                        </span>

                        <span className="text-sm font-bold text-[#890C25]">
                          {pendingIssues} ({pendingPercentage}%)
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

                  {/* Bottom Summary */}
                  <div className="grid grid-cols-2 gap-3 mt-7">

                    <div className="rounded-xl bg-green-50 border border-green-100 p-3">
                      <p className="text-xs text-green-600">
                        Returned
                      </p>
                      <p className="text-xl font-bold text-green-700 mt-1">
                        {returnedIssues}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#890C25]/5 border border-[#890C25]/10 p-3">
                      <p className="text-xs text-[#890C25]">
                        Pending
                      </p>
                      <p className="text-xl font-bold text-[#890C25] mt-1">
                        {pendingIssues}
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
                      <FaClipboardList className="text-blue-600 text-lg" />
                    </div>

                    <div>
                      <h2 className="font-bold text-lg text-slate-800">
                        Status Breakdown
                      </h2>

                      <p className="text-sm text-slate-500">
                        Issues grouped by status
                      </p>
                    </div>

                  </div>

                  {reportStatusStats.length === 0 ? (
                    <div className="text-center py-8">

                      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                        <FaClipboardList className="text-slate-400 text-xl" />
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
                            getNumber(item?.count) ||
                            getNumber(item?.total);

                          const percentage =
                            totalIssues > 0
                              ? Math.round(
                                  (count / totalIssues) * 100
                                )
                              : 0;

                          const isReturned =
                            String(name)
                              .toLowerCase()
                              .includes("return");

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
                                    isReturned
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
                                    isReturned
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

            <div className="relative overflow-hidden rounded-[1.75rem] bg-white border border-slate-200 shadow-xl p-5 md:p-6 mb-6 group">

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
                      Find specific circulation records
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
                      setSearchTerm(e.target.value)
                    }
                    placeholder="Search student, email, or book..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/10 transition"
                  />

                </div>

                {/* Status */}
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-700 outline-none focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/10 transition"
                >

                  <option value="all">
                    All Status
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Returned">
                    Returned
                  </option>

                </select>

              </div>

            </div>

            {/* =====================================================
                ISSUES TABLE
            ====================================================== */}

            <div className="relative overflow-hidden rounded-[1.75rem] bg-white border border-slate-200 shadow-xl">

              {/* Top Line */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#890C25] to-transparent" />

              {/* Table Header */}
              <div className="p-5 md:p-6 border-b border-slate-200">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-[#890C25]/10 flex items-center justify-center">
                        <FaBook className="text-[#890C25]" />
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-slate-800">
                          Issues List
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                          Showing {filteredIssues.length} of{" "}
                          {issues.length} issues
                        </p>
                      </div>

                    </div>

                  </div>

                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#890C25] bg-[#890C25]/5 border border-[#890C25]/10 px-4 py-2 rounded-xl">
                    <FaClipboardList />
                    {filteredIssues.length} Results
                  </div>

                </div>

              </div>

              {filteredIssues.length === 0 ? (
                <div className="py-16 text-center">

                  <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <FaClipboardList className="text-2xl text-slate-400" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-700">
                    No Issues Found
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Try changing your search or filters.
                  </p>

                </div>
              ) : (
                <div className="overflow-x-auto">

                  <table className="w-full min-w-[1150px]">

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
                          Issue Date
                        </th>

                        <th className="px-5 py-4">
                          Return Date
                        </th>

                        <th className="px-5 py-4">
                          Duration
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

                      {filteredIssues.map(
                        (issue, index) => {

                          const studentName =
                            getStudentName(issue);

                          const studentEmail =
                            getStudentEmail(issue);

                          const bookTitle =
                            getBookTitle(issue);

                          const issueDate =
                            getIssueDate(issue);

                          const returnDate =
                            getReturnDate(issue);

                          const status =
                            getIssueStatus(issue);

                          const duration =
                            getDaysDifference(
                              issueDate,
                              returnDate
                            );

                          return (
                            <tr
                              key={
                                issue?._id ||
                                issue?.id ||
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

                              {/* Issue Date */}
                              <td className="px-5 py-4 text-slate-500 text-sm">

                                <span className="inline-flex items-center gap-2">
                                  <FaCalendarAlt className="text-[#890C25]" />
                                  {formatDate(issueDate)}
                                </span>

                              </td>

                              {/* Return Date */}
                              <td className="px-5 py-4 text-slate-500 text-sm">

                                {returnDate ? (
                                  <span className="inline-flex items-center gap-2">
                                    <FaUndo className="text-green-600" />
                                    {formatDate(returnDate)}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">
                                    Not returned
                                  </span>
                                )}

                              </td>

                              {/* Duration */}
                              <td className="px-5 py-4">

                                {duration !== null ? (
                                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
                                    <FaClock />
                                    {duration} days
                                  </span>
                                ) : (
                                  <span className="text-slate-400">
                                    —
                                  </span>
                                )}

                              </td>

                              {/* Status */}
                              <td className="px-5 py-4">

                                {status === "Returned" ? (
                                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
                                    <FaCheckCircle />
                                    Returned
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
                                    if (issue?._id) {
                                      navigate(
                                        `/issues/view/${issue._id}`
                                      );
                                    }
                                  }}
                                  disabled={!issue?._id}
                                  className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center disabled:opacity-30"
                                  title="View Issue"
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

              {/* =====================================================
                  TABLE FOOTER
              ====================================================== */}

              {filteredIssues.length > 0 && (
                <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">

                  <span className="text-slate-500">
                    Total displayed:{" "}
                    <span className="text-slate-800 font-bold">
                      {filteredIssues.length}
                    </span>
                  </span>

                  <div className="flex items-center gap-5">

                    <span className="text-slate-500">
                      Returned:{" "}
                      <span className="text-green-600 font-bold">
                        {returnedIssues}
                      </span>
                    </span>

                    <span className="text-slate-500">
                      Pending:{" "}
                      <span className="text-[#890C25] font-bold">
                        {pendingIssues}
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

export default IssuesReport;

