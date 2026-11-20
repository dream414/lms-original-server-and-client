
import { useLocation, useNavigate } from "react-router-dom";

const ViewRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const request = location.state?.request;
  const from = location.state?.from;

  // ==========================================
  // REQUEST NOT FOUND
  // ==========================================

  if (!request) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-100 mt-5 px-4 pb-10 pt-8 sm:px-6 lg:px-8">

        {/* BACKGROUND CIRCLES */}

        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border-[35px] border-purple-100/60 blur-sm" />

        <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full border-[30px] border-green-100/60 blur-sm" />

        <div className="pointer-events-none absolute bottom-10 right-10 h-56 w-56 rounded-full border-[25px] border-cyan-100/60 blur-sm" />

        <div className="relative mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">

          <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_15px_35px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl">

            {/* TOP LINE */}

            <div className="h-1.5 w-full bg-gradient-to-r from-[#890C25] via-purple-500 to-cyan-500" />

            {/* DECORATIVE RINGS */}

            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full border-[10px] border-purple-100/60" />

            <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full border-8 border-green-100/60" />

            <div className="relative p-10 text-center">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600 ring-8 ring-blue-50 transition-all duration-300 hover:scale-110">
                !
              </div>

              <h1 className="mb-3 text-2xl font-bold text-slate-800">
                Request Not Found
              </h1>

              <p className="mb-6 text-sm text-slate-500">
                Request details are not available.
              </p>

              <button
                onClick={() =>
                  navigate(
                    from === "manage"
                      ? "/requests/manage"
                      : "/requests"
                  )
                }
                className="rounded-xl bg-[#890C25] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-red-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#65081b] hover:shadow-lg hover:ring-4 hover:ring-red-50"
              >
                Go Back
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // STATUS
  // ==========================================

  const getStatusClass = (status) => {
    if (status === "Approved") {
      return "border-green-200 bg-green-50 text-green-700 ring-green-100";
    }

    if (status === "Rejected") {
      return "border-red-200 bg-red-50 text-red-700 ring-red-100";
    }

    return "border-yellow-200 bg-yellow-50 text-yellow-700 ring-yellow-100";
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    return date
      ? new Date(date).toLocaleDateString()
      : "-";
  };

  const formatDateTime = (date) => {
    return date
      ? new Date(date).toLocaleString()
      : "-";
  };

  // ==========================================
  // DETAIL CARD
  // ==========================================

  const detailCard =
    "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 " +
    "transition-all duration-300 ease-out " +
    "hover:-translate-y-1 hover:border-purple-300 " +
    "hover:shadow-xl hover:shadow-purple-100/50 " +
    "hover:ring-4 hover:ring-purple-50";

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 mt-5 px-4 pb-10 pt-8 sm:px-6 lg:px-8">

      {/* ==========================================
          LMS BACKGROUND CIRCLES
      ========================================== */}

      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border-[35px] border-purple-100/60 blur-sm" />

      <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full border-[30px] border-green-100/60 blur-sm" />

      <div className="pointer-events-none absolute bottom-10 right-10 h-56 w-56 rounded-full border-[25px] border-cyan-100/60 blur-sm" />

      <div className="relative mx-auto max-w-5xl">

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

          {/* HEADER CIRCLES */}

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
                View Request
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-white/65">
                Complete book request details and request information.
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
              📖
            </div>

          </div>

        </div>

        {/* ==========================================
            MAIN CARD
        ========================================== */}

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_15px_35px_rgba(15,23,42,0.07)] transition-all duration-300 hover:border-purple-200 hover:shadow-xl">

          {/* TOP LINE */}

          <div className="h-1.5 w-full bg-gradient-to-r from-[#890C25] via-purple-500 to-cyan-500" />

          {/* ==========================================
              SUMMARY
          ========================================== */}

          <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-r from-purple-50/50 via-white to-white px-5 py-6 sm:px-7">

            {/* SUMMARY CIRCLES */}

            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full border-8 border-cyan-100/50" />

            <div className="pointer-events-none absolute -left-10 -bottom-10 h-28 w-28 rounded-full border-[10px] border-purple-100/40" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#890C25]">
                  Request Information
                </p>

                <p className="mt-1 break-all text-sm font-medium text-slate-600">
                  ID: {request._id}
                </p>

              </div>

              <span
                className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ring-4 ${getStatusClass(
                  request.status
                )}`}
              >

                <span
                  className={`h-2 w-2 rounded-full ${
                    request.status === "Approved"
                      ? "bg-green-500"
                      : request.status === "Rejected"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                />

                {request.status}

              </span>

            </div>

          </div>

          {/* ==========================================
              REQUEST DETAILS
          ========================================== */}

          <div className="relative bg-gradient-to-b from-white via-white to-purple-50/20 p-5 sm:p-7">

            {/* INNER CIRCLES */}

            <div className="pointer-events-none absolute -left-14 top-20 h-40 w-40 rounded-full border-[18px] border-blue-100/30 blur-sm" />

            <div className="pointer-events-none absolute -right-14 bottom-20 h-44 w-44 rounded-full border-[18px] border-cyan-100/30 blur-sm" />

            <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* REQUEST ID */}

              <div className={detailCard}>

                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full border-8 border-blue-100/40 transition-transform duration-500 group-hover:scale-125" />

                <div className="relative">

                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover:text-purple-500">
                    Request ID
                  </p>

                  <p className="break-all text-sm font-semibold text-slate-800">
                    {request._id}
                  </p>

                </div>

              </div>

              {/* STATUS */}

              <div className={detailCard}>

                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full border-8 border-green-100/40 transition-transform duration-500 group-hover:scale-125" />

                <div className="relative">

                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover:text-purple-500">
                    Status
                  </p>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ring-4 ${getStatusClass(
                      request.status
                    )}`}
                  >

                    <span
                      className={`h-2 w-2 rounded-full ${
                        request.status === "Approved"
                          ? "bg-green-500"
                          : request.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    />

                    {request.status}

                  </span>

                </div>

              </div>

              {/* STUDENT */}

              <div className={detailCard}>

                <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full border-8 border-purple-100/40" />

                <div className="relative">

                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover:text-purple-500">
                    Student
                  </p>

                  <p className="font-semibold text-slate-800">
                    {request.student?.name || "Unknown Student"}
                  </p>

                </div>

              </div>

              {/* EMAIL */}

              <div className={detailCard}>

                <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full border-8 border-cyan-100/40" />

                <div className="relative">

                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover:text-purple-500">
                    Student Email
                  </p>

                  <p className="break-all font-semibold text-slate-800">
                    {request.student?.email || "-"}
                  </p>

                </div>

              </div>

              {/* BOOK */}

              <div className="md:col-span-2">

                <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50/70 via-white to-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/50 hover:ring-4 hover:ring-purple-50">

                  {/* BOOK CIRCLES */}

                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full border-8 border-cyan-100/50 transition-all duration-500 group-hover:scale-125" />

                  <div className="pointer-events-none absolute -bottom-8 right-24 h-20 w-20 rounded-full border-8 border-blue-100/40" />

                  {/* LEFT ACCENT */}

                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#890C25] via-purple-500 to-cyan-400" />

                  <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-500">
                        Book Information
                      </p>

                      <p className="text-xl font-bold text-slate-800 transition-colors group-hover:text-[#890C25]">
                        {request.book?.title || "Book unavailable"}
                      </p>

                      {request.book?.author && (
                        <p className="mt-1 text-sm text-slate-500">
                          Author:{" "}
                          <span className="font-semibold text-slate-700">
                            {request.book.author}
                          </span>
                        </p>
                      )}

                    </div>

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-md ring-1 ring-purple-100 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:ring-4 group-hover:ring-purple-100">
                      📚
                    </div>

                  </div>

                </div>

              </div>

              {/* ISSUE DATE */}

              <div className={detailCard}>

                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full border-8 border-green-100/40" />

                <div className="relative">

                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover:text-purple-500">
                    Issue Date
                  </p>

                  <p className="font-semibold text-slate-800">
                    {formatDate(request.issueDate)}
                  </p>

                </div>

              </div>

              {/* RETURN DATE */}

              <div className={detailCard}>

                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full border-8 border-cyan-100/40" />

                <div className="relative">

                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover:text-purple-500">
                    Return Date
                  </p>

                  <p className="font-semibold text-slate-800">
                    {formatDate(request.returnDate)}
                  </p>

                </div>

              </div>

              {/* REMARKS */}

              <div className="md:col-span-2">

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-purple-50/30 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/40 hover:ring-4 hover:ring-purple-50">

                  {/* REMARKS CIRCLES */}

                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full border-8 border-purple-100/50 transition-all duration-500 group-hover:scale-125" />

                  <div className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full border-8 border-cyan-100/40" />

                  <p className="relative mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover:text-purple-500">
                    Remarks
                  </p>

                  <div className="relative rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm transition-all duration-300 group-hover:border-purple-200 group-hover:shadow-md">
                    {request.remarks || "No remarks"}
                  </div>

                </div>

              </div>

              {/* CREATED DATE */}

              <div className={detailCard}>

                <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full border-8 border-blue-100/40" />

                <div className="relative">

                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover:text-purple-500">
                    Request Created
                  </p>

                  <p className="font-semibold text-slate-800">
                    {formatDateTime(request.createdAt)}
                  </p>

                </div>

              </div>

              {/* UPDATED DATE */}

              <div className={detailCard}>

                <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full border-8 border-green-100/40" />

                <div className="relative">

                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover:text-purple-500">
                    Last Updated
                  </p>

                  <p className="font-semibold text-slate-800">
                    {formatDateTime(request.updatedAt)}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ==========================================
              FOOTER
          ========================================== */}

          <div className="relative overflow-hidden border-t border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-7">

            {/* FOOTER CIRCLES */}

            <div className="pointer-events-none absolute -bottom-16 -left-10 h-32 w-32 rounded-full border-[14px] border-blue-100/40" />

            <div className="pointer-events-none absolute -right-8 -top-12 h-28 w-28 rounded-full border-[12px] border-purple-100/40" />

            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm font-bold text-slate-700">
                  Book Request Details
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Review all information before taking action.
                </p>

              </div>

              <button
                onClick={() =>
                  navigate(
                    from === "manage"
                      ? "/requests/manage"
                      : "/requests"
                  )
                }
                className="group relative z-10 inline-flex items-center justify-center gap-2 rounded-xl bg-[#890C25] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-red-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#65081b] hover:shadow-lg hover:ring-4 hover:ring-red-50"
              >

                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>

                Back to Requests

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ViewRequest;

