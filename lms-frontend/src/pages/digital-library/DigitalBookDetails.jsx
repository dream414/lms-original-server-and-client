import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBook,
  FaUser,
  FaTags,
  FaBarcode,
  FaBuilding,
  FaCalendarAlt,
  FaLanguage,
  FaEye,
  FaDownload,
  FaEdit,
  FaBookOpen,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaInfoCircle,
  FaClock,
} from "react-icons/fa";

import {
  useDigitalBooks,
} from "../../context/DigitalBookContext";

const DigitalBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    currentDigitalBook,
    loading,
    error,
    getDigitalBookById,
    viewDigitalBook,
    readDigitalBook,
    downloadDigitalBook,
    clearCurrentDigitalBook,
    clearError,
  } = useDigitalBooks();

  const [viewLoading, setViewLoading] =
    useState(false);

  const [readLoading, setReadLoading] =
    useState(false);

  const [downloadLoading, setDownloadLoading] =
    useState(false);

  // =====================================================
  // LOAD BOOK + RECORD VIEW
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    const loadBook = async () => {
      if (!id) {
        return;
      }

      try {
        // -----------------------------------------------
        // First load the book details
        // -----------------------------------------------

        await getDigitalBookById(id);

        // -----------------------------------------------
        // Record VIEW activity
        // -----------------------------------------------
        // Backend:
        // GET /api/digital-books/:id/view
        //
        // This:
        // 1. increments book.views
        // 2. creates DigitalBookActivity "view"
        // -----------------------------------------------

        if (isMounted) {
          setViewLoading(true);
        }

        await viewDigitalBook(id);
      } catch (error) {
        console.error(
          "Load digital book / record view error:",
          error
        );
      } finally {
        if (isMounted) {
          setViewLoading(false);
        }
      }
    };

    loadBook();

    return () => {
      isMounted = false;
      clearCurrentDigitalBook();
      clearError();
    };
  }, [id]);

  // =====================================================
  // GET FILE TYPE
  // =====================================================

  const getFileType = () => {
    if (!currentDigitalBook?.digitalFile) {
      return "Digital File";
    }

    const extension =
      currentDigitalBook.digitalFile
        .split(".")
        .pop()
        ?.toUpperCase();

    return extension || "Digital File";
  };

  // =====================================================
  // FORMAT FILE SIZE
  // =====================================================

  const formatFileSize = (size) => {
    if (!size || size <= 0) {
      return "Not available";
    }

    if (size < 1024) {
      return `${size} Bytes`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  // =====================================================
  // READ ROUTE
  // =====================================================
  // IMPORTANT:
  // This now calls the backend READ endpoint first.
  //
  // Backend:
  // GET /api/digital-books/:id/read
  //
  // Backend creates:
  // DigitalBookActivity -> "read"
  //
  // Then the context opens the returned file.
  // =====================================================

  // const handleRead = async () => {
  //   if (!id || !currentDigitalBook) {
  //     return;
  //   }

  //   if (currentDigitalBook.status !== "Active") {
  //     return;
  //   }

  //   if (!currentDigitalBook.digitalFile) {
  //     return;
  //   }

  //   try {
  //     setReadLoading(true);

  //     await readDigitalBook(id);
  //   } catch (error) {
  //     console.error(
  //       "Read digital book error:",
  //       error
  //     );
  //   } finally {
  //     setReadLoading(false);
  //   }
  // };



const handleRead = async () => {
  if (!id || !currentDigitalBook) {
    return;
  }

  if (currentDigitalBook.status !== "Active") {
    return;
  }

  if (!currentDigitalBook.digitalFile) {
    return;
  }

  try {
    setReadLoading(true);

    // ==========================================
    // STEP 1:
    // Call READ API
    //
    // Backend will:
    // - create read activity
    // - increment read count
    // - return PDF blob
    // ==========================================

    const fileURL = await readDigitalBook(id);

    // ==========================================
    // STEP 2:
    // Only navigate if READ API succeeded
    // ==========================================

    if (fileURL) {
      navigate(
        `/digital-library/books/${id}/read`,
        {
          state: {
            fileURL,
            book: currentDigitalBook,
          },
        }
      );
    }
  } catch (error) {
    console.error(
      "Read digital book error:",
      error
    );
  } finally {
    setReadLoading(false);
  }
};


  // =====================================================
  // DOWNLOAD
  // =====================================================
  // Existing backend download route preserved.
  // =====================================================

  const handleDownload = async () => {
    if (
      !currentDigitalBook?.digitalFile ||
      !id
    ) {
      return;
    }

    if (currentDigitalBook.status !== "Active") {
      return;
    }

    try {
      setDownloadLoading(true);

      await downloadDigitalBook(id);
    } catch (error) {
      console.error(
        "Download digital book error:",
        error
      );
    } finally {
      setDownloadLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && !currentDigitalBook) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="text-center">

          <div className="w-16 h-16 rounded-2xl bg-[#890C25]/10 flex items-center justify-center mx-auto mb-5">
            <FaSpinner className="text-3xl text-[#890C25] animate-spin" />
          </div>

          <h2 className="text-xl font-bold text-slate-800">
            Loading Digital Book
          </h2>

          <p className="text-slate-500 mt-2">
            Please wait while we load the book details...
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!currentDigitalBook) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 max-w-lg w-full p-8 text-center">

          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <FaInfoCircle className="text-3xl text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-slate-800">
            Digital Book Not Found
          </h2>

          <p className="text-slate-500 mt-3 mb-6">
            {error ||
              "The requested digital book could not be found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/digital-library/books")
            }
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#890C25] text-white font-semibold hover:bg-[#6f091e] transition"
          >
            <FaArrowLeft />
            Back to Digital Books
          </button>

        </div>
      </div>
    );
  }

  const book = currentDigitalBook;

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-hidden py-10 px-4 sm:px-6 lg:px-8">

      {/* =====================================================
          BACKGROUND DECORATIONS
      ===================================================== */}

      <div className="pointer-events-none absolute -top-28 -left-28 w-80 h-80 bg-[#890C25]/10 rounded-full blur-3xl" />

      <div className="pointer-events-none absolute top-1/3 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 w-80 h-80 bg-[#D58A98]/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">

        {/* =====================================================
            TOP NAVIGATION
        ===================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <button
            type="button"
            onClick={() =>
              navigate("/digital-library/books")
            }
            className="
              inline-flex
              items-center
              gap-2
              text-slate-600
              hover:text-[#890C25]
              font-semibold
              transition
            "
          >
            <FaArrowLeft />
            Back to Digital Books
          </button>

          <div className="flex flex-wrap gap-3">

            {/* EDIT */}

            <Link
              to={`/digital-library/books/${id}/edit`}
              className="
                inline-flex
                items-center
                gap-2
                px-5
                py-3
                rounded-xl
                bg-white
                border
                border-slate-200
                text-slate-700
                font-semibold
                shadow-sm
                hover:border-[#890C25]
                hover:text-[#890C25]
                transition
              "
            >
              <FaEdit />
              Edit Book
            </Link>

            {/* DOWNLOAD */}

            <button
              type="button"
              onClick={handleDownload}
              disabled={
                downloadLoading ||
                !book.digitalFile ||
                book.status !== "Active"
              }
              className="
                inline-flex
                items-center
                gap-2
                px-5
                py-3
                rounded-xl
                bg-[#890C25]
                text-white
                font-semibold
                shadow-lg
                hover:bg-[#6f091e]
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {downloadLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <FaDownload />
                  Download
                </>
              )}
            </button>

          </div>
        </div>

        {/* =====================================================
            VIEW RECORDING INDICATOR
        ===================================================== */}

        {viewLoading && (
          <div className="mb-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold">
            <FaSpinner className="animate-spin" />
            Recording book view...
          </div>
        )}

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <FaInfoCircle className="text-red-500" />

              <p className="text-sm text-red-700">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={clearError}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ×
            </button>

          </div>
        )}

        {/* =====================================================
            HERO CONTAINER
        ===================================================== */}

        <div
          className="
            group/hero
            relative
            overflow-hidden
            rounded-[2rem]
            bg-[#890C25]
            shadow-2xl
            mb-8
          "
        >

          <div
            className="
              absolute
              left-0
              top-0
              z-30
              h-1.5
              w-20
              rounded-br-full
              bg-gradient-to-r
              from-[#65091c]
              via-[#D58A98]
              to-white
              transition-all
              duration-700
              ease-out
              group-hover/hero:w-full
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-80
              w-80
              rounded-full
              border
              border-white/15
              bg-white/5
              transition-all
              duration-700
              group-hover/hero:scale-110
              group-hover/hero:rotate-6
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-28
              left-1/3
              h-72
              w-72
              rounded-full
              border
              border-white/10
              bg-white/5
              transition-all
              duration-700
              group-hover/hero:scale-110
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              right-1/4
              top-1/2
              h-28
              w-28
              rounded-full
              bg-[#D58A98]/10
              blur-2xl
              transition-all
              duration-700
              group-hover/hero:scale-150
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-10
              h-20
              w-20
              rounded-full
              bg-blue-300/10
              blur-2xl
            "
          />

          <div className="relative z-10 p-6 sm:p-8 lg:p-10">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

              {/* COVER */}

              <div className="flex justify-center lg:justify-start">

                <div
                  className="
                    group/cover
                    relative
                    w-56
                    sm:w-64
                    aspect-[3/4]
                    rounded-3xl
                    overflow-hidden
                    bg-white/10
                    border
                    border-white/20
                    shadow-2xl
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    hover:shadow-black/30
                  "
                >

                  <div
                    className="
                      absolute
                      left-0
                      top-0
                      z-20
                      h-1
                      w-12
                      rounded-br-full
                      bg-white
                      transition-all
                      duration-500
                      group-hover/cover:w-full
                    "
                  />

                  {book.coverImage ? (
                    <img
                      src={`http://localhost:5000${book.coverImage}`}
                      alt={book.title}
                      className="
                        w-full
                        h-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover/cover:scale-105
                      "
                    />
                  ) : (
                    <div
                      className="
                        w-full
                        h-full
                        flex
                        flex-col
                        items-center
                        justify-center
                        text-white/70
                      "
                    >
                      <FaBook className="text-7xl mb-4" />

                      <p className="text-sm">
                        No Cover Available
                      </p>
                    </div>
                  )}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/30
                      via-transparent
                      to-white/10
                    "
                  />

                </div>
              </div>

              {/* BOOK INFO */}

              <div className="lg:col-span-2 text-white">

                <div className="flex flex-wrap items-center gap-3 mb-4">

                  <span
                    className="
                      px-3
                      py-1.5
                      rounded-full
                      bg-white/10
                      border
                      border-white/20
                      text-sm
                      font-semibold
                      backdrop-blur-md
                    "
                  >
                    {book.category || "Uncategorized"}
                  </span>

                  {book.status === "Active" ? (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-2
                        px-3
                        py-1.5
                        rounded-full
                        bg-green-500/20
                        border
                        border-green-300/20
                        text-green-100
                        text-sm
                        font-semibold
                      "
                    >
                      <FaCheckCircle />
                      Active
                    </span>
                  ) : (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-2
                        px-3
                        py-1.5
                        rounded-full
                        bg-red-500/20
                        border
                        border-red-300/20
                        text-red-100
                        text-sm
                        font-semibold
                      "
                    >
                      <FaTimesCircle />
                      Inactive
                    </span>
                  )}

                </div>

                <h1
                  className="
                    text-3xl
                    sm:text-4xl
                    lg:text-5xl
                    font-extrabold
                    leading-tight
                  "
                >
                  {book.title}
                </h1>

                <div className="flex items-center gap-3 mt-5 text-white/85">

                  <div
                    className="
                      w-11
                      h-11
                      rounded-xl
                      bg-white/10
                      border
                      border-white/10
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FaUser />
                  </div>

                  <div>

                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wider
                        text-white/60
                      "
                    >
                      Author
                    </p>

                    <p className="font-semibold">
                      {book.author || "Unknown Author"}
                    </p>

                  </div>

                </div>

                {book.description && (
                  <p
                    className="
                      mt-6
                      text-white/75
                      leading-7
                      max-w-3xl
                    "
                  >
                    {book.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 mt-7">

                  {/* READ */}

                  <button
                    type="button"
                    onClick={handleRead}
                    disabled={
                      readLoading ||
                      !book.digitalFile ||
                      book.status !== "Active"
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-6
                      py-3.5
                      rounded-xl
                      bg-white
                      text-[#890C25]
                      font-bold
                      hover:bg-slate-100
                      transition-all
                      duration-300
                      shadow-lg
                      hover:-translate-y-0.5
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                    "
                  >
                    {readLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Opening...
                      </>
                    ) : (
                      <>
                        <FaBookOpen />
                        Read Book
                      </>
                    )}
                  </button>

                  {/* DOWNLOAD */}

                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={
                      downloadLoading ||
                      !book.digitalFile ||
                      book.status !== "Active"
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-6
                      py-3.5
                      rounded-xl
                      bg-white/10
                      border
                      border-white/25
                      text-white
                      font-bold
                      hover:bg-white/20
                      transition-all
                      duration-300
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                    "
                  >
                    {downloadLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <FaDownload />
                        Download File
                      </>
                    )}
                  </button>

                </div>

              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* TOTAL VIEWS */}

          <div
            className="
              group/stat
              relative
              overflow-hidden
              rounded-3xl
              bg-blue-600
              p-6
              text-white
              shadow-xl
              transition-all
              duration-500
              hover:-translate-y-2
              hover:shadow-2xl
            "
          >

            <div
              className="
                absolute
                left-0
                top-0
                h-1.5
                w-16
                rounded-br-full
                bg-gradient-to-r
                from-blue-200
                via-white
                to-blue-300
                transition-all
                duration-700
                group-hover/stat:w-full
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -right-14
                -bottom-14
                h-40
                w-40
                rounded-full
                border-2
                border-white/15
                bg-white/5
                transition-all
                duration-700
                group-hover/stat:scale-125
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -left-10
                -top-10
                h-24
                w-24
                rounded-full
                border
                border-white/10
                bg-white/5
              "
            />

            <div className="relative">

              <div className="flex items-center justify-between">

                <div>

                  <p
                    className="
                      text-[11px]
                      font-black
                      uppercase
                      tracking-[0.18em]
                      text-blue-100/75
                    "
                  >
                    Total Views
                  </p>

                  <h3
                    className="
                      mt-2
                      text-4xl
                      font-black
                      tracking-tight
                    "
                  >
                    {String(book.views || 0).padStart(2, "0")}
                  </h3>

                </div>

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
                    bg-white/15
                    shadow-lg
                    transition-all
                    duration-500
                    group-hover/stat:rotate-6
                    group-hover/stat:scale-110
                  "
                >
                  <FaEye className="text-xl" />
                </div>

              </div>

              <div
                className="
                  mt-5
                  h-1
                  w-12
                  rounded-full
                  bg-white/60
                  transition-all
                  duration-500
                  group-hover/stat:w-24
                "
              />

              <p className="mt-3 text-xs text-white/60">
                People viewed this digital book
              </p>

            </div>
          </div>

          {/* DOWNLOADS */}

          <div
            className="
              group/stat
              relative
              overflow-hidden
              rounded-3xl
              bg-[#890C25]
              p-6
              text-white
              shadow-xl
              transition-all
              duration-500
              hover:-translate-y-2
              hover:shadow-2xl
            "
          >

            <div
              className="
                absolute
                left-0
                top-0
                h-1.5
                w-16
                rounded-br-full
                bg-gradient-to-r
                from-[#D58A98]
                via-white
                to-[#D58A98]
                transition-all
                duration-700
                group-hover/stat:w-full
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -right-14
                -bottom-14
                h-40
                w-40
                rounded-full
                border-2
                border-white/15
                bg-white/5
                transition-all
                duration-700
                group-hover/stat:scale-125
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -left-10
                -top-10
                h-24
                w-24
                rounded-full
                border
                border-white/10
                bg-white/5
              "
            />

            <div className="relative">

              <div className="flex items-center justify-between">

                <div>

                  <p
                    className="
                      text-[11px]
                      font-black
                      uppercase
                      tracking-[0.18em]
                      text-white/60
                    "
                  >
                    Downloads
                  </p>

                  <h3
                    className="
                      mt-2
                      text-4xl
                      font-black
                      tracking-tight
                    "
                  >
                    {String(book.downloads || 0).padStart(2, "0")}
                  </h3>

                </div>

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
                    bg-white/15
                    shadow-lg
                    transition-all
                    duration-500
                    group-hover/stat:rotate-6
                    group-hover/stat:scale-110
                  "
                >
                  <FaDownload className="text-xl" />
                </div>

              </div>

              <div
                className="
                  mt-5
                  h-1
                  w-12
                  rounded-full
                  bg-white/60
                  transition-all
                  duration-500
                  group-hover/stat:w-24
                "
              />

              <p className="mt-3 text-xs text-white/60">
                Total digital file downloads
              </p>

            </div>
          </div>

          {/* FILE TYPE */}

          <div
            className="
              group/stat
              relative
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-xl
              transition-all
              duration-500
              hover:-translate-y-2
              hover:shadow-2xl
            "
          >

            <div
              className="
                absolute
                left-0
                top-0
                h-1.5
                w-16
                rounded-br-full
                bg-gradient-to-r
                from-[#65091c]
                via-[#890C25]
                to-[#D58A98]
                transition-all
                duration-700
                group-hover/stat:w-full
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -right-14
                -bottom-14
                h-40
                w-40
                rounded-full
                border-2
                border-[#890C25]/10
                bg-[#890C25]/5
                transition-all
                duration-700
                group-hover/stat:scale-125
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -left-10
                -top-10
                h-24
                w-24
                rounded-full
                bg-blue-500/5
              "
            />

            <div className="relative">

              <div className="flex items-center justify-between">

                <div>

                  <p
                    className="
                      text-[11px]
                      font-black
                      uppercase
                      tracking-[0.18em]
                      text-[#890C25]
                    "
                  >
                    File Type
                  </p>

                  <h3
                    className="
                      mt-2
                      text-3xl
                      font-black
                      text-slate-800
                    "
                  >
                    {book.fileType || getFileType()}
                  </h3>

                </div>

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#890C25]/10
                    text-[#890C25]
                    transition-all
                    duration-500
                    group-hover/stat:rotate-6
                    group-hover/stat:scale-110
                  "
                >
                  <FaFileAlt className="text-xl" />
                </div>

              </div>

              <div
                className="
                  mt-5
                  h-1
                  w-12
                  rounded-full
                  bg-[#890C25]/30
                  transition-all
                  duration-500
                  group-hover/stat:w-24
                "
              />

              <p className="mt-3 text-xs text-slate-400">
                Digital file format
              </p>

            </div>
          </div>

          {/* FILE SIZE */}

          <div
            className="
              group/stat
              relative
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-xl
              transition-all
              duration-500
              hover:-translate-y-2
              hover:shadow-2xl
            "
          >

            <div
              className="
                absolute
                left-0
                top-0
                h-1.5
                w-16
                rounded-br-full
                bg-gradient-to-r
                from-blue-500
                via-blue-600
                to-[#890C25]
                transition-all
                duration-700
                group-hover/stat:w-full
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -right-14
                -bottom-14
                h-40
                w-40
                rounded-full
                border-2
                border-blue-500/10
                bg-blue-500/5
                transition-all
                duration-700
                group-hover/stat:scale-125
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -left-10
                -top-10
                h-24
                w-24
                rounded-full
                bg-[#890C25]/5
              "
            />

            <div className="relative">

              <div className="flex items-center justify-between">

                <div>

                  <p
                    className="
                      text-[11px]
                      font-black
                      uppercase
                      tracking-[0.18em]
                      text-blue-600
                    "
                  >
                    File Size
                  </p>

                  <h3
                    className="
                      mt-2
                      text-2xl
                      font-black
                      text-slate-800
                    "
                  >
                    {formatFileSize(book.fileSize)}
                  </h3>

                </div>

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-blue-50
                    text-blue-600
                    transition-all
                    duration-500
                    group-hover/stat:rotate-6
                    group-hover/stat:scale-110
                  "
                >
                  <FaFileAlt className="text-xl" />
                </div>

              </div>

              <div
                className="
                  mt-5
                  h-1
                  w-12
                  rounded-full
                  bg-blue-600/30
                  transition-all
                  duration-500
                  group-hover/stat:w-24
                "
              />

              <p className="mt-3 text-xs text-slate-400">
                Uploaded digital file size
              </p>

            </div>
          </div>

        </div>

        {/* =====================================================
            DETAILS
        ===================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Book Details */}

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">

            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">

              <h2 className="text-xl font-bold text-slate-800">
                Book Information
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Complete information about this digital book.
              </p>

            </div>

            <div className="p-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Author */}

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">

                  <div className="flex items-center gap-3 mb-2">

                    <div className="w-10 h-10 rounded-xl bg-[#890C25]/10 flex items-center justify-center">
                      <FaUser className="text-[#890C25]" />
                    </div>

                    <p className="text-sm text-slate-500">
                      Author
                    </p>

                  </div>

                  <p className="font-bold text-slate-800">
                    {book.author || "Not available"}
                  </p>

                </div>

                {/* Category */}

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">

                  <div className="flex items-center gap-3 mb-2">

                    <div className="w-10 h-10 rounded-xl bg-[#890C25]/10 flex items-center justify-center">
                      <FaTags className="text-[#890C25]" />
                    </div>

                    <p className="text-sm text-slate-500">
                      Category
                    </p>

                  </div>

                  <p className="font-bold text-slate-800">
                    {book.category || "Not available"}
                  </p>

                </div>

                {/* ISBN */}

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">

                  <div className="flex items-center gap-3 mb-2">

                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <FaBarcode className="text-blue-600" />
                    </div>

                    <p className="text-sm text-slate-500">
                      ISBN
                    </p>

                  </div>

                  <p className="font-bold text-slate-800 break-all">
                    {book.isbn || book.ISBN || "Not available"}
                  </p>

                </div>

                {/* Publisher */}

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">

                  <div className="flex items-center gap-3 mb-2">

                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <FaBuilding className="text-blue-600" />
                    </div>

                    <p className="text-sm text-slate-500">
                      Publisher
                    </p>

                  </div>

                  <p className="font-bold text-slate-800">
                    {book.publisher || "Not available"}
                  </p>

                </div>

                {/* Publication Year */}

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">

                  <div className="flex items-center gap-3 mb-2">

                    <div className="w-10 h-10 rounded-xl bg-[#890C25]/10 flex items-center justify-center">
                      <FaCalendarAlt className="text-[#890C25]" />
                    </div>

                    <p className="text-sm text-slate-500">
                      Publication Year
                    </p>

                  </div>

                  <p className="font-bold text-slate-800">
                    {book.publicationYear || "Not available"}
                  </p>

                </div>

                {/* Language */}

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">

                  <div className="flex items-center gap-3 mb-2">

                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <FaLanguage className="text-blue-600" />
                    </div>

                    <p className="text-sm text-slate-500">
                      Language
                    </p>

                  </div>

                  <p className="font-bold text-slate-800">
                    {book.language || "Not available"}
                  </p>

                </div>

              </div>

              {/* Description */}

              <div className="mt-6 p-6 rounded-2xl bg-[#890C25]/5 border border-[#890C25]/10">

                <div className="flex items-center gap-3 mb-4">

                  <div className="w-10 h-10 rounded-xl bg-[#890C25]/10 flex items-center justify-center">
                    <FaBook className="text-[#890C25]" />
                  </div>

                  <h3 className="font-bold text-slate-800">
                    Description
                  </h3>

                </div>

                <p className="text-slate-600 leading-7 whitespace-pre-line">
                  {book.description ||
                    "No description has been provided for this digital book."}
                </p>

              </div>

            </div>
          </div>

          {/* Side Information */}

          <div className="space-y-8">

            {/* Status */}

            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">

              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">

                <h2 className="text-xl font-bold text-slate-800">
                  Book Status
                </h2>

              </div>

              <div className="p-6">

                {book.status === "Active" ? (

                  <div className="p-5 rounded-2xl bg-green-50 border border-green-200">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                        <FaCheckCircle className="text-green-600 text-xl" />
                      </div>

                      <div>

                        <p className="font-bold text-green-800">
                          Active
                        </p>

                        <p className="text-sm text-green-700 mt-1">
                          This book is currently available.
                        </p>

                      </div>

                    </div>

                  </div>

                ) : (

                  <div className="p-5 rounded-2xl bg-red-50 border border-red-200">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">
                        <FaTimesCircle className="text-red-600 text-xl" />
                      </div>

                      <div>

                        <p className="font-bold text-red-800">
                          Inactive
                        </p>

                        <p className="text-sm text-red-700 mt-1">
                          This book is currently unavailable.
                        </p>

                      </div>

                    </div>

                  </div>

                )}

              </div>
            </div>

            {/* Dates */}

            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">

              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">

                <h2 className="text-xl font-bold text-slate-800">
                  Timeline
                </h2>

              </div>

              <div className="p-6 space-y-5">

                <div className="flex items-start gap-4">

                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <FaClock className="text-blue-600" />
                  </div>

                  <div>

                    <p className="text-xs text-slate-500 uppercase tracking-wide">
                      Created
                    </p>

                    <p className="font-semibold text-slate-800 mt-1">
                      {formatDate(book.createdAt)}
                    </p>

                  </div>

                </div>

                <div className="flex items-start gap-4">

                  <div className="w-10 h-10 rounded-xl bg-[#890C25]/10 flex items-center justify-center shrink-0">
                    <FaEdit className="text-[#890C25]" />
                  </div>

                  <div>

                    <p className="text-xs text-slate-500 uppercase tracking-wide">
                      Last Updated
                    </p>

                    <p className="font-semibold text-slate-800 mt-1">
                      {formatDate(book.updatedAt)}
                    </p>

                  </div>

                </div>

              </div>
            </div>

            {/* Quick Actions */}

            <div className="bg-gradient-to-br from-[#890C25] to-[#6f091e] rounded-3xl shadow-xl p-6 text-white">

              <h2 className="text-xl font-bold">
                Quick Actions
              </h2>

              <p className="text-white/70 text-sm mt-2">
                Manage this digital book from here.
              </p>

              <div className="space-y-3 mt-6">

                {/* READ */}

                <button
                  type="button"
                  onClick={handleRead}
                  disabled={
                    readLoading ||
                    !book.digitalFile ||
                    book.status !== "Active"
                  }
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[#890C25] font-bold hover:bg-slate-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {readLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Opening...
                    </>
                  ) : (
                    <>
                      <FaBookOpen />
                      Read Book
                    </>
                  )}
                </button>

                {/* DOWNLOAD */}

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={
                    downloadLoading ||
                    !book.digitalFile ||
                    book.status !== "Active"
                  }
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {downloadLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <FaDownload />
                      Download
                    </>
                  )}
                </button>

                {/* EDIT */}

                <Link
                  to={`/digital-library/books/${id}/edit`}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition"
                >
                  <FaEdit />
                  Edit Book
                </Link>

              </div>
            </div>

          </div>
        </div>

        {/* =====================================================
            BOTTOM BACK BUTTON
        ===================================================== */}

        <div className="mt-8 text-center">

          <button
            type="button"
            onClick={() =>
              navigate("/digital-library/books")
            }
            className="
              inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-xl
              bg-white
              border
              border-slate-200
              text-slate-700
              font-semibold
              shadow-sm
              hover:border-[#890C25]
              hover:text-[#890C25]
              transition
            "
          >
            <FaArrowLeft />
            Back to Digital Library
          </button>

        </div>

      </div>
    </div>
  );
};

export default DigitalBookDetails;