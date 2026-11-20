
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaBookOpen,
  FaUsers,
  FaClipboardList,
  FaChartLine,
  FaArrowRight,
  FaSyncAlt,
  FaGraduationCap,
  FaUserGraduate,
  FaLayerGroup,
  FaCalendarAlt,
  FaBell,
  FaCheckCircle,
  FaClock,
  FaUndo,
  FaDownload,
  FaEye,
  FaSpinner,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { useReports } from "../../context/ReportContext";
import { useCourses } from "../../context/CourseContext";

const TeacherDashboard = () => {
  const { user } = useAuth();

  const {
    overviewReport,
    usersReport,
    booksReport,
    issuesReport,
    returnsReport,
    digitalLibraryReport,
    loading: reportsLoading,
    getOverviewReport,
    getUsersReport,
    getBooksReport,
    getIssuesReport,
    getReturnsReport,
    getDigitalLibraryReport,
  } = useReports();

  const courseContext = useCourses();

  const {
    courses = [],
    getCourses,
    loading: coursesLoading,
  } = courseContext || {};

  const [refreshing, setRefreshing] = useState(false);
  const refreshLock = useRef(false);

  // =========================================================
  // LOAD DASHBOARD DATA
  // =========================================================
  useEffect(() => {
    let mounted = true;

    const loadDashboardData = async () => {
      try {
        await Promise.all([
          getOverviewReport(),
          getUsersReport(),
          getBooksReport(),
          getIssuesReport(),
          getReturnsReport(),
          getDigitalLibraryReport(),
          typeof getCourses === "function" ? getCourses() : Promise.resolve(),
        ]);
      } catch (error) {
        console.error("Teacher Dashboard data error:", error);
      }

      if (!mounted) return;
    };

    loadDashboardData();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================================================
  // REFRESH DATA
  // =========================================================
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
        getDigitalLibraryReport(),
        typeof getCourses === "function" ? getCourses() : Promise.resolve(),
      ]);
    } catch (error) {
      console.error("Teacher Dashboard refresh error:", error);
    } finally {
      setRefreshing(false);
      refreshLock.current = false;
    }
  };

  // =========================================================
  // SAFE DATA
  // =========================================================

  const overview = overviewReport || {};
  const usersSummary = usersReport?.summary || {};
  const booksSummary = booksReport?.summary || {};
  const issuesSummary = issuesReport?.summary || {};
  const returnsSummary = returnsReport?.summary || {};
  const digitalSummary = digitalLibraryReport?.summary || {};

  // =========================================================
  // STUDENT COUNT
  // =========================================================

  const studentCount = useMemo(() => {
    const roleStats = usersSummary?.roleStats;

    if (Array.isArray(roleStats)) {
      const studentRole = roleStats.find(
        (item) =>
          String(item?.role || item?._id || "")
            .toLowerCase()
            .replace(/\s+/g, "") === "student"
      );

      return Number(
        studentRole?.count ??
          studentRole?.total ??
          studentRole?.value ??
          0
      );
    }

    if (roleStats && typeof roleStats === "object") {
      return Number(
        roleStats.student ??
          roleStats.Student ??
          roleStats.students ??
          0
      );
    }

    return 0;
  }, [usersSummary]);

  // =========================================================
  // COURSE COUNT
  // =========================================================

  const courseCount = useMemo(() => {
    if (Array.isArray(courses)) {
      return courses.length;
    }

    if (courses?.data && Array.isArray(courses.data)) {
      return courses.data.length;
    }

    if (courses?.courses && Array.isArray(courses.courses)) {
      return courses.courses.length;
    }

    return Number(
      courses?.total ??
        courses?.count ??
        courses?.totalCourses ??
        0
    );
  }, [courses]);

  // =========================================================
  // BOOK COUNT
  // =========================================================

  const totalBooks = Number(
    booksSummary?.totalBooks ??
      overview?.books?.total ??
      0
  );

  const availableBooks = Number(
    booksSummary?.availableCopies ??
      0
  );

  // =========================================================
  // ISSUE DATA
  // =========================================================

  const totalIssues = Number(
    issuesSummary?.totalIssues ??
      overview?.issues?.total ??
      0
  );

  const pendingIssues = Number(
    issuesSummary?.pending ??
      overview?.issues?.pending ??
      0
  );

  const returnedIssues = Number(
    issuesSummary?.returned ??
      0
  );

  // =========================================================
  // RETURN DATA
  // =========================================================

  const totalReturns = Number(
    returnsSummary?.totalReturns ??
      overview?.returns?.total ??
      0
  );

  const pendingReturns = Number(
    returnsSummary?.pending ??
      overview?.returns?.pending ??
      0
  );

  const completedReturns = Number(
    returnsSummary?.completed ??
      0
  );

  // =========================================================
  // DIGITAL LIBRARY
  // =========================================================

  const digitalBooks = Number(
    digitalSummary?.totalBooks ??
      overview?.digitalLibrary?.total ??
      0
  );

  const digitalViews = Number(
    digitalSummary?.totalViews ??
      overview?.digitalLibrary?.totalViews ??
      0
  );

  const digitalDownloads = Number(
    digitalSummary?.totalDownloads ??
      overview?.digitalLibrary?.totalDownloads ??
      0
  );

  // =========================================================
  // ACTIVE CLASSES
  // =========================================================

  const activeClasses = courseCount;

  // =========================================================
  // TOTAL ACADEMIC ACTIVITIES
  // =========================================================

  const academicActivities =
    totalIssues + totalReturns + digitalBooks;

  // =========================================================
  // LOADING
  // =========================================================

  const initialLoading =
    reportsLoading || coursesLoading;

  // =========================================================
  // PERCENTAGES
  // =========================================================

  const issueCompletion =
    totalIssues > 0
      ? Math.min(
          100,
          Math.round((returnedIssues / totalIssues) * 100)
        )
      : 0;

  const returnCompletion =
    totalReturns > 0
      ? Math.min(
          100,
          Math.round((completedReturns / totalReturns) * 100)
        )
      : 0;

  const digitalEngagement =
    digitalBooks > 0
      ? Math.min(
          100,
          Math.round(
            ((digitalViews + digitalDownloads) /
              Math.max(digitalBooks, 1)) *
              10
          )
        )
      : 0;

  // =========================================================
  // LOADING CARD
  // =========================================================

  const LoadingValue = () => (
    <FaSpinner className="animate-spin text-lg" />
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8 relative overflow-hidden">

      {/* =====================================================
          BACKGROUND DECORATIONS
      ===================================================== */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#890C25]/10 blur-3xl pointer-events-none" />

      <div className="absolute top-[45%] -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="absolute bottom-0 right-[20%] w-72 h-72 rounded-full bg-[#D58A98]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto mt-6">

        {/* =====================================================
            HERO HEADER
        ===================================================== */}
        <div className="group relative overflow-hidden rounded-3xl mb-7 bg-gradient-to-br from-[#890C25] via-[#76091F] to-[#5F0719] border border-[#D58A98]/30 shadow-2xl">

          {/* Animated Top Line */}
          <div className="absolute top-0 left-0 w-0 h-1 bg-white group-hover:w-full transition-all duration-1000" />

          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />

          <div className="absolute bottom-0 left-1/2 w-64 h-64 rounded-full bg-[#D58A98]/10 translate-y-1/2" />

          <div className="relative p-6 md:p-8">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div className="flex items-start gap-5">

                {/* Teacher Icon */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-xl shrink-0">
                  <FaGraduationCap className="text-3xl md:text-4xl text-white" />
                </div>

                <div>

                  <p className="text-[#D58A98] text-sm font-semibold uppercase tracking-widest mb-1">
                    Academic Portal
                  </p>

                  <h1 className="text-2xl md:text-4xl font-bold text-white">
                    Teacher Dashboard
                  </h1>

                  <p className="text-white/80 mt-2 text-sm md:text-base">
                    Welcome back,{" "}
                    <span className="font-semibold text-white">
                      {user?.name || "Teacher"}
                    </span>
                  </p>

                  <div className="flex items-center gap-2 mt-2">

                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                    <span className="text-white/60 text-sm">
                      {user?.role || "Teacher"} Account
                    </span>

                  </div>

                </div>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing || initialLoading}
                className={`self-start lg:self-center inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#890C25] font-semibold shadow-lg transition-all duration-300 ${
                  refreshing || initialLoading
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-[#F8E8EC] hover:-translate-y-0.5"
                }`}
              >
                <FaSyncAlt
                  className={
                    refreshing ? "animate-spin" : ""
                  }
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh Data"}
              </button>

            </div>
          </div>
        </div>

        {/* =====================================================
            MAIN STAT CARDS
        ===================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">

          {/* STUDENTS */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#890C25] to-[#65071A] p-5 shadow-xl border border-[#890C25]/20">

            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-700" />

            <div className="absolute top-0 left-0 h-1 w-0 bg-white group-hover:w-full transition-all duration-700" />

            <div className="relative flex items-center justify-between">

              <div>

                <p className="text-white/70 text-sm font-medium">
                  Total Students
                </p>

                <h2 className="text-3xl font-bold text-white mt-2 flex items-center min-h-[36px]">
                  {initialLoading ? (
                    <LoadingValue />
                  ) : (
                    studentCount
                  )}
                </h2>

                <p className="text-white/60 text-xs mt-1">
                  Registered learners
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                <FaUserGraduate className="text-xl text-white" />
              </div>

            </div>
          </div>

          {/* COURSES */}
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 shadow-lg hover:shadow-xl transition-all duration-300">

            <div className="absolute top-0 left-0 h-1 w-0 bg-[#890C25] group-hover:w-full transition-all duration-700" />

            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-blue-500/10 group-hover:scale-125 transition-transform duration-700" />

            <div className="relative flex items-center justify-between">

              <div>

                <p className="text-slate-500 text-sm font-medium">
                  Total Courses
                </p>

                <h2 className="text-3xl font-bold text-slate-800 mt-2 flex items-center min-h-[36px]">
                  {initialLoading ? (
                    <span className="text-blue-600">
                      <LoadingValue />
                    </span>
                  ) : (
                    courseCount
                  )}
                </h2>

                <p className="text-slate-400 text-xs mt-1">
                  Academic courses
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <FaBookOpen className="text-xl text-blue-600" />
              </div>

            </div>
          </div>

          {/* BOOKS */}
          <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 shadow-lg hover:shadow-xl transition-all duration-300">

            <div className="absolute top-0 left-0 h-1 w-0 bg-[#890C25] group-hover:w-full transition-all duration-700" />

            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#D58A98]/15 group-hover:scale-125 transition-transform duration-700" />

            <div className="relative flex items-center justify-between">

              <div>

                <p className="text-slate-500 text-sm font-medium">
                  Total Books
                </p>

                <h2 className="text-3xl font-bold text-slate-800 mt-2 flex items-center min-h-[36px]">
                  {initialLoading ? (
                    <span className="text-[#890C25]">
                      <LoadingValue />
                    </span>
                  ) : (
                    totalBooks
                  )}
                </h2>

                <p className="text-slate-400 text-xs mt-1">
                  Library collection
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-[#F8E8EC] flex items-center justify-center">
                <FaBook className="text-xl text-[#890C25]" />
              </div>

            </div>
          </div>

          {/* ISSUES */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#890C25] to-[#76091F] p-5 shadow-xl">

            <div className="absolute top-0 left-0 h-1 w-0 bg-white group-hover:w-full transition-all duration-700" />

            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-700" />

            <div className="relative flex items-center justify-between">

              <div>

                <p className="text-white/70 text-sm font-medium">
                  Issued Books
                </p>

                <h2 className="text-3xl font-bold text-white mt-2 flex items-center min-h-[36px]">
                  {initialLoading ? (
                    <LoadingValue />
                  ) : (
                    totalIssues
                  )}
                </h2>

                <p className="text-white/60 text-xs mt-1">
                  Total book issues
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                <FaClipboardList className="text-xl text-white" />
              </div>

            </div>
          </div>

        </div>

        {/* =====================================================
            SECONDARY STAT CARDS
        ===================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">

          {/* ACTIVE CLASSES */}
          <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">

            <div className="absolute top-0 left-0 h-1 w-0 bg-[#890C25] group-hover:w-full transition-all duration-700" />

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-[#F8E8EC] flex items-center justify-center">
                <FaLayerGroup className="text-[#890C25] text-xl" />
              </div>

              <div>

                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Active Courses
                </p>

                <h3 className="text-xl font-bold text-slate-800 mt-1">
                  {initialLoading ? (
                    <span className="text-[#890C25]">
                      <LoadingValue />
                    </span>
                  ) : (
                    activeClasses
                  )}
                </h3>

              </div>

            </div>
          </div>

          {/* PENDING ISSUES */}
          <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">

            <div className="absolute top-0 left-0 h-1 w-0 bg-blue-600 group-hover:w-full transition-all duration-700" />

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <FaClock className="text-blue-600 text-xl" />
              </div>

              <div>

                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Pending Issues
                </p>

                <h3 className="text-xl font-bold text-slate-800 mt-1">
                  {initialLoading ? (
                    <span className="text-blue-600">
                      <LoadingValue />
                    </span>
                  ) : (
                    pendingIssues
                  )}
                </h3>

              </div>

            </div>
          </div>

          {/* RETURNS */}
          <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">

            <div className="absolute top-0 left-0 h-1 w-0 bg-green-600 group-hover:w-full transition-all duration-700" />

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <FaUndo className="text-green-600 text-xl" />
              </div>

              <div>

                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Completed Returns
                </p>

                <h3 className="text-xl font-bold text-slate-800 mt-1">
                  {initialLoading ? (
                    <span className="text-green-600">
                      <LoadingValue />
                    </span>
                  ) : (
                    completedReturns
                  )}
                </h3>

              </div>

            </div>
          </div>

          {/* DIGITAL BOOKS */}
          <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">

            <div className="absolute top-0 left-0 h-1 w-0 bg-[#890C25] group-hover:w-full transition-all duration-700" />

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-[#F8E8EC] flex items-center justify-center">
                <FaBookOpen className="text-[#890C25] text-xl" />
              </div>

              <div>

                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Digital Books
                </p>

                <h3 className="text-xl font-bold text-slate-800 mt-1">
                  {initialLoading ? (
                    <span className="text-[#890C25]">
                      <LoadingValue />
                    </span>
                  ) : (
                    digitalBooks
                  )}
                </h3>

              </div>

            </div>
          </div>

        </div>

        {/* =====================================================
            ANALYTICS SECTION
        ===================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-7">

          {/* Issue Analytics */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">

            <div className="group relative p-6 border-b border-slate-100">

              <div className="absolute top-0 left-0 h-1 w-0 bg-[#890C25] group-hover:w-full transition-all duration-700" />

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Library Issue Overview
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Current book circulation data
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-[#F8E8EC] flex items-center justify-center">
                  <FaChartLine className="text-[#890C25]" />
                </div>

              </div>
            </div>

            <div className="p-6 space-y-6">

              {/* Total Issues */}
              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-sm font-medium text-slate-600">
                    Total Issues
                  </span>

                  <span className="text-sm font-bold text-[#890C25]">
                    {totalIssues}
                  </span>

                </div>

                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-gradient-to-r from-[#890C25] to-[#D58A98] rounded-full transition-all duration-700"
                    style={{
                      width:
                        totalIssues > 0 ? "100%" : "0%",
                    }}
                  />

                </div>

              </div>

              {/* Pending */}
              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-sm font-medium text-slate-600">
                    Pending Issues
                  </span>

                  <span className="text-sm font-bold text-blue-600">
                    {pendingIssues}
                  </span>

                </div>

                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-700"
                    style={{
                      width:
                        totalIssues > 0
                          ? `${Math.min(
                              100,
                              (pendingIssues /
                                totalIssues) *
                                100
                            )}%`
                          : "0%",
                    }}
                  />

                </div>

              </div>

              {/* Returned */}
              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-sm font-medium text-slate-600">
                    Returned Books
                  </span>

                  <span className="text-sm font-bold text-green-600">
                    {returnedIssues}
                  </span>

                </div>

                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-green-600 rounded-full transition-all duration-700"
                    style={{
                      width: `${issueCompletion}%`,
                    }}
                  />

                </div>

              </div>

            </div>
          </div>

          {/* Digital Library Analytics */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">

            <div className="group relative p-6 border-b border-slate-100">

              <div className="absolute top-0 left-0 h-1 w-0 bg-blue-600 group-hover:w-full transition-all duration-700" />

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Digital Library
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Digital academic resources
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FaBookOpen className="text-blue-600" />
                </div>

              </div>
            </div>

            <div className="p-6">

              <div className="grid grid-cols-3 gap-3 mb-6">

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-center">

                  <FaBook className="mx-auto text-[#890C25] mb-2" />

                  <p className="text-xs text-slate-400">
                    Books
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 mt-1">
                    {digitalBooks}
                  </h3>

                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-center">

                  <FaEye className="mx-auto text-blue-600 mb-2" />

                  <p className="text-xs text-slate-400">
                    Views
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 mt-1">
                    {digitalViews}
                  </h3>

                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-center">

                  <FaDownload className="mx-auto text-green-600 mb-2" />

                  <p className="text-xs text-slate-400">
                    Downloads
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 mt-1">
                    {digitalDownloads}
                  </h3>

                </div>

              </div>

              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-sm font-medium text-slate-600">
                    Digital Engagement
                  </span>

                  <span className="text-sm font-bold text-blue-600">
                    {digitalEngagement}%
                  </span>

                </div>

                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-700"
                    style={{
                      width: `${digitalEngagement}%`,
                    }}
                  />

                </div>

              </div>

            </div>
          </div>

        </div>

        {/* =====================================================
            CLASS & RETURN INFORMATION
        ===================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-7">

          {/* Class Management */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">

            <div className="group relative p-6 border-b border-slate-100">

              <div className="absolute top-0 left-0 h-1 w-0 bg-[#890C25] group-hover:w-full transition-all duration-700" />

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Academic Overview
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Your current LMS statistics
                  </p>
                </div>

                <FaGraduationCap className="text-[#890C25] text-2xl" />

              </div>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">

                <FaUsers className="text-[#890C25] mb-3" />

                <p className="text-xs text-slate-400">
                  Students
                </p>

                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  {studentCount}
                </h3>

              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">

                <FaBookOpen className="text-blue-600 mb-3" />

                <p className="text-xs text-slate-400">
                  Courses
                </p>

                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  {courseCount}
                </h3>

              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">

                <FaCalendarAlt className="text-green-600 mb-3" />

                <p className="text-xs text-slate-400">
                  Active Courses
                </p>

                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  {activeClasses}
                </h3>

              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">

                <FaClipboardList className="text-[#890C25] mb-3" />

                <p className="text-xs text-slate-400">
                  Activities
                </p>

                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  {academicActivities}
                </h3>

              </div>

            </div>
          </div>

          {/* Returns */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">

            <div className="group relative p-6 border-b border-slate-100">

              <div className="absolute top-0 left-0 h-1 w-0 bg-green-600 group-hover:w-full transition-all duration-700" />

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Return Overview
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Current return activity
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                  <FaUndo className="text-green-600" />
                </div>

              </div>
            </div>

            <div className="p-6 space-y-5">

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <FaClipboardList className="text-blue-600" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Total Returns
                    </p>
                    <p className="text-xs text-slate-400">
                      All return records
                    </p>
                  </div>

                </div>

                <span className="text-xl font-bold text-slate-800">
                  {totalReturns}
                </span>

              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <FaClock className="text-orange-500" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Pending Returns
                    </p>
                    <p className="text-xs text-slate-400">
                      Awaiting completion
                    </p>
                  </div>

                </div>

                <span className="text-xl font-bold text-orange-500">
                  {pendingReturns}
                </span>

              </div>

              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-sm font-medium text-slate-600">
                    Return Completion
                  </span>

                  <span className="text-sm font-bold text-green-600">
                    {returnCompletion}%
                  </span>

                </div>

                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-700"
                    style={{
                      width: `${returnCompletion}%`,
                    }}
                  />

                </div>

              </div>

            </div>
          </div>

        </div>

        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 mb-7">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Quick Actions
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Quickly access your LMS resources
              </p>
            </div>

            <FaArrowRight className="text-[#890C25]" />

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Courses */}
            <Link
              to="/courses"
              className="group rounded-2xl border border-slate-200 p-5 hover:border-[#890C25]/30 hover:shadow-lg transition-all duration-300"
            >

              <div className="w-12 h-12 rounded-xl bg-[#F8E8EC] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FaBookOpen className="text-[#890C25] text-xl" />
              </div>

              <h3 className="font-bold text-slate-800">
                Courses
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                View academic courses
              </p>

              <div className="flex items-center gap-2 text-[#890C25] text-sm font-semibold mt-4">
                {courseCount} Courses
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </div>

            </Link>

            {/* Students */}
            <Link
              to="/students"
              className="group rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FaUsers className="text-blue-600 text-xl" />
              </div>

              <h3 className="font-bold text-slate-800">
                Students
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                View registered students
              </p>

              <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold mt-4">
                {studentCount} Students
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </div>

            </Link>

            {/* Library */}
            <Link
              to="/library/books"
              className="group rounded-2xl border border-slate-200 p-5 hover:border-green-300 hover:shadow-lg transition-all duration-300"
            >

              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FaBook className="text-green-600 text-xl" />
              </div>

              <h3 className="font-bold text-slate-800">
                Library Book
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Browse library collection
              </p>

              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold mt-4">
                {availableBooks} Available
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </div>

            </Link>

            {/* Digital Library */}
            <Link
              to="/digital-library/books"
              className="group rounded-2xl border border-slate-200 p-5 hover:border-[#890C25]/30 hover:shadow-lg transition-all duration-300"
            >

              <div className="w-12 h-12 rounded-xl bg-[#F8E8EC] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FaBookOpen className="text-[#890C25] text-xl" />
              </div>

              <h3 className="font-bold text-slate-800">
                Digital Library
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Explore digital resources
              </p>

              <div className="flex items-center gap-2 text-[#890C25] text-sm font-semibold mt-4">
                {digitalBooks} Books
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </div>

            </Link>

          </div>
        </div>

        {/* =====================================================
            TEACHER WORKSPACE
        ===================================================== */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#3A0A17] to-[#890C25] p-6 md:p-8 shadow-2xl">

          <div className="absolute top-0 left-0 h-1 w-0 bg-white group-hover:w-full transition-all duration-1000" />

          <div className="absolute -right-20 -bottom-32 w-80 h-80 rounded-full bg-white/5" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-3">

                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  <FaGraduationCap className="text-white text-xl" />
                </div>

                <span className="text-[#D58A98] font-semibold">
                  Teacher Workspace
                </span>

              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Empower Learning Through Knowledge
              </h2>

              <p className="text-white/65 mt-2 max-w-2xl text-sm md:text-base">
                Manage courses, support students and access
                academic resources from your teacher workspace.
              </p>

            </div>

            <Link
              to="/digital-library/books"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-[#890C25] font-bold hover:bg-[#F8E8EC] transition-all duration-300 shadow-lg"
            >
              Explore Resources
              <FaArrowRight />
            </Link>

          </div>
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}
        <div className="text-center mt-7 pb-3">

          <p className="text-xs text-slate-400">
            Learning Management System • Teacher Portal
          </p>

        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;

