import { useEffect } from "react";
import {
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaBookOpen,
  FaExchangeAlt,
  FaUndo,
  FaMoneyBillWave,
  FaGlobe,
  FaEye,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaChartBar,
  FaShieldAlt,
  FaSyncAlt,
  FaLayerGroup,
  FaFileAlt,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { useReports } from "../../context/ReportContext";

const SuperAdminDashboard = () => {
  const { user } = useAuth();

  const {
    overviewReport,
    usersReport,
    booksReport,
    issuesReport,
    returnsReport,
    finesReport,
    digitalLibraryReport,
    loading,
    error,
    getOverviewReport,
    getUsersReport,
    getBooksReport,
    getIssuesReport,
    getReturnsReport,
    getFinesReport,
    getDigitalLibraryReport,
  } = useReports();

  // =====================================================
  // LOAD DASHBOARD REPORTS
  // =====================================================

  useEffect(() => {
    getOverviewReport();
    getUsersReport();
    getBooksReport();
    getIssuesReport();
    getReturnsReport();
    getFinesReport();
    getDigitalLibraryReport();
  }, []);

  // =====================================================
  // BRAND COLORS
  // =====================================================

  const brandColor = "#890C25";
  const brandLightColor = "#D58A98";
  const blueColor = "#2563EB";

  // =====================================================
  // OVERVIEW DATA
  // =====================================================

  const overview = overviewReport || {};

  const totalUsers = overview.users?.total || 0;

  const totalBooks = overview.books?.total || 0;
  const activeBooks = overview.books?.active || 0;
  const inactiveBooks = overview.books?.inactive || 0;

  const totalIssues = overview.issues?.total || 0;
  const pendingIssues = overview.issues?.pending || 0;

  const totalReturns = overview.returns?.total || 0;
  const pendingReturns = overview.returns?.pending || 0;

  const totalFines = overview.fines?.total || 0;
  const totalFineAmount = overview.fines?.totalAmount || 0;

  const totalDigitalBooks =
    overview.digitalLibrary?.total || 0;

  const digitalActiveBooks =
    overview.digitalLibrary?.active || 0;

  const digitalInactiveBooks =
    overview.digitalLibrary?.inactive || 0;

  const totalDigitalViews =
    overview.digitalLibrary?.totalViews || 0;

  const totalDigitalDownloads =
    overview.digitalLibrary?.totalDownloads || 0;

  // =====================================================
  // DETAILED DATA
  // =====================================================

  const roleStats =
    usersReport?.summary?.roleStats || {};

  const totalQuantity =
    booksReport?.summary?.totalQuantity || 0;

  const availableCopies =
    booksReport?.summary?.availableCopies || 0;

  const returnedIssues =
    issuesReport?.summary?.returned || 0;

  const completedReturns =
    returnsReport?.summary?.completed || 0;

  const rejectedReturns =
    returnsReport?.summary?.rejected || 0;

  const totalReturnFine =
    returnsReport?.summary?.totalFine || 0;

  const paidFines =
    finesReport?.summary?.paidFines || 0;

  const unpaidFines =
    finesReport?.summary?.unpaidFines || 0;

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

    return Math.min(
      100,
      Math.round((value / total) * 100)
    );
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const refreshDashboard = async () => {
    await Promise.all([
      getOverviewReport(),
      getUsersReport(),
      getBooksReport(),
      getIssuesReport(),
      getReturnsReport(),
      getFinesReport(),
      getDigitalLibraryReport(),
    ]);
  };

  // =====================================================
  // STAT CARD
  // =====================================================

  const StatCard = ({
    icon,
    title,
    value,
    subtitle,
    accent = "maroon",
  }) => {
    const isBlue = accent === "blue";

    return (
      <div
        className="
          group
          relative
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-[0_12px_35px_rgba(15,23,42,0.08)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-[0_18px_45px_rgba(15,23,42,0.14)]
        "
      >
        {/* TOP ANIMATED LINE */}

        <div
          className="
            absolute
            left-0
            top-0
            h-1
            w-0
            transition-all
            duration-500
            group-hover:w-full
          "
          style={{
            backgroundColor: isBlue
              ? blueColor
              : brandColor,
          }}
        />

        {/* DECORATIVE CIRCLE */}

        <div
          className="
            absolute
            -right-10
            -top-10
            h-28
            w-28
            rounded-full
            opacity-60
          "
          style={{
            backgroundColor: isBlue
              ? "rgba(37,99,235,0.06)"
              : "rgba(137,12,37,0.06)",
          }}
        />

        <div className="relative flex items-start justify-between">

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {title}
            </p>

            <h3 className="mt-2 text-2xl font-black text-slate-800 sm:text-3xl">
              {value}
            </h3>

            <p className="mt-1 text-xs font-medium text-slate-400">
              {subtitle}
            </p>
          </div>

          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              text-lg
              text-white
              shadow-lg
            "
            style={{
              background: isBlue
                ? `linear-gradient(135deg, ${blueColor}, #1d4ed8)`
                : `linear-gradient(135deg, ${brandColor}, #5f0719)`,
            }}
          >
            {icon}
          </div>

        </div>
      </div>
    );
  };

  // =====================================================
  // PROGRESS ROW
  // =====================================================

  const ProgressRow = ({
    label,
    value,
    total,
    icon,
  }) => {
    const percentage = getPercentage(
      value,
      total
    );

    return (
      <div className="group">

        <div className="mb-2 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-xl
                bg-[#890C25]/10
                text-xs
                text-[#890C25]
              "
            >
              {icon}
            </span>

            <span className="text-sm font-bold text-slate-700">
              {label}
            </span>

          </div>

          <span className="text-xs font-black text-slate-500">
            {formatNumber(value)}
          </span>

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">

          <div
            className="
              h-full
              rounded-full
              transition-all
              duration-700
            "
            style={{
              width: `${percentage}%`,
              background:
                "linear-gradient(90deg, #890C25, #D58A98)",
            }}
          />

        </div>

        <p className="mt-1 text-right text-[10px] font-semibold text-slate-400">
          {percentage}% of total
        </p>

      </div>
    );
  };

  // =====================================================
  // SECTION CARD
  // =====================================================

  const SectionCard = ({
    icon,
    eyebrow,
    title,
    children,
  }) => {
    return (
      <div
        className="
          relative
          overflow-hidden
          rounded-[2rem]
          border
          border-slate-200
          bg-white
          p-6
          shadow-[0_12px_35px_rgba(15,23,42,0.07)]
          sm:p-7
        "
      >

        <div
          className="
            absolute
            -right-16
            -top-16
            h-40
            w-40
            rounded-full
            bg-[#890C25]/5
          "
        />

        <div className="relative">

          <div className="flex items-center gap-4">

            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-[#890C25]
                text-lg
                text-white
                shadow-lg
              "
            >
              {icon}
            </div>

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#D58A98]">
                {eyebrow}
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-800">
                {title}
              </h2>

            </div>

          </div>

          <div className="mt-7">
            {children}
          </div>

        </div>

      </div>
    );
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (
    loading &&
    !overviewReport &&
    !usersReport &&
    !booksReport
  ) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-10 sm:px-6 lg:px-8">

        <div className="animate-pulse">

          <div className="h-56 rounded-[2rem] bg-slate-300" />

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-36 rounded-3xl bg-white"
                />
              )
            )}

          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">

            <div className="h-80 rounded-[2rem] bg-white" />
            <div className="h-80 rounded-[2rem] bg-white" />

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN DASHBOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">

      {/* =================================================
          HERO
      ================================================= */}

      <div
        className="
          relative
          overflow-hidden
          rounded-[2rem]
          p-6
          shadow-[0_22px_55px_rgba(137,12,37,0.25)]
          sm:p-8
          lg:p-10
        "
        style={{
          background:
            "linear-gradient(135deg, #890C25 0%, #6f091e 55%, #420512 100%)",
        }}
      >

        {/* CIRCLES */}

        <div
          className="
            absolute
            -right-24
            -top-28
            h-80
            w-80
            rounded-full
            border
            border-white/10
            bg-white/5
          "
        />

        <div
          className="
            absolute
            -bottom-32
            -left-24
            h-96
            w-96
            rounded-full
            border
            border-white/10
            bg-white/5
          "
        />

        <div
          className="
            absolute
            right-[28%]
            top-10
            h-3
            w-3
            rounded-full
            bg-[#D58A98]
            shadow-[0_0_20px_rgba(213,138,152,0.9)]
          "
        />

        <div
          className="
            absolute
            bottom-10
            right-[15%]
            h-2
            w-2
            rounded-full
            bg-blue-400
            shadow-[0_0_15px_rgba(96,165,250,0.9)]
          "
        />

        <div className="relative z-10">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}

            <div>

              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    h-16
                    w-16
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/20
                    bg-white/10
                    text-xl
                    font-black
                    text-white
                    shadow-xl
                    backdrop-blur-md
                  "
                >
                  SA
                </div>

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#D58A98]">
                    Library Administration
                  </p>

                  <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-4xl">
                    Super Admin Dashboard
                  </h1>

                </div>

              </div>

              <p className="mt-6 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">

                Welcome back,{" "}

                <span className="font-bold text-white">
                  {user?.name || "Super Admin"}
                </span>

                . Monitor users, books, circulation, fines and digital
                library activity from one centralized administration panel.

              </p>

            </div>

            {/* RIGHT SIDE */}

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">

              <div
                className="
                  flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  backdrop-blur-md
                "
              >

                <span
                  className="
                    h-2.5
                    w-2.5
                    rounded-full
                    bg-blue-400
                    shadow-[0_0_12px_rgba(96,165,250,0.9)]
                  "
                />

                Super Admin

              </div>

              <button
                onClick={refreshDashboard}
                disabled={loading}
                className="
                  flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                  px-5
                  py-3
                  text-xs
                  font-bold
                  text-white
                  transition
                  hover:bg-white/20
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                <FaSyncAlt
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                {loading
                  ? "Refreshing..."
                  : "Refresh Data"}

              </button>

            </div>

          </div>

          {/* HERO MINI STATUS */}

          <div
            className="
              mt-8
              grid
              gap-3
              sm:grid-cols-3
            "
          >

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4 backdrop-blur-md">

              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Account
              </p>

              <div className="mt-2 flex items-center gap-2">

                <FaShieldAlt className="text-blue-300" />

                <span className="text-sm font-bold text-white">
                  {user?.status || "Active"}
                </span>

              </div>

            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4 backdrop-blur-md">

              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                System Users
              </p>

              <div className="mt-2 flex items-center gap-2">

                <FaUsers className="text-[#D58A98]" />

                <span className="text-sm font-bold text-white">
                  {formatNumber(totalUsers)}
                </span>

              </div>

            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4 backdrop-blur-md">

              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Library Books
              </p>

              <div className="mt-2 flex items-center gap-2">

                <FaBook className="text-blue-300" />

                <span className="text-sm font-bold text-white">
                  {formatNumber(totalBooks)}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          className="
            mt-5
            rounded-2xl
            border
            border-red-200
            bg-red-50
            px-5
            py-4
            text-sm
            font-semibold
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {/* =================================================
          PRIMARY STATISTICS
      ================================================= */}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          icon={<FaUsers />}
          title="Total Users"
          value={formatNumber(totalUsers)}
          subtitle="Registered LMS users"
        />

        <StatCard
          icon={<FaBook />}
          title="Total Books"
          value={formatNumber(totalBooks)}
          subtitle={`${formatNumber(activeBooks)} currently available`}
          accent="blue"
        />

        <StatCard
          icon={<FaExchangeAlt />}
          title="Total Issues"
          value={formatNumber(totalIssues)}
          subtitle={`${formatNumber(pendingIssues)} currently active`}
        />

        <StatCard
          icon={<FaUndo />}
          title="Total Returns"
          value={formatNumber(totalReturns)}
          subtitle={`${formatNumber(pendingReturns)} pending requests`}
          accent="blue"
        />

        <StatCard
          icon={<FaMoneyBillWave />}
          title="Total Fines"
          value={formatNumber(totalFines)}
          subtitle={formatAmount(totalFineAmount)}
        />

        <StatCard
          icon={<FaGlobe />}
          title="Digital Books"
          value={formatNumber(totalDigitalBooks)}
          subtitle={`${formatNumber(digitalActiveBooks)} active books`}
          accent="blue"
        />

        <StatCard
          icon={<FaEye />}
          title="Digital Views"
          value={formatNumber(totalDigitalViews)}
          subtitle="Total digital book views"
        />

        <StatCard
          icon={<FaDownload />}
          title="Downloads"
          value={formatNumber(totalDigitalDownloads)}
          subtitle="Digital library downloads"
          accent="blue"
        />

      </div>

      {/* =================================================
          ANALYTICS GRID
      ================================================= */}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        {/* USER OVERVIEW */}

        <SectionCard
          icon={<FaUsers />}
          eyebrow="User Analytics"
          title="User Overview"
        >

          <div className="grid gap-5 sm:grid-cols-2">

            <ProgressRow
              label="Students"
              value={roleStats.student || 0}
              total={totalUsers}
              icon={<FaUserGraduate />}
            />

            <ProgressRow
              label="Teachers"
              value={roleStats.teacher || 0}
              total={totalUsers}
              icon={<FaChalkboardTeacher />}
            />

            <ProgressRow
              label="Admins"
              value={roleStats.admin || 0}
              total={totalUsers}
              icon={<FaShieldAlt />}
            />

            <ProgressRow
              label="Librarians"
              value={roleStats.librarian || 0}
              total={totalUsers}
              icon={<FaBookOpen />}
            />

          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                  <FaLayerGroup />
                </div>

                <div>

                  <p className="text-xs font-bold text-slate-400">
                    Other System Roles
                  </p>

                  <p className="text-lg font-black text-slate-700">
                    {formatNumber(
                      Math.max(
                        0,
                        totalUsers -
                          (roleStats.student || 0) -
                          (roleStats.teacher || 0) -
                          (roleStats.admin || 0) -
                          (roleStats.librarian || 0)
                      )
                    )}
                  </p>

                </div>

              </div>

              <FaChartBar className="text-slate-300" />

            </div>

          </div>

        </SectionCard>

        {/* BOOK OVERVIEW */}

        <SectionCard
          icon={<FaBook />}
          eyebrow="Collection Analytics"
          title="Library Collection"
        >

          <ProgressRow
            label="Available Books"
            value={activeBooks}
            total={totalBooks}
            icon={<FaCheckCircle />}
          />

          <div className="mt-6">

            <ProgressRow
              label="Unavailable Books"
              value={inactiveBooks}
              total={totalBooks}
              icon={<FaTimesCircle />}
            />

          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

              <p className="text-xs font-bold text-slate-400">
                Total Quantity
              </p>

              <p className="mt-1 text-2xl font-black text-slate-800">
                {formatNumber(totalQuantity)}
              </p>

              <p className="mt-1 text-[10px] font-semibold text-slate-400">
                Physical copies
              </p>

            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">

              <p className="text-xs font-bold text-blue-500">
                Available Copies
              </p>

              <p className="mt-1 text-2xl font-black text-blue-700">
                {formatNumber(availableCopies)}
              </p>

              <p className="mt-1 text-[10px] font-semibold text-blue-400">
                Ready for issue
              </p>

            </div>

          </div>

        </SectionCard>

      </div>

      {/* =================================================
          CIRCULATION ANALYTICS
      ================================================= */}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">

        {/* ISSUES */}

        <SectionCard
          icon={<FaExchangeAlt />}
          eyebrow="Circulation"
          title="Issue Activity"
        >

          <div className="space-y-4">

            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">
                  <FaFileAlt />
                </div>

                <span className="text-sm font-bold text-slate-600">
                  Total Issues
                </span>

              </div>

              <span className="text-xl font-black text-slate-800">
                {formatNumber(totalIssues)}
              </span>

            </div>

            <div className="flex items-center justify-between rounded-2xl bg-blue-50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <FaClock />
                </div>

                <span className="text-sm font-bold text-blue-700">
                  Pending
                </span>

              </div>

              <span className="text-xl font-black text-blue-700">
                {formatNumber(pendingIssues)}
              </span>

            </div>

            <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <FaCheckCircle />
                </div>

                <span className="text-sm font-bold text-emerald-700">
                  Returned
                </span>

              </div>

              <span className="text-xl font-black text-emerald-700">
                {formatNumber(returnedIssues)}
              </span>

            </div>

          </div>

        </SectionCard>

        {/* RETURNS */}

        <SectionCard
          icon={<FaUndo />}
          eyebrow="Return Management"
          title="Return Activity"
        >

          <div className="space-y-4">

            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">

              <span className="text-sm font-bold text-slate-600">
                Total Returns
              </span>

              <span className="text-xl font-black text-slate-800">
                {formatNumber(totalReturns)}
              </span>

            </div>

            <div className="flex items-center justify-between rounded-2xl bg-amber-50 p-4">

              <div className="flex items-center gap-3">

                <FaClock className="text-amber-600" />

                <span className="text-sm font-bold text-amber-700">
                  Pending
                </span>

              </div>

              <span className="text-xl font-black text-amber-700">
                {formatNumber(pendingReturns)}
              </span>

            </div>

            <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-4">

              <div className="flex items-center gap-3">

                <FaCheckCircle className="text-emerald-600" />

                <span className="text-sm font-bold text-emerald-700">
                  Completed
                </span>

              </div>

              <span className="text-xl font-black text-emerald-700">
                {formatNumber(completedReturns)}
              </span>

            </div>

            <div className="flex items-center justify-between rounded-2xl bg-red-50 p-4">

              <div className="flex items-center gap-3">

                <FaTimesCircle className="text-red-500" />

                <span className="text-sm font-bold text-red-600">
                  Rejected
                </span>

              </div>

              <span className="text-xl font-black text-red-600">
                {formatNumber(rejectedReturns)}
              </span>

            </div>

          </div>

        </SectionCard>

        {/* FINES */}

        <SectionCard
          icon={<FaMoneyBillWave />}
          eyebrow="Financial Overview"
          title="Fine Management"
        >

          <div className="rounded-3xl bg-[#890C25] p-5 text-white">

            <p className="text-xs font-bold text-white/60">
              Total Fine Amount
            </p>

            <p className="mt-2 text-3xl font-black">
              {formatAmount(totalFineAmount)}
            </p>

            <div className="mt-4 h-px bg-white/10" />

            <p className="mt-3 text-xs text-white/50">
              {formatNumber(totalFines)} total fine records
            </p>

          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">

            <div className="rounded-2xl bg-emerald-50 p-4">

              <p className="text-xs font-bold text-emerald-600">
                Paid Fines
              </p>

              <p className="mt-1 text-2xl font-black text-emerald-700">
                {formatNumber(paidFines)}
              </p>

            </div>

            <div className="rounded-2xl bg-red-50 p-4">

              <p className="text-xs font-bold text-red-500">
                Unpaid Fines
              </p>

              <p className="mt-1 text-2xl font-black text-red-600">
                {formatNumber(unpaidFines)}
              </p>

            </div>

          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-4">

            <p className="text-xs font-bold text-slate-400">
              Fine From Returns
            </p>

            <p className="mt-1 text-xl font-black text-slate-700">
              {formatAmount(totalReturnFine)}
            </p>

          </div>

        </SectionCard>

      </div>

      {/* =================================================
          DIGITAL LIBRARY
      ================================================= */}

      <div className="mt-6">

        <div
          className="
            relative
            overflow-hidden
            rounded-[2rem]
            p-6
            shadow-[0_18px_45px_rgba(37,99,235,0.14)]
            sm:p-8
          "
          style={{
            background:
              "linear-gradient(135deg, #0f1f4d 0%, #172554 55%, #1e3a8a 100%)",
          }}
        >

          <div
            className="
              absolute
              -right-20
              -top-24
              h-72
              w-72
              rounded-full
              border
              border-white/10
              bg-white/5
            "
          />

          <div
            className="
              absolute
              -bottom-24
              -left-16
              h-64
              w-64
              rounded-full
              border
              border-white/10
              bg-white/5
            "
          />

          <div className="relative z-10">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-blue-600
                    text-xl
                    text-white
                    shadow-[0_10px_30px_rgba(37,99,235,0.35)]
                  "
                >
                  <FaGlobe />
                </div>

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">
                    Digital Library
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-white">
                    Digital Library Analytics
                  </h2>

                </div>

              </div>

              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-blue-200 backdrop-blur-md">
                Live Report Data
              </div>

            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">

                <FaBookOpen className="text-blue-300" />

                <p className="mt-4 text-xs font-bold text-white/50">
                  Digital Books
                </p>

                <p className="mt-1 text-2xl font-black text-white">
                  {formatNumber(
                    digitalLibraryReport?.summary?.totalBooks ??
                      totalDigitalBooks
                  )}
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">

                <FaCheckCircle className="text-emerald-300" />

                <p className="mt-4 text-xs font-bold text-white/50">
                  Active Books
                </p>

                <p className="mt-1 text-2xl font-black text-white">
                  {formatNumber(
                    digitalLibraryReport?.summary?.activeBooks ??
                      digitalActiveBooks
                  )}
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">

                <FaEye className="text-[#D58A98]" />

                <p className="mt-4 text-xs font-bold text-white/50">
                  Total Views
                </p>

                <p className="mt-1 text-2xl font-black text-white">
                  {formatNumber(
                    digitalLibraryReport?.summary?.totalViews ??
                      totalDigitalViews
                  )}
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">

                <FaDownload className="text-blue-300" />

                <p className="mt-4 text-xs font-bold text-white/50">
                  Downloads
                </p>

                <p className="mt-1 text-2xl font-black text-white">
                  {formatNumber(
                    digitalLibraryReport?.summary?.totalDownloads ??
                      totalDigitalDownloads
                  )}
                </p>

              </div>

            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-white/10 bg-black/10 p-5 backdrop-blur-md">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold text-white/50">
                      Active Digital Books
                    </p>

                    <p className="mt-1 text-lg font-black text-white">
                      {formatNumber(digitalActiveBooks)}
                    </p>

                  </div>

                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                    Active
                  </span>

                </div>

              </div>

              <div className="rounded-2xl border border-white/10 bg-black/10 p-5 backdrop-blur-md">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold text-white/50">
                      Inactive Digital Books
                    </p>

                    <p className="mt-1 text-lg font-black text-white">
                      {formatNumber(digitalInactiveBooks)}
                    </p>

                  </div>

                  <span className="rounded-full bg-red-400/10 px-3 py-1 text-xs font-bold text-red-300">
                    Inactive
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          REPORT SOURCE FOOTER
      ================================================= */}

      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">

        <div
          className="h-1 w-12 rounded-full"
          style={{
            backgroundColor: brandColor,
          }}
        />

        <div className="flex items-center gap-2">

          <FaChartBar className="text-slate-400" />

          <p className="text-xs font-bold text-slate-400">
            LMS Super Admin Analytics • Real Report Data
          </p>

        </div>

        <div
          className="h-1 w-12 rounded-full"
          style={{
            backgroundColor: blueColor,
          }}
        />

      </div>

    </div>
  );
};

export default SuperAdminDashboard;