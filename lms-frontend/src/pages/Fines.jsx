import { useEffect, useMemo, useState } from "react";
import {
  FaMoneyBillWave,
  FaSearch,
  FaBookOpen,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaFileInvoiceDollar,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { useFines } from "../context/FineContext";

// =====================================================
// FINES
// =====================================================

const Fines = () => {
  const { user } = useAuth();

  const {
    fines,
    myFines,
    loading,
    error,
    getAllFines,
    getMyFines,
    payFine,
    clearError,
  } = useFines();

  // =====================================================
  // STATE
  // =====================================================

  const [payingId, setPayingId] = useState(null);
  const [search, setSearch] = useState("");

  // =====================================================
  // BRAND COLORS
  // =====================================================

  const brandColor = "#890C25";
  const brandLight = "#D58A98";

  // =====================================================
  // ROLE NORMALIZATION
  // =====================================================

  const normalizeRole = (role) => {
    if (!role) return "";

    return role
      .toString()
      .trim()
      .toLowerCase()
      .replace(/_/g, "-")
      .replace(/\s+/g, "-");
  };

  const currentRole = normalizeRole(user?.role);

  // =====================================================
  // ROLE CHECK
  // =====================================================

  const isStudent = currentRole === "student";

  const canManageFines = [
    "superadmin",
    "admin",
    "accountant",
    "account",
    "account-1",
    "librarian",
    "library",
  ].includes(currentRole);

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    if (!user) return;

    clearError();

    if (isStudent) {
      getMyFines().catch(() => {});
    } else if (canManageFines) {
      getAllFines().catch(() => {});
    }
  }, [user, currentRole]);

  // =====================================================
  // DISPLAYED FINES
  // =====================================================

  const displayedFines = isStudent ? myFines : fines;

  // =====================================================
  // SEARCH FILTER
  // =====================================================

  const filteredFines = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return displayedFines;

    return displayedFines.filter((fine) => {
      const studentName = fine?.student?.name || "";
      const studentEmail = fine?.student?.email || "";
      const bookTitle = fine?.issue?.book?.title || "";
      const status = fine?.status || "";

      return (
        studentName.toLowerCase().includes(value) ||
        studentEmail.toLowerCase().includes(value) ||
        bookTitle.toLowerCase().includes(value) ||
        status.toLowerCase().includes(value)
      );
    });
  }, [displayedFines, search]);

  // =====================================================
  // PAY FINE
  // =====================================================

  const handlePayFine = async (id) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to mark this fine as Paid?"
    );

    if (!confirmed) return;

    try {
      setPayingId(id);

      await payFine(id);

      window.alert("Fine paid successfully.");
    } catch (err) {
      window.alert(err.message || "Failed to pay fine.");
    } finally {
      setPayingId(null);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // TOTAL FINE
  // =====================================================

  const totalFine = useMemo(() => {
    return filteredFines.reduce(
      (total, fine) => total + Number(fine?.amount || 0),
      0
    );
  }, [filteredFines]);

  // =====================================================
  // UNPAID FINE
  // =====================================================

  const unpaidFine = useMemo(() => {
    return filteredFines
      .filter((fine) => fine?.status === "Unpaid")
      .reduce(
        (total, fine) => total + Number(fine?.amount || 0),
        0
      );
  }, [filteredFines]);

  // =====================================================
  // ACCESS DENIED
  // =====================================================

  if (user && !isStudent && !canManageFines) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 pb-12 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-red-200 bg-white p-10 text-center shadow-xl">

            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-500/5" />

            <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#890C25]/5" />

            <div className="relative">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-600">
                <FaTimesCircle size={30} />
              </div>

              <p className="mt-5 text-lg font-black text-red-700">
                You do not have permission to access Fines.
              </p>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && displayedFines.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 pb-12 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">
        <div className="mx-auto max-w-7xl">

          <div className="flex min-h-[60vh] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#890C25]/10 bg-white shadow-2xl">

                <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#890C25]/20 border-t-[#890C25]" />

              </div>

              <h3 className="mt-5 text-xl font-black text-slate-800">
                Loading fines...
              </h3>

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

        <div className="group/hero relative mb-7 overflow-hidden rounded-[2rem] bg-[#890C25] shadow-[0_20px_50px_rgba(137,12,37,0.28)]">

          {/* DECORATIVE CIRCLES */}

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10 bg-white/5 transition duration-500 group-hover/hero:scale-110" />

          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-white/10 bg-white/5" />

          <div className="pointer-events-none absolute right-[25%] top-10 h-3 w-3 rounded-full bg-[#D58A98] shadow-[0_0_20px_rgba(213,138,152,0.8)]" />

          <div className="pointer-events-none absolute right-20 top-24 h-32 w-32 rounded-full bg-[#D58A98]/10 blur-3xl" />

          {/* HERO CONTENT */}

          <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div>

              <div className="mb-4 flex items-center gap-3">

                {/* BLUE ICON BOX */}

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-blue-300/30
                    bg-blue-600
                    text-white
                    shadow-[0_10px_25px_rgba(37,99,235,0.35)]
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:bg-blue-600
                    hover:shadow-[0_15px_30px_rgba(37,99,235,0.45)]
                  "
                >
                  <FaMoneyBillWave size={24} />
                </div>

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D58A98]">
                    Library Management
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    Learning Management System
                  </p>

                </div>

              </div>

              <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                Fines
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
                {isStudent
                  ? "View your library fines and payment status."
                  : "Manage library fines and payments."}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">

                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white/90 backdrop-blur-md">

                  <span className="h-2 w-2 rounded-full bg-green-400" />

                  {isStudent ? "My Fines" : "Fine Management"}

                </div>

                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white/90 backdrop-blur-md">
                  {filteredFines.length} Records
                </div>

              </div>

            </div>

            {/* =================================================
                BLUE TOTAL FINE BOX
            ================================================= */}

            <div
              className="
                group/total
                relative
                flex
                min-h-[225px]
                w-full
                items-center
                justify-center
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
                hover:shadow-[0_18px_40px_rgba(30,64,175,0.45)]
                lg:w-56
                lg:min-h-[175px]
              "
            >

              {/* BLUE DECORATIVE CIRCLE */}

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

              <div
                className="
                  pointer-events-none
                  absolute
                  -left-10
                  -top-10
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
                  "
                >
                  <FaMoneyBillWave size={24} />
                </div>

                <p
                  className="
                    mt-4
                    text-[11px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-blue-100/80
                  "
                >
                  Total Fine
                </p>

                <p
                  className="
                    mt-2
                    text-4xl
                    font-black
                    leading-none
                    text-white
                  "
                >
                  Rs. {totalFine}
                </p>

                <div
                  className="
                    mx-auto
                    mt-5
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
            SEARCH
        ================================================= */}

        <div className="group/search relative mb-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition duration-300 hover:border-[#890C25]/20 hover:shadow-xl">

          <div className="absolute left-0 top-0 h-1.5 w-20 rounded-br-full bg-[#890C25] transition-all duration-500 group-hover/search:w-full" />

          <div className="relative flex items-center">

            <FaSearch
              className="absolute left-5 text-[#890C25]"
              size={15}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, email, book title or status..."
              className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-5 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
            />

          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 shadow-sm">

            <FaTimesCircle />

            {error}

          </div>
        )}

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">

          {/* =================================================
              TOTAL FINE
          ================================================= */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-[#890C25]/20 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1.5 w-16 rounded-br-full bg-[#890C25] transition-all duration-500 group-hover:w-full" />

            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#890C25]/5 transition duration-500 group-hover:scale-125" />

            <div className="relative flex items-center justify-between">

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#890C25]">
                  Total Fine
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  Rs. {totalFine}
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-400">
                  All fine records
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#890C25]/10 text-[#890C25] transition duration-300 group-hover:bg-[#890C25] group-hover:text-white">
                <FaMoneyBillWave size={18} />
              </div>

            </div>

          </div>

          {/* =================================================
              UNPAID FINE
          ================================================= */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-[#890C25]/20 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1.5 w-16 rounded-br-full bg-[#890C25] transition-all duration-500 group-hover:w-full" />

            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#890C25]/5 transition duration-500 group-hover:scale-125" />

            <div className="relative flex items-center justify-between">

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#890C25]">
                  Unpaid Fine
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  Rs. {unpaidFine}
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Pending payment
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#890C25]/10 text-[#890C25] transition duration-300 group-hover:bg-[#890C25] group-hover:text-white">
                <FaClock size={18} />
              </div>

            </div>

          </div>

          {/* =================================================
              FINE RECORDS
          ================================================= */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-[#890C25]/20 hover:shadow-xl">

            <div className="absolute left-0 top-0 h-1.5 w-16 rounded-br-full bg-[#890C25] transition-all duration-500 group-hover:w-full" />

            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#890C25]/5 transition duration-500 group-hover:scale-125" />

            <div className="relative flex items-center justify-between">

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#890C25]">
                  Fine Records
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {filteredFines.length}
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Matching records
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#890C25]/10 text-[#890C25] transition duration-300 group-hover:bg-[#890C25] group-hover:text-white">
                <FaFileInvoiceDollar size={18} />
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            FINES HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="h-10 w-1.5 rounded-full bg-[#890C25]" />

              <div>

                <h2 className="text-2xl font-black tracking-tight text-slate-800">
                  Fines
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {isStudent
                    ? "View your library fines and payment status."
                    : "Manage library fines and payments."}
                </p>

              </div>

            </div>

          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-[#890C25]/10 bg-white px-5 py-2.5 text-xs font-black text-[#890C25] shadow-sm">

            <span className="h-2 w-2 rounded-full bg-[#890C25]" />

            Showing {filteredFines.length}

          </div>

        </div>

        {/* =================================================
            EMPTY STATE / TABLE
        ================================================= */}

        {filteredFines.length === 0 ? (

          <div className="relative overflow-hidden rounded-[2rem] border-2 border-dashed border-[#890C25]/20 bg-white px-6 py-16 text-center shadow-xl">

            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#890C25]/5" />

            <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#890C25]/5" />

            <div className="relative">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#890C25]/10 text-[#890C25]">
                <FaMoneyBillWave size={27} />
              </div>

              <h3 className="mt-6 text-xl font-black text-slate-800">
                No fine records found.
              </h3>

            </div>

          </div>

        ) : (

          <div className="relative overflow-hidden rounded-[2rem] bg-[#890C25] p-1.5 shadow-[0_20px_50px_rgba(137,12,37,0.25)]">

            {/* DECORATIVE CIRCLES */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10 bg-white/5" />

            <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full border border-white/10 bg-white/5" />

            <div className="relative overflow-hidden rounded-[1.6rem] bg-white">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[950px]">

                  {/* =================================================
                      TABLE HEADER
                  ================================================= */}

                  <thead>

                    <tr className="border-b border-white/10 bg-[#890C25] text-left text-[11px] font-black uppercase tracking-wider text-white">

                      <th className="px-5 py-4">
                        #
                      </th>

                      {!isStudent && (
                        <>
                          <th className="px-5 py-4">
                            Student
                          </th>

                          <th className="px-5 py-4">
                            Email
                          </th>
                        </>
                      )}

                      <th className="px-5 py-4">
                        Book
                      </th>

                      <th className="px-5 py-4">
                        Days Late
                      </th>

                      <th className="px-5 py-4">
                        Amount
                      </th>

                      <th className="px-5 py-4">
                        Status
                      </th>

                      <th className="px-5 py-4">
                        Paid Date
                      </th>

                      {!isStudent && (
                        <th className="px-5 py-4 text-center">
                          Action
                        </th>
                      )}

                    </tr>

                  </thead>

                  {/* =================================================
                      TABLE BODY
                  ================================================= */}

                  <tbody>

                    {filteredFines.map((fine, index) => {

                      const isPaid = fine?.status === "Paid";

                      return (
                        <tr
                          key={fine._id}
                          className="group border-b border-slate-100 transition hover:bg-slate-50/80 last:border-0"
                        >

                          {/* # */}

                          <td className="px-5 py-5">

                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#890C25]/10 text-xs font-black text-[#890C25]">
                              {index + 1}
                            </span>

                          </td>

                          {/* STUDENT */}

                          {!isStudent && (
                            <td className="px-5 py-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25] transition group-hover:bg-[#890C25] group-hover:text-white">
                                  <FaUser size={13} />
                                </div>

                                <p className="text-sm font-black text-slate-800">
                                  {fine?.student?.name || "-"}
                                </p>

                              </div>

                            </td>
                          )}

                          {/* EMAIL */}

                          {!isStudent && (
                            <td className="px-5 py-5">

                              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">

                                <FaEnvelope
                                  size={11}
                                  className="text-[#890C25]"
                                />

                                {fine?.student?.email || "-"}

                              </div>

                            </td>
                          )}

                          {/* BOOK */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25] transition group-hover:bg-[#890C25] group-hover:text-white">
                                <FaBookOpen size={14} />
                              </div>

                              <div className="min-w-0">

                                <p className="max-w-[220px] truncate text-sm font-black text-slate-800">
                                  {fine?.issue?.book?.title ||
                                    fine?.issue?.book ||
                                    "-"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* DAYS LATE */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">

                              <FaClock
                                size={12}
                                className="text-[#890C25]"
                              />

                              {fine?.daysLate ?? 0}

                            </div>

                          </td>

                          {/* AMOUNT */}

                          <td className="px-5 py-5">

                            <div className="font-black text-[#890C25]">
                              Rs. {fine?.amount ?? 0}
                            </div>

                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-5">

                            <span
                              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-black ${
                                isPaid
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-red-200 bg-red-50 text-red-700"
                              }`}
                            >

                              {isPaid ? (
                                <FaCheckCircle size={11} />
                              ) : (
                                <FaTimesCircle size={11} />
                              )}

                              {fine?.status || "Unpaid"}

                            </span>

                          </td>

                          {/* PAID DATE */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">

                              <FaCalendarAlt
                                size={12}
                                className="text-[#890C25]"
                              />

                              {formatDate(fine?.paidDate)}

                            </div>

                          </td>

                          {/* ACTION */}

                          {!isStudent && (
                            <td className="px-5 py-5 text-center">

                              {isPaid ? (

                                <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-black text-emerald-700">

                                  <FaCheckCircle size={12} />

                                  Paid

                                </span>

                              ) : (

                                <button
                                  type="button"
                                  onClick={() =>
                                    handlePayFine(fine._id)
                                  }
                                  disabled={
                                    payingId === fine._id
                                  }
                                  className="group/pay inline-flex items-center justify-center gap-2 rounded-xl bg-[#890C25] px-4 py-2.5 text-xs font-black text-white shadow-md shadow-[#890C25]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#890C25] hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                  <FaMoneyBillWave
                                    size={12}
                                    className="transition group-hover/pay:scale-110"
                                  />

                                  {payingId === fine._id
                                    ? "Processing..."
                                    : "Pay Fine"}

                                </button>

                              )}

                            </td>
                          )}

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            RESULT COUNT
        ================================================= */}

        {displayedFines.length > 0 && (

          <div className="mt-6 text-center text-xs font-semibold text-slate-400">

            Showing{" "}

            <span className="font-black text-[#890C25]">
              {filteredFines.length}
            </span>{" "}

            of{" "}

            <span className="font-black text-slate-600">
              {displayedFines.length}
            </span>{" "}

            fine records

          </div>

        )}

      </div>

    </div>
  );
};

export default Fines;