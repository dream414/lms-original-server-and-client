
import { useLocation, useNavigate } from "react-router-dom";

// ==========================================
// VIEW ISSUED BOOK
// ==========================================

const ViewIssuedBook = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const issue = location.state?.issue;

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!issue) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-100 mt-5 px-4 pb-10 pt-8 sm:px-6 lg:px-8">

        {/* ==========================================
            BACKGROUND CIRCLES
        ========================================== */}

        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border-[35px] border-purple-100/60 blur-sm" />

        <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full border-[30px] border-green-100/60 blur-sm" />

        <div className="pointer-events-none absolute bottom-10 right-10 h-56 w-56 rounded-full border-[25px] border-cyan-100/60 blur-sm" />

        <div className="relative mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">

          <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-[0_15px_35px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">

            {/* Decorative Ring */}

            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full border-[10px] border-purple-100/60" />

            <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full border-8 border-green-100/60" />

            <div className="relative">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600 ring-8 ring-blue-50">
                !
              </div>

              <h1 className="mb-3 text-2xl font-bold text-slate-800">
                Issued Book Not Found
              </h1>

              <p className="mb-6 text-sm text-slate-500">
                Issued book details are not available.
              </p>

              <button
                onClick={() => navigate("/issues")}
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
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };

  // ==========================================
  // STATUS
  // ==========================================

  const getStatusClass = (status) => {
    if (status === "Issued") {
      return "border-green-200 bg-green-50 text-green-700 ring-green-100";
    }

    return "border-blue-200 bg-blue-50 text-blue-700 ring-blue-100";
  };

  // ==========================================
  // DETAIL CARD
  // ==========================================

  const detailCard =
    "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 hover:ring-4 hover:ring-blue-50";

  // ==========================================
  // MAIN
  // ==========================================

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

          {/* HEADER DECORATIVE CIRCLES */}

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
                  Issue Book
                </span>

              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Issued Book Details
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-white/65">
                Complete information about this issued book.
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
            MAIN CARD
        ========================================== */}

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_15px_35px_rgba(15,23,42,0.07)] transition-all duration-300 hover:border-purple-200 hover:shadow-xl">

          {/* TOP LINE */}

          <div className="h-1.5 w-full bg-gradient-to-r from-[#890C25] via-purple-500 to-cyan-500" />

          {/* ==========================================
              SUMMARY
          ========================================== */}

          <div className="relative border-b border-slate-100 bg-gradient-to-r from-purple-50/50 via-white to-white px-5 py-6 sm:px-7">

            {/* SUMMARY DECORATIVE RING */}

            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full border-8 border-cyan-100/50" />

            <div className="pointer-events-none absolute -left-10 -bottom-10 h-28 w-28 rounded-full border-[10px] border-purple-100/40" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl ring-8 ring-blue-50 transition-all duration-300 hover:scale-110">
                  📚
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-[#890C25]">
                    Book Issued To
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-800">
                    {issue.student?.name || "Unknown Student"}
                  </h2>

                </div>

              </div>

              <span
                className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ring-4 ${getStatusClass(
                  issue.status
                )}`}
              >

                <span
                  className={`h-2 w-2 rounded-full ${
                    issue.status === "Issued"
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }`}
                />

                {issue.status}

              </span>

            </div>

          </div>

          {/* ==========================================
              DETAILS
          ========================================== */}

          <div className="relative p-5 sm:p-7">

            {/* DECORATIVE RINGS */}

            <div className="pointer-events-none absolute -right-16 top-1/3 h-40 w-40 rounded-full border-[18px] border-purple-100/30" />

            <div className="pointer-events-none absolute -left-14 bottom-10 h-32 w-32 rounded-full border-[14px] border-green-100/30" />

            <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* ISSUE ID */}

              <div className={detailCard}>

                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full border-8 border-blue-100/40 transition-transform duration-500 group-hover:scale-125" />

                <div className="relative">

                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-500">
                    Issue ID
                  </p>

                  <p className="break-all text-sm font-semibold text-slate-800">
                    {issue._id}
                  </p>

                </div>

              </div>

              {/* STATUS */}

              <div className={detailCard}>

                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full border-8 border-green-100/40 transition-transform duration-500 group-hover:scale-125" />

                <div className="relative">

                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-500">
                    Status
                  </p>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ring-4 ${getStatusClass(
                      issue.status
                    )}`}
                  >

                    <span
                      className={`h-2 w-2 rounded-full ${
                        issue.status === "Issued"
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                    />

                    {issue.status}

                  </span>

                </div>

              </div>

              {/* STUDENT */}

              <div className={detailCard}>

                <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full border-8 border-purple-100/40" />

                <div className="relative">

                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-500">
                    Student
                  </p>

                  <p className="font-semibold text-slate-800">
                    {issue.student?.name || "Unknown Student"}
                  </p>

                </div>

              </div>

              {/* EMAIL */}

              <div className={detailCard}>

                <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full border-8 border-cyan-100/40" />

                <div className="relative">

                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-500">
                    Student Email
                  </p>

                  <p className="break-all font-semibold text-slate-800">
                    {issue.student?.email || "-"}
                  </p>

                </div>

              </div>

              {/* BOOK */}

              <div className="md:col-span-2">

                <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50/70 via-white to-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/50 hover:ring-4 hover:ring-purple-50">

                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#890C25] via-purple-500 to-cyan-400" />

                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border-[10px] border-cyan-100/40 transition-transform duration-500 group-hover:scale-125" />

                  <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-500">
                        Book Information
                      </p>

                      <p className="text-xl font-bold text-slate-800 transition-colors group-hover:text-[#890C25]">
                        {issue.book?.title || "Book unavailable"}
                      </p>

                      {issue.book?.author && (
                        <p className="mt-1 text-sm text-slate-500">
                          Author:{" "}
                          <span className="font-semibold text-slate-700">
                            {issue.book.author}
                          </span>
                        </p>
                      )}

                    </div>

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm ring-1 ring-purple-100 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:ring-4 group-hover:ring-purple-100">
                      📚
                    </div>

                  </div>

                </div>

              </div>

              {/* ISSUE DATE */}

              <div className={detailCard}>

                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-500">
                  Issue Date
                </p>

                <p className="font-semibold text-slate-800">
                  {formatDate(issue.issueDate)}
                </p>

              </div>

              {/* DUE DATE */}

              <div className={detailCard}>

                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-500">
                  Due Date
                </p>

                <p className="font-semibold text-slate-800">
                  {formatDate(issue.dueDate)}
                </p>

              </div>

              {/* REQUEST */}

              <div className={detailCard}>

                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-500">
                  Request ID
                </p>

                <p className="break-all text-sm font-semibold text-slate-800">
                  {issue.request?._id || issue.request || "-"}
                </p>

              </div>

              {/* CREATED */}

              <div className={detailCard}>

                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-500">
                  Record Created
                </p>

                <p className="font-semibold text-slate-800">
                  {formatDateTime(issue.createdAt)}
                </p>

              </div>

              {/* UPDATED */}

              <div className={detailCard}>

                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-500">
                  Last Updated
                </p>

                <p className="font-semibold text-slate-800">
                  {formatDateTime(issue.updatedAt)}
                </p>

              </div>

            </div>

          </div>

          {/* ==========================================
              FOOTER
          ========================================== */}

          <div className="relative flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

            {/* FOOTER RING */}

            <div className="pointer-events-none absolute -bottom-16 -right-10 h-32 w-32 rounded-full border-[14px] border-purple-100/40" />

            <div className="relative">

              <p className="text-sm font-bold text-slate-700">
                Issue Record
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                Complete details of the issued book.
              </p>

            </div>

            <button
              onClick={() => navigate("/issues")}
              className="group relative z-10 inline-flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white px-5 py-3 text-sm font-semibold text-purple-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-600 hover:text-white hover:shadow-lg hover:shadow-purple-200/50 hover:ring-4 hover:ring-purple-50"
            >

              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>

              Back to Issue Books

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ViewIssuedBook;

