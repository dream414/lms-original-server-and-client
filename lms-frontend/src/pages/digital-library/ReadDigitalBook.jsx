
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBookOpen,
  FaDownload,
  FaExpand,
  FaCompress,
  FaSpinner,
  FaInfoCircle,
  FaUser,
  FaTags,
  FaEye,
  FaFileAlt,
} from "react-icons/fa";

import { useDigitalBooks } from "../../context/DigitalBookContext";

// =====================================================
// READ DIGITAL BOOK
// =====================================================

const ReadDigitalBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    currentDigitalBook,
    loading,
    error,
    getDigitalBookById,
  } = useDigitalBooks();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fileLoading, setFileLoading] = useState(true);

  // ==========================================
  // LOAD DIGITAL BOOK
  // ==========================================

  useEffect(() => {
    if (id) {
      getDigitalBookById(id);
    }
  }, [id]);

  // ==========================================
  // DOWNLOAD
  // ==========================================

  const handleDownload = () => {
    if (!currentDigitalBook?.digitalFile) {
      return;
    }

    window.open(
      `http://localhost:5000/api/digital-books/${id}/download`,
      "_blank"
    );
  };

  // ==========================================
  // FULLSCREEN
  // ==========================================

  const handleFullscreen = () => {
    const viewer = document.getElementById(
      "digital-book-viewer"
    );

    if (!viewer) {
      return;
    }

    if (!document.fullscreenElement) {
      viewer.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // ==========================================
  // FULLSCREEN CHANGE
  // ==========================================

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading && !currentDigitalBook) {
    return (
      <div
        className="
          min-h-screen
          bg-slate-100
          px-4
          pb-12
          pt-10
          sm:px-6
          sm:pt-12
          lg:px-8
          lg:pt-14
        "
      >
        <div className="mx-auto max-w-7xl">
          <div
            className="
              group/loading
              relative
              overflow-hidden
              rounded-3xl
              bg-[#890C25]
              p-10
              text-center
              shadow-2xl
            "
          >
            {/* HOVER LINE */}
            <div
              className="
                absolute
                left-0
                top-0
                z-30
                h-1.5
                w-16
                rounded-br-full
                bg-gradient-to-r
                from-[#65091c]
                via-[#D58A98]
                to-white
                transition-all
                duration-700
                group-hover/loading:w-full
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-64
                w-64
                rounded-full
                border
                border-white/20
                bg-white/5
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-24
                left-1/4
                h-64
                w-64
                rounded-full
                border
                border-white/10
                bg-white/5
              "
            />

            <div className="relative">
              <div
                className="
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-3xl
                  border
                  border-white/20
                  bg-white/10
                  text-white
                  shadow-xl
                  backdrop-blur-md
                "
              >
                <FaSpinner
                  size={30}
                  className="animate-spin"
                />
              </div>

              <h2
                className="
                  mt-6
                  text-2xl
                  font-black
                  text-white
                "
              >
                Loading Digital Book
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  text-white/65
                "
              >
                Preparing the book reader...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // BOOK NOT FOUND
  // ==========================================

  if (!currentDigitalBook) {
    return (
      <div
        className="
          min-h-screen
          bg-slate-100
          px-4
          pb-12
          pt-10
          sm:px-6
          sm:pt-12
          lg:px-8
          lg:pt-14
        "
      >
        <div className="mx-auto max-w-7xl">
          <div
            className="
              group/notfound
              relative
              overflow-hidden
              rounded-3xl
              bg-white
              p-8
              text-center
              shadow-xl
            "
          >
            {/* HOVER LINE */}
            <div
              className="
                absolute
                left-0
                top-0
                z-30
                h-1.5
                w-16
                rounded-br-full
                bg-gradient-to-r
                from-[#65091c]
                via-[#890C25]
                to-[#D58A98]
                transition-all
                duration-700
                group-hover/notfound:w-full
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -right-16
                -top-16
                h-48
                w-48
                rounded-full
                bg-[#890C25]/5
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-20
                -left-16
                h-56
                w-56
                rounded-full
                bg-blue-500/5
              "
            />

            <div className="relative">
              <div
                className="
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-3xl
                  bg-red-50
                  text-red-500
                "
              >
                <FaInfoCircle size={30} />
              </div>

              <h2
                className="
                  mt-6
                  text-2xl
                  font-black
                  text-slate-800
                "
              >
                Book Not Found
              </h2>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-md
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                {error ||
                  "The requested digital book could not be loaded."}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/digital-library/books")
                }
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#890C25]
                  px-6
                  py-3
                  text-sm
                  font-black
                  text-white
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#6f091e]
                  hover:shadow-xl
                "
              >
                <FaArrowLeft />
                Back to Digital Library
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const book = currentDigitalBook;

  const fileUrl = book.digitalFile
    ? `http://localhost:5000${book.digitalFile}`
    : "";

  const fileType =
    book.fileType ||
    book.digitalFile
      ?.split(".")
      .pop()
      ?.toUpperCase() ||
    "PDF";

  const isPdf =
    fileType.toLowerCase() === "pdf" ||
    book.digitalFile?.toLowerCase().endsWith(".pdf");

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      className="
        min-h-screen
        bg-slate-100
        px-4
        pb-12
        pt-10
        sm:px-6
        sm:pt-12
        lg:px-8
        lg:pt-14
      "
    >
      {/* =================================================
          BACKGROUND DECORATIONS
      ================================================= */}

      <div
        className="
          pointer-events-none
          fixed
          -left-32
          -top-32
          h-96
          w-96
          rounded-full
          bg-[#890C25]/5
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          -right-32
          top-1/3
          h-96
          w-96
          rounded-full
          bg-blue-500/5
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          bottom-0
          left-1/3
          h-72
          w-72
          rounded-full
          bg-[#D58A98]/5
          blur-3xl
        "
      />

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HERO HEADER
        ================================================= */}

        <div
          className="
            group/hero
            relative
            mb-6
            overflow-hidden
            rounded-3xl
            bg-[#890C25]
            shadow-2xl
          "
        >
          {/* HERO HOVER LINE */}
          <div
            className="
              absolute
              left-0
              top-0
              z-40
              h-1.5
              w-20
              rounded-br-full
              bg-gradient-to-r
              from-[#65091c]
              via-[#D58A98]
              to-white
              transition-all
              duration-700
              group-hover/hero:w-full
            "
          />

          {/* Decorative Circles */}

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-64
              w-64
              rounded-full
              border
              border-white/20
              bg-white/5
              transition
              duration-500
              group-hover/hero:scale-110
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              left-1/3
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
              pointer-events-none
              absolute
              right-24
              top-20
              h-20
              w-20
              rounded-full
              bg-[#D58A98]/10
              blur-2xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              bottom-8
              right-1/2
              h-10
              w-10
              rounded-full
              bg-blue-300/10
              blur-xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-7
              p-6
              sm:p-8
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            {/* LEFT */}

            <div>
              <div className="mb-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/digital-library/books/${id}`
                    )
                  }
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
                    text-white
                    shadow-xl
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:bg-white
                    hover:text-[#890C25]
                  "
                  title="Back to book details"
                >
                  <FaArrowLeft size={20} />
                </button>

                <div>
                  <p
                    className="
                      text-xs
                      font-black
                      uppercase
                      tracking-[0.2em]
                      text-[#D58A98]
                    "
                  >
                    Digital Library
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-white/55
                    "
                  >
                    Learning Management System
                  </p>
                </div>
              </div>

              <h1
                className="
                  max-w-3xl
                  text-3xl
                  font-extrabold
                  text-white
                  sm:text-4xl
                "
              >
                {book.title}
              </h1>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-6
                  text-white/70
                  sm:text-base
                "
              >
                Read and explore this digital book
                directly from the LMS digital library.
              </p>

              {/* HERO TAGS */}

              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/15
                    bg-white/10
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-white/85
                    backdrop-blur-md
                  "
                >
                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-green-400
                    "
                  />
                  Digital Book Reader
                </div>

                <div
                  className="
                    rounded-full
                    border
                    border-white/15
                    bg-white/10
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-white/85
                    backdrop-blur-md
                  "
                >
                  {fileType} File
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/15
                    bg-white/10
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-white/85
                    backdrop-blur-md
                  "
                >
                  <FaEye />
                  {book.views || 0} Views
                </div>
              </div>
            </div>

            {/* =================================================
                BOOK STATS BOX
            ================================================= */}

            <div
              className="
                group/statbox
                relative
                w-full
                overflow-hidden
                rounded-3xl
                border
                border-blue-300/30
                bg-gradient-to-br
                from-blue-600
                via-blue-700
                to-blue-900
                p-6
                text-center
                shadow-xl
                transition
                duration-300
                hover:-translate-y-1
                hover:shadow-blue-900/40
                lg:w-56
              "
            >
              {/* ⭐ HOVER ANIMATED TOP LINE */}
              <div
                className="
                  absolute
                  left-0
                  top-0
                  z-30
                  h-1.5
                  w-16
                  rounded-br-full
                  bg-gradient-to-r
                  from-blue-200
                  via-white
                  to-blue-300
                  transition-all
                  duration-700
                  group-hover/statbox:w-full
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-14
                  -right-14
                  h-40
                  w-40
                  rounded-full
                  border-2
                  border-blue-200/25
                  bg-blue-400/10
                  transition
                  duration-500
                  group-hover/statbox:scale-125
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -left-12
                  -top-12
                  h-28
                  w-28
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                "
              />

              <div className="relative">
                <div
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/20
                    bg-white/15
                    text-white
                    shadow-lg
                    transition-all
                    duration-500
                    group-hover/statbox:scale-110
                  "
                >
                  <FaEye size={24} />
                </div>

                <p
                  className="
                    mt-4
                    text-[11px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-blue-100/70
                  "
                >
                  Book Views
                </p>

                <p
                  className="
                    mt-1
                    text-5xl
                    font-black
                    leading-none
                    text-white
                  "
                >
                  {String(book.views || 0).padStart(
                    2,
                    "0"
                  )}
                </p>

                <div
                  className="
                    mx-auto
                    mt-4
                    h-1
                    w-12
                    rounded-full
                    bg-white/60
                    transition-all
                    duration-500
                    group-hover/statbox:w-20
                  "
                />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            BOOK META STATISTICS
        ================================================= */}

        <div
          className="
            mb-6
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >
          {/* AUTHOR */}

          <div
            className="
              group/author
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            {/* ⭐ HOVER LINE */}
            <div
              className="
                absolute
                left-0
                top-0
                z-20
                h-1
                w-16
                rounded-br-full
                bg-gradient-to-r
                from-[#65091c]
                via-[#890C25]
                to-[#D58A98]
                transition-all
                duration-700
                group-hover/author:w-full
              "
            />

            <div className="flex items-center justify-between">
              <div>
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wider
                    text-[#890C25]
                  "
                >
                  Author
                </p>

                <p
                  className="
                    mt-2
                    line-clamp-1
                    text-lg
                    font-black
                    text-slate-800
                  "
                >
                  {book.author || "Unknown Author"}
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    font-medium
                    text-slate-400
                  "
                >
                  Book author
                </p>
              </div>

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#890C25]/10
                  text-[#890C25]
                  transition-all
                  duration-500
                  group-hover/author:scale-110
                "
              >
                <FaUser size={19} />
              </div>
            </div>
          </div>

          {/* CATEGORY */}

          <div
            className="
              group/category
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            {/* ⭐ HOVER LINE */}
            <div
              className="
                absolute
                left-0
                top-0
                z-20
                h-1
                w-16
                rounded-br-full
                bg-gradient-to-r
                from-blue-800
                via-blue-600
                to-blue-300
                transition-all
                duration-700
                group-hover/category:w-full
              "
            />

            <div className="flex items-center justify-between">
              <div>
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wider
                    text-blue-600
                  "
                >
                  Category
                </p>

                <p
                  className="
                    mt-2
                    line-clamp-1
                    text-lg
                    font-black
                    text-slate-800
                  "
                >
                  {book.category || "Uncategorized"}
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    font-medium
                    text-slate-400
                  "
                >
                  Book category
                </p>
              </div>

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-100
                  text-blue-600
                  transition-all
                  duration-500
                  group-hover/category:scale-110
                "
              >
                <FaTags size={19} />
              </div>
            </div>
          </div>

          {/* DOWNLOADS */}

          <div
            className="
              group/downloads
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            {/* ⭐ HOVER LINE */}
            <div
              className="
                absolute
                left-0
                top-0
                z-20
                h-1
                w-16
                rounded-br-full
                bg-gradient-to-r
                from-green-800
                via-green-600
                to-green-300
                transition-all
                duration-700
                group-hover/downloads:w-full
              "
            />

            <div className="flex items-center justify-between">
              <div>
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wider
                    text-green-600
                  "
                >
                  Downloads
                </p>

                <p
                  className="
                    mt-2
                    text-3xl
                    font-black
                    text-slate-800
                  "
                >
                  {book.downloads || 0}
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    font-medium
                    text-slate-400
                  "
                >
                  Digital file downloads
                </p>
              </div>

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-100
                  text-green-600
                  transition-all
                  duration-500
                  group-hover/downloads:scale-110
                "
              >
                <FaDownload size={19} />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            READER SECTION HEADER
        ================================================= */}

        <div
          className="
            mb-6
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <div className="flex items-center gap-3">
              <div
                className="
                  h-10
                  w-1.5
                  rounded-full
                  bg-[#890C25]
                "
              />

              <div>
                <h2
                  className="
                    text-2xl
                    font-black
                    tracking-tight
                    text-slate-800
                  "
                >
                  Digital Book Reader
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  Read your digital book directly
                  inside the LMS.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-[#890C25]
                px-4
                py-2.5
                text-xs
                font-black
                text-white
                shadow-md
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#6f091e]
                hover:shadow-lg
              "
            >
              <FaDownload />
              Download
            </button>

            <button
              type="button"
              onClick={handleFullscreen}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-xs
                font-black
                text-slate-600
                shadow-sm
                transition-all
                duration-300
                hover:border-[#890C25]/20
                hover:bg-[#890C25]
                hover:text-white
              "
            >
              {isFullscreen ? (
                <>
                  <FaCompress />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <FaExpand />
                  Fullscreen
                </>
              )}
            </button>
          </div>
        </div>

        {/* =================================================
            READER
        ================================================= */}

        <div
          id="digital-book-viewer"
          className="
            group/table
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-xl
          "
        >
          {/* ⭐ TOP HOVER LINE */}

          <div
            className="
              absolute
              left-0
              top-0
              z-30
              h-1.5
              w-16
              rounded-br-full
              bg-gradient-to-r
              from-[#65091c]
              via-[#890C25]
              to-[#D58A98]
              transition-all
              duration-700
              group-hover/table:w-full
            "
          />

          {/* TOOLBAR */}

          <div
            className="
              border-b
              border-slate-200
              bg-slate-50/90
              px-4
              py-4
              sm:px-6
            "
          >
            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#890C25]
                    text-white
                    shadow-md
                  "
                >
                  <FaBookOpen size={17} />
                </div>

                <div>
                  <p
                    className="
                      text-sm
                      font-black
                      text-slate-800
                    "
                  >
                    {book.title}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      font-medium
                      text-slate-400
                    "
                  >
                    {fileType} Reader
                  </p>
                </div>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#890C25]/10
                  bg-white
                  px-4
                  py-2
                  text-xs
                  font-black
                  text-[#890C25]
                  shadow-sm
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-green-500
                  "
                />

                Reading Mode
              </div>
            </div>
          </div>

          {/* FILE VIEWER */}

          <div className="relative bg-slate-700">
            {fileLoading && (
              <div
                className="
                  absolute
                  inset-0
                  z-20
                  flex
                  items-center
                  justify-center
                  bg-slate-800
                "
              >
                <div className="text-center">
                  <div
                    className="
                      mx-auto
                      flex
                      h-20
                      w-20
                      items-center
                      justify-center
                      rounded-3xl
                      border
                      border-white/10
                      bg-white/5
                    "
                  >
                    <FaSpinner
                      className="
                        animate-spin
                        text-4xl
                        text-white
                      "
                    />
                  </div>

                  <h3
                    className="
                      mt-5
                      text-xl
                      font-black
                      text-white
                    "
                  >
                    Loading Book
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-slate-400
                    "
                  >
                    Please wait while the digital
                    file loads.
                  </p>
                </div>
              </div>
            )}

            {book.digitalFile ? (
              isPdf ? (
                <iframe
                  src={`${fileUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                  title={book.title}
                  onLoad={() => setFileLoading(false)}
                  className="
                    h-[70vh]
                    w-full
                    border-0
                    bg-white
                    sm:h-[78vh]
                    lg:h-[82vh]
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    min-h-[70vh]
                    items-center
                    justify-center
                    px-5
                    py-12
                  "
                >
                  <div
                    className="
                      group/filetype
                      relative
                      w-full
                      max-w-xl
                      overflow-hidden
                      rounded-3xl
                      bg-white
                      p-8
                      text-center
                      shadow-xl
                    "
                  >
                    {/* ⭐ HOVER LINE */}
                    <div
                      className="
                        absolute
                        left-0
                        top-0
                        z-30
                        h-1.5
                        w-16
                        rounded-br-full
                        bg-gradient-to-r
                        from-[#65091c]
                        via-[#890C25]
                        to-[#D58A98]
                        transition-all
                        duration-700
                        group-hover/filetype:w-full
                      "
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        -right-12
                        -top-12
                        h-32
                        w-32
                        rounded-full
                        bg-[#890C25]/5
                      "
                    />

                    <div className="relative">
                      <div
                        className="
                          mx-auto
                          flex
                          h-20
                          w-20
                          items-center
                          justify-center
                          rounded-3xl
                          bg-[#890C25]/10
                          text-[#890C25]
                        "
                      >
                        <FaFileAlt size={30} />
                      </div>

                      <h2
                        className="
                          mt-6
                          text-2xl
                          font-black
                          text-slate-800
                        "
                      >
                        {fileType} File
                      </h2>

                      <p
                        className="
                          mt-3
                          leading-6
                          text-slate-500
                        "
                      >
                        This file type cannot be displayed
                        directly inside the browser reader.
                        You can download the digital file
                        and open it with a compatible
                        application.
                      </p>

                      <button
                        type="button"
                        onClick={handleDownload}
                        className="
                          mt-6
                          inline-flex
                          items-center
                          gap-2
                          rounded-xl
                          bg-[#890C25]
                          px-6
                          py-3
                          text-sm
                          font-black
                          text-white
                          shadow-lg
                          transition-all
                          duration-300
                          hover:-translate-y-0.5
                          hover:bg-[#6f091e]
                          hover:shadow-xl
                        "
                      >
                        <FaDownload />
                        Download {fileType}
                      </button>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div
                className="
                  flex
                  min-h-[70vh]
                  items-center
                  justify-center
                  px-5
                "
              >
                <div className="text-center text-white">
                  <div
                    className="
                      mx-auto
                      flex
                      h-20
                      w-20
                      items-center
                      justify-center
                      rounded-3xl
                      bg-white/5
                    "
                  >
                    <FaInfoCircle
                      className="text-4xl text-slate-400"
                    />
                  </div>

                  <h2
                    className="
                      mt-6
                      text-2xl
                      font-black
                    "
                  >
                    No Digital File Available
                  </h2>

                  <p
                    className="
                      mt-2
                      text-slate-400
                    "
                  >
                    This book does not have a digital
                    file attached.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            BOOK INFORMATION
        ================================================= */}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-3
          "
        >
          {/* DESCRIPTION */}

          <div
            className="
              group/description
              relative
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-2xl
              lg:col-span-2
            "
          >
            {/* ⭐ HOVER LINE */}
            <div
              className="
                absolute
                left-0
                top-0
                z-20
                h-1.5
                w-20
                rounded-br-full
                bg-gradient-to-r
                from-[#65091c]
                via-[#890C25]
                to-[#D58A98]
                transition-all
                duration-700
                group-hover/description:w-full
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-20
                -right-20
                h-48
                w-48
                rounded-full
                bg-[#890C25]/5
              "
            />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#890C25]/10
                    text-[#890C25]
                    transition-all
                    duration-500
                    group-hover/description:scale-110
                  "
                >
                  <FaBookOpen size={18} />
                </div>

                <div>
                  <h2
                    className="
                      text-xl
                      font-black
                      text-slate-800
                    "
                  >
                    About This Book
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-slate-400
                    "
                  >
                    Book description
                  </p>
                </div>
              </div>

              <p
                className="
                  mt-5
                  whitespace-pre-line
                  leading-7
                  text-slate-600
                "
              >
                {book.description ||
                  "No description has been provided for this digital book."}
              </p>
            </div>
          </div>

          {/* QUICK DETAILS */}

          <div
            className="
              group/details
              relative
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-2xl
            "
          >
            {/* ⭐ HOVER LINE */}
            <div
              className="
                absolute
                left-0
                top-0
                z-20
                h-1.5
                w-20
                rounded-br-full
                bg-gradient-to-r
                from-blue-800
                via-blue-600
                to-blue-300
                transition-all
                duration-700
                group-hover/details:w-full
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -right-16
                -top-16
                h-40
                w-40
                rounded-full
                bg-blue-500/5
                transition-all
                duration-500
                group-hover/details:scale-125
              "
            />

            <div className="relative">
              <h2
                className="
                  text-xl
                  font-black
                  text-slate-800
                "
              >
                Book Details
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-400
                "
              >
                Quick information
              </p>

              <div className="mt-5 space-y-4">
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-medium
                      text-slate-500
                    "
                  >
                    <FaUser className="text-[#890C25]" />
                    Author
                  </span>

                  <span
                    className="
                      text-right
                      text-sm
                      font-black
                      text-slate-800
                    "
                  >
                    {book.author || "N/A"}
                  </span>
                </div>

                <div className="h-px bg-slate-100" />

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-medium
                      text-slate-500
                    "
                  >
                    <FaTags className="text-blue-600" />
                    Category
                  </span>

                  <span
                    className="
                      text-right
                      text-sm
                      font-black
                      text-slate-800
                    "
                  >
                    {book.category || "N/A"}
                  </span>
                </div>

                <div className="h-px bg-slate-100" />

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <span
                    className="
                      text-sm
                      font-medium
                      text-slate-500
                    "
                  >
                    Language
                  </span>

                  <span
                    className="
                      text-sm
                      font-black
                      text-slate-800
                    "
                  >
                    {book.language || "N/A"}
                  </span>
                </div>

                <div className="h-px bg-slate-100" />

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <span
                    className="
                      text-sm
                      font-medium
                      text-slate-500
                    "
                  >
                    File Type
                  </span>

                  <span
                    className="
                      rounded-full
                      bg-[#890C25]/10
                      px-3
                      py-1
                      text-xs
                      font-black
                      text-[#890C25]
                    "
                  >
                    {fileType}
                  </span>
                </div>

                <div className="h-px bg-slate-100" />

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-medium
                      text-slate-500
                    "
                  >
                    <FaEye className="text-blue-600" />
                    Views
                  </span>

                  <span
                    className="
                      text-sm
                      font-black
                      text-slate-800
                    "
                  >
                    {book.views || 0}
                  </span>
                </div>

                <div className="h-px bg-slate-100" />

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-medium
                      text-slate-500
                    "
                  >
                    <FaDownload className="text-green-600" />
                    Downloads
                  </span>

                  <span
                    className="
                      text-sm
                      font-black
                      text-slate-800
                    "
                  >
                    {book.downloads || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            BOTTOM NAVIGATION
        ================================================= */}

        <div
          className="
            mt-6
            flex
            flex-col
            items-center
            justify-between
            gap-4
            pb-6
            sm:flex-row
          "
        >
          <button
            type="button"
            onClick={() =>
              navigate(
                `/digital-library/books/${id}`
              )
            }
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-5
              py-3
              text-sm
              font-black
              text-slate-600
              shadow-sm
              transition-all
              duration-300
              hover:border-[#890C25]/20
              hover:bg-[#890C25]
              hover:text-white
              hover:shadow-md
            "
          >
            <FaArrowLeft />
            Back to Book Details
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[#890C25]
              px-5
              py-3
              text-sm
              font-black
              text-white
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#6f091e]
              hover:shadow-xl
            "
          >
            <FaDownload />
            Download Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadDigitalBook;

