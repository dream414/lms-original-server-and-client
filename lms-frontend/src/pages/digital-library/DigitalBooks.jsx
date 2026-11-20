import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBook,
  FaBookOpen,
  FaSearch,
  FaEye,
  FaDownload,
  FaArrowRight,
  FaFilter,
  FaLayerGroup,
  FaTimes,
} from "react-icons/fa";

import { useDigitalBooks } from "../../context/DigitalBookContext";

const DigitalBooks = () => {
  const navigate = useNavigate();

  const {
    digitalBooks,
    loading,
    error,
    getDigitalBooks,
    viewDigitalBook,
    clearError,
  } = useDigitalBooks();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [selectedStatus, setSelectedStatus] =
    useState("All");

  const [viewingBookId, setViewingBookId] =
    useState(null);

  // ==========================================
  // LOAD DIGITAL BOOKS
  // ==========================================

  useEffect(() => {
    getDigitalBooks();
  }, []);

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = [
    ...new Set(
      (digitalBooks || [])
        .map((book) => book.category)
        .filter(Boolean)
    ),
  ];

  // ==========================================
  // FILTER BOOKS
  // ==========================================

  const filteredBooks = (digitalBooks || []).filter(
    (book) => {
      const search =
        searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        book.title
          ?.toLowerCase()
          .includes(search) ||
        book.author
          ?.toLowerCase()
          .includes(search) ||
        book.category
          ?.toLowerCase()
          .includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        book.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "All" ||
        book.status === selectedStatus;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    }
  );

  // ==========================================
  // SUMMARY
  // ==========================================

  const activeBooks =
    (digitalBooks || []).filter(
      (book) => book.status === "Active"
    ).length;

  const totalViews = (digitalBooks || []).reduce(
    (total, book) =>
      total + (Number(book.views) || 0),
    0
  );

  const totalDownloads = (
    digitalBooks || []
  ).reduce(
    (total, book) =>
      total + (Number(book.downloads) || 0),
    0
  );

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedStatus("All");
  };

  const hasFilters =
    searchTerm ||
    selectedCategory !== "All" ||
    selectedStatus !== "All";

  // ==========================================
  // VIEW BOOK
  // ==========================================
  // First record the view through backend.
  // Then navigate to Details page.
  // ==========================================

  // const handleViewDetails = async (book) => {
  //   if (!book?._id) {
  //     return;
  //   }

  //   if (book.status !== "Active") {
  //     return;
  //   }

  //   try {
  //     setViewingBookId(book._id);

  //     const result = await viewDigitalBook(
  //       book._id
  //     );

  //     // --------------------------------------
  //     // Even if activity response is not used
  //     // for navigation, we still navigate after
  //     // the request completes.
  //     // --------------------------------------

  //     if (result !== null) {
  //       navigate(
  //         `/digital-library/books/${book._id}`
  //       );

  //       return;
  //     }

  //     // --------------------------------------
  //     // If view request failed, do not silently
  //     // pretend that the view was recorded.
  //     // --------------------------------------

  //     console.error(
  //       "Digital book view was not recorded."
  //     );
  //   } catch (error) {
  //     console.error(
  //       "Handle view details error:",
  //       error
  //     );
  //   } finally {
  //     setViewingBookId(null);
  //   }
  // };

// ==========================================
// VIEW BOOK DETAILS
// ==========================================
// First record the view through backend.
// Then open the Digital Book Details page.
// Navigation should not depend on response shape.
// ==========================================

