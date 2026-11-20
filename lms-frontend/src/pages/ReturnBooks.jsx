import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaUndoAlt,
  FaCheck,
  FaTimes,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";

import { useReturnBooks } from "../context/ReturnBookContext";
import { useAuth } from "../context/AuthContext";

// =====================================================
// RETURN BOOKS
// =====================================================

const ReturnBooks = () => {
  const navigate = useNavigate();

  const {
    returns,
    loading,
    error,
    getAllReturnRequests,
    confirmReturnBook,
    rejectReturnRequest,
    clearError,
  } = useReturnBooks();

  const { user } = useAuth();

  const [successMessage, setSuccessMessage] =
    useState("");

  const [processingId, setProcessingId] =
    useState(null);

  // =====================================================
  // ROLE CHECK
  // =====================================================

  const currentRole = user?.role
    ?.toString()
    .trim()
    .toLowerCase();

  // =====================================================
  // LOAD RETURN REQUESTS
  // =====================================================

  useEffect(() => {
    if (currentRole !== "librarian") {
      return;
    }

    getAllReturnRequests().catch((err) => {
      console.error(
        "LOAD RETURN REQUESTS ERROR:",
        err
      );
    });
  }, [currentRole]);

  // =====================================================
  // ACCESS DENIED
  // =====================================================

  if (currentRole !== "librarian") {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-red-100 bg-white p-10 text-center shadow-2xl">
            {/* TOP LINE */}

            <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-[#65091c] via-[#890C25] to-[#D58A98]" />

            {/* DECORATION */}

            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-500/5" />

            <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#890C25]/5" />

            <div className="relative">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100 text-4xl text-red-600 shadow-sm">
                🔒
              </div>

              <h2 className="mt-6 text-2xl font-black text-slate-800">
                Access Denied
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Only Librarian can manage return requests.
              </p>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="
                  mt-7
                  rounded-xl
                  bg-[#890C25]
                  px-6
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
                "
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // SAFE RETURN REQUEST LIST
  // =====================================================

  const returnRequests = Array.isArray(returns)
    ? returns
    : [];

  // =====================================================
  // FILTER STATUS
  // =====================================================

  const pendingRequests =
    returnRequests.filter(
      (item) =>
        item?.status
          ?.toString()
          .trim()
          .toLowerCase() ===
        "pending"
    );

  const processedRequests =
    returnRequests.filter(
      (item) =>
        item?.status
          ?.toString()
          .trim()
          .toLowerCase() !==
        "pending"
    );

  const returnedRequests =
    returnRequests.filter(
      (item) =>
        item?.status
          ?.toString()
          .trim()
          .toLowerCase() ===
        "returned"
    );

  const rejectedRequests =
    returnRequests.filter(
      (item) =>
        item?.status
          ?.toString()
          .trim()
          .toLowerCase() ===
        "rejected"
    );

  // =====================================================
  // DATE FORMATTER
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString();
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusClass = (status) => {
    const normalizedStatus = status
      ?.toString()
      .trim()
      .toLowerCase();

    if (normalizedStatus === "pending") {
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }

    if (normalizedStatus === "returned") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    if (normalizedStatus === "rejected") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    return "border-slate-200 bg-slate-50 text-slate-700";
  };

  // =====================================================
  // STATUS DOT
  // =====================================================

  const getStatusDotClass = (status) => {
    const normalizedStatus = status
      ?.toString()
      .trim()
      .toLowerCase();

    if (normalizedStatus === "pending") {
      return "bg-yellow-500";
    }

    if (normalizedStatus === "returned") {
      return "bg-green-600";
    }

    if (normalizedStatus === "rejected") {
      return "bg-red-600";
    }

    return "bg-slate-500";
  };

  // =====================================================
  // CONFIRM RETURN
  // =====================================================

  const handleConfirmReturn = async (issueId) => {
    const confirmed = window.confirm(
      "Are you sure you want to confirm this book return?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setSuccessMessage("");
      clearError();

      setProcessingId(issueId);

      const response =
        await confirmReturnBook(issueId);

      setSuccessMessage(
        response?.message ||
          "Book returned successfully."
      );

      await getAllReturnRequests();

    } catch (err) {
      console.error(
        "CONFIRM RETURN ERROR:",
        err
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // REJECT RETURN
  // =====================================================

  const handleRejectReturn = async (issueId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this return request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setSuccessMessage("");
      clearError();

      setProcessingId(issueId);

      const response =
        await rejectReturnRequest(issueId);

      setSuccessMessage(
        response?.message ||
          "Return request rejected successfully."
      );

      await getAllReturnRequests();

    } catch (err) {
      console.error(
        "REJECT RETURN ERROR:",
        err
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // CLEAR ERROR
  // =====================================================

  const handleClearError = () => {
    clearError();
    setSuccessMessage("");
  };

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
            {/* LEFT CONTENT */}

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
                  <FaUndoAlt size={23} />
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
                Return Books
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
                Review student return requests and
                confirm or reject them from one place.
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
                  Return Management
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
                  {returnRequests.length} Total Requests
                </div>

              </div>
            </div>

            {/* TOTAL REQUESTS CARD */}

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
                  <FaClipboardList size={23} />
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
                  Total Requests
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
                  {String(returnRequests.length).padStart(2, "0")}
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
            STATISTICS
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

          {/* PENDING */}

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
                  Pending Requests
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {pendingRequests.length}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Waiting for review
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
                <FaClock size={19} />
              </div>

            </div>
          </div>

          {/* RETURNED */}

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
                  Returned Books
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {returnedRequests.length}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Successfully returned
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
                <FaCheck size={19} />
              </div>

            </div>
          </div>

          {/* PROCESSED */}

          <div
            className="
              group/stat
              relative
              overflow-hidden
              rounded-2xl
              border
              border-[#890C25]/15
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
                bg-[#890C25]
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
                    text-[#890C25]
                  "
                >
                  Processed Requests
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {processedRequests.length}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Completed or rejected
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
                "
              >
                <FaClipboardList size={19} />
              </div>

            </div>
          </div>

        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {successMessage && (
          <div
            className="
              mb-6
              flex
              items-center
              justify-between
              gap-4
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
            <div className="flex items-center gap-3">
              <FaCheck />
              <span>{successMessage}</span>
            </div>

            <button
              type="button"
              onClick={() =>
                setSuccessMessage("")
              }
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                transition
                hover:bg-green-100
              "
            >
              ✕
            </button>
          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div
            className="
              mb-6
              flex
              items-center
              justify-between
              gap-4
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
            <div className="flex items-center gap-3">
              <FaTimes />
              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={handleClearError}
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                transition
                hover:bg-red-100
              "
            >
              ✕
            </button>
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
                  All Return Requests
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review and manage submitted book return requests.
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
            Showing {returnRequests.length}
          </div>
        </div>

        {/* =================================================
            MAIN TABLE
        ================================================= */}

        <div
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
              group-hover/table:w-full
            "
          />

          {/* LOADING */}

          {loading && returnRequests.length === 0 ? (
            <div className="py-16 text-center">

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
                  shadow-xl
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
                Loading Return Requests
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Fetching return request records...
              </p>

            </div>

          ) : returnRequests.length === 0 ? (

            /* EMPTY STATE */

            <div className="relative overflow-hidden px-6 py-16 text-center">

              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#890C25]/5" />

              <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-blue-500/5" />

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
                  No Return Requests Found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  There are currently no student return requests
                  available for review.
                </p>

              </div>
            </div>

          ) : (

            /* DESKTOP TABLE */

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full min-w-[1050px]">

                <thead>
                  <tr
                    className="
                      border-b
                      border-slate-200
                      bg-slate-50/80
                      text-left
                    "
                  >
                    <th className="px-5 py-5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Book
                    </th>

                    <th className="px-5 py-5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Student
                    </th>

                    <th className="px-5 py-5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Request Date
                    </th>

                    <th className="px-5 py-5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-5 text-right text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {returnRequests.map((request) => {

                    const isPending =
                      request?.status
                        ?.toString()
                        .trim()
                        .toLowerCase() ===
                      "pending";

                    const isProcessing =
                      processingId === request._id;

                    return (
                      <tr
                        key={request._id}
                        className="
                          group/row
                          border-b
                          border-slate-100
                          transition-all
                          duration-300
                          last:border-0
                          hover:bg-slate-50/70
                        "
                      >

                        {/* BOOK */}

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-3">

                            <div
                              className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-100
                                text-blue-600
                              "
                            >
                              <FaBookOpen size={16} />
                            </div>

                            <div>
                              <div className="font-black text-slate-800">
                                {request.issue?.book?.title ||
                                  request.book?.title ||
                                  "Unknown Book"}
                              </div>

                              <div className="mt-1 text-xs font-medium text-slate-400">
                                {request.issue?.book?.author ||
                                  request.book?.author ||
                                  "Unknown Author"}
                              </div>
                            </div>

                          </div>
                        </td>

                        {/* STUDENT */}

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-3">

                            <div
                              className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#890C25]/10
                                text-[#890C25]
                                transition-all
                                duration-300
                                group-hover/row:bg-[#890C25]
                                group-hover/row:text-white
                              "
                            >
                              <FaUser size={15} />
                            </div>

                            <div>
                              <div className="font-black text-slate-800">
                                {request.issue?.student?.name ||
                                  request.student?.name ||
                                  "Unknown Student"}
                              </div>

                              <div className="mt-1 text-xs font-medium text-slate-400">
                                {request.issue?.student?.email ||
                                  request.student?.email ||
                                  "-"}
                              </div>
                            </div>

                          </div>
                        </td>

                        {/* DATE */}

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2">

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

                            <span className="text-sm font-bold text-slate-600">
                              {formatDate(
                                request.createdAt ||
                                  request.requestDate
                              )}
                            </span>

                          </div>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-5">

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
                              ${getStatusClass(
                                request.status
                              )}
                            `}
                          >
                            <span
                              className={`
                                h-1.5
                                w-1.5
                                rounded-full
                                ${getStatusDotClass(
                                  request.status
                                )}
                              `}
                            />

                            {request.status || "Pending"}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-5">

                          {isPending ? (

                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                disabled={
                                  loading ||
                                  isProcessing
                                }
                                onClick={() =>
                                  handleConfirmReturn(
                                    request._id
                                  )
                                }
                                className="
                                  group/approve
                                  flex
                                  items-center
                                  justify-center
                                  gap-2
                                  rounded-xl
                                  bg-green-600
                                  px-4
                                  py-2.5
                                  text-xs
                                  font-black
                                  text-white
                                  shadow-sm
                                  transition-all
                                  duration-300
                                  hover:-translate-y-0.5
                                  hover:bg-green-700
                                  hover:shadow-md
                                  disabled:cursor-not-allowed
                                  disabled:opacity-50
                                "
                              >
                                <FaCheck
                                  size={11}
                                  className="
                                    transition
                                    group-hover/approve:scale-110
                                  "
                                />

                                {isProcessing
                                  ? "Processing..."
                                  : "Confirm Return"}
                              </button>

                              <button
                                type="button"
                                disabled={
                                  loading ||
                                  isProcessing
                                }
                                onClick={() =>
                                  handleRejectReturn(
                                    request._id
                                  )
                                }
                                className="
                                  group/reject
                                  flex
                                  items-center
                                  justify-center
                                  gap-2
                                  rounded-xl
                                  bg-red-600
                                  px-4
                                  py-2.5
                                  text-xs
                                  font-black
                                  text-white
                                  shadow-sm
                                  transition-all
                                  duration-300
                                  hover:-translate-y-0.5
                                  hover:bg-red-700
                                  hover:shadow-md
                                  disabled:cursor-not-allowed
                                  disabled:opacity-50
                                "
                              >
                                <FaTimes
                                  size={11}
                                  className="
                                    transition
                                    group-hover/reject:scale-110
                                  "
                                />

                                Reject
                              </button>

                            </div>

                          ) : (

                            <div className="flex justify-end">

                              <span
                                className="
                                  rounded-full
                                  bg-slate-100
                                  px-4
                                  py-2
                                  text-xs
                                  font-bold
                                  text-slate-400
                                "
                              >
                                No Action Required
                              </span>

                            </div>
                          )}

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>
            </div>
          )}

          {/* =================================================
              MOBILE CARDS
          ================================================= */}

          {!loading &&
            returnRequests.length > 0 && (
              <div className="space-y-4 p-4 md:hidden">

                {returnRequests.map((request) => {

                  const isPending =
                    request?.status
                      ?.toString()
                      .trim()
                      .toLowerCase() ===
                    "pending";

                  const isProcessing =
                    processingId === request._id;

                  return (
                    <div
                      key={request._id}
                      className="
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-100
                        bg-white
                        p-5
                        shadow-sm
                      "
                    >
                      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#65091c] via-[#890C25] to-[#D58A98]" />

                      {/* BOOK */}

                      <div className="flex items-start gap-3">

                        <div
                          className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-100
                            text-blue-600
                          "
                        >
                          <FaBookOpen />
                        </div>

                        <div className="min-w-0">

                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Book
                          </p>

                          <h3 className="mt-1 truncate text-base font-black text-slate-800">
                            {request.issue?.book?.title ||
                              request.book?.title ||
                              "Unknown Book"}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {request.issue?.book?.author ||
                              request.book?.author ||
                              "Unknown Author"}
                          </p>

                        </div>
                      </div>

                      {/* STUDENT */}

                      <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-4">

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-[#890C25]/10
                            text-[#890C25]
                          "
                        >
                          <FaUser size={14} />
                        </div>

                        <div className="min-w-0">

                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Student
                          </p>

                          <p className="mt-1 truncate text-sm font-black text-slate-700">
                            {request.issue?.student?.name ||
                              request.student?.name ||
                              "Unknown Student"}
                          </p>

                          <p className="truncate text-xs text-slate-400">
                            {request.issue?.student?.email ||
                              request.student?.email ||
                              "-"}
                          </p>

                        </div>
                      </div>

                      {/* DATE + STATUS */}

                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <div className="rounded-xl bg-purple-50 p-3">

                          <p className="text-[10px] font-black uppercase tracking-wider text-purple-500">
                            Request Date
                          </p>

                          <p className="mt-2 text-xs font-bold text-slate-700">
                            {formatDate(
                              request.createdAt ||
                                request.requestDate
                            )}
                          </p>

                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">

                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Status
                          </p>

                          <div className="mt-2">

                            <span
                              className={`
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                px-2.5
                                py-1
                                text-[10px]
                                font-black
                                ${getStatusClass(
                                  request.status
                                )}
                              `}
                            >
                              <span
                                className={`
                                  h-1.5
                                  w-1.5
                                  rounded-full
                                  ${getStatusDotClass(
                                    request.status
                                  )}
                                `}
                              />

                              {request.status ||
                                "Pending"}
                            </span>

                          </div>
                        </div>

                      </div>

                      {/* ACTIONS */}

                      {isPending ? (

                        <div className="mt-5 grid grid-cols-2 gap-3">

                          <button
                            type="button"
                            disabled={
                              loading ||
                              isProcessing
                            }
                            onClick={() =>
                              handleConfirmReturn(
                                request._id
                              )
                            }
                            className="
                              flex
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              bg-green-600
                              px-3
                              py-3
                              text-xs
                              font-black
                              text-white
                              transition
                              hover:bg-green-700
                              disabled:opacity-50
                            "
                          >
                            <FaCheck size={11} />

                            {isProcessing
                              ? "Processing..."
                              : "Confirm"}
                          </button>

                          <button
                            type="button"
                            disabled={
                              loading ||
                              isProcessing
                            }
                            onClick={() =>
                              handleRejectReturn(
                                request._id
                              )
                            }
                            className="
                              flex
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              bg-red-600
                              px-3
                              py-3
                              text-xs
                              font-black
                              text-white
                              transition
                              hover:bg-red-700
                              disabled:opacity-50
                            "
                          >
                            <FaTimes size={11} />
                            Reject
                          </button>

                        </div>

                      ) : (

                        <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-center text-xs font-bold text-slate-400">
                          No Action Required
                        </div>

                      )}

                    </div>
                  );
                })}

              </div>
            )}

        </div>

        {/* =================================================
            RESULT COUNT
        ================================================= */}

        {returnRequests.length > 0 && (
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
              {returnRequests.length}
            </span>{" "}

            return requests
          </div>
        )}

      </div>
    </div>
  );
};

export default ReturnBooks;