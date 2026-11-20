import { useEffect, useMemo, useState } from "react";
import {
  FaBookOpen,
  FaCommentDots,
  FaBuilding,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaCalendarAlt,
  FaReply,
  FaInfoCircle,
} from "react-icons/fa";

import { useFeedback } from "../../context/FeedbackContext";

// =====================================================
// MY FEEDBACK
// =====================================================

const MyFeedback = () => {
  // =====================================================
  // CONTEXT
  // =====================================================

  const {
    myFeedbacks,
    loading,
    error,
    getMyFeedback,
  } = useFeedback();

  // =====================================================
  // STATES
  // =====================================================

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // =====================================================
  // LOAD FEEDBACK
  // =====================================================

  useEffect(() => {
    getMyFeedback();
  }, []);

  // =====================================================
  // SAFE FEEDBACK ARRAY
  // =====================================================

  const feedbackList = Array.isArray(myFeedbacks)
    ? myFeedbacks
    : [];

  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = (feedback) => {
    if (feedback?.status) {
      return feedback.status;
    }

    if (feedback?.response?.trim()) {
      return "Reviewed";
    }

    return "Pending";
  };

  // =====================================================
  // TYPE
  // =====================================================

  const getFeedbackType = (feedback) => {
    if (feedback?.feedbackType === "Book") {
      return "Book Feedback";
    }

    if (feedback?.feedbackType === "Library") {
      return "Library Feedback";
    }

    return "Feedback";
  };

  // =====================================================
  // BOOK NAME
  // =====================================================

  const getBookName = (feedback) => {
    if (feedback?.feedbackType !== "Book") {
      return null;
    }

    return (
      feedback?.book?.title ||
      "Book name not available"
    );
  };

  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  // =====================================================
  // RATING TEXT
  // =====================================================

  const getRatingText = (rating) => {
    switch (Number(rating)) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "Not Rated";
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredFeedbacks = useMemo(() => {
    return feedbackList.filter((feedback) => {
      const type =
        feedback?.feedbackType || "";

      const status =
        getStatus(feedback);

      const bookTitle =
        feedback?.book?.title || "";

      const message =
        feedback?.message || "";

      const response =
        feedback?.response || "";

      const searchableText = `
        ${type}
        ${bookTitle}
        ${message}
        ${response}
      `.toLowerCase();

      const searchValue =
        search.trim().toLowerCase();

      const matchesSearch =
        searchableText.includes(searchValue);

      const matchesType =
        filterType === "All" ||
        type === filterType;

      const matchesStatus =
        filterStatus === "All" ||
        status === filterStatus;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }, [
    feedbackList,
    search,
    filterType,
    filterStatus,
  ]);

  // =====================================================
  // COUNTS
  // =====================================================

  const totalFeedback =
    feedbackList.length;

  const bookFeedback =
    feedbackList.filter(
      (feedback) =>
        feedback.feedbackType === "Book"
    ).length;

  const libraryFeedback =
    feedbackList.filter(
      (feedback) =>
        feedback.feedbackType === "Library"
    ).length;

  const reviewedFeedback =
    feedbackList.filter(
      (feedback) =>
        getStatus(feedback) === "Reviewed"
    ).length;

  const pendingFeedback =
    feedbackList.filter(
      (feedback) =>
        getStatus(feedback) === "Pending"
    ).length;

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    if (status === "Reviewed") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    return "border-yellow-200 bg-yellow-50 text-yellow-700";
  };

  // =====================================================
  // STATUS DOT
  // =====================================================

  const getStatusDotClass = (status) => {
    if (status === "Reviewed") {
      return "bg-green-600";
    }

    return "bg-yellow-500";
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

          {/* DECORATIVE CIRCLE */}

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
                  <FaCommentDots size={24} />
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
                My Feedback
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
                View your submitted book and library
                feedback and check their review status.
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

                  Student Feedback
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
                  {totalFeedback} Total Feedback
                </div>

              </div>

            </div>

            {/* TOTAL FEEDBACK */}

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
                  <FaCommentDots size={24} />
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
                  Total Feedback
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
                  {String(totalFeedback).padStart(
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
            xl:grid-cols-4
          "
        >

          {/* BOOK FEEDBACK */}

          <div
            className="
              group/stat
              relative
              overflow-hidden
              rounded-2xl
              border
              border-blue-200
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
                bg-blue-600
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
                    text-blue-600
                  "
                >
                  Book Feedback
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {bookFeedback}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Feedback about books
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
                "
              >
                <FaBookOpen size={19} />
              </div>

            </div>
          </div>

          {/* LIBRARY FEEDBACK */}

          <div
            className="
              group/stat
              relative
              overflow-hidden
              rounded-2xl
              border
              border-[#890C25]/20
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
                  Library Feedback
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {libraryFeedback}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Feedback about library
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
                <FaBuilding size={19} />
              </div>

            </div>
          </div>

          {/* REVIEWED */}

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
                  Reviewed
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {reviewedFeedback}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Feedback reviewed
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
                <FaCheckCircle size={19} />
              </div>

            </div>
          </div>

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
                  Pending
                </p>

                <p className="mt-2 text-3xl font-black text-slate-800">
                  {pendingFeedback}
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

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="
              mb-6
              flex
              items-center
              gap-3
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
            <FaInfoCircle />
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
                  My Submitted Feedback
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and track all your submitted feedback.
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

            Showing {filteredFeedbacks.length}
          </div>

        </div>

        {/* =================================================
            SEARCH & FILTERS
        ================================================= */}

        <div
          className="
            mb-6
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-lg
          "
        >

          <div
            className="
              grid
              grid-cols-1
              gap-4
              md:grid-cols-3
            "
          >

            {/* SEARCH */}

            <div className="relative">

              <FaSearch
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
                size={14}
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search feedback or book..."
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  py-3
                  pl-11
                  pr-4
                  text-sm
                  font-medium
                  text-slate-700
                  outline-none
                  transition
                  focus:border-[#890C25]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#890C25]/10
                "
              />

            </div>

            {/* TYPE */}

            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value)
              }
              className="
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                text-sm
                font-semibold
                text-slate-700
                outline-none
                transition
                focus:border-[#890C25]
                focus:bg-white
                focus:ring-4
                focus:ring-[#890C25]/10
              "
            >
              <option value="All">
                All Feedback Types
              </option>

              <option value="Book">
                Book Feedback
              </option>

              <option value="Library">
                Library Feedback
              </option>
            </select>

            {/* STATUS */}

            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value)
              }
              className="
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                text-sm
                font-semibold
                text-slate-700
                outline-none
                transition
                focus:border-[#890C25]
                focus:bg-white
                focus:ring-4
                focus:ring-[#890C25]/10
              "
            >
              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Reviewed">
                Reviewed
              </option>
            </select>

          </div>

        </div>

        {/* =================================================
            FEEDBACK LIST
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

          {/* TOP LINE */}

          <div
            className="
              absolute
              left-0
              right-0
              top-0
              z-20
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

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
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
                Loading Feedback
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Fetching your feedback records...
              </p>

            </div>
          )}

          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            filteredFeedbacks.length === 0 && (
              <div
                className="
                  relative
                  overflow-hidden
                  px-6
                  py-16
                  text-center
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
                    <FaCommentDots size={28} />
                  </div>

                  <h3 className="mt-6 text-xl font-black text-slate-800">
                    No Feedback Found
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
                    {totalFeedback === 0
                      ? "You have not submitted any feedback yet."
                      : "No feedback matches your current search or filters."}
                  </p>

                </div>
              </div>
            )}

          {/* =================================================
              FEEDBACK CARDS
          ================================================= */}

          {!loading &&
            filteredFeedbacks.length > 0 && (
              <div className="divide-y divide-slate-100">

                {filteredFeedbacks.map(
                  (feedback) => {

                    const isBook =
                      feedback?.feedbackType === "Book";

                    const status =
                      getStatus(feedback);

                    const bookName =
                      getBookName(feedback);

                    return (
                      <div
                        key={feedback._id}
                        className="
                          group/feedback
                          relative
                          p-5
                          transition-all
                          duration-300
                          hover:bg-slate-50/70
                          sm:p-6
                        "
                      >

                        {/* =================================================
                            CARD TOP
                        ================================================= */}

                        <div
                          className="
                            flex
                            flex-col
                            gap-5
                            lg:flex-row
                            lg:items-start
                            lg:justify-between
                          "
                        >

                          {/* TYPE + BOOK */}

                          <div className="flex items-start gap-4">

                            <div
                              className={`
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                transition-all
                                duration-300
                                group-hover/feedback:scale-105
                                ${
                                  isBook
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-[#890C25]/10 text-[#890C25]"
                                }
                              `}
                            >
                              {isBook ? (
                                <FaBookOpen size={19} />
                              ) : (
                                <FaBuilding size={19} />
                              )}
                            </div>

                            <div>

                              <p
                                className="
                                  text-[10px]
                                  font-black
                                  uppercase
                                  tracking-wider
                                  text-slate-400
                                "
                              >
                                Feedback Type
                              </p>

                              <h3
                                className="
                                  mt-1
                                  text-xl
                                  font-black
                                  text-slate-800
                                "
                              >
                                {getFeedbackType(
                                  feedback
                                )}
                              </h3>

                              {/* BOOK NAME */}

                              {isBook && (
                                <div
                                  className="
                                    mt-2
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2
                                  "
                                >

                                  <FaBookOpen
                                    size={12}
                                    className="text-[#890C25]"
                                  />

                                  <span className="text-xs font-bold text-slate-500">
                                    Book:
                                  </span>

                                  <span
                                    className="
                                      text-sm
                                      font-black
                                      text-[#890C25]
                                    "
                                  >
                                    {bookName}
                                  </span>

                                </div>
                              )}

                              {/* LIBRARY NAME */}

                              {!isBook && (
                                <div
                                  className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-2
                                  "
                                >

                                  <FaBuilding
                                    size={12}
                                    className="text-[#890C25]"
                                  />

                                  <span
                                    className="
                                      text-sm
                                      font-bold
                                      text-slate-500
                                    "
                                  >
                                    General Library Services
                                  </span>

                                </div>
                              )}

                            </div>

                          </div>

                          {/* STATUS */}

                          <span
                            className={`
                              inline-flex
                              w-fit
                              items-center
                              gap-2
                              rounded-full
                              border
                              px-3
                              py-1.5
                              text-xs
                              font-black
                              ${getStatusClass(status)}
                            `}
                          >

                            <span
                              className={`
                                h-1.5
                                w-1.5
                                rounded-full
                                ${getStatusDotClass(status)}
                              `}
                            />

                            {status}

                          </span>

                        </div>

                        {/* =================================================
                            DETAILS
                        ================================================= */}

                        <div
                          className="
                            mt-5
                            grid
                            grid-cols-1
                            gap-4
                            md:grid-cols-3
                          "
                        >

                          {/* RATING */}

                          <div
                            className="
                              rounded-xl
                              border
                              border-slate-200
                              bg-slate-50
                              p-4
                            "
                          >

                            <p
                              className="
                                text-[10px]
                                font-black
                                uppercase
                                tracking-wider
                                text-slate-400
                              "
                            >
                              Rating
                            </p>

                            <div className="mt-2 flex items-center gap-1">

                              {[1, 2, 3, 4, 5].map(
                                (star) => (
                                  <FaStar
                                    key={star}
                                    size={14}
                                    className={
                                      star <=
                                      Number(
                                        feedback?.rating
                                      )
                                        ? "text-yellow-500"
                                        : "text-slate-200"
                                    }
                                  />
                                )
                              )}

                            </div>

                            <p className="mt-2 text-xs font-bold text-slate-500">
                              {feedback?.rating || 0}/5 —{" "}
                              {getRatingText(
                                feedback?.rating
                              )}
                            </p>

                          </div>

                          {/* DATE */}

                          <div
                            className="
                              rounded-xl
                              border
                              border-slate-200
                              bg-slate-50
                              p-4
                            "
                          >

                            <p
                              className="
                                text-[10px]
                                font-black
                                uppercase
                                tracking-wider
                                text-slate-400
                              "
                            >
                              Submitted Date
                            </p>

                            <div
                              className="
                                mt-3
                                flex
                                items-center
                                gap-3
                              "
                            >

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
                                {formatDate(
                                  feedback?.createdAt
                                )}
                              </span>

                            </div>

                          </div>

                          {/* STATUS */}

                          <div
                            className="
                              rounded-xl
                              border
                              border-slate-200
                              bg-slate-50
                              p-4
                            "
                          >

                            <p
                              className="
                                text-[10px]
                                font-black
                                uppercase
                                tracking-wider
                                text-slate-400
                              "
                            >
                              Current Status
                            </p>

                            <div className="mt-3 flex items-center gap-3">

                              <div
                                className={`
                                  flex
                                  h-9
                                  w-9
                                  items-center
                                  justify-center
                                  rounded-lg
                                  ${
                                    status === "Reviewed"
                                      ? "bg-green-100 text-green-600"
                                      : "bg-yellow-100 text-yellow-600"
                                  }
                                `}
                              >
                                {status === "Reviewed" ? (
                                  <FaCheckCircle size={14} />
                                ) : (
                                  <FaClock size={14} />
                                )}
                              </div>

                              <span
                                className={`
                                  text-sm
                                  font-black
                                  ${
                                    status === "Reviewed"
                                      ? "text-green-700"
                                      : "text-yellow-700"
                                  }
                                `}
                              >
                                {status}
                              </span>

                            </div>

                          </div>

                        </div>

                        {/* =================================================
                            MESSAGE
                        ================================================= */}

                        <div className="mt-5">

                          <p
                            className="
                              mb-2
                              text-[10px]
                              font-black
                              uppercase
                              tracking-wider
                              text-slate-400
                            "
                          >
                            Your Feedback
                          </p>

                          <div
                            className="
                              rounded-xl
                              border
                              border-slate-200
                              bg-white
                              p-4
                            "
                          >

                            <p
                              className="
                                text-sm
                                leading-6
                                text-slate-700
                              "
                            >
                              {feedback?.message ||
                                "No message available."}
                            </p>

                          </div>

                        </div>

                        {/* =================================================
                            RESPONSE
                        ================================================= */}

                        {feedback?.response?.trim() && (
                          <div className="mt-5">

                            <div
                              className="
                                mb-2
                                flex
                                items-center
                                gap-2
                              "
                            >

                              <FaReply
                                size={13}
                                className="text-[#890C25]"
                              />

                              <p
                                className="
                                  text-[10px]
                                  font-black
                                  uppercase
                                  tracking-wider
                                  text-slate-400
                                "
                              >
                                Library Response
                              </p>

                            </div>

                            <div
                              className="
                                rounded-xl
                                border
                                border-[#890C25]/15
                                bg-[#890C25]/5
                                p-4
                              "
                            >

                              <p
                                className="
                                  text-sm
                                  leading-6
                                  text-slate-700
                                "
                              >
                                {feedback.response}
                              </p>

                            </div>

                          </div>
                        )}

                      </div>
                    );
                  }
                )}

              </div>
            )}

        </div>

        {/* =================================================
            RESULT COUNT
        ================================================= */}

        {feedbackList.length > 0 && (
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
              {filteredFeedbacks.length}
            </span>{" "}

            of{" "}

            <span className="font-black text-[#890C25]">
              {feedbackList.length}
            </span>{" "}

            feedback records
          </div>
        )}

      </div>
    </div>
  );
};

export default MyFeedback;