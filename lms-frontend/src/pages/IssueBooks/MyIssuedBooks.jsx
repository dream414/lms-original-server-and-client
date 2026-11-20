import { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaCheck,
  FaClock,
  FaUndoAlt,
  FaUserCheck,
} from "react-icons/fa";

import { useIssueBooks } from "../../context/IssueBookContext";
import { useReturnBooks } from "../../context/ReturnBookContext";

const MyIssuedBooks = () => {
  // =========================================================
  // API / CONTEXT
  // =========================================================

  const {
    getMyIssuedBooks,
    receiveBook,
  } = useIssueBooks();

  const {
    requestReturnBook,
  } = useReturnBooks();

  // =========================================================
  // STATES
  // =========================================================

  const [myBooks, setMyBooks] = useState([]);
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [receivingId, setReceivingId] = useState(null);
  const [returningId, setReturningId] = useState(null);

  // =========================================================
  // LOAD MY ISSUED BOOKS
  // =========================================================

  const loadMyBooks = async () => {
    try {
      setPageError("");

      const data = await getMyIssuedBooks();

      setMyBooks(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "GET MY ISSUED BOOKS ERROR:",
        err
      );

      setPageError(
        err?.message ||
          "Failed to load issued books."
      );
    }
  };

  useEffect(() => {
    loadMyBooks();
  }, []);

  // =========================================================
  // RECEIVE BOOK
  // =========================================================

  const handleReceiveBook = async (issueId) => {
    if (!issueId) return;

    try {
      setReceivingId(issueId);
      setPageError("");
      setSuccessMessage("");

      const response = await receiveBook(issueId);

      if (response?.issueBook) {
        setMyBooks((prev) =>
          prev.map((book) =>
            book._id === issueId
              ? response.issueBook
              : book
          )
        );
      } else {
        await loadMyBooks();
      }

      setSuccessMessage(
        "Book received successfully."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

    } catch (err) {
      console.error(
        "RECEIVE BOOK ERROR:",
        err
      );

      setPageError(
        err?.message ||
          "Failed to receive book."
      );
    } finally {
      setReceivingId(null);
    }
  };

  // =========================================================
  // REQUEST RETURN
  // =========================================================

  const handleReturnBook = async (issueId) => {
    if (!issueId) return;

    try {
      setReturningId(issueId);
      setPageError("");
      setSuccessMessage("");

      const response =
        await requestReturnBook(issueId);

      if (response?.issueBook) {
        setMyBooks((prev) =>
          prev.map((book) =>
            book._id === issueId
              ? response.issueBook
              : book
          )
        );
      } else {
        setMyBooks((prev) =>
          prev.map((book) =>
            book._id === issueId
              ? {
                  ...book,
                  returnRequested: true,
                  returnRequestedAt:
                    new Date(),
                }
              : book
          )
        );
      }

      setSuccessMessage(
        "Return request submitted successfully. Please wait for the librarian to confirm."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

    } catch (err) {
      console.error(
        "RETURN BOOK ERROR:",
        err
      );

      setPageError(
        err?.message ||
          "Failed to submit return request."
      );
    } finally {
      setReturningId(null);
    }
  };

  // =========================================================
  // CHECK RETURN REQUEST
  // =========================================================

  const isReturnRequested = (issue) => {
    return issue?.returnRequested === true;
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "—";

    try {
      return new Date(date).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
    } catch {
      return "—";
    }
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalBooks = myBooks?.length || 0;

  const receivedBooks =
    myBooks?.filter(
      (book) => book?.received === true
    ).length || 0;

  const pendingReceiveBooks =
    myBooks?.filter(
      (book) =>
        book?.received !== true &&
        book?.status !== "Returned"
    ).length || 0;

  const returnRequestedBooks =
    myBooks?.filter(
      (book) =>
        book?.returnRequested === true
    ).length || 0;

  // =========================================================
  // STATUS CONFIG
  // =========================================================

  const getStatus = (issue) => {
    if (issue?.status === "Returned") {
      return {
        label: "Returned",
        className:
          "border-green-200 bg-green-50 text-green-700",
        dot: "bg-green-600",
      };
    }

    if (isReturnRequested(issue)) {
      return {
        label: "Return Requested",
        className:
          "border-yellow-200 bg-yellow-50 text-yellow-700",
        dot: "bg-yellow-500",
      };
    }

    if (issue?.received) {
      return {
        label: "Received",
        className:
          "border-blue-200 bg-blue-50 text-blue-700",
        dot: "bg-blue-600",
      };
    }

    return {
      label: "Issued",
      className:
        "border-purple-200 bg-purple-50 text-purple-700",
      dot: "bg-purple-600",
    };
  };

  // =========================================================
  // RENDER ACTION BUTTON
  // =========================================================

  const renderActionButton = (issue) => {
    if (!issue) return null;

    // ALREADY RETURNED

    if (issue.status === "Returned") {
      return (
        <button
          type="button"
          disabled
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-green-200
            bg-green-50
            px-4
            py-3
            text-sm
            font-black
            text-green-700
            cursor-not-allowed
          "
        >
          <FaCheck size={13} />
          Returned
        </button>
      );
    }

    // RETURN REQUEST ALREADY SUBMITTED

    if (isReturnRequested(issue)) {
      return (
        <button
          type="button"
          disabled
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-yellow-200
            bg-yellow-50
            px-4
            py-3
            text-sm
            font-black
            text-yellow-700
            cursor-not-allowed
          "
        >
          <FaClock size={13} />
          Return Requested
        </button>
      );
    }

    // BOOK RECEIVED → RETURN BOOK

    if (issue.received) {
      const isReturning =
        returningId === issue._id;

      return (
        <button
          type="button"
          onClick={() =>
            handleReturnBook(issue._id)
          }
          disabled={isReturning}
          className="
            group/return
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-red-600
            px-4
            py-3
            text-sm
            font-black
            text-white
            shadow-lg
            shadow-red-600/20
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-red-700
            hover:shadow-xl
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isReturning ? (
            <div
              className="
                h-4
                w-4
                animate-spin
                rounded-full
                border-2
                border-white/30
                border-t-white
              "
            />
          ) : (
            <FaUndoAlt
              size={13}
              className="
                transition
                duration-300
                group-hover/return:-rotate-45
              "
            />
          )}

          {isReturning
            ? "Submitting..."
            : "Return Book"}
        </button>
      );
    }

    // BOOK NOT RECEIVED → RECEIVE BOOK

    const isReceiving =
      receivingId === issue._id;

    return (
      <button
        type="button"
        onClick={() =>
          handleReceiveBook(issue._id)
        }
        disabled={isReceiving}
        className="
          group/receive
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-[#890C25]
          px-4
          py-3
          text-sm
          font-black
          text-white
          shadow-lg
          shadow-[#890C25]/20
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:bg-[#65091c]
          hover:shadow-xl
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {isReceiving ? (
          <div
            className="
              h-4
              w-4
              animate-spin
              rounded-full
              border-2
              border-white/30
              border-t-white
            "
          />
        ) : (
          <FaCheck
            size={13}
            className="
              transition
              duration-300
              group-hover/receive:scale-110
            "
          />
        )}

        {isReceiving
          ? "Receiving..."
          : "Receive Book"}
      </button>
    );
  };

  // =========================================================
  // PAGE
  // =========================================================

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

        {/* =====================================================
            HERO HEADER
        ===================================================== */}

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
          {/* DECORATIVE CIRCLES */}

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
                My Issued Books
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
                View your issued books, receive your books
                and manage return requests from one place.
              </p>

              {/* HERO TAGS */}

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
                  Book Management
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
                  {totalBooks} Total Books
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
                  <FaBookOpen size={24} />
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
                  {String(totalBooks).padStart(2, "0")}
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

        {/* =====================================================
            STATISTICS
        ===================================================== */}

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
          {/* RECEIVED */}

          <div
            className="
              group/stat
              relative
              overflow-hidden
              rounded-2xl
              border
              border-green-200
              bg-white
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div
              className="
                absolute
                left-0
                top-0
                h-1
                w-16
                rounded-br-full
                bg-green-600
                transition-all
                duration-500
                group-hover/stat:w-full
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
                  Received Books
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {receivedBooks}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Successfully received
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
                "
              >
                <FaUserCheck size={19} />
              </div>

            </div>
          </div>

          {/* PENDING RECEIVE */}

          <div
            className="
              group/stat
              relative
              overflow-hidden
              rounded-2xl
              border
              border-purple-200
              bg-white
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div
              className="
                absolute
                left-0
                top-0
                h-1
                w-16
                rounded-br-full
                bg-purple-600
                transition-all
                duration-500
                group-hover/stat:w-full
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
                    text-purple-600
                  "
                >
                  Pending Receive
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {pendingReceiveBooks}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Waiting to receive
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
                  bg-purple-100
                  text-purple-600
                "
              >
                <FaClock size={19} />
              </div>

            </div>
          </div>

          {/* RETURN REQUESTS */}

          <div
            className="
              group/stat
              relative
              overflow-hidden
              rounded-2xl
              border
              border-yellow-200
              bg-white
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div
              className="
                absolute
                left-0
                top-0
                h-1
                w-16
                rounded-br-full
                bg-yellow-500
                transition-all
                duration-500
                group-hover/stat:w-full
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
                    text-yellow-600
                  "
                >
                  Return Requests
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {returnRequestedBooks}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Awaiting confirmation
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
                  bg-yellow-100
                  text-yellow-600
                "
              >
                <FaUndoAlt size={18} />
              </div>

            </div>
          </div>

        </div>

        {/* =====================================================
            SUCCESS MESSAGE
        ===================================================== */}

        {successMessage && (
          <div
            className="
              mb-6
              rounded-2xl
              border
              border-green-200
              bg-green-50
              px-5
              py-4
              text-sm
              font-semibold
              text-green-700
              shadow-sm
            "
          >
            {successMessage}
          </div>
        )}

        {/* =====================================================
            ERROR MESSAGE
        ===================================================== */}

        {pageError && (
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
            {pageError}
          </div>
        )}

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

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
                  All My Issued Books
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage all books currently issued to you.
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

            Showing {totalBooks}
          </div>

        </div>

        {/* =====================================================
            BOOK GRID
        ===================================================== */}

        {myBooks.length === 0 ? (

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
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
                <FaBookOpen size={28} />
              </div>

              <h3 className="mt-6 text-xl font-black text-slate-800">
                No Issued Books Found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                You currently don't have any issued books.
              </p>

            </div>
          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {myBooks.map((issue) => {
              const book = issue?.book || {};

              const status = getStatus(issue);

              return (
                <div
                  key={issue._id}
                  className="
                    group/book
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    shadow-lg
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-2xl
                  "
                >
                  {/* TOP HOVER LINE */}

                  <div
                    className="
                      absolute
                      left-0
                      right-0
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
                      group-hover/book:w-full
                    "
                  />

                  {/* BOOK IMAGE */}

                  <div
                    className="
                      relative
                      flex
                      h-52
                      items-center
                      justify-center
                      overflow-hidden
                      bg-gradient-to-br
                      from-[#65091c]
                      via-[#890C25]
                      to-[#D58A98]
                    "
                  >
                    {book?.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book?.title || "Book"}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition
                          duration-500
                          group-hover/book:scale-105
                        "
                      />
                    ) : (
                      <>
                        <div
                          className="
                            absolute
                            -right-10
                            -top-10
                            h-40
                            w-40
                            rounded-full
                            border
                            border-white/10
                            bg-white/5
                          "
                        />

                        <div
                          className="
                            relative
                            flex
                            h-24
                            w-24
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
                          <FaBookOpen size={38} />
                        </div>
                      </>
                    )}

                    {/* STATUS */}

                    <div className="absolute right-4 top-4">

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          px-3
                          py-1.5
                          text-xs
                          font-black
                          shadow-sm
                          backdrop-blur-md
                          ${status.className}
                        `}
                      >
                        <span
                          className={`
                            h-1.5
                            w-1.5
                            rounded-full
                            ${status.dot}
                          `}
                        />

                        {status.label}
                      </span>

                    </div>
                  </div>

                  {/* CONTENT */}

                  <div className="p-5 sm:p-6">

                    <h2
                      className="
                        line-clamp-2
                        text-xl
                        font-black
                        text-slate-800
                      "
                    >
                      {book?.title ||
                        "Unknown Book"}
                    </h2>

                    <p className="mt-2 text-sm font-medium text-slate-500">
                      {book?.author ||
                        "Unknown Author"}
                    </p>

                    {/* DETAILS */}

                    <div className="mt-6 space-y-3">

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          rounded-xl
                          border
                          border-slate-100
                          bg-slate-50/70
                          px-4
                          py-3
                        "
                      >
                        <div className="flex items-center gap-3">

                          <div
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-blue-50
                              text-blue-600
                            "
                          >
                            <FaCalendarAlt size={13} />
                          </div>

                          <span className="text-xs font-bold text-slate-500">
                            Issue Date
                          </span>

                        </div>

                        <span className="text-xs font-black text-slate-700">
                          {formatDate(
                            issue.issueDate
                          )}
                        </span>
                      </div>

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          rounded-xl
                          border
                          border-slate-100
                          bg-slate-50/70
                          px-4
                          py-3
                        "
                      >
                        <div className="flex items-center gap-3">

                          <div
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-purple-50
                              text-purple-600
                            "
                          >
                            <FaCalendarAlt size={13} />
                          </div>

                          <span className="text-xs font-bold text-slate-500">
                            Due Date
                          </span>

                        </div>

                        <span className="text-xs font-black text-slate-700">
                          {formatDate(
                            issue.dueDate
                          )}
                        </span>
                      </div>

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          rounded-xl
                          border
                          border-slate-100
                          bg-slate-50/70
                          px-4
                          py-3
                        "
                      >
                        <span className="text-xs font-bold text-slate-500">
                          Received
                        </span>

                        <span
                          className={`
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-black
                            ${
                              issue.received
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          `}
                        >
                          {issue.received
                            ? "Yes"
                            : "No"}
                        </span>
                      </div>

                      {issue.receivedAt && (
                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            rounded-xl
                            border
                            border-slate-100
                            bg-slate-50/70
                            px-4
                            py-3
                          "
                        >
                          <span className="text-xs font-bold text-slate-500">
                            Received On
                          </span>

                          <span className="text-xs font-black text-slate-700">
                            {formatDate(
                              issue.receivedAt
                            )}
                          </span>
                        </div>
                      )}

                      {issue.returnRequestedAt && (
                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            rounded-xl
                            border
                            border-yellow-100
                            bg-yellow-50
                            px-4
                            py-3
                          "
                        >
                          <span className="text-xs font-bold text-yellow-700">
                            Return Requested
                          </span>

                          <span className="text-xs font-black text-yellow-700">
                            {formatDate(
                              issue.returnRequestedAt
                            )}
                          </span>
                        </div>
                      )}

                    </div>

                    {/* ACTION */}

                    <div className="mt-6">
                      {renderActionButton(issue)}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        )}

        {/* RESULT COUNT */}

        {myBooks.length > 0 && (
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
              {myBooks.length}
            </span>{" "}

            issued books
          </div>
        )}

      </div>
    </div>
  );
};

export default MyIssuedBooks;