
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaBoxes,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaFilter,
  FaSyncAlt,
  FaCalendarAlt,
  FaTag,
  FaChartPie,
  FaLayerGroup,
  FaArrowLeft,
  FaEye,
  FaExclamationTriangle,
  FaBookOpen,
  FaHashtag,
  FaUser,
} from "react-icons/fa";

import { useReports } from "../../context/ReportContext";

const BooksReport = () => {
  const navigate = useNavigate();

  const {
    booksReport,
    getBooksReport,
    loading,
    error,
  } = useReports();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    getBooksReport();
  }, []);

  // ---------------------------------------------------------
  // REPORT DATA
  // ---------------------------------------------------------

  const report = booksReport?.report || booksReport || {};

  const books = useMemo(() => {
    if (Array.isArray(report?.books)) {
      return report.books;
    }

    if (Array.isArray(report?.data)) {
      return report.data;
    }

    if (Array.isArray(report?.data?.books)) {
      return report.data.books;
    }

    return [];
  }, [report]);

  const summary = report?.summary || report?.stats || {};

  // ---------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------

  const getNumber = (value, fallback = 0) => {
    const number = Number(value);

    return Number.isFinite(number) ? number : fallback;
  };

  const getBookCategory = (book) => {
    if (!book?.category) {
      return "Uncategorized";
    }

    if (typeof book.category === "string") {
      return book.category;
    }

    if (typeof book.category === "object") {
      return (
        book.category?.name ||
        book.category?.title ||
        "Uncategorized"
      );
    }

    return "Uncategorized";
  };

  const getBookStatus = (book) => {
    if (book?.status) {
      const status = String(book.status).toLowerCase();

      if (
        status === "inactive" ||
        status === "disabled" ||
        status === "false"
      ) {
        return "Inactive";
      }

      if (
        status === "active" ||
        status === "enabled" ||
        status === "true"
      ) {
        return "Active";
      }
    }

    if (book?.isActive === false || book?.active === false) {
      return "Inactive";
    }

    // Since Book schema does not have a status field,
    // availability is used as fallback.
    return getNumber(book?.availableCopies) > 0
      ? "Active"
      : "Inactive";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ---------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------

  const totalBooks = books.length;

  const activeBooks = books.filter(
    (book) => getBookStatus(book) === "Active"
  ).length;

  const inactiveBooks = books.filter(
    (book) => getBookStatus(book) === "Inactive"
  ).length;

  // FIX:
  // This variable was missing before.
  const availableBooks = books.filter(
    (book) => getNumber(book?.availableCopies) > 0
  ).length;

  const totalQuantity = books.reduce(
    (sum, book) => sum + getNumber(book?.quantity),
    0
  );

  const availableCopies = books.reduce(
    (sum, book) => sum + getNumber(book?.availableCopies),
    0
  );

  const unavailableCopies = Math.max(
    totalQuantity - availableCopies,
    0
  );

  const summaryTotalBooks =
    getNumber(summary?.totalBooks) ||
    getNumber(report?.totalBooks) ||
    totalBooks;

  const summaryActiveBooks =
    getNumber(summary?.activeBooks) ||
    activeBooks;

  const summaryInactiveBooks =
    getNumber(summary?.inactiveBooks) ||
    inactiveBooks;

  const summaryTotalQuantity =
    getNumber(summary?.totalQuantity) ||
    totalQuantity;

  const summaryAvailableCopies =
    getNumber(summary?.availableCopies) ||
    availableCopies;

  // ---------------------------------------------------------
  // CATEGORIES
  // ---------------------------------------------------------

  const categories = useMemo(() => {
    const categoryMap = {};

    books.forEach((book) => {
      const category = getBookCategory(book);

      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }

      categoryMap[category] += 1;
    });

    return Object.entries(categoryMap)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [books]);

  const categoryNames = categories.map(
    (category) => category.name
  );

  // ---------------------------------------------------------
  // FILTERED BOOKS
  // ---------------------------------------------------------

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const title = String(book?.title || "").toLowerCase();
      const author = String(book?.author || "").toLowerCase();
      const isbn = String(book?.isbn || "").toLowerCase();

      const category = getBookCategory(book);
      const status = getBookStatus(book);

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        title.includes(searchValue) ||
        author.includes(searchValue) ||
        isbn.includes(searchValue);

      const matchesCategory =
        categoryFilter === "All" ||
        category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    books,
    search,
    categoryFilter,
    statusFilter,
  ]);

  // ---------------------------------------------------------
  // REFRESH
  // ---------------------------------------------------------

  const handleRefresh = async () => {
    await getBooksReport();
  };

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 md:px-6 lg:px-8">

      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section
          className="relative overflow-hidden  mt-10 rounded-[2rem] p-6 shadow-2xl md:p-8 lg:p-10"
          style={{
            background:
              "linear-gradient(135deg, #890C25 0%, #6f091e 55%, #420512 100%)",
          }}
        >
          {/* Decorative circles */}

          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-[1px]" />

          <div className="pointer-events-none absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-[#D58A98]/10" />

          <div className="pointer-events-none absolute right-[22%] top-10 h-28 w-28 rounded-full border border-white/10 bg-white/5" />

          <div className="pointer-events-none absolute bottom-8 right-12 h-16 w-16 rounded-full border border-white/10 bg-white/5" />

          {/* Animated top line */}

          <div className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden bg-white/10">
            <div className="h-full w-1/3 animate-pulse bg-white/70" />
          </div>

          <div className="relative z-10">

            {/* Top controls */}

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <button
                onClick={() => navigate(-1)}
                className="group inline-flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
              >
                <FaArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
                Back to Reports
              </button>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaSyncAlt
                  className={loading ? "animate-spin" : ""}
                />
                {loading ? "Refreshing..." : "Refresh Report"}
              </button>

            </div>

            {/* Hero content */}

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-5">

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-md md:h-20 md:w-20">
                  <FaBookOpen className="text-3xl text-white md:text-4xl" />
                </div>

                <div>

                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#D58A98]">
                    Library Analytics
                  </p>

                  <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
                    Books Report
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 md:text-base">
                    Monitor your library collection, availability,
                    categories, inventory and book distribution from
                    one centralized report.
                  </p>

                </div>

              </div>

              <div className="w-fit rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-md">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <FaChartPie className="text-[#D58A98]" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                      Report Status
                    </p>

                    <p className="mt-1 flex items-center gap-2 text-sm font-bold text-white">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      Live Data
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <div className="flex items-center gap-3 text-red-700">
              <FaExclamationTriangle />
              <p className="text-sm font-semibold">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
            STAT CARDS
        ====================================================== */}

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">

          {/* Total Books */}

          <div
            className="group relative overflow-hidden rounded-3xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background:
                "linear-gradient(145deg, #890C25, #65081b)",
            }}
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />

            <div className="absolute bottom-[-35px] left-[-25px] h-24 w-24 rounded-full bg-[#D58A98]/10" />

            <div className="relative z-10">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <FaBook className="text-xl text-white" />
                </div>

                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D58A98]">
                  Collection
                </span>

              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                Total Books
              </p>

              <h2 className="mt-2 text-3xl font-black text-white">
                {summaryTotalBooks}
              </h2>

              <p className="mt-2 text-xs text-white/55">
                Books in library collection
              </p>

            </div>
          </div>

          {/* Available Books */}

          <div
            className="group relative overflow-hidden rounded-3xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background:
                "linear-gradient(145deg, #890C25, #65081b)",
            }}
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-400/10 transition-transform duration-500 group-hover:scale-125" />

            <div className="absolute bottom-[-35px] left-[-25px] h-24 w-24 rounded-full bg-white/5" />

            <div className="relative z-10">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15">
                  <FaCheckCircle className="text-xl text-emerald-300" />
                </div>

                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Available
                </span>

              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                Available Books
              </p>

              <h2 className="mt-2 text-3xl font-black text-white">
                {availableBooks}
              </h2>

              <p className="mt-2 text-xs text-white/55">
                Currently available titles
              </p>

            </div>
          </div>

          {/* Active Books */}

          <div
            className="group relative overflow-hidden rounded-3xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background:
                "linear-gradient(145deg, #890C25, #65081b)",
            }}
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-400/10 transition-transform duration-500 group-hover:scale-125" />

            <div className="relative z-10">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15">
                  <FaCheckCircle className="text-xl text-blue-300" />
                </div>

                <span className="rounded-full bg-blue-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  Active
                </span>

              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                Active Books
              </p>

              <h2 className="mt-2 text-3xl font-black text-white">
                {summaryActiveBooks}
              </h2>

              <p className="mt-2 text-xs text-white/55">
                Active library titles
              </p>

            </div>
          </div>

          {/* Inactive Books */}

          <div
            className="group relative overflow-hidden rounded-3xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background:
                "linear-gradient(145deg, #890C25, #65081b)",
            }}
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-red-400/10 transition-transform duration-500 group-hover:scale-125" />

            <div className="relative z-10">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15">
                  <FaTimesCircle className="text-xl text-red-300" />
                </div>

                <span className="rounded-full bg-red-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300">
                  Inactive
                </span>

              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                Inactive Books
              </p>

              <h2 className="mt-2 text-3xl font-black text-white">
                {summaryInactiveBooks}
              </h2>

              <p className="mt-2 text-xs text-white/55">
                Currently unavailable titles
              </p>

            </div>
          </div>

          {/* Total Copies */}

          <div
            className="group relative overflow-hidden rounded-3xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background:
                "linear-gradient(145deg, #2563EB, #1e40af)",
            }}
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />

            <div className="absolute bottom-[-35px] left-[-25px] h-24 w-24 rounded-full bg-white/10" />

            <div className="relative z-10">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <FaBoxes className="text-xl text-white" />
                </div>

                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80">
                  Inventory
                </span>

              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-blue-100">
                Total Copies
              </p>

              <h2 className="mt-2 text-3xl font-black text-white">
                {summaryTotalQuantity}
              </h2>

              <p className="mt-2 text-xs text-blue-100/70">
                Physical copies in inventory
              </p>

            </div>
          </div>

        </section>

        {/* =====================================================
            INVENTORY CONTROL CENTER
        ====================================================== */}

        <section
          className="relative overflow-hidden rounded-[2rem] p-6 shadow-2xl md:p-8"
          style={{
            background:
              "linear-gradient(145deg, #890C25, #65081b)",
          }}
        >

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />

          <div className="pointer-events-none absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-[#D58A98]/5" />

          <div className="relative z-10">

            <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
                  <FaBoxes className="text-lg text-white" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D58A98]">
                    Control Center
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-white">
                    Inventory Overview
                  </h2>
                </div>

              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Live Inventory
              </div>

            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.14]">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                      Available Copies
                    </p>

                    <p className="mt-2 text-3xl font-black text-white">
                      {summaryAvailableCopies}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15">
                    <FaCheckCircle className="text-xl text-emerald-300" />
                  </div>

                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                    style={{
                      width:
                        summaryTotalQuantity > 0
                          ? `${Math.min(
                              (summaryAvailableCopies /
                                summaryTotalQuantity) *
                                100,
                              100
                            )}%`
                          : "0%",
                    }}
                  />
                </div>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.14]">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                      Unavailable Copies
                    </p>

                    <p className="mt-2 text-3xl font-black text-white">
                      {unavailableCopies}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15">
                    <FaTimesCircle className="text-xl text-red-300" />
                  </div>

                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-red-400 transition-all duration-700"
                    style={{
                      width:
                        summaryTotalQuantity > 0
                          ? `${Math.min(
                              (unavailableCopies /
                                summaryTotalQuantity) *
                                100,
                              100
                            )}%`
                          : "0%",
                    }}
                  />
                </div>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.14]">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                      Availability Rate
                    </p>

                    <p className="mt-2 text-3xl font-black text-white">
                      {summaryTotalQuantity > 0
                        ? Math.round(
                            (summaryAvailableCopies /
                              summaryTotalQuantity) *
                              100
                          )
                        : 0}
                      %
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15">
                    <FaChartPie className="text-xl text-blue-300" />
                  </div>

                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-blue-400 transition-all duration-700"
                    style={{
                      width:
                        summaryTotalQuantity > 0
                          ? `${Math.min(
                              (summaryAvailableCopies /
                                summaryTotalQuantity) *
                                100,
                              100
                            )}%`
                          : "0%",
                    }}
                  />
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            ANALYTICS
        ====================================================== */}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* Status Analytics */}

          <div
            className="relative overflow-hidden rounded-[2rem] p-6 shadow-2xl md:p-8"
            style={{
              background:
                "linear-gradient(145deg, #890C25, #65081b)",
            }}
          >

            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5" />

            <div className="relative z-10">

              <div className="mb-7 flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
                  <FaChartPie className="text-lg text-white" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#D58A98]">
                    Analytics
                  </p>

                  <h2 className="text-xl font-black text-white">
                    Book Status
                  </h2>
                </div>

              </div>

              <div className="space-y-6">

                {/* Active */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <span className="text-sm font-semibold text-white">
                        Active Books
                      </span>
                    </div>

                    <span className="text-sm font-black text-white">
                      {summaryActiveBooks}
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white/10">

                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                      style={{
                        width:
                          summaryTotalBooks > 0
                            ? `${Math.min(
                                (summaryActiveBooks /
                                  summaryTotalBooks) *
                                  100,
                                100
                              )}%`
                            : "0%",
                      }}
                    />

                  </div>

                </div>

                {/* Inactive */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <span className="text-sm font-semibold text-white">
                        Inactive Books
                      </span>
                    </div>

                    <span className="text-sm font-black text-white">
                      {summaryInactiveBooks}
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white/10">

                    <div
                      className="h-full rounded-full bg-red-400 transition-all duration-700"
                      style={{
                        width:
                          summaryTotalBooks > 0
                            ? `${Math.min(
                                (summaryInactiveBooks /
                                  summaryTotalBooks) *
                                  100,
                                100
                              )}%`
                            : "0%",
                      }}
                    />

                  </div>

                </div>

                {/* Available Titles */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                      <span className="text-sm font-semibold text-white">
                        Available Titles
                      </span>
                    </div>

                    <span className="text-sm font-black text-white">
                      {availableBooks}
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white/10">

                    <div
                      className="h-full rounded-full bg-blue-400 transition-all duration-700"
                      style={{
                        width:
                          totalBooks > 0
                            ? `${Math.min(
                                (availableBooks /
                                  totalBooks) *
                                  100,
                                100
                              )}%`
                            : "0%",
                      }}
                    />

                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* Categories Analytics */}

          <div
            className="relative overflow-hidden rounded-[2rem] p-6 shadow-2xl md:p-8"
            style={{
              background:
                "linear-gradient(145deg, #890C25, #65081b)",
            }}
          >

            <div className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-[#D58A98]/10" />

            <div className="relative z-10">

              <div className="mb-7 flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
                  <FaLayerGroup className="text-lg text-white" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#D58A98]">
                    Distribution
                  </p>

                  <h2 className="text-xl font-black text-white">
                    Book Categories
                  </h2>
                </div>

              </div>

              {categories.length === 0 ? (

                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                  <FaLayerGroup className="mx-auto text-3xl text-white/30" />

                  <p className="mt-3 text-sm text-white/60">
                    No category data available.
                  </p>
                </div>

              ) : (

                <div className="max-h-[300px] space-y-5 overflow-y-auto pr-2">

                  {categories.slice(0, 8).map(
                    (category, index) => {

                      const percentage =
                        totalBooks > 0
                          ? Math.round(
                              (category.count /
                                totalBooks) *
                                100
                            )
                          : 0;

                      return (
                        <div key={category.name + index}>

                          <div className="mb-2 flex items-center justify-between">

                            <div className="flex min-w-0 items-center gap-2">

                              <FaTag className="shrink-0 text-xs text-[#D58A98]" />

                              <span className="truncate text-sm font-semibold text-white">
                                {category.name}
                              </span>

                            </div>

                            <div className="ml-3 flex shrink-0 items-center gap-2">

                              <span className="text-xs text-white/50">
                                {percentage}%
                              </span>

                              <span className="text-sm font-black text-white">
                                {category.count}
                              </span>

                            </div>

                          </div>

                          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">

                            <div
                              className="h-full rounded-full bg-blue-400 transition-all duration-700"
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

        </section>

        {/* =====================================================
            FILTERS
        ====================================================== */}

        <section
          className="relative overflow-hidden rounded-[2rem] p-6 shadow-2xl md:p-8"
          style={{
            background:
              "linear-gradient(145deg, #890C25, #65081b)",
          }}
        >

          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/5" />

          <div className="relative z-10">

            <div className="mb-6 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
                <FaFilter className="text-lg text-white" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#D58A98]">
                  Search & Filter
                </p>

                <h2 className="text-xl font-black text-white">
                  Find Books
                </h2>
              </div>

            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

              {/* Search */}

              <div className="lg:col-span-1">

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                  Search
                </label>

                <div className="relative">

                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search title, author or ISBN..."
                    className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pl-11 pr-4 text-sm font-medium text-white outline-none backdrop-blur-md transition-all placeholder:text-white/40 focus:border-blue-400/60 focus:bg-white/[0.14] focus:ring-2 focus:ring-blue-400/20"
                  />

                </div>

              </div>

              {/* Category */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                  Category
                </label>

                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white outline-none backdrop-blur-md transition-all focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20"
                >

                  <option
                    value="All"
                    className="bg-[#65081b] text-white"
                  >
                    All Categories
                  </option>

                  {categoryNames.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-[#65081b] text-white"
                    >
                      {category}
                    </option>
                  ))}

                </select>

              </div>

              {/* Status */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                  Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white outline-none backdrop-blur-md transition-all focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20"
                >

                  <option
                    value="All"
                    className="bg-[#65081b] text-white"
                  >
                    All Status
                  </option>

                  <option
                    value="Active"
                    className="bg-[#65081b] text-white"
                  >
                    Active
                  </option>

                  <option
                    value="Inactive"
                    className="bg-[#65081b] text-white"
                  >
                    Inactive
                  </option>

                </select>

              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            BOOKS TABLE
        ====================================================== */}

        <section
          className="relative overflow-hidden rounded-[2rem] shadow-2xl"
          style={{
            background:
              "linear-gradient(145deg, #890C25, #65081b)",
          }}
        >

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />

          <div className="relative z-10">

            {/* Table Header */}

            <div className="flex flex-col gap-4 border-b border-white/10 p-6 md:flex-row md:items-center md:justify-between md:p-8">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
                  <FaBook className="text-lg text-white" />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-widest text-[#D58A98]">
                    Library Collection
                  </p>

                  <h2 className="mt-1 text-xl font-black text-white">
                    Books Directory
                  </h2>

                </div>

              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2">

                <span className="text-xs font-semibold text-white/60">
                  Showing
                </span>

                <span className="text-sm font-black text-white">
                  {filteredBooks.length}
                </span>

                <span className="text-xs font-semibold text-white/60">
                  of
                </span>

                <span className="text-sm font-black text-white">
                  {books.length}
                </span>

              </div>

            </div>

            {/* Loading */}

            {loading && books.length === 0 ? (

              <div className="flex min-h-[350px] items-center justify-center">

                <div className="text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">

                    <FaSyncAlt className="animate-spin text-xl text-white" />

                  </div>

                  <p className="mt-4 text-sm font-semibold text-white/60">
                    Loading books report...
                  </p>

                </div>

              </div>

            ) : filteredBooks.length === 0 ? (

              <div className="flex min-h-[350px] items-center justify-center p-8">

                <div className="max-w-md text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">

                    <FaBook className="text-2xl text-white/30" />

                  </div>

                  <h3 className="mt-5 text-lg font-black text-white">
                    No Books Found
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/50">
                    No books match your current search or
                    filter criteria.
                  </p>

                  <button
                    onClick={() => {
                      setSearch("");
                      setCategoryFilter("All");
                      setStatusFilter("All");
                    }}
                    className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-500"
                  >
                    Clear Filters
                  </button>

                </div>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="min-w-[1100px] w-full">

                  <thead>

                    <tr className="border-b border-white/10 bg-black/10">

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-[#D58A98]">
                        Book
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-[#D58A98]">
                        ISBN
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-[#D58A98]">
                        Author
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-[#D58A98]">
                        Category
                      </th>

                      <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-wider text-[#D58A98]">
                        Quantity
                      </th>

                      <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-wider text-[#D58A98]">
                        Available
                      </th>

                      <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-wider text-[#D58A98]">
                        Status
                      </th>

                      <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-wider text-[#D58A98]">
                        Created
                      </th>

                      <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-wider text-[#D58A98]">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredBooks.map((book, index) => {

                      const status = getBookStatus(book);

                      const category =
                        getBookCategory(book);

                      const quantity =
                        getNumber(book?.quantity);

                      const available =
                        getNumber(
                          book?.availableCopies
                        );

                      return (
                        <tr
                          key={
                            book?._id ||
                            book?.id ||
                            index
                          }
                          className="group border-b border-white/5 transition-all duration-300 hover:bg-white/[0.06]"
                        >

                          {/* Book */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 transition-all group-hover:bg-blue-600">
                                <FaBook className="text-sm text-white/80 group-hover:text-white" />
                              </div>

                              <div className="min-w-0">

                                <p className="max-w-[220px] truncate text-sm font-bold text-white">
                                  {book?.title ||
                                    "Untitled Book"}
                                </p>

                                <p className="mt-1 flex items-center gap-1 text-[11px] text-white/40">
                                  <FaHashtag />
                                  {index + 1}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* ISBN */}

                          <td className="px-6 py-5">

                            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/70">
                              {book?.isbn || "—"}
                            </span>

                          </td>

                          {/* Author */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-2">

                              <FaUser className="text-xs text-[#D58A98]" />

                              <span className="max-w-[160px] truncate text-sm font-medium text-white/75">
                                {book?.author ||
                                  "Unknown Author"}
                              </span>

                            </div>

                          </td>

                          {/* Category */}

                          <td className="px-6 py-5">

                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/75">

                              <FaTag className="text-[#D58A98]" />

                              {category}

                            </span>

                          </td>

                          {/* Quantity */}

                          <td className="px-6 py-5 text-center">

                            <span className="text-sm font-black text-white">
                              {quantity}
                            </span>

                          </td>

                          {/* Available */}

                          <td className="px-6 py-5 text-center">

                            <span
                              className={`inline-flex min-w-[50px] items-center justify-center rounded-lg px-3 py-1.5 text-xs font-black ${
                                available > 0
                                  ? "bg-emerald-400/10 text-emerald-300"
                                  : "bg-red-400/10 text-red-300"
                              }`}
                            >
                              {available}
                            </span>

                          </td>

                          {/* Status */}

                          <td className="px-6 py-5 text-center">

                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ${
                                status === "Active"
                                  ? "bg-emerald-400/10 text-emerald-300"
                                  : "bg-red-400/10 text-red-300"
                              }`}
                            >

                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  status === "Active"
                                    ? "bg-emerald-400"
                                    : "bg-red-400"
                                }`}
                              />

                              {status}

                            </span>

                          </td>

                          {/* Created */}

                          <td className="px-6 py-5">

                            <div className="flex items-center justify-center gap-2 text-xs text-white/55">

                              <FaCalendarAlt className="text-[#D58A98]" />

                              {formatDate(
                                book?.createdAt
                              )}

                            </div>

                          </td>

                          {/* Action */}

                          <td className="px-6 py-5 text-center">

                            <button
                              onClick={() =>
                                navigate(
                                  `/books/view/${book?._id}`
                                )
                              }
                              disabled={!book?._id}
                              className="group/view inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white transition-all duration-300 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >

                              <FaEye className="transition-transform duration-300 group-hover/view:scale-110" />

                              View

                            </button>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>

            )}

            {/* Footer */}

            {filteredBooks.length > 0 && (

              <div className="border-t border-white/10 px-6 py-5 md:px-8">

                <div className="flex flex-col gap-3 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">

                  <p>
                    Showing{" "}
                    <span className="font-bold text-white/80">
                      {filteredBooks.length}
                    </span>{" "}
                    matching books.
                  </p>

                  <p>
                    Total available copies:{" "}
                    <span className="font-bold text-white/80">
                      {availableCopies}
                    </span>
                  </p>

                </div>

              </div>

            )}

          </div>
        </section>

        {/* =====================================================
            FOOTER SUMMARY
        ====================================================== */}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#890C25]/10">
                <FaBook className="text-[#890C25]" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Collection
                </p>

                <p className="mt-1 text-xl font-black text-slate-800">
                  {summaryTotalBooks}
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10">
                <FaBoxes className="text-blue-600" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Inventory
                </p>

                <p className="mt-1 text-xl font-black text-slate-800">
                  {summaryTotalQuantity}
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600/10">
                <FaCheckCircle className="text-emerald-600" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Available Copies
                </p>

                <p className="mt-1 text-xl font-black text-slate-800">
                  {summaryAvailableCopies}
                </p>
              </div>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
};

export default BooksReport;

