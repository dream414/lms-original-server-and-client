
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBookOpen,
  FaBook,
  FaCalendarAlt,
  FaClipboardList,
  FaEye,
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaFileAlt,
} from "react-icons/fa";

import { useBooks } from "../../context/BookContext";
import { useRequests } from "../../context/RequestContext";

// =====================================================
// BOOK REQUEST
// =====================================================

const BookRequest = () => {
  const navigate = useNavigate();

  const { books, fetchBooks } = useBooks();

  const {
    myRequests,
    loading,
    error,
    createRequest,
    getMyRequests,
  } = useRequests();

  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] = useState({
    book: "",
    issueDate: "",
    returnDate: "",
  });

  const [success, setSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [search, setSearch] = useState("");

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
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchBooks();
    getMyRequests();
  }, []);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT REQUEST
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setSubmitError("");

    if (!form.book) {
      setSubmitError("Please select a book.");
      return;
    }

    if (!form.issueDate || !form.returnDate) {
      setSubmitError(
        "Please select issue date and return date."
      );
      return;
    }

    if (
      new Date(form.returnDate) <=
      new Date(form.issueDate)
    ) {
      setSubmitError(
        "Return date must be after issue date."
      );
      return;
    }

    try {
      await createRequest(form);

      setSuccess(
        "Book request submitted successfully."
      );

      setForm({
        book: "",
        issueDate: "",
        returnDate: "",
      });

      await getMyRequests();
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit book request."
      );
    }
  };

  // =====================================================
  // SEARCH REQUESTS
  // =====================================================

  const filteredRequests = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return Array.isArray(myRequests)
        ? myRequests
        : [];
    }

    return (Array.isArray(myRequests)
      ? myRequests
      : []
    ).filter((request) => {
      return (
        request?.book?.title
          ?.toString()
          ?.toLowerCase()
          ?.includes(value) ||
        request?.status
          ?.toString()
          ?.toLowerCase()
          ?.includes(value) ||
        request?.remarks
          ?.toString()
          ?.toLowerCase()
          ?.includes(value)
      );
    });
  }, [myRequests, search]);

  // =====================================================
  // STATUS
  // =====================================================

  const getStatusConfig = (status) => {
    if (status === "Approved") {
      return {
        label: "Approved",
        className:
          "border-green-200 bg-green-50 text-green-700",
        icon: <FaCheckCircle size={11} />,
      };
    }

    if (status === "Rejected") {
      return {
        label: "Rejected",
        className:
          "border-red-200 bg-red-50 text-red-700",
        icon: <FaTimesCircle size={11} />,
      };
    }

    return {
      label: status || "Pending",
      className:
        "border-yellow-200 bg-yellow-50 text-yellow-700",
      icon: <FaClock size={11} />,
    };
  };

  // =====================================================
  // COUNTS
  // =====================================================

  const requestList = Array.isArray(myRequests)
    ? myRequests
    : [];

  const approvedCount = requestList.filter(
    (request) => request.status === "Approved"
  ).length;

  const pendingCount = requestList.filter(
    (request) =>
      request.status !== "Approved" &&
      request.status !== "Rejected"
  ).length;

  const rejectedCount = requestList.filter(
    (request) => request.status === "Rejected"
  ).length;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && requestList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#890C25]/10 bg-white shadow-2xl">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#890C25]/20 border-t-[#890C25]" />
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-800">
                Loading Requests
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Fetching your book requests...
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
    <div className="min-h-screen bg-slate-100 px-4 pb-12 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HERO
        ================================================= */}

        <div className="group/hero relative mb-6 overflow-hidden rounded-3xl bg-[#890C25] shadow-2xl">

          {/* Decorative Circles */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/20 bg-white/5 transition duration-500 group-hover/hero:scale-110" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full border border-white/10 bg-white/5" />

          <div className="pointer-events-none absolute right-24 top-20 h-20 w-20 rounded-full bg-[#D58A98]/10 blur-2xl" />

          <div className="relative flex flex-col gap-7 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}

            <div>
              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-md">
                  <FaClipboardList size={24} />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D58A98]">
                    Library Management
                  </p>

                  <p className="mt-1 text-xs text-white/55">
                    Learning Management System
                  </p>
                </div>

              </div>

              <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                Book Requests
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                Request books from the library and track
                the approval status of your requests.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">

                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white/85 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  My Requests
                </div>

                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white/85 backdrop-blur-md">
                  {requestList.length} Requests
                </div>

              </div>
            </div>

            {/* TOTAL REQUESTS */}

            <div className="group/total relative w-full overflow-hidden rounded-3xl border border-blue-300/30 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-6 text-center shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-blue-900/40 lg:w-56">

              <div className="pointer-events-none absolute -bottom-14 -right-14 h-40 w-40 rounded-full border-2 border-blue-200/25 bg-blue-400/10 transition duration-500 group-hover/total:scale-125" />

              <div className="relative">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-lg">
                  <FaBook size={24} />
                </div>

                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-blue-100/70">
                  Total Requests
                </p>

                <p className="mt-1 text-5xl font-black leading-none text-white">
                  {String(requestList.length).padStart(2, "0")}
                </p>

                <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-white/60 transition-all duration-500 group-hover/total:w-20" />

              </div>
            </div>

          </div>
        </div>

        {/* =================================================
            REQUEST FORM
        ================================================= */}

        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">

          {/* Form Header */}

          <div className="border-b border-slate-100 bg-gradient-to-r from-white via-slate-50 to-blue-50/40 px-6 py-5 sm:px-8">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#890C25] text-white shadow-md">
                <FaBookOpen size={18} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-800">
                  Request a Book
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select a book and choose your issue and return dates.
                </p>
              </div>

            </div>
          </div>

          <div className="p-6 sm:p-8">

            {/* SUCCESS */}

            {success && (
              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
                <FaCheckCircle />
                {success}
              </div>
            )}

            {/* ERROR */}

            {(submitError || error) && (
              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                <FaTimesCircle />
                {submitError || error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-5 md:grid-cols-3"
            >

              {/* BOOK */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
                  <FaBook size={11} className="text-[#890C25]" />
                  Select Book
                </label>

                <select
                  name="book"
                  value={form.book}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#890C25] focus:bg-white focus:ring-4 focus:ring-[#890C25]/10"
                >
                  <option value="">
                    Select a book
                  </option>

                  {booksList.map((book) => (
                    <option
                      key={book._id}
                      value={book._id}
                      disabled={
                        Number(book.availableCopies) <= 0
                      }
                    >
                      {book.title}

                      {Number(book.availableCopies) <= 0
                        ? " (Out of Stock)"
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* ISSUE DATE */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
                  <FaCalendarAlt
                    size={11}
                    className="text-blue-600"
                  />
                  Issue Date
                </label>

                <input
                  type="date"
                  name="issueDate"
                  value={form.issueDate}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* RETURN DATE */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
                  <FaCalendarAlt
                    size={11}
                    className="text-green-600"
                  />
                  Return Date
                </label>

                <input
                  type="date"
                  name="returnDate"
                  value={form.returnDate}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                />
              </div>

              {/* BUTTON */}

              <div className="md:col-span-3">

                <button
                  type="submit"
                  disabled={loading}
                  className="group/submit relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#890C25] px-7 py-4 text-sm font-black text-white shadow-lg shadow-[#890C25]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#6f091e] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/5 transition duration-500 group-hover/submit:scale-125" />

                  <FaClipboardList size={14} />

                  {loading
                    ? "Submitting Request..."
                    : "Submit Book Request"}
                </button>

              </div>

            </form>
          </div>
        </div>

        {/* =================================================
            REQUEST STATS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* PENDING */}

          <div className="group relative overflow-hidden rounded-2xl border border-yellow-200 bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-yellow-500/10 transition duration-500 group-hover:scale-125" />

            <div className="relative flex items-center justify-between">

              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-yellow-600">
                  Pending
                </p>

                <p className="mt-1 text-3xl font-black text-slate-800">
                  {pendingCount}
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Awaiting approval
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                <FaClock size={18} />
              </div>

            </div>
          </div>

          {/* APPROVED */}

          <div className="group relative overflow-hidden rounded-2xl border border-green-200 bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-green-500/10 transition duration-500 group-hover:scale-125" />

            <div className="relative flex items-center justify-between">

              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-green-600">
                  Approved
                </p>

                <p className="mt-1 text-3xl font-black text-slate-800">
                  {approvedCount}
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Requests approved
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <FaCheckCircle size={18} />
              </div>

            </div>
          </div>

          {/* REJECTED */}

          <div className="group relative overflow-hidden rounded-2xl border border-red-200 bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-red-500/10 transition duration-500 group-hover:scale-125" />

            <div className="relative flex items-center justify-between">

              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-red-600">
                  Rejected
                </p>

                <p className="mt-1 text-3xl font-black text-slate-800">
                  {rejectedCount}
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Requests rejected
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <FaTimesCircle size={18} />
              </div>

            </div>
          </div>

        </div>

        {/* =================================================
            MY REQUESTS HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <div className="h-10 w-1.5 rounded-full bg-[#890C25]" />

              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-800">
                  My Requests
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Browse and track your submitted book requests.
                </p>
              </div>

            </div>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-[#890C25]/10 bg-white px-5 py-2.5 text-xs font-black text-[#890C25] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#890C25]" />
            Showing {filteredRequests.length}
          </div>

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        {requestList.length > 0 && (
          <div className="group/search relative mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition duration-300 hover:border-[#890C25]/20 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1.5 w-20 rounded-br-full bg-[#890C25] transition-all duration-500 group-hover/search:w-full" />

            <div className="relative flex items-center">

              <FaSearch
                className="absolute left-5 text-[#890C25]"
                size={15}
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by book title, status or remarks..."
                className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-5 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              />

            </div>
          </div>
        )}

        {/* =================================================
            REQUEST TABLE
        ================================================= */}

        {filteredRequests.length === 0 ? (

          <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-[#890C25]/20 bg-white px-6 py-16 text-center shadow-xl">

            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#890C25]/5" />

            <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-blue-500/5" />

            <div className="relative">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#890C25]/10 text-[#890C25]">
                <FaClipboardList size={27} />
              </div>

              <h3 className="mt-6 text-xl font-black text-slate-800">
                No Requests Found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search
                  ? "Try searching with another book title, status or remark."
                  : "You have not submitted any book requests yet."}
              </p>

            </div>
          </div>

        ) : (

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px]">

                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-black uppercase tracking-wider text-slate-500">

                    <th className="px-5 py-4">
                      Book
                    </th>

                    <th className="px-5 py-4">
                      Issue Date
                    </th>

                    <th className="px-5 py-4">
                      Return Date
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4">
                      Remarks
                    </th>

                    <th className="px-5 py-4 text-center">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredRequests.map((request) => {

                    const status =
                      getStatusConfig(
                        request.status
                      );

                    return (
                      <tr
                        key={request._id}
                        className="group border-b border-slate-100 transition hover:bg-slate-50/80 last:border-0"
                      >

                        {/* BOOK */}

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25] transition group-hover:bg-[#890C25] group-hover:text-white">
                              <FaBookOpen size={16} />
                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-black text-slate-800">
                                {request.book?.title ||
                                  "Book unavailable"}
                              </p>

                              <p className="mt-1 text-xs font-semibold text-slate-400">
                                Book Request
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* ISSUE DATE */}

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                            <FaCalendarAlt
                              size={12}
                              className="text-blue-500"
                            />

                            {request.issueDate
                              ? new Date(
                                  request.issueDate
                                ).toLocaleDateString()
                              : "-"}
                          </div>

                        </td>

                        {/* RETURN DATE */}

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                            <FaCalendarAlt
                              size={12}
                              className="text-green-500"
                            />

                            {request.returnDate
                              ? new Date(
                                  request.returnDate
                                ).toLocaleDateString()
                              : "-"}
                          </div>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-5">

                          <span
                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-black ${status.className}`}
                          >
                            {status.icon}
                            {status.label}
                          </span>

                        </td>

                        {/* REMARKS */}

                        <td className="max-w-[220px] px-5 py-5">

                          <div className="flex items-start gap-2 text-sm font-medium text-slate-500">

                            <FaFileAlt
                              size={11}
                              className="mt-1 shrink-0 text-slate-400"
                            />

                            <span className="line-clamp-2">
                              {request.remarks || "-"}
                            </span>

                          </div>

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-5 text-center">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/requests/view/${request._id}`,
                                {
                                  state: {
                                    request,
                                    from: "student",
                                  },
                                }
                              )
                            }
                            className="group/view inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-600 shadow-sm transition-all duration-300 hover:border-[#890C25]/20 hover:bg-[#890C25] hover:text-white hover:shadow-md"
                          >
                            <FaEye
                              size={12}
                              className="transition group-hover/view:scale-110"
                            />

                            View
                          </button>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>
        )}

        {/* =================================================
            RESULT COUNT
        ================================================= */}

        {requestList.length > 0 && (
          <div className="mt-6 text-center text-xs font-semibold text-slate-400">

            Showing{" "}

            <span className="font-black text-[#890C25]">
              {filteredRequests.length}
            </span>{" "}

            of{" "}

            <span className="font-black text-slate-600">
              {requestList.length}
            </span>{" "}

            requests

          </div>
        )}

      </div>
    </div>
  );
};

export default BookRequest;

