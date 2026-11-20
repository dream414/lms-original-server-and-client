import { useEffect, useMemo } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaBook,
  FaBookOpen,
  FaEdit,
  FaUser,
  FaTag,
  FaBarcode,
  FaLayerGroup,
  FaCalendarAlt,
  FaBuilding,
  FaLanguage,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import { useBooks } from "../../context/BookContext";
import { useAuth } from "../../context/AuthContext";

// =====================================================
// BOOK DETAILS
// =====================================================

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { books, loading, error, getBookById } = useBooks();
  const { user } = useAuth();

  // =====================================================
  // USER ROLE
  // =====================================================

  const userRole = String(user?.role || "")
    .toLowerCase()
    .trim();

  // =====================================================
  // EDIT PERMISSION
  // ONLY SUPERADMIN, ADMIN AND LIBRARIAN CAN EDIT BOOK
  // =====================================================

  const canEditBook = ["superadmin", "admin", "librarian"].includes(userRole);

  // =====================================================
  // SAFE BOOKS ARRAY
  // =====================================================

  const booksList = Array.isArray(books)
    ? books
    : Array.isArray(books?.books)
    ? books.books
    : Array.isArray(books?.data)
    ? books.data
    : Array.isArray(books?.data?.books)
    ? books.data.books
    : [];

  // =====================================================
  // FIND BOOK FROM CONTEXT
  // =====================================================

  const contextBook = useMemo(() => {
    if (!id || booksList.length === 0) {
      return null;
    }

    return (
      booksList.find(
        (book) => String(book?._id) === String(id)
      ) || null
    );
  }, [booksList, id]);

  // =====================================================
  // FETCH BOOK IF AVAILABLE
  // =====================================================

  useEffect(() => {
    const loadBook = async () => {
      if (
        !contextBook &&
        typeof getBookById === "function" &&
        id
      ) {
        try {
          await getBookById(id);
        } catch (err) {
          console.error(
            "GET BOOK DETAILS ERROR:",
            err
          );
        }
      }
    };

    loadBook();
  }, [id, contextBook, getBookById]);

  // =====================================================
  // BOOK DATA
  // =====================================================

  const book = contextBook;

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) return null;

    let cleanImage = String(image).trim();

    if (!cleanImage) return null;

    // Already complete URL
    if (
      cleanImage.startsWith("http://") ||
      cleanImage.startsWith("https://")
    ) {
      return cleanImage;
    }

    // Remove leading slash
    cleanImage = cleanImage.replace(/^\/+/, "");

    // uploads/filename
    if (cleanImage.startsWith("uploads/")) {
      return `http://localhost:5000/${cleanImage}`;
    }

    // books/filename
    if (cleanImage.startsWith("books/")) {
      return `http://localhost:5000/uploads/${cleanImage}`;
    }

    // Default
    return `http://localhost:5000/uploads/books/${cleanImage}`;
  };

  const imageUrl = getImageUrl(book?.image);

  // =====================================================
  // BOOK VALUES
  // =====================================================

  const quantity = Number(book?.quantity) || 0;

  const availableCopies =
    Number(book?.availableCopies) || 0;

  const issuedCopies = Math.max(
    quantity - availableCopies,
    0
  );

  const isAvailable = availableCopies > 0;

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    try {
      return new Date(date).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    } catch {
      return "N/A";
    }
  };

  // =====================================================
  // IMAGE ERROR
  // =====================================================

  const handleImageError = (e) => {
    e.currentTarget.style.display = "none";

    const fallback =
      e.currentTarget.parentElement?.querySelector(
        ".details-image-fallback"
      );

    if (fallback) {
      fallback.classList.remove("hidden");
      fallback.classList.add("flex");
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && !book) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#890C25]/10 bg-white shadow-2xl">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#890C25]/20 border-t-[#890C25]" />
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-800">
                Loading Book
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Fetching book details...
              </p>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // BOOK NOT FOUND
  // =====================================================

  if (!book) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <div className="mx-auto max-w-3xl">

          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#890C25]/10 text-[#890C25]">
              <FaBookOpen size={30} />
            </div>

            <h2 className="mt-6 text-2xl font-black text-slate-800">
              Book Not Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              The requested book could not be found in the
              library records.
            </p>

            {error && (
              <p className="mt-4 text-sm font-semibold text-red-600">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={() => navigate("/library/books")}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#890C25] px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-[#6f091e]"
            >
              <FaArrowLeft size={12} />
              Back to Books
            </button>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-12 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            TOP NAVIGATION
        ================================================= */}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

          <Link
            to="/library/books"
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#890C25]/20 hover:bg-[#890C25] hover:text-white hover:shadow-lg"
          >
            <FaArrowLeft
              size={12}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Back to Books
          </Link>

          {/* =================================================
              EDIT BUTTON
              ONLY ADMIN AND LIBRARIAN
          ================================================= */}

          {canEditBook && (
            <Link
              to={`/library/books/${book?._id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
            >
              <FaEdit size={12} />
              Edit Book
            </Link>
          )}

        </div>

        {/* =================================================
            HERO
        ================================================= */}

        <div className="relative mb-6 overflow-hidden rounded-3xl bg-[#890C25] shadow-2xl">

          {/* Decorative circles */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/20 bg-white/5" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full border border-white/10 bg-white/5" />

          <div className="pointer-events-none absolute right-24 top-20 h-20 w-20 rounded-full bg-[#D58A98]/10 blur-2xl" />

          <div className="relative p-6 sm:p-8 lg:p-10">

            <div className="flex flex-wrap items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-md">
                <FaBookOpen size={21} />
              </div>

              <div>

                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D58A98]">
                  Library Management
                </p>

                <p className="mt-1 text-xs text-white/55">
                  Book Details
                </p>

              </div>

            </div>

            <h1 className="mt-6 text-3xl font-black text-white sm:text-4xl">
              {book?.title || "Untitled Book"}
            </h1>

            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-white/70">
              <FaUser size={11} />
              {book?.author || "Unknown Author"}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black backdrop-blur-md ${
                  isAvailable
                    ? "border-green-300/30 bg-green-500/20 text-green-100"
                    : "border-red-300/30 bg-red-500/20 text-red-100"
                }`}
              >
                {isAvailable ? (
                  <FaCheckCircle size={11} />
                ) : (
                  <FaTimesCircle size={11} />
                )}

                {isAvailable
                  ? "Available"
                  : "Unavailable"}
              </span>

              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white/80">
                {availableCopies} Available
              </span>

              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white/80">
                {quantity} Total Copies
              </span>

            </div>
          </div>
        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">

          {/* =================================================
              BOOK COVER
          ================================================= */}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

            <div className="relative overflow-hidden bg-gradient-to-br from-[#890C25] via-[#9d1833] to-[#65091c] p-6">

              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/15 bg-white/5" />

              <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5" />

              <div className="relative">

                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
                  Book Cover
                </p>

                <div className="relative mt-4 flex h-[430px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">

                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={book?.title || "Book"}
                      onError={handleImageError}
                      className="block h-full w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]"
                    />
                  )}

                  <div
                    className={`details-image-fallback absolute inset-0 items-center justify-center bg-gradient-to-br from-white/10 to-white/5 ${
                      imageUrl ? "hidden" : "flex"
                    }`}
                  >
                    <div className="text-center">

                      <FaBook className="mx-auto text-7xl text-white/25" />

                      <p className="mt-4 text-sm font-semibold text-white/50">
                        No Cover Image
                      </p>

                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Cover footer */}

            <div className="p-6">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Book Title
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-800">
                    {book?.title || "Untitled Book"}
                  </h2>

                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                  <FaBook size={17} />
                </div>

              </div>

              <div className="mt-5 h-1 w-20 rounded-full bg-[#890C25]" />

            </div>
          </div>

          {/* =================================================
              BOOK INFORMATION
          ================================================= */}

          <div className="space-y-6">

            {/* Basic Information */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-7">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#890C25] text-white shadow-lg">
                  <FaBookOpen size={17} />
                </div>

                <div>

                  <h2 className="text-xl font-black text-slate-800">
                    Book Information
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Complete information about this book
                  </p>

                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* Author */}

                <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                      <FaUser size={14} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[10px] font-black uppercase tracking-wider text-blue-500">
                        Author
                      </p>

                      <p className="mt-1 truncate text-sm font-black text-slate-700">
                        {book?.author || "Unknown Author"}
                      </p>

                    </div>

                  </div>
                </div>

                {/* Category */}

                <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                      <FaTag size={14} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[10px] font-black uppercase tracking-wider text-blue-500">
                        Category
                      </p>

                      <p className="mt-1 truncate text-sm font-black text-slate-700">
                        {book?.category || "N/A"}
                      </p>

                    </div>

                  </div>
                </div>

                {/* ISBN */}

                <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-purple-200 hover:bg-purple-50">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
                      <FaBarcode size={14} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[10px] font-black uppercase tracking-wider text-purple-500">
                        ISBN
                      </p>

                      <p className="mt-1 truncate text-sm font-black text-slate-700">
                        {book?.isbn || "N/A"}
                      </p>

                    </div>

                  </div>
                </div>

                {/* Language */}

                <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-purple-200 hover:bg-purple-50">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
                      <FaLanguage size={14} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[10px] font-black uppercase tracking-wider text-purple-500">
                        Language
                      </p>

                      <p className="mt-1 truncate text-sm font-black text-slate-700">
                        {book?.language || "N/A"}
                      </p>

                    </div>

                  </div>
                </div>

                {/* Publisher */}

                <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-green-200 hover:bg-green-50">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm">
                      <FaBuilding size={14} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[10px] font-black uppercase tracking-wider text-green-600">
                        Publisher
                      </p>

                      <p className="mt-1 truncate text-sm font-black text-slate-700">
                        {book?.publisher || "N/A"}
                      </p>

                    </div>

                  </div>
                </div>

                {/* Published Year */}

                <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-green-200 hover:bg-green-50">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm">
                      <FaCalendarAlt size={14} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[10px] font-black uppercase tracking-wider text-green-600">
                        Published
                      </p>

                      <p className="mt-1 truncate text-sm font-black text-slate-700">
                        {book?.publishedYear ||
                          book?.publicationYear ||
                          "N/A"}
                      </p>

                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* =================================================
                STOCK INFORMATION
            ================================================= */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-7">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white shadow-lg">
                  <FaLayerGroup size={17} />
                </div>

                <div>

                  <h2 className="text-xl font-black text-slate-800">
                    Stock Information
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Current library inventory status
                  </p>

                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-3">

                {/* Total */}

                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">

                  <p className="text-[10px] font-black uppercase tracking-wider text-blue-500">
                    Total Copies
                  </p>

                  <p className="mt-2 text-3xl font-black text-blue-700">
                    {quantity}
                  </p>

                </div>

                {/* Available */}

                <div className="rounded-2xl border border-green-200 bg-green-50 p-5">

                  <p className="text-[10px] font-black uppercase tracking-wider text-green-600">
                    Available
                  </p>

                  <p className="mt-2 text-3xl font-black text-green-700">
                    {availableCopies}
                  </p>

                </div>

                {/* Issued */}

                <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

                  <p className="text-[10px] font-black uppercase tracking-wider text-red-500">
                    Issued
                  </p>

                  <p className="mt-2 text-3xl font-black text-red-700">
                    {issuedCopies}
                  </p>

                </div>

              </div>

              {/* Stock Progress */}

              <div className="mt-6">

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-xs font-black text-slate-500">
                    Availability
                  </span>

                  <span className="text-xs font-black text-slate-700">
                    {quantity > 0
                      ? Math.round(
                          (availableCopies / quantity) *
                            100
                        )
                      : 0}
                    %
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                    style={{
                      width: `${
                        quantity > 0
                          ? Math.min(
                              (availableCopies /
                                quantity) *
                                100,
                              100
                            )
                          : 0
                      }%`,
                    }}
                  />

                </div>
              </div>
            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            {(book?.description ||
              book?.summary ||
              book?.notes) && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-7">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#890C25] text-white shadow-lg">
                    <FaBook size={17} />
                  </div>

                  <div>

                    <h2 className="text-xl font-black text-slate-800">
                      Description
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      About this book
                    </p>

                  </div>

                </div>

                <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                  {book?.description ||
                    book?.summary ||
                    book?.notes}
                </p>

              </div>
            )}

          </div>
        </div>

        {/* =================================================
            BOOK METADATA
        ================================================= */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">

          <div className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">

            <div>

              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Book ID
              </p>

              <p className="mt-1 break-all font-bold text-slate-700">
                {book?._id || "N/A"}
              </p>

            </div>

            <div>

              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Added On
              </p>

              <p className="mt-1 font-bold text-slate-700">
                {formatDate(book?.createdAt)}
              </p>

            </div>

            <div>

              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Last Updated
              </p>

              <p className="mt-1 font-bold text-slate-700">
                {formatDate(book?.updatedAt)}
              </p>

            </div>

            <div>

              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Status
              </p>

              <p
                className={`mt-1 font-black ${
                  isAvailable
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {isAvailable
                  ? "Available in Library"
                  : "Currently Unavailable"}
              </p>

            </div>

          </div>
        </div>

        {/* =================================================
            BOTTOM ACTIONS
        ================================================= */}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">

          <Link
            to="/library/books"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-600 shadow-sm transition hover:border-[#890C25]/20 hover:bg-[#890C25] hover:text-white hover:shadow-lg"
          >
            <FaArrowLeft size={12} />
            Back to Books
          </Link>

          {/* =================================================
              EDIT BUTTON
              ONLY ADMIN AND LIBRARIAN
          ================================================= */}

          {canEditBook && (
            <Link
              to={`/library/books/${book?._id}/edit`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
            >
              <FaEdit size={12} />
              Edit This Book
            </Link>
          )}

        </div>

      </div>
    </div>
  );
};

export default BookDetails;

