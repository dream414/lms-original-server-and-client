
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBook,
  FaBookOpen,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaPlus,
  FaUser,
  FaTag,
  FaBarcode,
  FaLayerGroup,
} from "react-icons/fa";

import { useBooks } from "../../context/BookContext";
import { useAuth } from "../../context/AuthContext";

// =====================================================
// BOOKS LIST
// =====================================================

const Books = () => {
  const {
    books,
    loading,
    error,
    deleteBook,
    searchBooks,
  } = useBooks();

  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

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
  // ROLE
  // =====================================================

  const role = user?.role
    ?.toString()
    ?.trim()
    ?.toLowerCase();

  // =====================================================
  // PERMISSIONS
  // =====================================================

  const canManageBooks = [
    "admin",
    "librarian",
    "superadmin",
  ].includes(role);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredBooks = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return booksList;
    }

    return booksList.filter((book) => {
      return (
        book?.title
          ?.toString()
          ?.toLowerCase()
          ?.includes(value) ||
        book?.author
          ?.toString()
          ?.toLowerCase()
          ?.includes(value) ||
        book?.category
          ?.toString()
          ?.toLowerCase()
          ?.includes(value) ||
        book?.isbn
          ?.toString()
          ?.toLowerCase()
          ?.includes(value)
      );
    });
  }, [booksList, search]);

  // =====================================================
  // SEARCH HANDLER
  // =====================================================

  const handleSearch = async (e) => {
    const value = e.target.value;

    setSearch(value);

    try {
      if (typeof searchBooks === "function") {
        await searchBooks(value);
      }
    } catch (err) {
      console.error("SEARCH BOOK ERROR:", err);
    }
  };

  // =====================================================
  // DELETE BOOK
  // =====================================================

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteBook(id);
    } catch (err) {
      console.error("DELETE BOOK ERROR:", err);
    } finally {
      setDeletingId(null);
    }
  };

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

  // =====================================================
  // IMAGE ERROR
  // =====================================================

  const handleImageError = (e) => {
    console.error(
      "BOOK IMAGE NOT FOUND:",
      e.currentTarget.src
    );

    e.currentTarget.style.display = "none";

    const fallback =
      e.currentTarget.parentElement?.querySelector(
        ".image-fallback"
      );

    if (fallback) {
      fallback.classList.remove("hidden");
      fallback.classList.add("flex");
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && booksList.length === 0) {
    return (
      <div
        className="
          min-h-screen
          bg-slate-100
          px-4
          pb-10
          pt-10
          sm:px-6
          sm:pt-12
          lg:px-8
          lg:pt-14
        "
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[60vh] items-center justify-center">
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
                  border-[#890C25]/10
                  bg-white
                  shadow-2xl
                "
              >
                <div
                  className="
                    h-9
                    w-9
                    animate-spin
                    rounded-full
                    border-4
                    border-[#890C25]/20
                    border-t-[#890C25]
                  "
                />
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-800">
                Loading Books
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Fetching library records...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

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
          {/* Decorative Circle */}

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
                    text-white
                    shadow-xl
                    backdrop-blur-md
                  "
                >
                  <FaBookOpen size={24} />
                </div>

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
                    Library Management
                  </p>

                  <p className="mt-1 text-xs text-white/55">
                    Learning Management System
                  </p>
                </div>
              </div>

              <h1
                className="
                  text-3xl
                  font-extrabold
                  text-white
                  sm:text-4xl
                "
              >
                Books
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
                Manage, explore and access all available
                library books from one place.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
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
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Book Directory
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
                  {booksList.length} Books
                </div>
              </div>
            </div>

            {/* TOTAL BOOKS */}

            <div
              className="
                group/total
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
                  group-hover/total:scale-125
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
                  "
                >
                  <FaBook size={24} />
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
                  Total Books
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
                  {String(booksList.length).padStart(2, "0")}
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
                    group-hover/total:w-20
                  "
                />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            SEARCH + ADD BOOK
        ================================================= */}

        <div
          className="
            mb-6
            grid
            gap-5
            lg:grid-cols-[1fr_auto]
          "
        >
          {/* SEARCH */}

          <div
            className="
              group/search
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-lg
              transition
              duration-300
              hover:border-[#890C25]/20
              hover:shadow-xl
            "
          >
            <div
              className="
                absolute
                left-0
                top-0
                h-1.5
                w-20
                rounded-br-full
                bg-[#890C25]
                transition-all
                duration-500
                group-hover/search:w-full
              "
            />

            <div className="relative flex items-center">
              <FaSearch
                className="
                  absolute
                  left-5
                  text-[#890C25]
                "
                size={15}
              />

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by book title, author, category or ISBN..."
                className="
                  w-full
                  rounded-2xl
                  bg-transparent
                  py-4
                  pl-12
                  pr-5
                  text-sm
                  font-semibold
                  text-slate-700
                  outline-none
                  placeholder:text-slate-400
                "
              />
            </div>
          </div>

          {/* ADD BOOK */}

          {canManageBooks && (
            <Link
              to="/library/books/add"
              className="
                group/create
                relative
                inline-flex
                items-center
                justify-center
                gap-2
                overflow-hidden
                rounded-2xl
                bg-[#890C25]
                px-7
                py-4
                text-sm
                font-black
                text-white
                shadow-lg
                shadow-[#890C25]/20
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#6f091e]
                hover:shadow-xl
              "
            >
              <span
                className="
                  absolute
                  -right-8
                  -top-8
                  h-20
                  w-20
                  rounded-full
                  bg-white/5
                  transition
                  duration-500
                  group-hover/create:scale-125
                "
              />

              <FaPlus size={13} />

              Add Book
            </Link>
          )}
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="
              mb-6
              rounded-2xl
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
            {error}
          </div>
        )}

        {/* =================================================
            SECTION HEADER
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
              <div className="h-10 w-1.5 rounded-full bg-[#890C25]" />

              <div>
                <h2
                  className="
                    text-2xl
                    font-black
                    tracking-tight
                    text-slate-800
                  "
                >
                  All Books
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Browse and manage registered library books.
                </p>
              </div>
            </div>
          </div>

          <div
            className="
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-[#890C25]/10
              bg-white
              px-5
              py-2.5
              text-xs
              font-black
              text-[#890C25]
              shadow-sm
            "
          >
            <span className="h-2 w-2 rounded-full bg-[#890C25]" />

            Showing {filteredBooks.length}
          </div>
        </div>

        {/* =================================================
            EMPTY
        ================================================= */}

        {filteredBooks.length === 0 ? (
          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border-2
              border-dashed
              border-[#890C25]/20
              bg-white
              px-6
              py-16
              text-center
              shadow-xl
            "
          >
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
                  bg-[#890C25]/10
                  text-[#890C25]
                "
              >
                <FaBookOpen size={27} />
              </div>

              <h3
                className="
                  mt-6
                  text-xl
                  font-black
                  text-slate-800
                "
              >
                No Books Found
              </h3>

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
                {search
                  ? "Try searching with another book title, author, category or ISBN."
                  : "There are currently no books available in the library."}
              </p>

              {canManageBooks && !search && (
                <Link
                  to="/library/books/add"
                  className="
                    mt-6
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#890C25]
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    transition
                    hover:bg-[#6f091e]
                  "
                >
                  <FaPlus size={11} />

                  Add First Book
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* =================================================
             BOOK GRID
          ================================================= */

          <div
            className="
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {filteredBooks.map((book) => {
              const imageUrl = getImageUrl(book?.image);

              const availableCopies =
                Number(book?.availableCopies) || 0;

              const quantity =
                Number(book?.quantity) || 0;

              const isAvailable =
                availableCopies > 0;

              const isDeleting =
                deletingId === book?._id;

              return (
                <div
                  key={book?._id}
                  className="
                    group/card
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    shadow-lg
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:border-[#890C25]/20
                    hover:shadow-[0_25px_55px_rgba(137,12,37,0.14)]
                  "
                >
                  {/* =================================================
                      TOP COLOR LINE
                  ================================================= */}

                  <div
                    className="
                      absolute
                      left-0
                      right-0
                      top-0
                      z-20
                      h-1.5
                      bg-gradient-to-r
                      from-[#65091c]
                      via-[#890C25]
                      to-[#D58A98]
                    "
                  />

                  {/* =================================================
                      BOOK IMAGE HEADER
                  ================================================= */}

                  <div
                    className="
                      relative
                      overflow-hidden
                      bg-gradient-to-br
                      from-[#890C25]
                      via-[#9d1833]
                      to-[#65091c]
                      px-6
                      pb-6
                      pt-7
                      text-white
                    "
                  >
                    {/* Decorative */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        -right-10
                        -top-10
                        h-32
                        w-32
                        rounded-full
                        border
                        border-white/15
                        bg-white/5
                        transition
                        duration-500
                        group-hover/card:scale-125
                      "
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        -bottom-8
                        left-1/3
                        h-20
                        w-20
                        rounded-full
                        bg-white/5
                      "
                    />

                    <div className="relative">

                      {/* HEADER ROW */}

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >
                        {/* BLUE ICON */}

                        <div
                          className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-600
                            text-white
                            shadow-lg
                            transition-all
                            duration-300
                            group-hover/card:scale-105
                            group-hover/card:bg-blue-700
                          "
                        >
                          <FaBookOpen size={21} />
                        </div>

                        {/* STATUS */}

                        <span
                          className={`
                            rounded-lg
                            border
                            px-3
                            py-1.5
                            text-xs
                            font-black
                            backdrop-blur-md
                            ${
                              isAvailable
                                ? "border-green-300/30 bg-green-500/20 text-green-100"
                                : "border-red-300/30 bg-red-500/20 text-red-100"
                            }
                          `}
                        >
                          {isAvailable
                            ? "Available"
                            : "Unavailable"}
                        </span>
                      </div>

                      {/* IMAGE */}

                      <div
                        className="
                          relative
                          mt-5
                          flex
                          h-52
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-2xl
                          border
                          border-white/10
                          bg-white/10
                          p-4
                          backdrop-blur-sm
                        "
                      >
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={
                              book?.title || "Book"
                            }
                            onError={handleImageError}
                            className="
                              block
                              h-full
                              w-full
                              object-contain
                              drop-shadow-[0_12px_18px_rgba(0,0,0,0.35)]
                              transition
                              duration-500
                              group-hover/card:scale-105
                            "
                          />
                        )}

                        {/* FALLBACK */}

                        <div
                          className={`
                            image-fallback
                            absolute
                            inset-0
                            items-center
                            justify-center
                            bg-gradient-to-br
                            from-white/10
                            to-white/5
                            ${
                              imageUrl
                                ? "hidden"
                                : "flex"
                            }
                          `}
                        >
                          <div className="text-center">
                            <FaBook
                              className="
                                mx-auto
                                text-5xl
                                text-white/25
                              "
                            />

                            <p
                              className="
                                mt-3
                                text-xs
                                font-semibold
                                text-white/50
                              "
                            >
                              No Cover Image
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* TITLE */}

                      <div className="mt-5">
                        <h2
                          className="
                            line-clamp-2
                            text-xl
                            font-black
                          "
                        >
                          {book?.title ||
                            "Untitled Book"}
                        </h2>

                        <p
                          className="
                            mt-2
                            flex
                            items-center
                            gap-2
                            text-xs
                            font-medium
                            text-white/65
                          "
                        >
                          <FaUser size={10} />

                          {book?.author ||
                            "Unknown Author"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      CARD BODY
                  ================================================= */}

                  <div className="relative p-6">

                    {/* =================================================
                        CATEGORY + ISBN
                    ================================================= */}

                    <div className="grid grid-cols-2 gap-3">

                      {/* CATEGORY - BLUE */}

                      <div
                        className="
                          group/info
                          relative
                          overflow-hidden
                          rounded-2xl
                          border
                          border-blue-200
                          bg-gradient-to-br
                          from-blue-50
                          via-white
                          to-blue-100/40
                          p-4
                          shadow-sm
                          ring-1
                          ring-blue-100
                          transition-all
                          duration-300
                          hover:-translate-y-0.5
                          hover:border-blue-300
                          hover:ring-2
                          hover:ring-blue-200
                          hover:shadow-md
                        "
                      >
                        <div
                          className="
                            pointer-events-none
                            absolute
                            -right-8
                            -top-8
                            h-20
                            w-20
                            rounded-full
                            bg-blue-500/10
                            transition
                            duration-500
                            group-hover/info:scale-125
                          "
                        />

                        <div className="relative">
                          <div
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-blue-600
                              text-white
                              shadow-sm
                              ring-4
                              ring-blue-100
                            "
                          >
                            <FaTag size={13} />
                          </div>

                          <p
                            className="
                              mt-3
                              text-[10px]
                              font-black
                              uppercase
                              tracking-wider
                              text-blue-500
                            "
                          >
                            Category
                          </p>

                          <p
                            className="
                              mt-1
                              truncate
                              text-sm
                              font-black
                              text-slate-700
                            "
                          >
                            {book?.category ||
                              "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* ISBN - PURPLE */}

                      <div
                        className="
                          group/info
                          relative
                          overflow-hidden
                          rounded-2xl
                          border
                          border-purple-200
                          bg-gradient-to-br
                          from-purple-50
                          via-white
                          to-purple-100/40
                          p-4
                          shadow-sm
                          ring-1
                          ring-purple-100
                          transition-all
                          duration-300
                          hover:-translate-y-0.5
                          hover:border-purple-300
                          hover:ring-2
                          hover:ring-purple-200
                          hover:shadow-md
                        "
                      >
                        <div
                          className="
                            pointer-events-none
                            absolute
                            -right-8
                            -top-8
                            h-20
                            w-20
                            rounded-full
                            bg-purple-500/10
                            transition
                            duration-500
                            group-hover/info:scale-125
                          "
                        />

                        <div className="relative">
                          <div
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-purple-600
                              text-white
                              shadow-sm
                              ring-4
                              ring-purple-100
                            "
                          >
                            <FaBarcode size={13} />
                          </div>

                          <p
                            className="
                              mt-3
                              text-[10px]
                              font-black
                              uppercase
                              tracking-wider
                              text-purple-500
                            "
                          >
                            ISBN
                          </p>

                          <p
                            className="
                              mt-1
                              truncate
                              text-sm
                              font-black
                              text-slate-700
                            "
                          >
                            {book?.isbn || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        AVAILABLE COPIES - GREEN
                    ================================================= */}

                    <div
                      className="
                        group/copies
                        relative
                        mt-4
                        overflow-hidden
                        rounded-2xl
                        border
                        border-green-200
                        bg-gradient-to-r
                        from-green-50
                        via-white
                        to-emerald-50
                        px-4
                        py-4
                        shadow-sm
                        ring-1
                        ring-green-100
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:border-green-300
                        hover:ring-2
                        hover:ring-green-200
                        hover:shadow-md
                      "
                    >
                      <div
                        className="
                          pointer-events-none
                          absolute
                          -bottom-8
                          -right-8
                          h-24
                          w-24
                          rounded-full
                          bg-green-500/10
                          transition
                          duration-500
                          group-hover/copies:scale-125
                        "
                      />

                      <div
                        className="
                          relative
                          flex
                          items-center
                          justify-between
                          gap-3
                        "
                      >
                        <div className="flex items-center gap-3">

                          <div
                            className="
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center
                              rounded-xl
                              bg-green-600
                              text-white
                              shadow-sm
                              ring-4
                              ring-green-100
                            "
                          >
                            <FaLayerGroup size={14} />
                          </div>

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
                              Available Copies
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                font-bold
                                text-slate-500
                              "
                            >
                              Library Stock
                            </p>
                          </div>
                        </div>

                        <span
                          className="
                            rounded-xl
                            border
                            border-green-200
                            bg-green-100
                            px-3
                            py-2
                            text-lg
                            font-black
                            text-green-700
                            shadow-sm
                            ring-2
                            ring-green-50
                          "
                        >
                          {availableCopies} / {quantity}
                        </span>
                      </div>
                    </div>

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="mt-5 flex items-center gap-2">

                      {/* VIEW */}

                      <Link
                        to={`/library/books/${book?._id}`}
                        className="
                          group/view
                          flex
                          flex-1  
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-slate-200
                          px-3
                          py-3
                          text-xs
                          font-black
                          text-slate-600
                          transition-all
                          duration-300
                          hover:border-[#890C25]/20
                          hover:bg-[#890C25]
                          hover:text-white
                        "
                      >
                        <FaEye
                          size={12}
                          className="
                            transition
                            group-hover/view:scale-110
                          "
                        />

                        View
                      </Link>

                      {/* EDIT + DELETE */}

                      {canManageBooks && (
                        <>
                          {/* EDIT */}

                          <Link
                            to={`/library/books/${book?._id}/edit`}
                            className="
                              group/edit
                              flex
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              bg-blue-600
                              px-4
                              py-3
                              text-xs
                              font-black
                              text-white
                              shadow-sm
                              transition-all
                              duration-300
                              hover:bg-blue-700
                              hover:shadow-md
                            "
                          >
                            <FaEdit
                              size={12}
                              className="
                                transition
                                group-hover/edit:scale-110
                              "
                            />

                            Edit
                          </Link>

                          {/* DELETE */}

                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() =>
                              handleDelete(
                                book?._id,
                                book?.title
                              )
                            }
                            className="
                              group/delete
                              flex
                              items-center
                              justify-center
                              rounded-xl
                              bg-red-50
                              px-3.5
                              py-3
                              text-red-500
                              transition-all
                              duration-300
                              hover:bg-red-600
                              hover:text-white
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                            title="Delete Book"
                          >
                            {isDeleting ? (
                              <div
                                className="
                                  h-3
                                  w-3
                                  animate-spin
                                  rounded-full
                                  border-2
                                  border-red-300
                                  border-t-red-600
                                "
                              />
                            ) : (
                              <FaTrash
                                size={12}
                                className="
                                  transition
                                  group-hover/delete:scale-110
                                "
                              />
                            )}
                          </button>
                        </>
                      )}
                    </div>

                    {/* =================================================
                        BOTTOM HOVER STRIP
                    ================================================= */}

                    <div
                      className="
                        mt-5
                        h-1
                        w-16
                        rounded-full
                        bg-[#890C25]
                        transition-all
                        duration-500
                        group-hover/card:w-full
                      "
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =================================================
            RESULT COUNT
        ================================================= */}

        {booksList.length > 0 && (
          <div
            className="
              mt-6
              text-center
              text-xs
              font-semibold
              text-slate-400
            "
          >
            Showing{" "}
            <span className="font-black text-[#890C25]">
              {filteredBooks.length}
            </span>{" "}
            of{" "}
            <span className="font-black text-slate-600">
              {booksList.length}
            </span>{" "}
            books
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;

