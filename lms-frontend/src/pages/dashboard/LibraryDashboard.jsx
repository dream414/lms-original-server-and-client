import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBook,
  FaBookOpen,
  FaUsers,
  FaChartBar,
  FaDigitalTachograph,
  FaArrowRight,
  FaSyncAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaLayerGroup,
  FaDatabase,
  FaUniversity,
  FaEye,
  FaDownload,
  FaFolderOpen,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { useReports } from "../../context/ReportContext";

const LibraryDashboard = () => {
  const { user } = useAuth();

  const {
    overviewReport,
    booksReport,
    usersReport,
    digitalLibraryReport,
    loading,
    getOverviewReport,
    getBooksReport,
    getUsersReport,
    getDigitalLibraryReport,
  } = useReports();

  // =====================================================
  // REFRESH ANIMATION STATE
  // =====================================================

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Prevent automatic useEffect from running repeatedly
  const initialLoadRef = useRef(false);

  // =====================================================
  // LOAD REPORT DATA - ONLY ONCE
  // =====================================================

  useEffect(() => {
    if (initialLoadRef.current) return;

    initialLoadRef.current = true;

    const loadDashboardData = async () => {
      setIsRefreshing(true);

      try {
        await Promise.all([
          getOverviewReport(),
          getBooksReport(),
          getUsersReport(),
          getDigitalLibraryReport(),
        ]);
      } catch (error) {
        console.error("Library Dashboard Data Error:", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    loadDashboardData();

    // IMPORTANT:
    // We intentionally do not add report functions here.
    // Some contexts recreate functions on every render,
    // which can cause repeated API calls / reload loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =====================================================
  // NORMALIZE REPORT RESPONSE
  // =====================================================

  const getReportObject = (report) => {
    if (!report) return {};

    if (
      report.data &&
      typeof report.data === "object" &&
      !Array.isArray(report.data)
    ) {
      if (
        report.data.data &&
        typeof report.data.data === "object" &&
        !Array.isArray(report.data.data)
      ) {
        return report.data.data;
      }

      if (
        report.data.summary &&
        typeof report.data.summary === "object"
      ) {
        return report.data.summary;
      }

      return report.data;
    }

    if (
      report.summary &&
      typeof report.summary === "object"
    ) {
      return report.summary;
    }

    return report;
  };

  const overview = useMemo(
    () => getReportObject(overviewReport),
    [overviewReport]
  );

  const books = useMemo(
    () => getReportObject(booksReport),
    [booksReport]
  );

  const users = useMemo(
    () => getReportObject(usersReport),
    [usersReport]
  );

  const digital = useMemo(
    () => getReportObject(digitalLibraryReport),
    [digitalLibraryReport]
  );

  // =====================================================
  // VALUE HELPER
  // =====================================================

  const getNumber = (...values) => {
    for (const value of values) {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !Number.isNaN(Number(value))
      ) {
        return Number(value);
      }
    }

    return 0;
  };

  // =====================================================
  // BOOK DATA
  // =====================================================

  const totalBooks = getNumber(
    books.totalBooks,
    books.total,
    books.count,
    overview.totalBooks,
    overview.books?.totalBooks,
    overview.books?.total,
    overview.books?.count
  );

  const totalQuantity = getNumber(
    books.totalQuantity,
    books.totalCopies,
    books.quantity,
    books.copies,
    overview.totalQuantity,
    overview.totalCopies,
    overview.books?.totalQuantity,
    overview.books?.totalCopies,
    overview.books?.quantity
  );

  const availableCopies = getNumber(
    books.availableCopies,
    books.available,
    books.availableQuantity,
    overview.availableCopies,
    overview.available,
    overview.books?.availableCopies,
    overview.books?.available,
    overview.books?.availableQuantity
  );

  const activeBooks = getNumber(
    books.activeBooks,
    books.active,
    books.activeCount,
    overview.activeBooks,
    overview.active,
    overview.books?.activeBooks,
    overview.books?.active,
    overview.books?.activeCount
  );

  const inactiveBooks = getNumber(
    books.inactiveBooks,
    books.inactive,
    books.inactiveCount,
    overview.inactiveBooks,
    overview.inactive,
    overview.books?.inactiveBooks,
    overview.books?.inactive,
    overview.books?.inactiveCount
  );

  // =====================================================
  // USER DATA
  // =====================================================

  const totalUsers = getNumber(
    users.totalUsers,
    users.total,
    users.count,
    overview.totalUsers,
    overview.users?.totalUsers,
    overview.users?.total,
    overview.users?.count
  );

  // =====================================================
  // DIGITAL LIBRARY DATA
  // =====================================================

  const digitalBooks = getNumber(
    digital.totalBooks,
    digital.totalDigitalBooks,
    digital.digitalBooks,
    digital.total,
    digital.count,
    overview.digitalBooks,
    overview.totalDigitalBooks,
    overview.digitalLibrary?.totalBooks,
    overview.digitalLibrary?.totalDigitalBooks,
    overview.digitalLibrary?.total
  );

  const digitalViews = getNumber(
    digital.totalViews,
    digital.views,
    digital.viewCount,
    overview.digitalViews,
    overview.totalViews,
    overview.digitalLibrary?.totalViews,
    overview.digitalLibrary?.views
  );

  const digitalDownloads = getNumber(
    digital.totalDownloads,
    digital.downloads,
    digital.downloadCount,
    overview.digitalDownloads,
    overview.totalDownloads,
    overview.digitalLibrary?.totalDownloads,
    overview.digitalLibrary?.downloads
  );

  // =====================================================
  // CALCULATIONS
  // =====================================================

  const circulatingCopies = Math.max(
    totalQuantity - availableCopies,
    0
  );

  const availabilityPercentage =
    totalQuantity > 0
      ? Math.round(
          (availableCopies / totalQuantity) * 100
        )
      : 0;

  const activePercentage =
    totalBooks > 0
      ? Math.round(
          (activeBooks / totalBooks) * 100
        )
      : 0;

  const circulationPercentage =
    totalQuantity > 0
      ? Math.round(
          (circulatingCopies / totalQuantity) * 100
        )
      : 0;

  const inactivePercentage =
    totalBooks > 0
      ? Math.round(
          (inactiveBooks / totalBooks) * 100
        )
      : 0;

  // =====================================================
  // COLLECTION SNAPSHOT
  // =====================================================

  const collectionStats = useMemo(
    () => [
      {
        label: "Titles",
        value: totalBooks,
        icon: FaBook,
      },
      {
        label: "Copies",
        value: totalQuantity,
        icon: FaLayerGroup,
      },
      {
        label: "Users",
        value: totalUsers,
        icon: FaUsers,
      },
    ],
    [totalBooks, totalQuantity, totalUsers]
  );

  // =====================================================
  // MANUAL REFRESH ONLY
  // =====================================================

  const refreshDashboard = async () => {
    if (isRefreshing || loading) return;

    setIsRefreshing(true);

    try {
      await Promise.all([
        getOverviewReport(),
        getBooksReport(),
        getUsersReport(),
        getDigitalLibraryReport(),
      ]);
    } catch (error) {
      console.error("Library Dashboard Refresh Error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const refreshing = isRefreshing || loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#FFF5F7] p-4 md:p-6">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <div className="relative mt-6 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#890C25] via-[#76091F] to-[#520615] p-6 shadow-2xl md:p-8">

        <div className="absolute left-0 top-0 h-[3px] w-full overflow-hidden">
          <div className="h-full w-1/3 animate-pulse bg-gradient-to-r from-white via-[#D58A98] to-blue-400" />
        </div>

        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10 bg-white/5" />

        <div className="absolute -bottom-24 -left-16 h-60 w-60 rounded-full border border-white/10 bg-white/5" />

        <div className="absolute right-32 top-20 h-16 w-16 rounded-full bg-white/5 blur-xl" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-2xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
              <FaUniversity />
              Library Resource Center
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Library Dashboard
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/75 md:text-base">
              Welcome back,{" "}
              <span className="font-semibold text-white">
                {user?.name || "Library User"}
              </span>
              . Keep track of your library collection,
              digital resources and overall resource activity.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white">
                Role: {user?.role || "Library"}
              </span>

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white">
                Resource Management
              </span>

            </div>
          </div>

          {/* Refresh Button */}

          <button
            type="button"
            onClick={refreshDashboard}
            disabled={refreshing}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
          >

            <FaSyncAlt
              className={`transition-transform duration-500 ${
                refreshing
                  ? "animate-spin"
                  : "group-hover:rotate-180"
              }`}
            />

            {refreshing ? "Refreshing..." : "Refresh Data"}

          </button>

        </div>
      </div>

      {/* =====================================================
          COLLECTION SNAPSHOT
      ====================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Main Collection */}

        <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 shadow-lg lg:col-span-2">

          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#FFF0F3] blur-3xl" />

          <div className="relative z-10 flex flex-col gap-7 md:flex-row md:items-center">

            {/* Availability Circle */}

            <div className="flex justify-center md:w-1/3">

              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[12px] border-[#FFF0F3]">

                <div
                  className={`absolute inset-[-12px] rounded-full border-[12px] border-transparent border-t-[#890C25] border-r-[#D58A98] ${
                    refreshing ? "animate-spin" : ""
                  }`}
                  style={{
                    animationDuration: refreshing
                      ? "1.1s"
                      : "3s",
                  }}
                />

                <div
                  className={`absolute inset-[-3px] rounded-full border-[3px] border-transparent border-b-[#890C25]/40 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                  style={{
                    animationDuration: refreshing
                      ? "0.8s"
                      : "4s",
                    animationDirection: "reverse",
                  }}
                />

                <div
                  className={`absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full border border-[#890C25]/10 bg-white text-[#890C25] shadow-md ${
                    refreshing ? "animate-spin" : ""
                  }`}
                  style={{
                    animationDuration: "1.2s",
                  }}
                >
                  <FaSyncAlt className="text-sm" />
                </div>

                <div className="relative z-10 text-center">

                  <p
                    className={`text-4xl font-extrabold text-[#890C25] transition-all ${
                      refreshing ? "scale-105" : ""
                    }`}
                  >
                    {availabilityPercentage}%
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    {refreshing ? "Refreshing" : "Available"}
                  </p>

                </div>
              </div>
            </div>

            {/* Collection Details */}

            <div className="flex-1">

              <p className="text-sm font-semibold text-slate-500">
                Collection Snapshot
              </p>

              <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                Library Collection
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your current collection contains{" "}
                <span className="font-bold text-[#890C25]">
                  {totalBooks}
                </span>{" "}
                registered titles and{" "}
                <span className="font-bold text-blue-600">
                  {totalQuantity}
                </span>{" "}
                total copies.
              </p>

              {/* Mini Statistics */}

              <div className="mt-6 grid grid-cols-3 gap-3">

                {collectionStats.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={index}
                      className="rounded-2xl bg-slate-50 p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >

                      <Icon className="text-blue-600" />

                      <p className="mt-2 text-xl font-extrabold text-slate-900">
                        {item.value}
                      </p>

                      <p className="text-[11px] font-medium text-slate-400">
                        {item.label}
                      </p>

                    </div>
                  );
                })}

              </div>

            </div>
          </div>
        </div>

        {/* =====================================================
            COPY STATUS
        ====================================================== */}

        <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#890C25] via-[#76091F] to-[#520615] p-6 shadow-xl">

          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/10 bg-white/5" />

          <div className="relative z-10">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-white/60">
                  Collection Movement
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-white">
                  Copy Status
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                <FaBookOpen />
              </div>

            </div>

            <div className="mt-7">

              <div className="mb-2 flex justify-between">

                <span className="text-xs text-white/70">
                  Available Copies
                </span>

                <span className="text-xs font-bold text-white">
                  {availableCopies}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">

                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{
                    width: `${availabilityPercentage}%`,
                  }}
                />

              </div>

            </div>

            <div className="mt-5">

              <div className="mb-2 flex justify-between">

                <span className="text-xs text-white/70">
                  In Circulation
                </span>

                <span className="text-xs font-bold text-white">
                  {circulatingCopies}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">

                <div
                  className="h-full rounded-full bg-[#D58A98] transition-all duration-700"
                  style={{
                    width: `${circulationPercentage}%`,
                  }}
                />

              </div>

            </div>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">

              <p className="text-xs text-white/60">
                Total Copies
              </p>

              <p className="mt-1 text-3xl font-extrabold text-white">
                {totalQuantity}
              </p>

              <p className="mt-1 text-xs text-white/50">
                Across the complete collection
              </p>

            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          DIGITAL LIBRARY ACTIVITY
      ====================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Digital Activity */}

        <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg lg:col-span-2">

          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-50 blur-3xl" />

          <div className="relative z-10">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Digital Resource Center
                </p>

                <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                  Digital Library Activity
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FaDigitalTachograph />
              </div>

            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

              {/* Digital Books */}

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#890C25] shadow-sm">
                    <FaBookOpen />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Digital Books
                    </p>

                    <p className="text-xl font-extrabold text-slate-900">
                      {digitalBooks}
                    </p>
                  </div>

                </div>
              </div>

              {/* Views */}

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <FaEye />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Total Views
                    </p>

                    <p className="text-xl font-extrabold text-slate-900">
                      {digitalViews}
                    </p>
                  </div>

                </div>
              </div>

              {/* Downloads */}

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#890C25] shadow-sm">
                    <FaDownload />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Downloads
                    </p>

                    <p className="text-xl font-extrabold text-slate-900">
                      {digitalDownloads}
                    </p>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>

        {/* =====================================================
            LIBRARY COMMUNITY - BLUE THEME
        ====================================================== */}

        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 p-6 shadow-xl">

          <div className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full border border-white/10 bg-white/5" />

          <div className="relative z-10">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
              <FaUsers />
            </div>

            <p className="mt-6 text-sm font-medium text-white/70">
              Library Community
            </p>

            <h2 className="mt-1 text-4xl font-extrabold text-white">
              {totalUsers}
            </h2>

            <p className="mt-2 text-sm leading-5 text-white/70">
              Registered users connected with the library system.
            </p>

            <Link
              to="/users"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition-all hover:gap-3"
            >
              View Users
              <FaArrowRight />
            </Link>

          </div>
        </div>
      </div>

      {/* =====================================================
          CATALOG HEALTH
      ====================================================== */}

      <div className="mt-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-lg">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm font-semibold text-slate-500">
              Catalog Monitoring
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
              Catalog Health
            </h2>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-[#FFF5F7] px-4 py-3">

            <FaDatabase className="text-[#890C25]" />

            <span className="text-sm font-bold text-[#890C25]">
              {activePercentage}% Active
            </span>

          </div>

        </div>

        <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Active Titles */}

          <div>

            <div className="mb-3 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <FaCheckCircle className="text-blue-600" />

                <span className="text-sm font-semibold text-slate-700">
                  Active Titles
                </span>

              </div>

              <span className="font-extrabold text-slate-900">
                {activeBooks}
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-700"
                style={{
                  width: `${activePercentage}%`,
                }}
              />

            </div>

            <p className="mt-2 text-xs text-slate-400">
              Currently active titles in the catalog
            </p>

          </div>

          {/* Inactive Titles */}

          <div>

            <div className="mb-3 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <FaTimesCircle className="text-[#890C25]" />

                <span className="text-sm font-semibold text-slate-700">
                  Inactive Titles
                </span>

              </div>

              <span className="font-extrabold text-[#890C25]">
                {inactiveBooks}
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-[#890C25] transition-all duration-700"
                style={{
                  width: `${inactivePercentage}%`,
                }}
              />

            </div>

            <p className="mt-2 text-xs text-slate-400">
              Titles currently marked as inactive
            </p>

          </div>

        </div>
      </div>

      {/* =====================================================
          LIBRARY SERVICES
      ====================================================== */}

      <div className="mt-6">

        <div className="mb-5">

          <p className="text-sm font-semibold text-slate-500">
            Library Services
          </p>

          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
            Quick Access
          </h2>

        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

          {/* Book Catalog */}

          <Link
            to="/books"
            className="group flex items-center gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#D58A98] hover:shadow-xl"
          >

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0F3] text-xl text-[#890C25] transition-transform duration-300 group-hover:scale-110">
              <FaBook />
            </div>

            <div className="min-w-0 flex-1">

              <h3 className="font-bold text-slate-900">
                Book Catalog
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Browse collection
              </p>

            </div>

            <FaArrowRight className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-[#890C25]" />

          </Link>

          {/* Digital Library */}

          <Link
            to="/digital-library"
            className="group flex items-center gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
          >

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xl text-blue-600 transition-transform duration-300 group-hover:scale-110">
              <FaDigitalTachograph />
            </div>

            <div className="min-w-0 flex-1">

              <h3 className="font-bold text-slate-900">
                Digital Library
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Online resources
              </p>

            </div>

            <FaArrowRight className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-blue-600" />

          </Link>

          {/* Users */}

          <Link
            to="/users"
            className="group flex items-center gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#D58A98] hover:shadow-xl"
          >

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0F3] text-xl text-[#890C25] transition-transform duration-300 group-hover:scale-110">
              <FaUsers />
            </div>

            <div className="min-w-0 flex-1">

              <h3 className="font-bold text-slate-900">
                Library Users
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                User directory
              </p>

            </div>

            <FaArrowRight className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-[#890C25]" />

          </Link>

          {/* Reports */}

          <Link
            to="/reports"
            className="group flex items-center gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
          >

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl text-blue-600 transition-transform duration-300 group-hover:scale-110">
              <FaChartBar />
            </div>

            <div className="min-w-0 flex-1">

              <h3 className="font-bold text-slate-900">
                Analytics
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                View reports
              </p>

            </div>

            <FaArrowRight className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-blue-600" />

          </Link>

        </div>
      </div>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div className="mt-6 flex flex-col gap-3 rounded-[26px] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-md md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#890C25]">
            <FaUniversity />
          </div>

          <div>

            <p className="text-sm font-bold text-[#890C25]">
              Library Resource Center
            </p>

            <p className="text-xs text-slate-400">
              Organized library management and resource monitoring.
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <FaFolderOpen />
          Library Management System
        </div>

      </div>

    </div>
  );
};

export default LibraryDashboard;