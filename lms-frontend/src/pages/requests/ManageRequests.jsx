import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaClipboardList,
  FaEye,
  FaCheck,
  FaTimes,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaSearch,
} from "react-icons/fa";
import { useRequests } from "../../context/RequestContext";

// =====================================================
// MANAGE BOOK REQUESTS
// =====================================================

const ManageRequests = () => {
  const navigate = useNavigate();

  const {
    requests,
    loading,
    error,
    getAllRequests,
    approveRequest,
    rejectRequest,
  } = useRequests();

  const [rejectId, setRejectId] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // ==========================================
  // LOAD ALL REQUESTS
  // ==========================================

  useEffect(() => {
    getAllRequests();
  }, []);

  // ==========================================
  // APPROVE
  // ==========================================

  const handleApprove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this request?"
    );

    if (!confirmed) return;

    try {
      setActionError("");
      setActionLoading(true);

      await approveRequest(id);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // OPEN REJECT BOX
  // ==========================================

  const openReject = (id) => {
    setRejectId(id);
    setRemarks("");
    setActionError("");
  };

  // ==========================================
  // CANCEL REJECT
  // ==========================================

  const cancelReject = () => {
    setRejectId(null);
    setRemarks("");
  };

  // ==========================================
  // REJECT
  // ==========================================

  const handleReject = async () => {
    if (!rejectId) return;

    try {
      setActionError("");
      setActionLoading(true);

      await rejectRequest(rejectId, remarks);

      setRejectId(null);
      setRemarks("");
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    if (status === "Approved") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    if (status === "Rejected") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    return "border-yellow-200 bg-yellow-50 text-yellow-700";
  };

  // ==========================================
  // REQUEST COUNTS
  // ==========================================

  const totalRequests = requests?.length || 0;

  const pendingRequests =
    requests?.filter(
      (request) => request.status === "Pending"
    ).length || 0;

  const approvedRequests =
    requests?.filter(
      (request) => request.status === "Approved"
    ).length || 0;

  const rejectedRequests =
    requests?.filter(
      (request) => request.status === "Rejected"
    ).length || 0;

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
                  <FaClipboardList size={24} />
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
                Manage Book Requests
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
                Review, approve and manage student
                book requests from one place.
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
                  Request Management
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
                  {totalRequests} Total Requests
                </div>

              </div>
            </div>

            {/* TOTAL REQUESTS */}

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
                  <FaClipboardList size={24} />
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
                  {String(totalRequests).padStart(2, "0")}
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
                  {pendingRequests}
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

          {/* APPROVED */}

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
                  Approved Requests
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {approvedRequests}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Successfully approved
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

          {/* REJECTED */}

          <div
            className="
              group/stat
              relative
              overflow-hidden
              rounded-2xl
              border
              border-red-200
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
                bg-red-600
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
                    text-red-600
                  "
                >
                  Rejected Requests
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {rejectedRequests}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Requests rejected
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
                  bg-red-100
                  text-red-600
                "
              >
                <FaTimes size={19} />
              </div>

            </div>
          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {(error || actionError) && (
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
            {actionError || error}
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
                  All Book Requests
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review and manage submitted student requests.
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
            Showing {totalRequests}
          </div>

        </div>

        {/* =================================================
            REQUEST TABLE
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

          {loading && requests.length === 0 ? (

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
                Loading Requests
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Fetching book request records...
              </p>

            </div>

          ) : requests.length === 0 ? (

            <div className="relative overflow-hidden px-6 py-16 text-center">

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
                  No Book Requests Found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  There are currently no student book requests
                  available for review.
                </p>

              </div>
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1150px]">

                {/* TABLE HEADER */}

                <thead>

                  <tr
                    className="
                      border-b
                      border-slate-200
                      bg-slate-50/80
                      text-left
                    "
                  >

                    <th
                      className="
                        px-5
                        py-5
                        text-[11px]
                        font-black
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Student
                    </th>

                    <th
                      className="
                        px-5
                        py-5
                        text-[11px]
                        font-black
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Book
                    </th>

                    <th
                      className="
                        px-5
                        py-5
                        text-[11px]
                        font-black
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Issue Date
                    </th>

                    <th
                      className="
                        px-5
                        py-5
                        text-[11px]
                        font-black
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Return Date
                    </th>

                    <th
                      className="
                        px-5
                        py-5
                        text-[11px]
                        font-black
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Status
                    </th>

                    <th
                      className="
                        px-5
                        py-5
                        text-[11px]
                        font-black
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Actions
                    </th>

                  </tr>

                </thead>

                {/* TABLE BODY */}

                <tbody>

                  {requests.map((request) => (

                    <tr
                      key={request._id}
                      className="
                        group/row
                        relative
                        border-b
                        border-slate-100
                        transition-all
                        duration-300
                        last:border-0
                        hover:bg-slate-50/70
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
                              {request.student?.name ||
                                "Unknown Student"}
                            </div>

                            <div className="mt-1 text-xs font-medium text-slate-400">
                              {request.student?.email || "-"}
                            </div>

                          </div>

                        </div>

                      </td>

                      {/* BOOK */}

                      <td className="px-5 py-5">

                        <div className="flex items-center gap-3">

                          <div
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-blue-100
                              text-blue-600
                            "
                          >
                            <FaBookOpen size={15} />
                          </div>

                          <div>

                            <div className="font-black text-slate-800">
                              {request.book?.title ||
                                "Book unavailable"}
                            </div>

                            <div className="mt-1 text-xs font-medium text-slate-400">
                              Library Book
                            </div>

                          </div>

                        </div>

                      </td>

                      {/* ISSUE DATE */}

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
                              bg-blue-50
                              text-blue-600
                            "
                          >
                            <FaCalendarAlt size={13} />
                          </div>

                          <span className="text-sm font-bold text-slate-600">
                            {request.issueDate
                              ? new Date(
                                  request.issueDate
                                ).toLocaleDateString()
                              : "-"}
                          </span>

                        </div>

                      </td>

                      {/* RETURN DATE */}

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
                            {request.returnDate
                              ? new Date(
                                  request.returnDate
                                ).toLocaleDateString()
                              : "-"}
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
                            ${getStatusClass(request.status)}
                          `}
                        >

                          <span
                            className={`
                              h-1.5
                              w-1.5
                              rounded-full
                              ${
                                request.status === "Approved"
                                  ? "bg-green-600"
                                  : request.status === "Rejected"
                                  ? "bg-red-600"
                                  : "bg-yellow-500"
                              }
                            `}
                          />

                          {request.status}

                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-5">

                        <div className="flex flex-wrap gap-2">

                          {/* VIEW */}

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
                              group/view
                              flex
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              border
                              border-slate-200
                              bg-white
                              px-3
                              py-2.5
                              text-xs
                              font-black
                              text-slate-600
                              transition-all
                              duration-300
                              hover:border-[#890C25]/20
                              hover:bg-[#890C25]
                              hover:text-white
                              hover:shadow-md
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
                          </button>

                          {/* APPROVE */}

                          {request.status === "Pending" && (

                            <button
                              onClick={() =>
                                handleApprove(
                                  request._id
                                )
                              }
                              disabled={actionLoading}
                              className="
                                group/approve
                                flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-green-600
                                px-3
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

                              Approve
                            </button>

                          )}

                          {/* REJECT */}

                          {request.status === "Pending" && (

                            <button
                              onClick={() =>
                                openReject(
                                  request._id
                                )
                              }
                              disabled={actionLoading}
                              className="
                                group/reject
                                flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-red-600
                                px-3
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

                          )}

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* =================================================
            RESULT COUNT
        ================================================= */}

        {requests.length > 0 && (

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
              {requests.length}
            </span>{" "}

            book requests

          </div>

        )}

      </div>

      {/* =================================================
          REJECT MODAL
      ================================================= */}

      {rejectId && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-950/60
            p-4
            backdrop-blur-sm
          "
        >

          <div
            className="
              relative
              w-full
              max-w-md
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-2xl
            "
          >

            {/* MODAL TOP LINE */}

            <div
              className="
                absolute
                left-0
                right-0
                top-0
                h-1.5
                bg-gradient-to-r
                from-[#65091c]
                via-[#890C25]
                to-[#D58A98]
              "
            />

            {/* DECORATION */}

            <div
              className="
                pointer-events-none
                absolute
                -right-12
                -top-12
                h-32
                w-32
                rounded-full
                bg-red-500/5
              "
            />

            <div className="relative p-6 sm:p-7">

              {/* MODAL HEADER */}

              <div className="flex items-start gap-4">

                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-red-100
                    text-red-600
                    shadow-sm
                  "
                >
                  <FaTimes size={22} />
                </div>

                <div>

                  <h2
                    className="
                      text-xl
                      font-black
                      text-slate-800
                    "
                  >
                    Reject Book Request
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    You can add a reason for rejecting
                    this request.
                  </p>

                </div>

              </div>

              {/* TEXTAREA */}

              <div className="mt-6">

                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-black
                    uppercase
                    tracking-wider
                    text-slate-600
                  "
                >
                  Remarks
                </label>

                <textarea
                  value={remarks}
                  onChange={(e) =>
                    setRemarks(e.target.value)
                  }
                  rows="4"
                  placeholder="Enter remarks..."
                  className="
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                    text-sm
                    font-medium
                    text-slate-700
                    outline-none
                    transition
                    focus:border-red-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-red-100
                  "
                />

              </div>

              {/* BUTTONS */}

              <div className="mt-6 flex justify-end gap-3">

                <button
                  onClick={cancelReject}
                  disabled={actionLoading}
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-100
                    px-5
                    py-3
                    text-sm
                    font-black
                    text-slate-600
                    transition-all
                    duration-300
                    hover:bg-slate-200
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-red-600
                    px-5
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
                    disabled:opacity-50
                  "
                >

                  {actionLoading ? (

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

                    <FaTimes size={12} />

                  )}

                  {actionLoading
                    ? "Rejecting..."
                    : "Confirm Reject"}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default ManageRequests;