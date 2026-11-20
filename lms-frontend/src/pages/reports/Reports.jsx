
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaUsers,
  FaBook,
  FaBookOpen,
  FaUndo,
  FaMoneyBillWave,
  FaLaptop,
  FaEye,
  FaDownload,
  FaArrowRight,
  FaClipboardList,
  FaExclamationTriangle,
  FaCheckCircle,
  FaChartBar,
  FaFileAlt,
  FaSyncAlt,
} from "react-icons/fa";

import { useReports } from "../../context/ReportContext";

const Reports = () => {
  const navigate = useNavigate();

  const {
    overviewReport,
    loading,
    error,
    getOverviewReport,
  } = useReports();

  // =====================================================
  // BRAND COLORS
  // =====================================================

  const brandColor = "#890C25";
  const brandLightColor = "#D58A98";
  const blueColor = "#2563EB";

  // =====================================================
  // LOAD REPORT
  // =====================================================

  useEffect(() => {
    getOverviewReport();
  }, []);

  // =====================================================
  // SAFE DATA
  // =====================================================

  const users = overviewReport?.users || {};
  const books = overviewReport?.books || {};
  const issues = overviewReport?.issues || {};
  const returns = overviewReport?.returns || {};
  const fines = overviewReport?.fines || {};
  const digitalLibrary = overviewReport?.digitalLibrary || {};

  const totalUsers = Number(users.total) || 0;

  const totalBooks = Number(books.total) || 0;
  const availableBooks =
    Number(books.active) || 0;

  const unavailableBooks =
    Number(books.inactive) || 0;

  const totalIssues = Number(issues.total) || 0;
  const pendingIssues = Number(issues.pending) || 0;

  const totalReturns = Number(returns.total) || 0;
  const pendingReturns = Number(returns.pending) || 0;

  const totalFines = Number(fines.total) || 0;
  const totalFineAmount = Number(fines.totalAmount) || 0;

  const totalDigitalBooks =
    Number(digitalLibrary.total) || 0;

  const activeDigitalBooks =
    Number(digitalLibrary.active) || 0;

  const inactiveDigitalBooks =
    Number(digitalLibrary.inactive) || 0;

  const totalViews =
    Number(digitalLibrary.totalViews) || 0;

  const totalDownloads =
    Number(digitalLibrary.totalDownloads) || 0;

  // =====================================================
  // PERCENTAGES
  // =====================================================

  const availablePercentage =
    totalBooks > 0
      ? Math.round((availableBooks / totalBooks) * 100)
      : 0;

  const unavailablePercentage =
    totalBooks > 0
      ? Math.round((unavailableBooks / totalBooks) * 100)
      : 0;

  const activeDigitalPercentage =
    totalDigitalBooks > 0
      ? Math.round(
          (activeDigitalBooks / totalDigitalBooks) * 100
        )
      : 0;

  const inactiveDigitalPercentage =
    totalDigitalBooks > 0
      ? Math.round(
          (inactiveDigitalBooks / totalDigitalBooks) * 100
        )
      : 0;

  // =====================================================
  // FORMAT NUMBER
  // =====================================================

  const formatNumber = (value) => {
    return new Intl.NumberFormat().format(value);
  };

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-PK", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // =====================================================
  // REPORT NAVIGATION
  // =====================================================

  const reportCards = [
    {
      title: "Users Report",
      description:
        "View user accounts, roles and system participation.",
      icon: FaUsers,
      path: "/reports/users",
      accent: "blue",
    },
    {
      title: "Books Report",
      description:
        "Analyze physical library books and availability.",
      icon: FaBook,
      path: "/reports/books",
      accent: "maroon",
    },
    {
      title: "Issues Report",
      description:
        "Review issued books and current issue status.",
      icon: FaBookOpen,
      path: "/reports/issues",
      accent: "blue",
    },
    {
      title: "Returns Report",
      description:
        "Monitor returned books and pending returns.",
      icon: FaUndo,
      path: "/reports/returns",
      accent: "maroon",
    },
    {
      title: "Fines Report",
      description:
        "Analyze fines, payments and outstanding amounts.",
      icon: FaMoneyBillWave,
      path: "/reports/fines",
      accent: "blue",
    },
    {
      title: "Digital Library",
      description:
        "Track digital books, views and downloads.",
      icon: FaLaptop,
      path: "/reports/digital-library",
      accent: "maroon",
    },
  ];

  // =====================================================
  // STAT CARD
  // =====================================================

  const StatCard = ({
    icon: Icon,
    title,
    value,
    description,
    blue = false,
  }) => {
    return (
      <div
        className="
          group
          relative
          overflow-hidden
          rounded-3xl
          p-6
          shadow-[0_15px_35px_rgba(137,12,37,0.20)]
          transition
          duration-300
          hover:-translate-y-1
          hover:shadow-[0_20px_45px_rgba(137,12,37,0.30)]
        "
        style={{
          background: blue
            ? "linear-gradient(145deg, #890C25, #70091f)"
            : "linear-gradient(145deg, #890C25, #65081b)",
        }}
      >
        {/* Decorative Circle */}

        <div
          className="
            absolute
            -right-10
            -top-10
            h-32
            w-32
            rounded-full
            border
            border-white/10
            bg-white/5
            transition
            duration-500
            group-hover:scale-125
          "
        />

        {/* Bottom Circle */}

        <div
          className="
            absolute
            -bottom-14
            -left-10
            h-28
            w-28
            rounded-full
            bg-blue-500/5
          "
        />

        <div className="relative z-10">

          <div
            className={`
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              text-xl
              text-white
              shadow-lg
              ${
                blue
                  ? "bg-blue-600 shadow-[0_10px_25px_rgba(37,99,235,0.35)]"
                  : "bg-white/10 border border-white/20"
              }
            `}
          >
            <Icon />
          </div>

          <p className="mt-5 text-sm font-semibold text-[#D58A98]">
            {title}
          </p>

          <h3 className="mt-1 text-3xl font-black text-white">
            {value}
          </h3>

          <p className="mt-2 text-xs text-white/55">
            {description}
          </p>

        </div>
      </div>
    );
  };

  // =====================================================
  // PROGRESS BAR
  // =====================================================

  const ProgressBar = ({
    title,
    value,
    percentage,
    blue = false,
  }) => {
    return (
      <div className="mt-5">

        <div className="mb-2 flex items-center justify-between">

          <span className="text-sm font-semibold text-white">
            {title}
          </span>

          <span
            className={
              blue
                ? "text-sm font-black text-blue-300"
                : "text-sm font-black text-[#D58A98]"
            }
          >
            {value}
          </span>

        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-black/20">

          <div
            className={`
              h-full
              rounded-full
              transition-all
              duration-700
              ${
                blue
                  ? "bg-blue-500"
                  : "bg-[#D58A98]"
              }
            `}
            style={{
              width: `${Math.min(
                Math.max(percentage, 0),
                100
              )}%`,
            }}
          />

        </div>

      </div>
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && !overviewReport) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-10 sm:px-6 lg:px-8">

        <div
          className="
            flex
            min-h-[500px]
            items-center
            justify-center
            rounded-[2rem]
            shadow-[0_20px_50px_rgba(137,12,37,0.25)]
          "
          style={{
            background:
              "linear-gradient(135deg, #890C25 0%, #65081b 55%, #420512 100%)",
          }}
        >

          <div className="text-center">

            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                animate-spin
                items-center
                justify-center
                rounded-full
                border-4
                border-white/20
                border-t-white
              "
            >
              <FaChartLine className="text-xl text-white" />
            </div>

            <h2 className="mt-6 text-2xl font-black text-white">
              Loading Reports
            </h2>

            <p className="mt-2 text-sm text-white/60">
              Preparing your LMS analytics...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-8 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">

      {/* =================================================
          HERO
      ================================================= */}

      <div
        className="
          relative
          overflow-hidden
          rounded-[2rem]
          p-6
          shadow-[0_20px_50px_rgba(137,12,37,0.28)]
          sm:p-8
        "
        style={{
          background:
            "linear-gradient(135deg, #890C25 0%, #6f091e 55%, #420512 100%)",
        }}
      >

        {/* Circle 1 */}

        <div
          className="
            absolute
            -right-24
            -top-24
            h-72
            w-72
            animate-pulse
            rounded-full
            border
            border-white/10
            bg-white/5
          "
        />

        {/* Circle 2 */}

        <div
          className="
            absolute
            -bottom-32
            -left-20
            h-80
            w-80
            rounded-full
            border
            border-white/10
            bg-white/5
          "
        />

        {/* Circle 3 */}

        <div
          className="
            absolute
            right-[30%]
            top-8
            h-3
            w-3
            rounded-full
            bg-[#D58A98]
            shadow-[0_0_20px_rgba(213,138,152,0.8)]
          "
        />

        {/* Circle 4 */}

        <div
          className="
            absolute
            bottom-10
            right-[20%]
            h-2
            w-2
            rounded-full
            bg-blue-400
            shadow-[0_0_15px_rgba(96,165,250,0.9)]
          "
        />

        <div className="relative z-10">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}

            <div>

              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/20
                    bg-white/10
                    text-xl
                    text-white
                    shadow-xl
                    backdrop-blur-md
                  "
                >
                  <FaChartLine />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D58A98]">
                    Administration Panel
                  </p>

                  <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-4xl">
                    Reports & Analytics
                  </h1>

                </div>

              </div>

              <p className="mt-6 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                Monitor your LMS performance, library operations,
                users, issues, returns, fines and digital library
                activity from one powerful analytics center.
              </p>

            </div>

            {/* RIGHT BADGE */}

            <button
              type="button"
              onClick={() => getOverviewReport()}
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
                transition
                hover:bg-white/15
              "
            >

              <FaSyncAlt
                className={loading ? "animate-spin" : ""}
              />

              Refresh Analytics

            </button>

          </div>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          className="
            mt-6
            flex
            items-center
            gap-3
            rounded-3xl
            border
            border-red-200
            bg-red-50
            px-5
            py-4
            text-sm
            font-semibold
            text-red-700
            shadow-sm
          "
        >
          <FaExclamationTriangle />
          {error}
        </div>
      )}

      {/* =================================================
          MAIN STAT CARDS
      ================================================= */}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          icon={FaUsers}
          title="Total Users"
          value={formatNumber(totalUsers)}
          description="Registered LMS accounts"
        />

        <StatCard
          icon={FaBook}
          title="Total Books"
          value={formatNumber(totalBooks)}
          description="Physical library collection"
          blue
        />

        <StatCard
          icon={FaBookOpen}
          title="Issued Books"
          value={formatNumber(totalIssues)}
          description={`${formatNumber(pendingIssues)} currently pending`}
        />

        <StatCard
          icon={FaUndo}
          title="Pending Returns"
          value={formatNumber(pendingReturns)}
          description={`${formatNumber(totalReturns)} total return records`}
          blue
        />

        <StatCard
          icon={FaMoneyBillWave}
          title="Total Fines"
          value={formatNumber(totalFines)}
          description={`PKR ${formatCurrency(totalFineAmount)} total amount`}
        />

        <StatCard
          icon={FaLaptop}
          title="Digital Books"
          value={formatNumber(totalDigitalBooks)}
          description={`${formatNumber(activeDigitalBooks)} active digital books`}
          blue
        />

      </div>

      {/* =================================================
          LIBRARY OPERATIONS
      ================================================= */}

      <div
        className="
          relative
          mt-6
          overflow-hidden
          rounded-[2rem]
          p-6
          shadow-[0_18px_45px_rgba(137,12,37,0.22)]
          sm:p-8
        "
        style={{
          background:
            "linear-gradient(135deg, #890C25, #65081b, #4a0512)",
        }}
      >

        <div
          className="
            absolute
            -right-20
            -top-20
            h-64
            w-64
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

          {/* HEADER */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-blue-600
                text-2xl
                text-white
                shadow-[0_10px_25px_rgba(37,99,235,0.35)]
              "
            >
              <FaChartBar />
            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D58A98]">
                Library Analytics
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                Library Operations Overview
              </h2>

            </div>

          </div>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
            Monitor physical library availability, active issues,
            return activity and operational performance.
          </p>

          {/* CONTENT */}

          <div className="mt-7 grid gap-5 lg:grid-cols-2">

            {/* AVAILABILITY */}

            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-black/10
                p-6
                backdrop-blur-md
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-bold text-white">
                    Book Availability
                  </p>

                  <p className="mt-1 text-xs text-white/45">
                    Based on available copies
                  </p>

                </div>

                <FaBook className="text-xl text-[#D58A98]" />

              </div>

              <ProgressBar
                title="Available"
                value={`${availableBooks} books`}
                percentage={availablePercentage}
              />

              <ProgressBar
                title="Unavailable"
                value={`${unavailableBooks} books`}
                percentage={unavailablePercentage}
                blue
              />

            </div>

            {/* ISSUE / RETURN */}

            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-black/10
                p-6
                backdrop-blur-md
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-bold text-white">
                    Circulation Activity
                  </p>

                  <p className="mt-1 text-xs text-white/45">
                    Issues and return workflow
                  </p>

                </div>

                <FaClipboardList className="text-xl text-blue-400" />

              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">

                <div
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    p-5
                  "
                >

                  <FaBookOpen className="text-xl text-[#D58A98]" />

                  <p className="mt-3 text-xs text-white/50">
                    Total Issues
                  </p>

                  <p className="mt-1 text-2xl font-black text-white">
                    {formatNumber(totalIssues)}
                  </p>

                </div>

                <div
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    p-5
                  "
                >

                  <FaUndo className="text-xl text-blue-400" />

                  <p className="mt-3 text-xs text-white/50">
                    Pending Returns
                  </p>

                  <p className="mt-1 text-2xl font-black text-white">
                    {formatNumber(pendingReturns)}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          DIGITAL LIBRARY ANALYTICS
      ================================================= */}

      <div
        className="
          relative
          mt-6
          overflow-hidden
          rounded-[2rem]
          p-6
          shadow-[0_18px_45px_rgba(137,12,37,0.20)]
          sm:p-8
        "
        style={{
          background:
            "linear-gradient(135deg, #780A21, #520615)",
        }}
      >

        <div
          className="
            absolute
            -right-20
            -bottom-20
            h-64
            w-64
            rounded-full
            border
            border-white/10
            bg-white/5
          "
        />

        <div className="relative z-10">

          {/* HEADER */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-blue-600
                text-2xl
                text-white
                shadow-[0_10px_25px_rgba(37,99,235,0.35)]
              "
            >
              <FaLaptop />
            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D58A98]">
                Digital Library
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                Digital Engagement Analytics
              </h2>

            </div>

          </div>

          {/* DIGITAL STATS */}

          <div className="mt-7 grid gap-5 md:grid-cols-2">

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-black/10
                p-6
                backdrop-blur-md
              "
            >

              <div
                className="
                  absolute
                  -right-8
                  -top-8
                  h-24
                  w-24
                  rounded-full
                  bg-white/5
                  transition
                  duration-500
                  group-hover:scale-125
                "
              />

              <div className="relative">

                <div className="flex items-center justify-between">

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white/10
                      text-xl
                      text-[#D58A98]
                    "
                  >
                    <FaEye />
                  </div>

                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-white/50">
                    Views
                  </span>

                </div>

                <p className="mt-5 text-xs font-semibold text-white/50">
                  Total Digital Views
                </p>

                <h3 className="mt-1 text-3xl font-black text-white">
                  {formatNumber(totalViews)}
                </h3>

              </div>

            </div>

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-black/10
                p-6
                backdrop-blur-md
              "
            >

              <div
                className="
                  absolute
                  -right-8
                  -top-8
                  h-24
                  w-24
                  rounded-full
                  bg-blue-500/10
                  transition
                  duration-500
                  group-hover:scale-125
                "
              />

              <div className="relative">

                <div className="flex items-center justify-between">

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-blue-600
                      text-xl
                      text-white
                    "
                  >
                    <FaDownload />
                  </div>

                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
                    Downloads
                  </span>

                </div>

                <p className="mt-5 text-xs font-semibold text-white/50">
                  Total Digital Downloads
                </p>

                <h3 className="mt-1 text-3xl font-black text-white">
                  {formatNumber(totalDownloads)}
                </h3>

              </div>

            </div>

          </div>

          {/* DIGITAL STATUS */}

          <div
            className="
              mt-5
              rounded-3xl
              border
              border-white/10
              bg-black/10
              p-6
              backdrop-blur-md
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-bold text-white">
                  Digital Library Status
                </p>

                <p className="mt-1 text-xs text-white/45">
                  Current digital collection status
                </p>

              </div>

              <FaCheckCircle className="text-xl text-blue-400" />

            </div>

            <ProgressBar
              title="Active Digital Books"
              value={`${activeDigitalBooks} books`}
              percentage={activeDigitalPercentage}
            />

            <ProgressBar
              title="Inactive Digital Books"
              value={`${inactiveDigitalBooks} books`}
              percentage={inactiveDigitalPercentage}
              blue
            />

          </div>

        </div>

      </div>

      {/* =================================================
          REPORT CENTER
      ================================================= */}

      <div
        className="
          relative
          mt-6
          overflow-hidden
          rounded-[2rem]
          p-6
          shadow-[0_18px_45px_rgba(137,12,37,0.22)]
          sm:p-8
        "
        style={{
          background:
            "linear-gradient(135deg, #890C25, #65081b, #4a0512)",
        }}
      >

        <div
          className="
            absolute
            -left-20
            -top-20
            h-64
            w-64
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
            -right-16
            h-64
            w-64
            rounded-full
            border
            border-white/10
            bg-white/5
          "
        />

        <div className="relative z-10">

          {/* HEADER */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-blue-600
                text-2xl
                text-white
                shadow-[0_10px_25px_rgba(37,99,235,0.35)]
              "
            >
              <FaFileAlt />
            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D58A98]">
                Report Center
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                Detailed Reports
              </h2>

            </div>

          </div>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
            Open detailed reports for individual LMS modules and
            analyze complete operational data.
          </p>

          {/* REPORT CARDS */}

          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {reportCards.map((report) => {

              const Icon = report.icon;

              return (
                <button
                  key={report.path}
                  type="button"
                  onClick={() => navigate(report.path)}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/10
                    bg-black/10
                    p-6
                    text-left
                    backdrop-blur-md
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:bg-white/5
                  "
                >

                  {/* Hover Circle */}

                  <div
                    className="
                      absolute
                      -right-10
                      -top-10
                      h-28
                      w-28
                      rounded-full
                      bg-white/5
                      transition
                      duration-500
                      group-hover:scale-150
                    "
                  />

                  <div className="relative">

                    <div className="flex items-center justify-between">

                      <div
                        className={`
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-2xl
                          text-xl
                          text-white
                          ${
                            report.accent === "blue"
                              ? "bg-blue-600"
                              : "bg-white/10 border border-white/20"
                          }
                        `}
                      >
                        <Icon />
                      </div>

                      <FaArrowRight
                        className="
                          text-white/30
                          transition
                          duration-300
                          group-hover:translate-x-1
                          group-hover:text-blue-300
                        "
                      />

                    </div>

                    <h3 className="mt-5 text-lg font-black text-white">
                      {report.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-white/50">
                      {report.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[#D58A98]">
                      View Report
                      <FaArrowRight className="text-[10px]" />
                    </div>

                  </div>

                </button>
              );
            })}

          </div>

        </div>

      </div>

      {/* =================================================
          ACCESS / STATUS BAR
      ================================================= */}

      <div
        className="
          relative
          mt-6
          overflow-hidden
          rounded-[2rem]
          p-6
          shadow-[0_15px_35px_rgba(137,12,37,0.20)]
          sm:p-8
        "
        style={{
          background:
            "linear-gradient(145deg, #780A21, #520615)",
        }}
      >

        <div
          className="
            absolute
            -right-16
            -top-16
            h-48
            w-48
            rounded-full
            bg-white/5
          "
        />

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-bold text-white">
              Reports & Analytics Center
            </p>

            <p className="mt-1 text-xs text-white/50">
              LMS operational insights and performance monitoring
            </p>

          </div>

          <div
            className="
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-blue-400/20
              bg-blue-500/10
              px-4
              py-2
              text-xs
              font-bold
              text-blue-300
            "
          >

            <span
              className="
                h-2
                w-2
                rounded-full
                bg-blue-400
                shadow-[0_0_12px_rgba(96,165,250,0.9)]
              "
            />

            Analytics Active

          </div>

        </div>

      </div>

      {/* =================================================
          FOOTER ACCENT
      ================================================= */}

      <div className="mt-6 flex items-center justify-center gap-3">

        <div
          className="h-1 w-12 rounded-full"
          style={{
            backgroundColor: brandColor,
          }}
        />

        <p className="text-xs font-semibold text-slate-400">
          LMS Reports & Analytics
        </p>

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

export default Reports;

