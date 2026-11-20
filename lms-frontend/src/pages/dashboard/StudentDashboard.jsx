import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBook,
  FaUsers,
  FaBookOpen,
  FaDigitalTachograph,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowRight,
  FaSyncAlt,
  FaUserGraduate,
  FaLayerGroup,
  FaEye,
  FaDownload,
  FaUndo,
  FaMoneyBillWave,
  FaSearch,
  FaGraduationCap,
  FaChartLine,
  FaCalendarAlt,
  FaSpinner,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { useReports } from "../../context/ReportContext";

const StudentDashboard = () => {
  const { user } = useAuth();

  const {
    overviewReport,
    usersReport,
    booksReport,
    issuesReport,
    returnsReport,
    finesReport,
    digitalLibraryReport,

    getOverviewReport,
    getUsersReport,
    getBooksReport,
    getIssuesReport,
    getReturnsReport,
    getFinesReport,
    getDigitalLibraryReport,

    loading,
  } = useReports();

  const [refreshing, setRefreshing] = useState(false);
  const refreshLock = useRef(false);

  // =====================================================
  // LOAD DASHBOARD REPORTS
  // =====================================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await Promise.all([
          getOverviewReport(),
          getUsersReport(),
          getBooksReport(),
          getIssuesReport(),
          getReturnsReport(),
          getFinesReport(),
          getDigitalLibraryReport(),
        ]);
      } catch (error) {
        console.error("Student Dashboard Load Error:", error);
      }
    };

    loadDashboard();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =====================================================
  // DEBUG REPORT DATA
  // =====================================================

  useEffect(() => {
    console.log(
      "========== STUDENT DASHBOARD REPORT DATA =========="
    );

    console.log("OVERVIEW REPORT:", overviewReport);
    console.log("USERS REPORT:", usersReport);
    console.log("BOOKS REPORT:", booksReport);
    console.log("ISSUES REPORT:", issuesReport);
    console.log("RETURNS REPORT:", returnsReport);
    console.log("FINES REPORT:", finesReport);
    console.log(
      "DIGITAL LIBRARY REPORT:",
      digitalLibraryReport
    );

    console.log("CURRENT USER:", user);

    console.log(
      "===================================================="
    );
  }, [
    overviewReport,
    usersReport,
    booksReport,
    issuesReport,
    returnsReport,
    finesReport,
    digitalLibraryReport,
    user,
  ]);

  // =====================================================
  // REFRESH REPORTS
  // =====================================================

  const handleRefresh = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (refreshLock.current) return;

    refreshLock.current = true;
    setRefreshing(true);

    try {
      await Promise.all([
        getOverviewReport(),
        getUsersReport(),
        getBooksReport(),
        getIssuesReport(),
        getReturnsReport(),
        getFinesReport(),
        getDigitalLibraryReport(),
      ]);
    } catch (error) {
      console.error("Student Dashboard Refresh Error:", error);
    } finally {
      setRefreshing(false);
      refreshLock.current = false;
    }
  };

  // =====================================================
  // REPORT DATA
  // =====================================================

  const overview =
    overviewReport?.report ||
    overviewReport ||
    {};

  const usersSummary =
    usersReport?.summary ||
    usersReport?.report?.summary ||
    {};

  const booksSummary =
    booksReport?.summary ||
    booksReport?.report?.summary ||
    {};

  const issuesSummary =
    issuesReport?.summary ||
    issuesReport?.report?.summary ||
    {};

  const returnsSummary =
    returnsReport?.summary ||
    returnsReport?.report?.summary ||
    {};

  const finesSummary =
    finesReport?.summary ||
    finesReport?.report?.summary ||
    {};

  const digitalSummary =
    digitalLibraryReport?.summary ||
    digitalLibraryReport?.report?.summary ||
    {};

  // =====================================================
  // SAFE NUMBER HELPER
  // =====================================================

  const getNumber = (...values) => {
    const value = values.find(
      (item) =>
        item !== undefined &&
        item !== null &&
        item !== ""
    );

    const number = Number(value);

    return Number.isFinite(number) ? number : 0;
  };

  // =====================================================
  // GLOBAL LIBRARY DATA
  // =====================================================

  const totalUsers = getNumber(
    overview?.users?.total,
    overview?.users?.totalUsers,
    usersSummary?.totalUsers,
    usersSummary?.total
  );

  const totalBooks = getNumber(
    overview?.books?.total,
    overview?.books?.totalBooks,
    booksSummary?.totalBooks,
    booksSummary?.total
  );

  const activeBooks = getNumber(
    overview?.books?.active,
    overview?.books?.activeBooks,
    booksSummary?.activeBooks
  );

  const inactiveBooks = getNumber(
    overview?.books?.inactive,
    overview?.books?.inactiveBooks,
    booksSummary?.inactiveBooks
  );

  const totalIssues = getNumber(
    overview?.issues?.total,
    overview?.issues?.totalIssues,
    issuesSummary?.totalIssues,
    issuesSummary?.total
  );

  const pendingIssues = getNumber(
    overview?.issues?.pending,
    overview?.issues?.pendingIssues,
    issuesSummary?.pending,
    issuesSummary?.pendingIssues
  );

  const totalReturns = getNumber(
    overview?.returns?.total,
    overview?.returns?.totalReturns,
    returnsSummary?.totalReturns,
    returnsSummary?.total
  );

  const pendingReturns = getNumber(
    overview?.returns?.pending,
    overview?.returns?.pendingReturns,
    returnsSummary?.pending,
    returnsSummary?.pendingReturns
  );

  const totalFines = getNumber(
    overview?.fines?.total,
    overview?.fines?.totalFines,
    finesSummary?.totalFines,
    finesSummary?.total
  );

  const totalFineAmount = getNumber(
    overview?.fines?.totalAmount,
    overview?.fines?.amount,
    finesSummary?.totalAmount,
    finesSummary?.amount
  );

  const totalDigitalBooks = getNumber(
    overview?.digitalLibrary?.total,
    overview?.digitalLibrary?.totalBooks,
    digitalSummary?.totalBooks,
    digitalSummary?.total
  );

  const digitalActiveBooks = getNumber(
    overview?.digitalLibrary?.active,
    overview?.digitalLibrary?.activeBooks,
    digitalSummary?.activeBooks
  );

  const digitalInactiveBooks = getNumber(
    overview?.digitalLibrary?.inactive,
    overview?.digitalLibrary?.inactiveBooks,
    digitalSummary?.inactiveBooks
  );

  const totalDigitalViews = getNumber(
    overview?.digitalLibrary?.totalViews,
    digitalSummary?.totalViews,
    digitalSummary?.views
  );

  const totalDigitalDownloads = getNumber(
    overview?.digitalLibrary?.totalDownloads,
    digitalSummary?.totalDownloads,
    digitalSummary?.downloads
  );

  // =====================================================
  // CURRENT STUDENT ID
  // =====================================================

  const currentStudentId = String(
    user?._id ||
      user?.id ||
      user?.userId ||
      user?.studentId ||
      user?.student?._id ||
      user?.student?.id ||
      ""
  );

  // =====================================================
  // NORMALIZE ID
  // =====================================================

  const normalizeId = (value) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return "";
    }

    return String(value);
  };

  // =====================================================
  // GET STUDENT ID FROM REPORT RECORD
  // =====================================================

  const getStudentId = (record) => {
    if (!record) return "";

    const student = record?.student;

    if (
      typeof student === "string" ||
      typeof student === "number"
    ) {
      return normalizeId(student);
    }

    return normalizeId(
      student?._id ||
        student?.id ||
        student?.userId ||
        student?.studentId ||
        student?.user?._id ||
        student?.user?.id ||
        record?.studentId ||
        record?.userId
    );
  };

  // =====================================================
  // GET REPORT ARRAY
  // =====================================================

  const getArray = (report, key) => {
    if (Array.isArray(report?.[key])) {
      return report[key];
    }

    if (Array.isArray(report?.report?.[key])) {
      return report.report[key];
    }

    if (Array.isArray(report?.data?.[key])) {
      return report.data[key];
    }

    return [];
  };

  // =====================================================
  // REPORT ARRAYS
  // =====================================================

  const issueRecords = getArray(
    issuesReport,
    "issues"
  );

  const returnRecords = getArray(
    returnsReport,
    "returns"
  );

  const fineRecords = getArray(
    finesReport,
    "fines"
  );

  // =====================================================
  // MY ISSUED BOOKS
  // =====================================================

  const myIssuedBooks = useMemo(() => {
    if (!currentStudentId) {
      return [];
    }

    return issueRecords.filter(
      (issue) =>
        getStudentId(issue) === currentStudentId
    );
  }, [issueRecords, currentStudentId]);

  // =====================================================
  // MY RETURNS
  // =====================================================

  const myReturns = useMemo(() => {
    if (!currentStudentId) {
      return [];
    }

    return returnRecords.filter(
      (item) =>
        getStudentId(item) === currentStudentId
    );
  }, [returnRecords, currentStudentId]);

  // =====================================================
  // MY FINES
  // =====================================================

  const myFines = useMemo(() => {
    if (!currentStudentId) {
      return [];
    }

    return fineRecords.filter(
      (fine) =>
        getStudentId(fine) === currentStudentId
    );
  }, [fineRecords, currentStudentId]);

  // =====================================================
  // STUDENT CALCULATIONS
  // =====================================================

  const myActiveIssues = myIssuedBooks.filter(
    (issue) => {
      const status = String(
        issue?.status || ""
      ).toLowerCase();

      return status !== "returned";
    }
  );

  const myPendingReturns = myReturns.filter(
    (item) => {
      const status = String(
        item?.status || ""
      ).toLowerCase();

      return status === "pending";
    }
  );

  const myCompletedReturns = myReturns.filter(
    (item) => {
      const status = String(
        item?.status || ""
      ).toLowerCase();

      return (
        status === "returned" ||
        status === "completed"
      );
    }
  );

  const myFineAmount = myFines.reduce(
    (total, fine) =>
      total +
      getNumber(
        fine?.amount,
        fine?.fineAmount
      ),
    0
  );

  // =====================================================
  // ROLE STATS
  // =====================================================

  const roleStats =
    usersSummary?.roleStats ||
    usersReport?.roleStats ||
    {};

  const studentCount = Array.isArray(roleStats)
    ? getNumber(
        roleStats.find(
          (item) =>
            String(
              item?.role || ""
            ).toLowerCase() === "student"
        )?.count
      )
    : getNumber(
        roleStats?.student,
        roleStats?.students
      );

  // =====================================================
  // PERCENTAGES
  // =====================================================

  const bookAvailabilityPercentage =
    totalBooks > 0
      ? Math.round(
          (activeBooks / totalBooks) * 100
        )
      : 0;

  const digitalActivityPercentage =
    totalDigitalBooks > 0
      ? Math.round(
          (digitalActiveBooks /
            totalDigitalBooks) *
            100
        )
      : 0;

  // =====================================================
  // FORMAT
  // =====================================================

  const formatNumber = (value) =>
    Number(value || 0).toLocaleString();

  const formatCurrency = (value) =>
    `Rs. ${Number(
      value || 0
    ).toLocaleString()}`;

  // =====================================================
  // MAIN STATS
  // =====================================================

  const mainStats = [
    {
      title: "My Issued Books",
      value: formatNumber(
        myActiveIssues.length
      ),
      description:
        "Currently issued to you",
      icon: FaBookOpen,
      color: "blue",
      link: "/my-issued-books",
    },
    {
      title: "Pending Returns",
      value: formatNumber(
        myPendingReturns.length
      ),
      description:
        "Your pending return requests",
      icon: FaClipboardList,
      color: "maroon",
      link: "/returns",
    },
    {
      title: "Available Books",
      value: formatNumber(activeBooks),
      description:
        "Active library books",
      icon: FaBook,
      color: "blue",
      link: "/books",
    },
    {
      title: "Digital Books",
      value: formatNumber(
        totalDigitalBooks
      ),
      description:
        "Digital library collection",
      icon: FaDigitalTachograph,
      color: "maroon",
      link: "/digital-library/books",
    },
  ];

  // =====================================================
  // SECONDARY STATS
  // =====================================================

  const secondaryStats = [
    {
      title: "My Returns",
      value: formatNumber(
        myReturns.length
      ),
      icon: FaUndo,
    },
    {
      title: "Pending Returns",
      value: formatNumber(
        myPendingReturns.length
      ),
      icon: FaClock,
    },
    {
      title: "My Fines",
      value: formatNumber(
        myFines.length
      ),
      icon: FaMoneyBillWave,
    },
    {
      title: "My Fine Amount",
      value: formatCurrency(
        myFineAmount
      ),
      icon: FaExclamationCircle,
    },
  ];

  // =====================================================
  // QUICK ACTIONS
  // =====================================================

  const quickActions = [
    {
      title: "Browse Books",
      description:
        "Explore the library collection",
      icon: FaSearch,
      link: "/library/books",
    },
    {
      title: "My Issued Books",
      description:
        "View books issued to you",
      icon: FaBookOpen,
      link: "/my-issued-books",
    },
    {
      title: "Digital Library",
      description:
        "Read digital books online",
      icon: FaDigitalTachograph,
      link: "/digital-library/books",
    },
    {
      title: "Book Requests",
      description:
        "Track your book requests",
      icon: FaClipboardList,
      link: "/requests/my",
    },
  ];

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-white to-pink-50 p-4 sm:p-6 lg:p-8">

      {/* BACKGROUND DECORATION */}

      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#890C25]/10 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-96 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#D58A98]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl  mt-6">

        {/* HERO HEADER */}

        <div className="group relative mb-7 overflow-hidden rounded-3xl border border-[#D58A98]/30 bg-gradient-to-br from-[#890C25] via-[#76091F] to-[#5F0719] p-6 shadow-2xl sm:p-8">

          <div className="absolute left-0 top-0 h-1 w-0 bg-white transition-all duration-700 group-hover:w-full" />

          <div className="absolute right-0 top-0 h-1 w-0 bg-blue-400 transition-all delay-100 duration-700 group-hover:w-1/2" />

          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/10 bg-white/5" />

          <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full border border-[#D58A98]/20 bg-[#D58A98]/10" />

          <div className="absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-white/5 blur-xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

            <div className="flex items-start gap-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur-md">
                <FaGraduationCap className="text-3xl text-white" />
              </div>

              <div>

                <p className="mb-1 text-sm font-semibold uppercase tracking-[0.25em] text-[#D58A98]">
                  Academic Portal
                </p>

                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Student Dashboard
                </h1>

                <p className="mt-2 text-sm text-white/75 sm:text-base">
                  Welcome back,{" "}
                  <span className="font-bold text-white">
                    {user?.name || "Student"}
                  </span>
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">

                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
                    <FaUserGraduate className="mr-1 inline-block" />
                    {user?.role || "Student"}
                  </span>

                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
                    <FaCalendarAlt className="mr-1 inline-block" />
                    Academic Portal
                  </span>

                </div>

              </div>

            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={
                refreshing || loading
              }
              className="group/btn inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#890C25] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#F8E8EC] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {refreshing || loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaSyncAlt className="transition-transform duration-500 group-hover/btn:rotate-180" />
              )}

              {refreshing
                ? "Refreshing..."
                : "Refresh Data"}
            </button>

          </div>
        </div>

        {/* MAIN STAT CARDS */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {mainStats.map((stat) => {
            const Icon = stat.icon;
            const isMaroon =
              stat.color === "maroon";

            return (
              <Link
                key={stat.title}
                to={stat.link}
                className={`group relative overflow-hidden rounded-2xl border p-5 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  isMaroon
                    ? "border-[#D58A98]/30 bg-gradient-to-br from-[#890C25] via-[#76091F] to-[#5F0719]"
                    : "border-blue-200 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900"
                }`}
              >

                <div className="absolute left-0 top-0 h-1 w-0 bg-white transition-all duration-500 group-hover:w-full" />

                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-white/10 bg-white/5 transition-transform duration-500 group-hover:scale-150" />

                <div className="relative">

                  <div className="mb-5 flex items-center justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-xl text-white backdrop-blur-md">
                      <Icon />
                    </div>

                    <FaArrowRight className="text-white/60 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />

                  </div>

                  <p className="text-sm font-semibold text-white/70">
                    {stat.title}
                  </p>

                  <h2 className="mt-1 text-3xl font-black text-white">
                    {stat.value}
                  </h2>

                  <p className="mt-2 text-xs text-white/60">
                    {stat.description}
                  </p>

                </div>
              </Link>
            );
          })}

        </div>

        {/* SECONDARY STATS */}

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {secondaryStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-md backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-[#890C25] to-blue-600 transition-all duration-500 group-hover:w-full" />

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25] transition-all duration-300 group-hover:scale-110">
                    <Icon />
                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {stat.title}
                    </p>

                    <p className="mt-1 text-xl font-black text-slate-800">
                      {stat.value}
                    </p>

                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* ANALYTICS SECTION */}

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* LIBRARY AVAILABILITY */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-[#890C25] to-blue-600 transition-all duration-700 group-hover:w-full" />

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#890C25]">
                  Library
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-800">
                  Library Availability
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FaBook />
              </div>

            </div>

            <div className="mt-7">

              <div className="mb-3 flex items-center justify-between">

                <span className="text-sm font-semibold text-slate-600">
                  Active Collection
                </span>

                <span className="font-black text-[#890C25]">
                  {bookAvailabilityPercentage}%
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#890C25] to-blue-600 transition-all duration-1000"
                  style={{
                    width: `${bookAvailabilityPercentage}%`,
                  }}
                />

              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">

                <div className="rounded-2xl bg-blue-50 p-4">

                  <p className="text-xs font-semibold text-blue-600">
                    Active Books
                  </p>

                  <p className="mt-1 text-2xl font-black text-slate-800">
                    {formatNumber(
                      activeBooks
                    )}
                  </p>

                </div>

                <div className="rounded-2xl bg-[#F8E8EC] p-4">

                  <p className="text-xs font-semibold text-[#890C25]">
                    Inactive Books
                  </p>

                  <p className="mt-1 text-2xl font-black text-slate-800">
                    {formatNumber(
                      inactiveBooks
                    )}
                  </p>

                </div>

              </div>

              <p className="mt-4 text-sm text-slate-500">
                Total library books:{" "}
                <span className="font-bold text-slate-700">
                  {formatNumber(
                    totalBooks
                  )}
                </span>
              </p>

            </div>
          </div>

          {/* DIGITAL LIBRARY */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-blue-600 to-[#890C25] transition-all duration-700 group-hover:w-full" />

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  Digital Library
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-800">
                  Digital Activity
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8E8EC] text-[#890C25]">
                <FaDigitalTachograph />
              </div>

            </div>

            <div className="mt-7">

              <div className="mb-3 flex items-center justify-between">

                <span className="text-sm font-semibold text-slate-600">
                  Active Digital Books
                </span>

                <span className="font-black text-blue-600">
                  {digitalActivityPercentage}%
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-[#890C25] transition-all duration-1000"
                  style={{
                    width: `${digitalActivityPercentage}%`,
                  }}
                />

              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">

                <div className="rounded-2xl bg-blue-50 p-4">

                  <div className="flex items-center gap-2 text-blue-600">

                    <FaEye />

                    <span className="text-xs font-bold">
                      Views
                    </span>

                  </div>

                  <p className="mt-1 text-2xl font-black text-slate-800">
                    {formatNumber(
                      totalDigitalViews
                    )}
                  </p>

                </div>

                <div className="rounded-2xl bg-[#F8E8EC] p-4">

                  <div className="flex items-center gap-2 text-[#890C25]">

                    <FaDownload />

                    <span className="text-xs font-bold">
                      Downloads
                    </span>

                  </div>

                  <p className="mt-1 text-2xl font-black text-slate-800">
                    {formatNumber(
                      totalDigitalDownloads
                    )}
                  </p>

                </div>

              </div>

              <div className="mt-4 flex items-center justify-between text-sm">

                <span className="text-slate-500">
                  Digital collection
                </span>

                <span className="font-bold text-slate-700">
                  {formatNumber(
                    totalDigitalBooks
                  )}{" "}
                  books
                </span>

              </div>

              <div className="mt-2 flex items-center justify-between text-sm">

                <span className="text-slate-500">
                  Inactive digital books
                </span>

                <span className="font-bold text-slate-700">
                  {formatNumber(
                    digitalInactiveBooks
                  )}
                </span>

              </div>

            </div>
          </div>

        </div>

        {/* MY LIBRARY / RETURNS / FINES */}

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* MY LIBRARY */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-[#890C25] transition-all duration-700 group-hover:w-full" />

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8E8EC] text-[#890C25]">
                <FaBookOpen />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wide text-[#890C25]">
                  My Library
                </p>

                <h3 className="font-black text-slate-800">
                  Reading Activity
                </h3>

              </div>

            </div>

            <div className="mt-6 space-y-4">

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">

                <span className="text-sm text-slate-600">
                  Active Issues
                </span>

                <span className="font-black text-[#890C25]">
                  {formatNumber(
                    myActiveIssues.length
                  )}
                </span>

              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">

                <span className="text-sm text-slate-600">
                  Total Returns
                </span>

                <span className="font-black text-blue-600">
                  {formatNumber(
                    myReturns.length
                  )}
                </span>

              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">

                <span className="text-sm text-slate-600">
                  Completed Returns
                </span>

                <span className="font-black text-emerald-600">
                  {formatNumber(
                    myCompletedReturns.length
                  )}
                </span>

              </div>

            </div>

            <Link
              to="/my-issued-books"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#890C25] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#76091F]"
            >
              View My Books
              <FaArrowRight />
            </Link>

          </div>

          {/* RETURNS */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-blue-600 transition-all duration-700 group-hover:w-full" />

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FaUndo />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                  Returns
                </p>

                <h3 className="font-black text-slate-800">
                  Return Status
                </h3>

              </div>

            </div>

            <div className="mt-6 space-y-4">

              <div className="rounded-xl bg-amber-50 p-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold text-amber-700">
                    Pending
                  </span>

                  <FaClock className="text-amber-600" />

                </div>

                <p className="mt-1 text-2xl font-black text-slate-800">
                  {formatNumber(
                    myPendingReturns.length
                  )}
                </p>

              </div>

              <div className="rounded-xl bg-emerald-50 p-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold text-emerald-700">
                    Completed
                  </span>

                  <FaCheckCircle className="text-emerald-600" />

                </div>

                <p className="mt-1 text-2xl font-black text-slate-800">
                  {formatNumber(
                    myCompletedReturns.length
                  )}
                </p>

              </div>

            </div>

            <Link
              to="/returns"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700"
            >
              View Returns
              <FaArrowRight />
            </Link>

          </div>

          {/* FINES */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur-xl">

            <div className="absolute left-0 top-0 h-1 w-0 bg-[#890C25] transition-all duration-700 group-hover:w-full" />

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8E8EC] text-[#890C25]">
                <FaMoneyBillWave />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wide text-[#890C25]">
                  Fines
                </p>

                <h3 className="font-black text-slate-800">
                  My Fine Summary
                </h3>

              </div>

            </div>

            <div className="mt-6">

              <div className="rounded-2xl bg-gradient-to-br from-[#890C25] to-[#5F0719] p-5 text-white">

                <p className="text-sm text-white/70">
                  My Fine Amount
                </p>

                <p className="mt-1 text-3xl font-black">
                  {formatCurrency(
                    myFineAmount
                  )}
                </p>

                <p className="mt-2 text-xs text-white/60">
                  {formatNumber(
                    myFines.length
                  )}{" "}
                  fine record(s)
                </p>

              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-slate-50 p-3">

                  <p className="text-xs text-slate-500">
                    My Fines
                  </p>

                  <p className="mt-1 text-lg font-black text-slate-800">
                    {formatNumber(
                      myFines.length
                    )}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-3">

                  <p className="text-xs text-slate-500">
                    System Fine Amount
                  </p>

                  <p className="mt-1 text-lg font-black text-slate-800">
                    {formatCurrency(
                      totalFineAmount
                    )}
                  </p>

                </div>

              </div>

            </div>
          </div>

        </div>

        {/* QUICK ACTIONS */}

        <div className="mt-7 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur-xl">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#890C25]">
                Student Workspace
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-800">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Access your most-used library features quickly.
              </p>

            </div>

            <FaChartLine className="hidden text-3xl text-[#D58A98] sm:block" />

          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  to={action.link}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D58A98]/50 hover:bg-white hover:shadow-lg"
                >

                  <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-[#890C25] to-blue-600 transition-all duration-500 group-hover:w-full" />

                  <div className="flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25] transition-all duration-300 group-hover:scale-110">
                      <Icon />
                    </div>

                    <FaArrowRight className="text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#890C25]" />

                  </div>

                  <h3 className="mt-5 font-black text-slate-800">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {action.description}
                  </p>

                </Link>
              );
            })}

          </div>
        </div>

        {/* SYSTEM OVERVIEW */}

        <div className="mt-7 rounded-3xl border border-[#D58A98]/20 bg-gradient-to-r from-[#890C25]/5 via-white to-blue-50 p-6 shadow-md">

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                <FaUsers />
              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Students
                </p>

                <p className="text-xl font-black text-slate-800">
                  {formatNumber(
                    studentCount
                  )}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <FaLayerGroup />
              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Library Issues
                </p>

                <p className="text-xl font-black text-slate-800">
                  {formatNumber(
                    totalIssues
                  )}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8E8EC] text-[#890C25]">
                <FaCheckCircle />
              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pending Issues
                </p>

                <p className="text-xl font-black text-slate-800">
                  {formatNumber(
                    pendingIssues
                  )}
                </p>

              </div>

            </div>

          </div>
        </div>

        {/* FOOTER */}

        <div className="py-8 text-center">

          <p className="text-sm font-semibold text-slate-500">
            Student Academic Portal
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Learn • Read • Explore • Grow 
          </p>

        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;