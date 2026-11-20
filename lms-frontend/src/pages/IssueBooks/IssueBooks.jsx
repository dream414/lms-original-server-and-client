
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useIssueBooks } from "../../context/IssueBookContext";
import { useRequests } from "../../context/RequestContext";

// ==========================================
// ISSUE BOOKS PAGE
// ==========================================

const IssueBooks = () => {
  const navigate = useNavigate();

  const {
    issues,
    loading: issueLoading,
    error: issueError,
    getAllIssuedBooks,
    issueBook,
  } = useIssueBooks();

  const {
    requests,
    loading: requestLoading,
    error: requestError,
    getAllRequests,
  } = useRequests();

  // ==========================================
  // STATES
  // ==========================================

  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    getAllIssuedBooks();
    getAllRequests();
  }, []);

  // ==========================================
  // APPROVED REQUESTS
  // ==========================================

  const approvedRequests = useMemo(() => {
    return requests.filter(
      (request) => request.status === "Approved"
    );
  }, [requests]);

  // ==========================================
  // STATS
  // ==========================================

  const totalIssued = issues.length;

  const activeIssued = issues.filter(
    (issue) => issue.status === "Issued"
  ).length;

  const returnedBooks = issues.filter(
    (issue) => issue.status === "Returned"
  ).length;

  // ==========================================
  // OPEN MODAL
  // ==========================================

  const openIssueModal = (request) => {
    setSelectedRequest(request);
    setDueDate("");
    setActionError("");
    setSuccessMessage("");
    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeIssueModal = () => {
    if (actionLoading) return;

    setShowModal(false);
    setSelectedRequest(null);
    setDueDate("");
    setActionError("");
  };

  // ==========================================
  // ISSUE BOOK
  // ==========================================

  const handleIssueBook = async () => {
    if (!selectedRequest) return;

    if (!dueDate) {
      setActionError("Please select a due date.");
      return;
    }

    const selectedDate = new Date(dueDate);
    const today = new Date();

    if (selectedDate <= today) {
      setActionError("Due date must be in the future.");
      return;
    }

    try {
      setActionLoading(true);
      setActionError("");

      await issueBook(
        selectedRequest._id,
        dueDate
      );

      await Promise.all([
        getAllIssuedBooks(),
        getAllRequests(),
      ]);

      setShowModal(false);
      setSelectedRequest(null);
      setDueDate("");

      setSuccessMessage(
        "Book issued successfully."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (err) {
      setActionError(
        err.message || "Failed to issue book."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    if (status === "Issued") {
      return "border-green-200 bg-green-50 text-green-700 ring-green-100";
    }

    if (status === "Returned") {
      return "border-purple-200 bg-purple-50 text-purple-700 ring-purple-100";
    }

    return "border-yellow-200 bg-yellow-50 text-yellow-700 ring-yellow-100";
  };

  // ==========================================
  // LOADING
  // ==========================================

  const pageLoading =
    issueLoading || requestLoading;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 mt-5 px-4 pb-10 pt-8 sm:px-6 lg:px-8">

      {/* ==========================================
          BACKGROUND DECORATIONS
      ========================================== */}

      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border-[35px] border-purple-100/60 blur-sm" />

      <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full border-[30px] border-green-100/60 blur-sm" />

      <div className="pointer-events-none absolute bottom-10 right-10 h-56 w-56 rounded-full border-[25px] border-cyan-100/60 blur-sm" />

      <div className="relative mx-auto max-w-7xl">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div
          className="
            relative
            mb-8
            overflow-hidden
            rounded-[2rem]
            p-6
            shadow-[0_18px_45px_rgba(137,12,37,0.20)]
            sm:p-8
          "
          style={{
            background:
              "linear-gradient(135deg, #890C25, #65081b, #4a0512)",
          }}
        >

          {/* Decorative circles */}

          <div
            className="
              absolute
              -right-20
              -top-24
              h-64
              w-64
              rounded-full
              border-[18px]
              border-purple-300/10
            "
          />

          <div
            className="
              absolute
              -bottom-24
              right-1/4
              h-48
              w-48
              rounded-full
              border-[14px]
              border-green-300/10
            "
          />

          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="mb-2 flex items-center gap-2">

                <span className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D58A98]">
                  Library Management
                </span>

              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Issue Books
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-white/65">
                Issue approved book requests to students
                and manage issued book records.
              </p>

            </div>

            <div
              className="
                flex
                h-16
                w-16
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-blue-600
                text-3xl
                text-white
                shadow-lg
                ring-8
                ring-blue-500/10
                transition
                duration-300
                hover:scale-105
              "
            >
              📚
            </div>

          </div>
        </div>

        {/* ==========================================
            SUCCESS MESSAGE
        ========================================== */}

        {successMessage && (
          <div
            className="
              mb-6
              flex
              items-center
              gap-3
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
              ring-4
              ring-green-50
            "
          >

            <span
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-green-100
                text-green-600
                ring-4
                ring-green-50
              "
            >
              ✓
            </span>

            {successMessage}

          </div>
        )}

        {/* ==========================================
            ERROR
        ========================================== */}

        {(issueError || requestError) && (
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
              ring-4
              ring-red-50
            "
          >
            {issueError || requestError}
          </div>
        )}

        {/* ==========================================
            STATISTICS
        ========================================== */}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* TOTAL */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-blue-100
              bg-white
              p-6
              shadow-[0_10px_30px_rgba(15,23,42,0.06)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-blue-300
              hover:shadow-xl
              hover:shadow-blue-100/50
              hover:ring-4
              hover:ring-blue-50
            "
          >

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border-[10px] border-blue-100/70 transition-transform duration-500 group-hover:scale-125" />

            <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full border-8 border-purple-100/60" />

            <div className="relative flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Issued
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {totalIssued}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  All issue records
                </p>
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
                  text-xl
                  ring-4
                  ring-blue-50
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:bg-blue-600
                  group-hover:text-white
                "
              >
                📚
              </div>

            </div>
          </div>

          {/* ACTIVE */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-green-100
              bg-white
              p-6
              shadow-[0_10px_30px_rgba(15,23,42,0.06)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-green-300
              hover:shadow-xl
              hover:shadow-green-100/50
              hover:ring-4
              hover:ring-green-50
            "
          >

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border-[10px] border-green-100/70 transition-transform duration-500 group-hover:scale-125" />

            <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full border-8 border-cyan-100/60" />

            <div className="relative flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Currently Issued
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {activeIssued}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Active books
                </p>
              </div>

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-green-50
                  text-xl
                  ring-4
                  ring-green-50
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:bg-green-600
                  group-hover:text-white
                "
              >
                ✓
              </div>

            </div>
          </div>

          {/* RETURNED */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-purple-100
              bg-white
              p-6
              shadow-[0_10px_30px_rgba(15,23,42,0.06)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-purple-300
              hover:shadow-xl
              hover:shadow-purple-100/50
              hover:ring-4
              hover:ring-purple-50
            "
          >

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border-[10px] border-purple-100/70 transition-transform duration-500 group-hover:scale-125" />

            <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full border-8 border-pink-100/60" />

            <div className="relative flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Returned
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {returnedBooks}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Completed returns
                </p>
              </div>

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-purple-50
                  text-xl
                  ring-4
                  ring-purple-50
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:bg-purple-600
                  group-hover:text-white
                "
              >
                ↩
              </div>

            </div>
          </div>

        </div>

        {/* ==========================================
            APPROVED REQUESTS CARD
        ========================================== */}

        <div
          className="
            relative
            mb-8
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-[0_15px_35px_rgba(15,23,42,0.07)]
            transition-all
            duration-300
            hover:border-blue-200
            hover:shadow-xl
          "
        >

          {/* TOP RING LINE */}

          <div className="h-1.5 w-full bg-gradient-to-r from-[#890C25] via-purple-500 to-blue-500" />

          {/* CARD HEADER */}

          <div className="relative border-b border-slate-100 bg-gradient-to-r from-red-50/50 via-purple-50/30 to-white px-5 py-6 sm:px-7">

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border-8 border-purple-100/50" />

            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#890C25]">
                  Ready To Issue
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-800">
                  Approved Requests
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Requests approved by the librarian/admin.
                </p>

              </div>

              <span
                className="
                  w-fit
                  rounded-full
                  border
                  border-blue-200
                  bg-blue-50
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-blue-700
                  ring-4
                  ring-blue-50
                "
              >
                {approvedRequests.length} Approved
              </span>

            </div>
          </div>

          {/* CONTENT */}

          {pageLoading && approvedRequests.length === 0 ? (

            <div className="py-14 text-center text-sm text-slate-500">
              Loading approved requests...
            </div>

          ) : approvedRequests.length === 0 ? (

            <div className="px-5 py-16 text-center">

              <div
                className="
                  mx-auto
                  mb-5
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-blue-50
                  text-2xl
                  ring-8
                  ring-blue-50
                "
              >
                📖
              </div>

              <h3 className="text-lg font-black text-slate-700">
                No Approved Requests
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                There are currently no approved requests
                waiting to be issued.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>

                  <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-400">

                    <th className="px-5 py-4">
                      Student
                    </th>

                    <th className="px-5 py-4">
                      Book
                    </th>

                    <th className="px-5 py-4">
                      Request Date
                    </th>

                    <th className="px-5 py-4 text-right">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {approvedRequests.map((request) => (

                    <tr
                      key={request._id}
                      className="
                        group
                        border-t
                        border-slate-100
                        transition-all
                        duration-300
                        hover:bg-blue-50/30
                      "
                    >

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
                              bg-blue-50
                              font-black
                              text-blue-600
                              ring-4
                              ring-blue-50
                              transition-all
                              duration-300
                              group-hover:scale-110
                              group-hover:bg-blue-600
                              group-hover:text-white
                            "
                          >
                            {request.student?.name
                              ?.charAt(0)
                              ?.toUpperCase() || "S"}
                          </div>

                          <div>

                            <p className="font-bold text-slate-800">
                              {request.student?.name ||
                                "Unknown Student"}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {request.student?.email || "-"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* BOOK */}

                      <td className="px-5 py-5">

                        <p className="font-bold text-slate-800 transition-colors group-hover:text-[#890C25]">
                          {request.book?.title ||
                            "Book unavailable"}
                        </p>

                        {request.book?.author && (
                          <p className="mt-1 text-xs text-slate-400">
                            {request.book.author}
                          </p>
                        )}

                      </td>

                      {/* DATE */}

                      <td className="px-5 py-5 text-sm font-medium text-slate-600">
                        {formatDate(request.createdAt)}
                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-5">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              navigate(
                                `/requests/view/${request._id}`,
                                {
                                  state: {
                                    request,
                                    from: "manage",
                                  },
                                }
                              )
                            }
                            className="
                              rounded-xl
                              border
                              border-slate-200
                              bg-white
                              px-4
                              py-2.5
                              text-sm
                              font-bold
                              text-slate-600
                              shadow-sm
                              transition-all
                              duration-300
                              hover:-translate-y-0.5
                              hover:border-purple-200
                              hover:bg-purple-50
                              hover:text-purple-700
                              hover:ring-4
                              hover:ring-purple-50
                            "
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              openIssueModal(request)
                            }
                            className="
                              rounded-xl
                              bg-[#890C25]
                              px-4
                              py-2.5
                              text-sm
                              font-bold
                              text-white
                              shadow-md
                              shadow-red-200
                              transition-all
                              duration-300
                              hover:-translate-y-0.5
                              hover:bg-[#65081b]
                              hover:shadow-lg
                              hover:ring-4
                              hover:ring-red-50
                            "
                          >
                            Issue Book
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* ==========================================
            ISSUED BOOKS CARD
        ========================================== */}

        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-[0_15px_35px_rgba(15,23,42,0.07)]
            transition-all
            duration-300
            hover:border-purple-200
            hover:shadow-xl
          "
        >

          <div className="h-1.5 w-full bg-gradient-to-r from-[#890C25] via-purple-500 to-cyan-500" />

          <div className="relative border-b border-slate-100 bg-gradient-to-r from-purple-50/50 via-white to-white px-5 py-6 sm:px-7">

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border-8 border-cyan-100/50" />

            <div className="relative">

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-600">
                Issue History
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-800">
                Issued Books
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                All currently issued and returned books.
              </p>

            </div>

          </div>

          {issueLoading && issues.length === 0 ? (

            <div className="py-14 text-center text-sm text-slate-500">
              Loading issued books...
            </div>

          ) : issues.length === 0 ? (

            <div className="px-5 py-16 text-center">

              <div
                className="
                  mx-auto
                  mb-5
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-purple-50
                  text-2xl
                  ring-8
                  ring-purple-50
                "
              >
                📚
              </div>

              <h3 className="text-lg font-black text-slate-700">
                No Books Issued Yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                Issued book records will appear here.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead>

                  <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-400">

                    <th className="px-5 py-4">
                      Student
                    </th>

                    <th className="px-5 py-4">
                      Book
                    </th>

                    <th className="px-5 py-4">
                      Issue Date
                    </th>

                    <th className="px-5 py-4">
                      Due Date
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {issues.map((issue) => (

                    <tr
                      key={issue._id}
                      className="
                        group
                        border-t
                        border-slate-100
                        transition-all
                        duration-300
                        hover:bg-purple-50/30
                      "
                    >

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
                              bg-indigo-50
                              font-black
                              text-indigo-600
                              ring-4
                              ring-indigo-50
                              transition-all
                              duration-300
                              group-hover:scale-110
                              group-hover:bg-indigo-600
                              group-hover:text-white
                            "
                          >
                            {issue.student?.name
                              ?.charAt(0)
                              ?.toUpperCase() || "S"}
                          </div>

                          <div>

                            <p className="font-bold text-slate-800">
                              {issue.student?.name ||
                                "Unknown Student"}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {issue.student?.email || "-"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* BOOK */}

                      <td className="px-5 py-5">

                        <p className="font-bold text-slate-800 transition-colors group-hover:text-[#890C25]">
                          {issue.book?.title ||
                            "Book unavailable"}
                        </p>

                        {issue.book?.author && (
                          <p className="mt-1 text-xs text-slate-400">
                            {issue.book.author}
                          </p>
                        )}

                      </td>

                      {/* ISSUE DATE */}

                      <td className="px-5 py-5 text-sm font-medium text-slate-600">
                        {formatDate(issue.issueDate)}
                      </td>

                      {/* DUE DATE */}

                      <td className="px-5 py-5 text-sm font-bold text-slate-700">
                        {formatDate(issue.dueDate)}
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
                            font-bold
                            ring-4
                            ${getStatusClass(issue.status)}
                          `}
                        >

                          <span
                            className={`
                              h-2
                              w-2
                              rounded-full
                              ${
                                issue.status === "Issued"
                                  ? "bg-green-500"
                                  : issue.status === "Returned"
                                  ? "bg-purple-500"
                                  : "bg-yellow-500"
                              }
                            `}
                          />

                          {issue.status}

                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-5 text-right">

                        <button
                          onClick={() =>
                            navigate(
                              `/issues/view/${issue._id}`,
                              {
                                state: {
                                  issue,
                                },
                              }
                            )
                          }
                          className="
                            rounded-xl
                            border
                            border-purple-200
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            font-bold
                            text-purple-600
                            shadow-sm
                            transition-all
                            duration-300
                            hover:-translate-y-0.5
                            hover:bg-purple-600
                            hover:text-white
                            hover:shadow-lg
                            hover:ring-4
                            hover:ring-purple-50
                          "
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* ==========================================
          ISSUE MODAL
      ========================================== */}

      {showModal && selectedRequest && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-950/55
            p-4
            backdrop-blur-sm
          "
        >

          <div
            className="
              relative
              max-h-[90vh]
              w-full
              max-w-lg
              overflow-y-auto
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-2xl
            "
          >

            {/* TOP LINE */}

            <div className="h-1.5 w-full bg-gradient-to-r from-[#890C25] via-purple-500 to-blue-500" />

            {/* DECORATIVE RINGS */}

            <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full border-[18px] border-purple-100/70" />

            <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full border-[14px] border-green-100/60" />

            {/* HEADER */}

            <div className="relative border-b border-slate-100 px-6 py-6">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-blue-50
                      text-2xl
                      ring-8
                      ring-blue-50
                    "
                  >
                    📖
                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#890C25]">
                      Issue Book
                    </p>

                    <h2 className="mt-1 text-xl font-black text-slate-800">
                      Confirm Book Issue
                    </h2>

                  </div>

                </div>

                <button
                  onClick={closeIssueModal}
                  disabled={actionLoading}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    text-xl
                    text-slate-400
                    transition-all
                    hover:bg-red-50
                    hover:text-red-600
                    hover:ring-4
                    hover:ring-red-50
                    disabled:opacity-50
                  "
                >
                  ×
                </button>

              </div>

            </div>

            {/* BODY */}

            <div className="relative space-y-5 p-6">

              {/* STUDENT */}

              <div
                className="
                  group
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-4
                  transition-all
                  duration-300
                  hover:border-blue-200
                  hover:bg-blue-50/40
                  hover:ring-4
                  hover:ring-blue-50
                "
              >

                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-500">
                  Student
                </p>

                <p className="font-black text-slate-800">
                  {selectedRequest.student?.name ||
                    "Unknown Student"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedRequest.student?.email || "-"}
                </p>

              </div>

              {/* BOOK */}

              <div
                className="
                  group
                  rounded-2xl
                  border
                  border-purple-100
                  bg-purple-50/40
                  p-4
                  transition-all
                  duration-300
                  hover:border-purple-300
                  hover:ring-4
                  hover:ring-purple-50
                "
              >

                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-500">
                  Book
                </p>

                <p className="font-black text-slate-800">
                  {selectedRequest.book?.title ||
                    "Book unavailable"}
                </p>

                {selectedRequest.book?.author && (
                  <p className="mt-1 text-sm text-slate-500">
                    Author:{" "}
                    <span className="font-bold text-slate-700">
                      {selectedRequest.book.author}
                    </span>
                  </p>
                )}

              </div>

              {/* ISSUE DATE */}

              <div
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-4
                  shadow-sm
                "
              >

                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Issue Date
                </p>

                <p className="font-bold text-slate-800">
                  {new Date().toLocaleDateString()}
                </p>

              </div>

              {/* DUE DATE */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Due Date
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(e.target.value)
                  }
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  disabled={actionLoading}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-slate-700
                    outline-none
                    transition-all
                    duration-300
                    focus:border-[#890C25]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#890C25]/10
                    disabled:bg-slate-100
                  "
                />

              </div>

              {/* ERROR */}

              {actionError && (

                <div
                  className="
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-red-700
                    ring-4
                    ring-red-50
                  "
                >
                  {actionError}
                </div>

              )}

            </div>

            {/* FOOTER */}

            <div
              className="
                flex
                flex-col-reverse
                gap-3
                border-t
                border-slate-100
                bg-slate-50/70
                px-6
                py-5
                sm:flex-row
                sm:justify-end
              "
            >

              <button
                onClick={closeIssueModal}
                disabled={actionLoading}
                className="
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-slate-600
                  transition-all
                  duration-300
                  hover:bg-slate-100
                  hover:ring-4
                  hover:ring-slate-100
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                onClick={handleIssueBook}
                disabled={actionLoading}
                className="
                  rounded-xl
                  bg-[#890C25]
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_8px_20px_rgba(137,12,37,0.25)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#65081b]
                  hover:shadow-lg
                  hover:ring-4
                  hover:ring-red-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {actionLoading
                  ? "Issuing..."
                  : "Confirm Issue"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default IssueBooks;

