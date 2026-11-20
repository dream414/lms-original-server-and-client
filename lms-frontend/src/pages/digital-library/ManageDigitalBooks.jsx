
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBook,
  FaBookOpen,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaToggleOn,
  FaToggleOff,
  FaPlus,
  FaArrowLeft,
  FaFilter,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import { useDigitalBooks } from "../../context/DigitalBookContext";

const ManageDigitalBooks = () => {
  const {
    digitalBooks,
    loading,
    error,
    getDigitalBooks,
    deleteDigitalBook,
    toggleDigitalBookStatus,
    clearError,
  } = useDigitalBooks();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    getDigitalBooks();
  }, []);

  const categories = [
    ...new Set(
      (digitalBooks || [])
        .map((book) => book.category)
        .filter(Boolean)
    ),
  ];

  const filteredBooks = (digitalBooks || []).filter((book) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !search ||
      book.title?.toLowerCase().includes(search) ||
      book.author?.toLowerCase().includes(search) ||
      book.category?.toLowerCase().includes(search) ||
      book.isbn?.toLowerCase().includes(search);

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
  });

  const totalBooks = digitalBooks?.length || 0;

  const activeBooks = (digitalBooks || []).filter(
    (book) => book.status === "Active"
  ).length;

  const inactiveBooks = (digitalBooks || []).filter(
    (book) => book.status === "Inactive"
  ).length;

  const totalViews = (digitalBooks || []).reduce(
    (total, book) => total + (book.views || 0),
    0
  );

  const totalDownloads = (digitalBooks || []).reduce(
    (total, book) => total + (book.downloads || 0),
    0
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedStatus("All");
  };

  const hasFilters =
    searchTerm ||
    selectedCategory !== "All" ||
    selectedStatus !== "All";

  const handleDeleteClick = (book) => {
    setDeleteId(book._id);
    setDeleteTitle(book.title);
  };

  const cancelDelete = () => {
    if (actionLoading) return;

    setDeleteId(null);
    setDeleteTitle("");
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setActionLoading(true);

      const result = await deleteDigitalBook(deleteId);

      if (result) {
        setSuccessMessage(
          "Digital book deleted successfully."
        );

        setDeleteId(null);
        setDeleteTitle("");

        await getDigitalBooks();

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (book) => {
    if (!book?._id) return;

    try {
      setActionLoading(true);

      const result =
        await toggleDigitalBookStatus(book._id);

      if (result) {
        setSuccessMessage(
          "Book status changed successfully."
        );

        await getDigitalBooks();

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-hidden">

      {/* ================================= */}
      {/* BACKGROUND DECORATION */}
      {/* ================================= */}

      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#890C25]/10 blur-3xl pointer-events-none" />

      <div className="absolute top-[40%] -left-32 w-80 h-80 rounded-full bg-[#D58A98]/10 blur-3xl pointer-events-none" />

      <div className="absolute bottom-0 right-[20%] w-72 h-72 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="mb-7">

          <Link
            to="/digital-library/books"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#890C25] hover:text-[#6f091e] mb-5 transition"
          >
            <FaArrowLeft />
            Back to Digital Books
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#890C25] to-[#5f0719] flex items-center justify-center shadow-lg shadow-[#890C25]/20">
                  <FaBookOpen className="text-white text-xl" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#890C25] uppercase tracking-wider">
                    Digital Library
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    Manage Digital Books
                  </h1>
                </div>

              </div>

              <p className="text-slate-500 mt-3 max-w-2xl">
                Manage your digital library resources,
                update book information and control
                availability.
              </p>

            </div>

            <Link
              to="/digital-library/add"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#890C25] text-white font-semibold shadow-lg shadow-[#890C25]/20 hover:bg-[#6f091e] hover:-translate-y-0.5 transition-all duration-300"
            >
              <FaPlus />
              Add Digital Book
            </Link>

          </div>

        </div>

        {/* ================================= */}
        {/* SUCCESS */}
        {/* ================================= */}

        {successMessage && (
          <div className="mb-6 relative overflow-hidden bg-white/90 backdrop-blur-xl border border-green-200 rounded-2xl p-4 flex items-center gap-3 shadow-lg">

            <div className="absolute left-0 top-0 h-full w-1 bg-green-500" />

            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <FaCheckCircle />
            </div>

            <p className="text-sm font-semibold text-green-700">
              {successMessage}
            </p>

          </div>
        )}

        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold">
                !
              </div>

              <p className="text-sm text-red-700">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={clearError}
              className="w-9 h-9 rounded-lg hover:bg-red-100 text-red-500 hover:text-red-700 flex items-center justify-center transition"
            >
              <FaTimes />
            </button>

          </div>
        )}

        {/* ================================= */}
        {/* SUMMARY */}
        {/* ================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">

          {/* TOTAL */}

          <div className="relative overflow-hidden group rounded-3xl bg-gradient-to-br from-[#890C25] via-[#79091f] to-[#520615] p-5 text-white shadow-xl shadow-[#890C25]/15 hover:-translate-y-1 transition-all duration-300">

            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-500" />

            <div className="absolute bottom-0 right-8 w-16 h-16 rounded-full bg-white/5" />

            <div className="relative z-10 flex items-center justify-between">

              <div>
                <p className="text-xs text-white/65 uppercase tracking-wider">
                  Total Books
                </p>

                <h2 className="text-3xl font-extrabold mt-1">
                  {totalBooks}
                </h2>

                <p className="text-[11px] text-white/50 mt-1">
                  Digital resources
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center">
                <FaBook className="text-lg" />
              </div>

            </div>

          </div>

          {/* ACTIVE */}

          <div className="relative overflow-hidden group rounded-3xl bg-gradient-to-br from-blue-600 via-blue-600 to-blue-800 p-5 text-white shadow-xl shadow-blue-500/15 hover:-translate-y-1 transition-all duration-300">

            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-500" />

            <div className="absolute bottom-0 left-12 w-16 h-16 rounded-full bg-white/5" />

            <div className="relative z-10 flex items-center justify-between">

              <div>
                <p className="text-xs text-white/65 uppercase tracking-wider">
                  Active Books
                </p>

                <h2 className="text-3xl font-extrabold mt-1">
                  {activeBooks}
                </h2>

                <p className="text-[11px] text-white/50 mt-1">
                  Currently available
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center">
                <FaToggleOn className="text-xl" />
              </div>

            </div>

          </div>

          {/* INACTIVE */}

          <div className="relative overflow-hidden group rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl p-5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">

            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-[#D58A98] to-[#890C25]" />

            <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-red-50 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10 flex items-center justify-between">

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Inactive Books
                </p>

                <h2 className="text-3xl font-extrabold text-slate-800 mt-1">
                  {inactiveBooks}
                </h2>

                <p className="text-[11px] text-slate-400 mt-1">
                  Currently unavailable
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                <FaToggleOff className="text-red-500 text-xl" />
              </div>

            </div>

          </div>

          {/* VIEWS */}

          <div className="relative overflow-hidden group rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl p-5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">

            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-600" />

            <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-blue-50 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10 flex items-center justify-between">

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Total Views
                </p>

                <h2 className="text-3xl font-extrabold text-slate-800 mt-1">
                  {totalViews}
                </h2>

                <p className="text-[11px] text-slate-400 mt-1">
                  Book views
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <FaEye className="text-blue-600 text-lg" />
              </div>

            </div>

          </div>

          {/* DOWNLOADS */}

          <div className="relative overflow-hidden group rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl p-5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">

            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25]" />

            <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-[#890C25]/5 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10 flex items-center justify-between">

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Downloads
                </p>

                <h2 className="text-3xl font-extrabold text-slate-800 mt-1">
                  {totalDownloads}
                </h2>

                <p className="text-[11px] text-slate-400 mt-1">
                  Total downloads
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-[#890C25]/10 border border-[#890C25]/10 flex items-center justify-center">
                <FaDownload className="text-[#890C25] text-lg" />
              </div>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* SEARCH & FILTER */}
        {/* ================================= */}

        <div className="relative overflow-hidden bg-white/85 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl mb-8">

          {/* Animated Top Line */}

          <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25] transition-all duration-700 group-hover:w-full" />

          {/* Decorative Circles */}

          <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-[#890C25]/5 pointer-events-none" />

          <div className="absolute -left-12 -bottom-20 w-36 h-36 rounded-full bg-blue-500/5 pointer-events-none" />

          <div className="relative z-10 p-5 sm:p-6">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-[#890C25]/10 border border-[#890C25]/10 flex items-center justify-center">
                  <FaFilter className="text-[#890C25] text-lg" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Search & Filter
                  </h2>

                  <p className="text-sm text-slate-400 mt-0.5">
                    Find and manage specific digital books
                  </p>
                </div>

              </div>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm font-semibold hover:bg-red-600 hover:text-white transition-all"
                >
                  <FaTimes />
                  Clear Filters
                </button>
              )}

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

              {/* SEARCH */}

              <div className="xl:col-span-2">

                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Search Books
                </label>

                <div className="relative group">

                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#890C25] transition" />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    placeholder="Search title, author, category or ISBN..."
                    className="w-full h-13 pl-11 pr-4 rounded-2xl border border-slate-200 bg-slate-50/80 text-sm text-slate-700 outline-none focus:bg-white focus:border-[#890C25] focus:ring-4 focus:ring-[#890C25]/10 transition-all"
                  />

                </div>

              </div>

              {/* CATEGORY */}

              <div>

                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Category
                </label>

                <div className="relative">

                  <select
                    value={selectedCategory}
                    onChange={(e) =>
                      setSelectedCategory(e.target.value)
                    }
                    className="appearance-none w-full h-13 px-4 pr-10 rounded-2xl border border-slate-200 bg-slate-50/80 text-sm text-slate-700 font-medium outline-none cursor-pointer focus:bg-white focus:border-[#890C25] focus:ring-4 focus:ring-[#890C25]/10 transition-all"
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

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#890C25]">
                    <span className="text-xs">▼</span>
                  </div>

                </div>

              </div>

              {/* STATUS */}

              <div>

                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Status
                </label>

                <div className="relative">

                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value)
                    }
                    className="appearance-none w-full h-13 px-4 pr-10 rounded-2xl border border-slate-200 bg-slate-50/80 text-sm text-slate-700 font-medium outline-none cursor-pointer focus:bg-white focus:border-[#890C25] focus:ring-4 focus:ring-[#890C25]/10 transition-all"
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

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#890C25]">
                    <span className="text-xs">▼</span>
                  </div>

                </div>

              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div className="flex items-center gap-2">

                <span className="w-2 h-2 rounded-full bg-[#890C25] animate-pulse" />

                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-bold text-[#890C25]">
                    {filteredBooks.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-700">
                    {totalBooks}
                  </span>{" "}
                  books
                </p>

              </div>

              {hasFilters && (
                <p className="text-xs text-slate-400">
                  Filters are currently active
                </p>
              )}

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* TABLE */}
        {/* ================================= */}

        <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl">

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25]" />

          <div className="px-5 sm:px-6 py-6 border-b border-slate-100">

            <div className="flex items-center justify-between gap-3">

              <div>

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-[#890C25]/10 flex items-center justify-center">
                    <FaBook className="text-[#890C25]" />
                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-slate-800">
                      Digital Book Management
                    </h2>

                    <p className="text-xs text-slate-400 mt-1">
                      Update, activate, deactivate or remove
                      digital books.
                    </p>

                  </div>

                </div>

              </div>

              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500">

                <FaBook className="text-[#890C25]" />

                <span>
                  {filteredBooks.length} Records
                </span>

              </div>

            </div>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="p-12 text-center">

              <div className="w-11 h-11 mx-auto border-4 border-[#890C25]/20 border-t-[#890C25] rounded-full animate-spin" />

              <p className="text-sm font-medium text-slate-500 mt-4">
                Loading digital books...
              </p>

            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            filteredBooks.length === 0 && (
              <div className="p-12 text-center">

                <div className="w-20 h-20 mx-auto rounded-2xl bg-[#890C25]/10 flex items-center justify-center mb-4">
                  <FaBook className="text-[#890C25] text-3xl" />
                </div>

                <h3 className="font-bold text-slate-700 text-lg">
                  No Books Found
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Try changing your search or filter
                  options.
                </p>

              </div>
            )}

          {/* DESKTOP TABLE */}

          {!loading &&
            filteredBooks.length > 0 && (
              <div className="hidden lg:block overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="bg-gradient-to-r from-[#890C25] via-[#79091f] to-[#65091c] text-white">

                      <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wide">
                        Book
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wide">
                        Category
                      </th>

                      <th className="text-center px-5 py-4 text-xs font-semibold uppercase tracking-wide">
                        Status
                      </th>

                      <th className="text-center px-5 py-4 text-xs font-semibold uppercase tracking-wide">
                        Views
                      </th>

                      <th className="text-center px-5 py-4 text-xs font-semibold uppercase tracking-wide">
                        Downloads
                      </th>

                      <th className="text-center px-5 py-4 text-xs font-semibold uppercase tracking-wide">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredBooks.map((book) => (
                      <tr
                        key={book._id}
                        className="border-b border-slate-100 hover:bg-[#890C25]/[0.025] transition"
                      >

                        {/* BOOK */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3 min-w-[260px]">

                            <div className="w-12 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-[#890C25] to-[#5f0719] shrink-0 flex items-center justify-center shadow-sm">

                              {book.coverImage ? (
                                <img
                                  src={`http://localhost:5000${book.coverImage}`}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FaBookOpen className="text-white" />
                              )}

                            </div>

                            <div className="min-w-0">

                              <p
                                className="font-semibold text-slate-800 truncate max-w-[250px]"
                                title={book.title}
                              >
                                {book.title}
                              </p>

                              <p className="text-xs text-slate-500 mt-1">
                                {book.author ||
                                  "Unknown Author"}
                              </p>

                              {book.isbn && (
                                <p className="text-[10px] text-slate-400 mt-1">
                                  ISBN: {book.isbn}
                                </p>
                              )}

                            </div>

                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td className="px-5 py-4">

                          <span className="inline-flex px-3 py-1.5 rounded-lg bg-[#890C25]/10 text-[#890C25] text-xs font-semibold">
                            {book.category ||
                              "General"}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4 text-center">

                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() =>
                              handleToggleStatus(book)
                            }
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition ${
                              book.status === "Active"
                                ? "bg-green-50 text-green-600 hover:bg-green-100"
                                : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                          >

                            {book.status ===
                            "Active" ? (
                              <FaToggleOn className="text-base" />
                            ) : (
                              <FaToggleOff className="text-base" />
                            )}

                            {book.status}

                          </button>

                        </td>

                        {/* VIEWS */}

                        <td className="px-5 py-4 text-center">

                          <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                            <FaEye className="text-blue-500 text-xs" />
                            {book.views || 0}
                          </div>

                        </td>

                        {/* DOWNLOADS */}

                        <td className="px-5 py-4 text-center">

                          <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                            <FaDownload className="text-[#890C25] text-xs" />
                            {book.downloads || 0}
                          </div>

                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">

                          <div className="flex items-center justify-center gap-2">

                            <Link
                              to={`/digital-library/books/${book._id}`}
                              title="View"
                              className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
                            >
                              <FaEye className="text-xs" />
                            </Link>

                            <Link
                              to={`/digital-library/books/${book._id}/edit`}
                              title="Edit"
                              className="w-9 h-9 rounded-lg bg-[#890C25]/10 text-[#890C25] flex items-center justify-center hover:bg-[#890C25] hover:text-white transition"
                            >
                              <FaEdit className="text-xs" />
                            </Link>

                            <button
                              type="button"
                              title="Delete"
                              disabled={actionLoading}
                              onClick={() =>
                                handleDeleteClick(book)
                              }
                              className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition disabled:opacity-50"
                            >
                              <FaTrash className="text-xs" />
                            </button>

                          </div>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          {/* MOBILE / TABLET */}

          {!loading &&
            filteredBooks.length > 0 && (
              <div className="lg:hidden p-4 sm:p-5 space-y-4">

                {filteredBooks.map((book) => (

                  <div
                    key={book._id}
                    className="relative overflow-hidden border border-slate-200 bg-white rounded-2xl p-4 hover:border-[#D58A98]/50 hover:shadow-lg transition-all"
                  >

                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#890C25] via-[#D58A98] to-blue-500" />

                    <div className="flex items-start gap-4">

                      <div className="w-16 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-[#890C25] to-[#5f0719] shrink-0 flex items-center justify-center shadow-sm">

                        {book.coverImage ? (
                          <img
                            src={`http://localhost:5000${book.coverImage}`}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaBookOpen className="text-white text-xl" />
                        )}

                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex items-start justify-between gap-2">

                          <div className="min-w-0">

                            <h3 className="font-bold text-slate-800 line-clamp-2">
                              {book.title}
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                              {book.author ||
                                "Unknown Author"}
                            </p>

                          </div>

                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() =>
                              handleToggleStatus(book)
                            }
                            className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              book.status === "Active"
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >

                            {book.status ===
                            "Active" ? (
                              <FaToggleOn />
                            ) : (
                              <FaToggleOff />
                            )}

                            {book.status}

                          </button>

                        </div>

                        <div className="mt-3">

                          <span className="inline-flex px-2.5 py-1 rounded-lg bg-[#890C25]/10 text-[#890C25] text-[10px] font-semibold">
                            {book.category ||
                              "General"}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* STATS */}

                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">

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

                    {/* ACTIONS */}

                    <div className="grid grid-cols-3 gap-2 mt-4">

                      <Link
                        to={`/digital-library/books/${book._id}`}
                        className="inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-600 hover:text-white transition"
                      >
                        <FaEye />
                        View
                      </Link>

                      <Link
                        to={`/digital-library/books/${book._id}/edit`}
                        className="inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#890C25]/10 text-[#890C25] text-xs font-semibold hover:bg-[#890C25] hover:text-white transition"
                      >
                        <FaEdit />
                        Edit
                      </Link>

                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() =>
                          handleDeleteClick(book)
                        }
                        className="inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-600 hover:text-white transition disabled:opacity-50"
                      >
                        <FaTrash />
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>
            )}

        </div>

        {/* ================================= */}
        {/* FOOTER INFO */}
        {/* ================================= */}

        <div className="mt-6 relative overflow-hidden bg-gradient-to-r from-[#890C25] via-[#79091f] to-[#6f091e] rounded-3xl p-5 sm:p-6 text-white shadow-xl">

          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10" />

          <div className="absolute -left-10 -bottom-10 w-28 h-28 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <FaBook />
              </div>

              <div>

                <h3 className="font-bold">
                  Digital Library Management
                </h3>

                <p className="text-sm text-white/60 mt-1">
                  Keep your digital resources organized
                  and available for users.
                </p>

              </div>

            </div>

            <Link
              to="/digital-library/add"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#890C25] font-semibold text-sm hover:bg-slate-100 transition"
            >
              <FaPlus />
              Add New Book
            </Link>

          </div>

        </div>

      </div>

      {/* ================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ================================= */}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={cancelDelete}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

            <div className="h-2 bg-gradient-to-r from-[#890C25] to-[#5f0719]" />

            <div className="p-6">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-5">
                <FaExclamationTriangle className="text-red-500 text-2xl" />
              </div>

              <h2 className="text-xl font-bold text-slate-800 text-center">
                Delete Digital Book?
              </h2>

              <p className="text-sm text-slate-500 text-center mt-2 leading-relaxed">

                Are you sure you want to delete{" "}

                <span className="font-semibold text-slate-700">
                  "{deleteTitle}"
                </span>
                ?

                <br />

                This action cannot be undone.

              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={cancelDelete}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition disabled:opacity-50"
                >
                  <FaTimes />
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleDelete}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-60"
                >

                  {actionLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      Delete Book
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default ManageDigitalBooks;