const handleViewDetails = async (book) => {
  if (!book?._id) {
    console.error("Digital book ID is missing.");
    return;
  }

  if (book.status !== "Active") {
    return;
  }

  try {
    setViewingBookId(book._id);

    // --------------------------------------
    // Record book view
    // --------------------------------------
    try {
      await viewDigitalBook(book._id);
    } catch (viewError) {
      console.error(
        "Digital book view API error:",
        viewError
      );
    }

    // --------------------------------------
    // Always open details page after click
    // --------------------------------------
    navigate(
      `/digital-library/books/${book._id}`
    );
  } catch (error) {
    console.error(
      "Handle view details error:",
      error
    );
  } finally {
    setViewingBookId(null);
  }
};


  return (
    <div className="min-h-screen bg-slate-100 relative overflow-hidden">

      {/* ================================= */}
      {/* BACKGROUND DECORATION */}
      {/* ================================= */}

      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#890C25]/10 blur-3xl pointer-events-none animate-pulse" />

      <div className="absolute top-[40%] -left-32 w-80 h-80 rounded-full bg-[#D58A98]/10 blur-3xl pointer-events-none animate-pulse" />

      <div className="absolute bottom-0 right-[25%] w-72 h-72 rounded-full bg-blue-500/5 blur-3xl pointer-events-none animate-pulse" />

      <div className="absolute top-24 left-10 w-28 h-28 rounded-full border border-[#890C25]/10 animate-[spin_18s_linear_infinite] pointer-events-none" />

      <div className="absolute top-32 right-16 w-20 h-20 rounded-full border border-blue-500/10 animate-[spin_14s_linear_infinite_reverse] pointer-events-none" />

      <div className="absolute bottom-32 left-[28%] w-24 h-24 rounded-full border border-[#D58A98]/15 animate-[spin_20s_linear_infinite] pointer-events-none" />

      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full border border-[#890C25]/10 animate-[spin_24s_linear_infinite_reverse] pointer-events-none" />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 pt-10 sm:pt-12 lg:pt-14">

        {/* ================================= */}
        {/* PAGE HEADER */}
        {/* ================================= */}

        <div className="mb-7">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>

              <div className="flex items-center gap-3 mb-3">

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#890C25] to-[#5f0719] flex items-center justify-center shadow-lg shadow-[#890C25]/20">

                  <FaBookOpen className="text-white text-xl" />

                </div>

                <div>

                  <p className="text-sm font-semibold text-[#890C25] uppercase tracking-wider">
                    Digital Library
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    Digital Books
                  </h1>

                </div>

              </div>

              <p className="text-slate-500 max-w-2xl">
                Explore, read and access digital books
                available in your LMS library.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/digital-library/my-books"
                )
              }
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#890C25] text-white font-semibold shadow-lg shadow-[#890C25]/20 hover:bg-[#6f091e] hover:-translate-y-0.5 transition-all duration-300"
            >
              <FaBookOpen />
              My Digital Books
            </button>

          </div>

        </div>

        {/* ================================= */}
        {/* ERROR MESSAGE */}
        {/* ================================= */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                !
              </div>

              <p className="text-sm text-red-700">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              <FaTimes />
            </button>

          </div>
        )}

        {/* ================================= */}
        {/* SUMMARY CARDS */}
        {/* ================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">

          {/* Total Books */}

          <div className="relative group overflow-hidden bg-gradient-to-br from-[#890C25] to-[#5f0719] rounded-2xl p-5 text-white shadow-lg shadow-[#890C25]/15">

            <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-white/20 via-[#D58A98] to-white transition-all duration-700 ease-out group-hover:w-full z-20" />

            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10 animate-pulse" />

            <div className="absolute -right-2 top-8 w-14 h-14 rounded-full border border-white/10 animate-[spin_14s_linear_infinite]" />

            <div className="absolute right-10 -bottom-8 w-20 h-20 rounded-full border border-white/10 animate-[spin_18s_linear_infinite_reverse]" />

            <div className="relative z-10 flex items-center justify-between">

              <div>

                <p className="text-sm text-white/70">
                  Total Books
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {digitalBooks?.length || 0}
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                <FaBook className="text-xl" />
              </div>

            </div>

          </div>

          {/* Active Books */}

          <div className="relative group overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/15">

            <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-300 via-white/80 to-blue-200 transition-all duration-700 ease-out group-hover:w-full z-20" />

            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10 animate-pulse" />

            <div className="absolute -right-2 top-8 w-14 h-14 rounded-full border border-white/10 animate-[spin_16s_linear_infinite_reverse]" />

            <div className="absolute right-10 -bottom-8 w-20 h-20 rounded-full border border-white/10 animate-[spin_20s_linear_infinite]" />

            <div className="relative z-10 flex items-center justify-between">

              <div>

                <p className="text-sm text-white/70">
                  Active Books
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {activeBooks}
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                <FaBookOpen className="text-xl" />
              </div>

            </div>

          </div>

          {/* Views */}

          <div className="relative group overflow-hidden bg-gradient-to-br from-[#ffffff] via-[#fdf3f5] to-[#f5dfe4] rounded-2xl p-5 border border-[#D58A98]/30 shadow-lg shadow-[#890C25]/10">

            <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25] transition-all duration-700 ease-out group-hover:w-full z-20" />

            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#890C25]/10 animate-pulse" />

            <div className="absolute right-1 top-7 w-16 h-16 rounded-full border border-[#890C25]/15 animate-[spin_15s_linear_infinite]" />

            <div className="absolute right-14 -bottom-8 w-20 h-20 rounded-full border border-[#D58A98]/25 animate-[spin_19s_linear_infinite_reverse]" />

            <div className="relative z-10 flex items-center justify-between">

              <div>

                <p className="text-sm text-[#890C25]/65">
                  Total Views
                </p>

                <h2 className="text-3xl font-bold text-slate-800 mt-1">
                  {totalViews}
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-[#890C25]/10 flex items-center justify-center">
                <FaEye className="text-[#890C25] text-xl" />
              </div>

            </div>

          </div>

          {/* Downloads */}

          <div className="relative group overflow-hidden bg-gradient-to-br from-[#ffffff] via-[#f1f7ff] to-[#dcecff] rounded-2xl p-5 border border-blue-200/70 shadow-lg shadow-blue-500/10">

            <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-600 transition-all duration-700 ease-out group-hover:w-full z-20" />

            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-blue-500/10 animate-pulse" />

            <div className="absolute right-1 top-7 w-16 h-16 rounded-full border border-blue-500/15 animate-[spin_15s_linear_infinite_reverse]" />

            <div className="absolute right-14 -bottom-8 w-20 h-20 rounded-full border border-blue-400/25 animate-[spin_19s_linear_infinite]" />

            <div className="relative z-10 flex items-center justify-between">

              <div>

                <p className="text-sm text-blue-700/65">
                  Total Downloads
                </p>

                <h2 className="text-3xl font-bold text-slate-800 mt-1">
                  {totalDownloads}
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <FaDownload className="text-blue-600 text-xl" />
              </div>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* SEARCH & FILTER */}
        {/* ================================= */}

        <div className="relative group bg-gradient-to-br from-white via-[#fff8fa] to-[#f7e5e9] rounded-2xl border-2 border-[#D58A98]/30 shadow-lg shadow-[#890C25]/10 p-5 mb-7 overflow-hidden">

          <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25] transition-all duration-700 ease-out group-hover:w-full z-30" />

          <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-[#890C25]/10 animate-pulse pointer-events-none" />

          <div className="absolute right-8 top-6 w-20 h-20 rounded-full border border-[#890C25]/15 animate-[spin_16s_linear_infinite] pointer-events-none" />

          <div className="absolute -left-10 -bottom-10 w-28 h-28 rounded-full border border-[#D58A98]/25 animate-[spin_20s_linear_infinite_reverse] pointer-events-none" />

          <div className="absolute left-[35%] -bottom-16 w-32 h-32 rounded-full bg-[#D58A98]/5 animate-pulse pointer-events-none" />

          <div className="absolute right-[32%] top-2 w-10 h-10 rounded-full border border-[#890C25]/10 animate-[spin_12s_linear_infinite_reverse] pointer-events-none" />

          <div className="relative z-10">

            <div className="flex items-center gap-2 mb-4">

              <div className="relative w-9 h-9 rounded-lg bg-[#890C25]/10 border border-[#D58A98]/20 flex items-center justify-center overflow-hidden">

                <div className="absolute inset-0 rounded-lg bg-[#890C25]/5 animate-pulse" />

                <FaFilter className="relative z-10 text-[#890C25] text-sm" />

              </div>

              <div>

                <h2 className="font-bold text-slate-800">
                  Find Digital Books
                </h2>

                <p className="text-xs text-slate-400">
                  Search and filter library resources
                </p>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

              <div className="xl:col-span-2 relative">

                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#890C25]/50 z-10" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="Search by title, author or category..."
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#D58A98]/30 bg-white/80 backdrop-blur-sm text-sm text-slate-700 outline-none focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/10 transition shadow-sm"
                />

              </div>

              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value)
                }
                className="w-full h-12 px-4 rounded-xl border border-[#D58A98]/30 bg-white/80 backdrop-blur-sm text-sm text-slate-700 outline-none focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/10 transition shadow-sm"
              >

                <option value="All">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}

              </select>

              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value)
                }
                className="w-full h-12 px-4 rounded-xl border border-blue-200 bg-white/80 backdrop-blur-sm text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition shadow-sm"
              >

                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

            {hasFilters && (
              <div className="mt-4 flex items-center justify-between gap-3">

                <p className="text-xs text-slate-500">

                  Showing{" "}

                  <span className="font-bold text-[#890C25]">
                    {filteredBooks.length}
                  </span>{" "}

                  of{" "}

                  <span className="font-bold text-slate-700">
                    {digitalBooks?.length || 0}
                  </span>{" "}

                  books

                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#890C25] hover:text-[#6f091e] transition"
                >
                  <FaTimes />
                  Clear Filters
                </button>

              </div>
            )}

          </div>

        </div>

        {/* ================================= */}
        {/* BOOK GRID HEADER */}
        {/* ================================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

          <div>

            <h2 className="text-xl font-bold text-slate-800">
              Available Digital Books
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {filteredBooks.length} digital resource
              {filteredBooks.length !== 1
                ? "s"
                : ""}{" "}
              available
            </p>

          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">

            <FaLayerGroup className="text-[#890C25]" />

            <span>
              {categories.length} categor
              {categories.length !== 1
                ? "ies"
                : "y"}
            </span>

          </div>

        </div>

        {/* ================================= */}
        {/* LOADING */}
        {/* ================================= */}

        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">

            <div className="w-10 h-10 mx-auto border-4 border-[#890C25]/20 border-t-[#890C25] rounded-full animate-spin" />

            <p className="text-sm text-slate-500 mt-4">
              Loading digital books...
            </p>

          </div>
        )}

        {/* ================================= */}
        {/* EMPTY */}
        {/* ================================= */}

        {!loading &&
          filteredBooks.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

              <div className="w-20 h-20 mx-auto rounded-2xl bg-[#890C25]/10 flex items-center justify-center mb-5">

                <FaBook className="text-[#890C25] text-3xl" />

              </div>

              <h3 className="text-lg font-bold text-slate-800">
                No Digital Books Found
              </h3>

              <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
                {hasFilters
                  ? "No books match your current search or filter criteria."
                  : "There are currently no digital books available in the library."}
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#890C25] text-white text-sm font-semibold hover:bg-[#6f091e] transition"
                >
                  <FaTimes />
                  Clear Filters
                </button>
              )}

            </div>
          )}

        {/* ================================= */}
        {/* BOOK GRID */}
        {/* ================================= */}

        {!loading &&
          filteredBooks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {filteredBooks.map((book, index) => (

                <div
                  key={book._id}
                  className={`relative group rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${
                    index % 2 === 0
                      ? "bg-gradient-to-br from-white via-[#fff8fa] to-[#f7e5e9] border-[#D58A98]/30"
                      : "bg-gradient-to-br from-white via-[#f8fbff] to-[#e5f0ff] border-blue-200/70"
                  }`}
                >

                  {/* Hover Line */}

                  <div
                    className={`absolute top-0 left-0 h-1 w-0 transition-all duration-700 ease-out group-hover:w-full z-30 ${
                      index % 2 === 0
                        ? "bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25]"
                        : "bg-gradient-to-r from-blue-700 via-blue-400 to-blue-600"
                    }`}
                  />

                  {/* Decorative Circles */}

                  <div
                    className={`absolute -right-10 -top-10 w-32 h-32 rounded-full animate-pulse pointer-events-none ${
                      index % 2 === 0
                        ? "bg-[#890C25]/10"
                        : "bg-blue-500/10"
                    }`}
                  />

                  <div
                    className={`absolute -right-1 top-7 w-16 h-16 rounded-full border pointer-events-none ${
                      index % 2 === 0
                        ? "border-[#890C25]/15 animate-[spin_15s_linear_infinite]"
                        : "border-blue-500/15 animate-[spin_15s_linear_infinite_reverse]"
                    }`}
                  />

                  <div
                    className={`absolute right-12 -bottom-8 w-20 h-20 rounded-full border pointer-events-none ${
                      index % 2 === 0
                        ? "border-[#D58A98]/25 animate-[spin_19s_linear_infinite_reverse]"
                        : "border-blue-400/25 animate-[spin_19s_linear_infinite]"
                    }`}
                  />

                  <div
                    className={`absolute left-20 bottom-24 w-10 h-10 rounded-full border pointer-events-none ${
                      index % 2 === 0
                        ? "border-[#890C25]/10 animate-[spin_13s_linear_infinite]"
                        : "border-blue-500/10 animate-[spin_13s_linear_infinite_reverse]"
                    }`}
                  />

                  {/* Cover */}

                  <div className="relative z-10 h-56 bg-gradient-to-br from-[#890C25] to-[#5f0719] overflow-hidden">

                    {book.coverImage ? (

                      <img
                        src={`http://localhost:5000${book.coverImage}`}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                    ) : (

                      <div className="w-full h-full flex flex-col items-center justify-center">

                        <FaBookOpen className="text-white/80 text-5xl mb-3" />

                        <span className="text-white/60 text-xs">
                          Digital Book
                        </span>

                      </div>

                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3">

                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm ${
                          book.status === "Active"
                            ? "bg-green-500/90 text-white"
                            : "bg-red-500/90 text-white"
                        }`}
                      >
                        {book.status}
                      </span>

                    </div>

                    <div className="absolute top-3 right-3">

                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#890C25] text-[10px] font-bold">
                        {book.fileType || "PDF"}
                      </span>

                    </div>

                  </div>

                  {/* Card Content */}

                  <div className="relative z-10 p-5">

                    <div className="mb-3">

                      <h3
                        className="font-bold text-slate-800 line-clamp-2 min-h-[48px] group-hover:text-[#890C25] transition"
                        title={book.title}
                      >
                        {book.title}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1 truncate">
                        By {book.author || "Unknown Author"}
                      </p>

                    </div>

                    <div className="flex items-center gap-2 mb-4">

                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#890C25]/10 text-[#890C25] text-[10px] font-semibold">
                        {book.category ||
                          "General"}
                      </span>

                      {book.language && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-semibold">
                          {book.language}
                        </span>
                      )}

                    </div>

                    {/* Stats */}

                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-200/70 mb-4">

                      <div className="flex items-center gap-2">

                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <FaEye className="text-blue-600 text-xs" />
                        </div>

                        <div>

                          <p className="text-sm font-bold text-slate-700">
                            {book.views || 0}
                          </p>

                          <p className="text-[10px] text-slate-400">
                            Views
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-2">

                        <div className="w-8 h-8 rounded-lg bg-[#890C25]/10 flex items-center justify-center">
                          <FaDownload className="text-[#890C25] text-xs" />
                        </div>

                        <div>

                          <p className="text-sm font-bold text-slate-700">
                            {book.downloads || 0}
                          </p>

                          <p className="text-[10px] text-slate-400">
                            Downloads
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* View Details */}

                    <button
                      type="button"
                      onClick={() =>
                        handleViewDetails(book)
                      }
                      disabled={
                        book.status !== "Active" ||
                        viewingBookId === book._id
                      }
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        book.status === "Active"
                          ? "bg-[#890C25] text-white hover:bg-[#6f091e] shadow-md shadow-[#890C25]/15 disabled:opacity-70"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >

                      {viewingBookId ===
                      book._id ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Opening...
                        </>
                      ) : (
                        <>
                          <FaEye />
                          View Details
                          <FaArrowRight className="text-xs ml-auto" />
                        </>
                      )}

                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        {/* ================================= */}
        {/* BOTTOM INFO */}
        {/* ================================= */}

        {!loading &&
          filteredBooks.length > 0 && (
            <div className="relative group mt-8 bg-gradient-to-r from-[#890C25] to-[#6f091e] rounded-2xl p-5 sm:p-6 text-white overflow-hidden">

              <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-500 via-[#D58A98] to-white transition-all duration-700 ease-out group-hover:w-full z-20" />

              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10 animate-pulse" />

              <div className="absolute -left-10 -bottom-10 w-28 h-28 rounded-full bg-white/5 animate-pulse" />

              <div className="absolute top-5 right-24 w-16 h-16 rounded-full border border-white/10 animate-[spin_15s_linear_infinite]" />

              <div className="absolute bottom-5 left-1/3 w-12 h-12 rounded-full border border-white/10 animate-[spin_12s_linear_infinite_reverse]" />

              <div className="absolute top-1/2 right-1/2 w-10 h-10 rounded-full border border-[#D58A98]/20 animate-[spin_17s_linear_infinite]" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <FaBookOpen className="text-xl" />
                  </div>

                  <div>

                    <h3 className="font-bold">
                      Explore Your Digital Library
                    </h3>

                    <p className="text-sm text-white/65 mt-1">
                      Read and download available
                      digital resources.
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/digital-library/my-books"
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#890C25] font-semibold text-sm hover:bg-slate-100 transition"
                >
                  My Digital Books
                  <FaArrowRight className="text-xs" />
                </button>

              </div>

            </div>
          )}

      </div>
    </div>
  );
};

export default DigitalBooks;