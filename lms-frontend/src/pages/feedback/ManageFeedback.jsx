import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaComments,
  FaEye,
  FaSearch,
  FaUser,
  FaBookOpen,
  FaBuilding,
  FaCalendarAlt,
  FaStar,
  FaClock,
  FaCheckCircle,
  FaReply,
} from "react-icons/fa";

import { useFeedback } from "../../context/FeedbackContext";

// =====================================================
// MANAGE FEEDBACK
// =====================================================

const ManageFeedback = () => {
  const navigate = useNavigate();

  const {
    feedbacks,
    loading,
    error,
    getAllFeedback,
  } = useFeedback();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Pending");

  // =====================================================
  // LOAD ALL FEEDBACKS
  // =====================================================

  useEffect(() => {
    getAllFeedback();
  }, []);

  // =====================================================
  // SAFE FEEDBACK LIST
  // =====================================================

  const feedbackList = Array.isArray(feedbacks)
    ? feedbacks
    : [];

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalFeedbacks = feedbackList.length;

  const pendingFeedbacks = feedbackList.filter(
    (feedback) =>
      feedback.status === "Pending" ||
      !feedback.status
  ).length;

  const reviewedFeedbacks = feedbackList.filter(
    (feedback) =>
      feedback.status === "Reviewed"
  ).length;

  const bookFeedbacks = feedbackList.filter(
    (feedback) =>
      feedback.feedbackType === "Book"
  ).length;

  const libraryFeedbacks = feedbackList.filter(
    (feedback) =>
      feedback.feedbackType === "Library"
  ).length;

  // =====================================================
  // FILTER FEEDBACKS
  // =====================================================

  const filteredFeedbacks = feedbackList.filter(
    (feedback) => {
      const status =
        feedback.status || "Pending";

      if (
        activeTab !== "All" &&
        status !== activeTab
      ) {
        return false;
      }

      const studentName =
        feedback.student?.name || "";

      const studentEmail =
        feedback.student?.email || "";

      const bookTitle =
        feedback.book?.title || "";

      const type =
        feedback.feedbackType || "";

      const message =
        feedback.message || "";

      const searchValue =
        searchTerm.toLowerCase().trim();

      return (
        studentName
          .toLowerCase()
          .includes(searchValue) ||
        studentEmail
          .toLowerCase()
          .includes(searchValue) ||
        bookTitle
          .toLowerCase()
          .includes(searchValue) ||
        type
          .toLowerCase()
          .includes(searchValue) ||
        message
          .toLowerCase()
          .includes(searchValue)
      );
    }
  );

  // =====================================================
  // RATING STARS
  // =====================================================

  const renderStars = (rating) => {
    return Array.from(
      { length: 5 },
      (_, index) => (
        <FaStar
          key={index}
          className={
            index < rating
              ? "text-yellow-400"
              : "text-slate-200"
          }
          size={13}
        />
      )
    );
  };

  // =====================================================
  // OPEN DETAILS
  // =====================================================

  const openDetails = (feedback) => {
    navigate(
      `/feedback/details/${feedback._id}`,
      {
        state: {
          feedback,
        },
      }
    );
  };

  // =====================================================
  // TAB BUTTON
  // =====================================================

  const tabs = [
    {
      name: "Pending",
      count: pendingFeedbacks,
      icon: <FaClock />,
    },
    {
      name: "Reviewed",
      count: reviewedFeedbacks,
      icon: <FaCheckCircle />,
    },
    {
      name: "All",
      count: totalFeedbacks,
      icon: <FaComments />,
    },
  ];

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

        {/* =============================================
            HERO
        ============================================= */}

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
                  <FaComments size={24} />
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
                    Student Feedback System
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
                Manage Feedback
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
                Review pending student feedback,
                respond to students and manage
                completed feedback records.
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
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />
                  {pendingFeedbacks} Pending Reviews
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
                  {totalFeedbacks} Total Feedbacks
                </div>

              </div>

            </div>

            {/* TOTAL CARD */}

            <div
              className="
                relative
                w-full
                overflow-hidden
                rounded-3xl
                bg-gradient-to-br
                from-blue-600
                via-blue-700
                to-blue-900
                p-6
                text-center
                shadow-xl
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
                  "
                >
                  <FaComments size={24} />
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
                  Total Feedbacks
                </p>

                <p
                  className="
                    mt-1
                    text-5xl
                    font-black
                    text-white
                  "
                >
                  {String(totalFeedbacks).padStart(
                    2,
                    "0"
                  )}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =============================================
            STATISTICS
        ============================================= */}

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

          {/* PENDING */}

          <div
            className="
              rounded-2xl
              border
              border-yellow-100
              bg-white
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
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
                  {pendingFeedbacks}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Need response
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

          {/* REVIEWED */}

          <div
            className="
              rounded-2xl
              border
              border-green-100
              bg-white
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
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
                  {reviewedFeedbacks}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Completed reviews
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

          {/* BOOK */}

          <div
            className="
              rounded-2xl
              border
              border-blue-100
              bg-white
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
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
                  {bookFeedbacks}
                </p>

                <p className="mt-1 text-xs text-slate-400">
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

          {/* LIBRARY */}

          <div
            className="
              rounded-2xl
              border
              border-[#890C25]/10
              bg-white
              p-5
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
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
                  {libraryFeedbacks}
                </p>

                <p className="mt-1 text-xs text-slate-400">
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

        </div>

        {/* =============================================
            ERROR
        ============================================= */}

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
            "
          >
            {error}
          </div>
        )}

        {/* =============================================
            SECTION HEADER
        ============================================= */}

        <div
          className="
            mb-5
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-end
            lg:justify-between
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
                    text-slate-800
                  "
                >
                  Feedback Management
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review and respond to student feedback.
                </p>

              </div>

            </div>

          </div>

          {/* SEARCH */}

          <div className="relative w-full lg:w-96">

            <FaSearch
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
              size={15}
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Search student, book or feedback..."
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                py-3.5
                pl-11
                pr-4
                text-sm
                font-medium
                text-slate-700
                outline-none
                shadow-sm
                transition
                focus:border-[#890C25]
                focus:ring-4
                focus:ring-[#890C25]/10
              "
            />

          </div>

        </div>

        {/* =============================================
            TABS
        ============================================= */}

        <div
          className="
            mb-6
            flex
            flex-wrap
            gap-3
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-3
            shadow-lg
          "
        >

          {tabs.map((tab) => (

            <button
              key={tab.name}
              onClick={() =>
                setActiveTab(tab.name)
              }
              className={`
                flex
                items-center
                gap-2
                rounded-xl
                px-5
                py-3
                text-xs
                font-black
                transition-all
                duration-300
                ${
                  activeTab === tab.name
                    ? "bg-[#890C25] text-white shadow-md"
                    : "bg-slate-50 text-slate-500 hover:bg-[#890C25]/10 hover:text-[#890C25]"
                }
              `}
            >

              {tab.icon}

              {tab.name}

              <span
                className={`
                  rounded-full
                  px-2
                  py-0.5
                  text-[10px]
                  ${
                    activeTab === tab.name
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-600"
                  }
                `}
              >
                {tab.count}
              </span>

            </button>

          ))}

        </div>

        {/* =============================================
            FEEDBACK TABLE
        ============================================= */}

        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-xl
          "
        >

          <div
            className="
              absolute
              left-0
              top-0
              z-20
              h-1.5
              w-24
              bg-gradient-to-r
              from-[#65091c]
              via-[#890C25]
              to-[#D58A98]
            "
          />

          {/* LOADING */}

          {loading && feedbackList.length === 0 ? (

            <div className="py-16 text-center">

              <div
                className="
                  mx-auto
                  h-10
                  w-10
                  animate-spin
                  rounded-full
                  border-4
                  border-[#890C25]/20
                  border-t-[#890C25]
                "
              />

              <h3 className="mt-5 text-xl font-black text-slate-800">
                Loading Feedbacks
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Fetching student feedback records...
              </p>

            </div>

          ) : filteredFeedbacks.length === 0 ? (

            <div className="px-6 py-16 text-center">

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
                {activeTab === "Pending" ? (
                  <FaClock size={28} />
                ) : (
                  <FaComments size={28} />
                )}
              </div>

              <h3 className="mt-6 text-xl font-black text-slate-800">
                No {activeTab} Feedback
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {searchTerm
                  ? "No feedback matches your search."
                  : activeTab === "Pending"
                  ? "There are no feedback records waiting for review."
                  : activeTab === "Reviewed"
                  ? "No feedback has been reviewed yet."
                  : "There are currently no feedback records."}
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1250px]">

                <thead>

                  <tr
                    className="
                      border-b
                      border-slate-200
                      bg-slate-50
                      text-left
                    "
                  >

                    <th className="px-5 py-5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Student
                    </th>

                    <th className="px-5 py-5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Type
                    </th>

                    <th className="px-5 py-5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Book / Service
                    </th>

                    <th className="px-5 py-5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Rating
                    </th>

                    <th className="px-5 py-5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-5 py-5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredFeedbacks.map(
                    (feedback) => {

                      const isReviewed =
                        feedback.status ===
                        "Reviewed";

                      return (
                        <tr
                          key={feedback._id}
                          className="
                            group
                            border-b
                            border-slate-100
                            transition
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
                                  transition
                                  group-hover:bg-[#890C25]
                                  group-hover:text-white
                                "
                              >
                                <FaUser size={15} />
                              </div>

                              <div>

                                <p className="font-black text-slate-800">
                                  {feedback.student?.name ||
                                    "Unknown Student"}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  {feedback.student?.email ||
                                    "-"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* TYPE */}

                          <td className="px-5 py-5">

                            <span
                              className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                bg-[#890C25]/10
                                px-3
                                py-1.5
                                text-xs
                                font-black
                                text-[#890C25]
                              "
                            >

                              {feedback.feedbackType ===
                              "Book" ? (
                                <FaBookOpen size={11} />
                              ) : (
                                <FaBuilding size={11} />
                              )}

                              {feedback.feedbackType ||
                                "General"}

                            </span>

                          </td>

                          {/* BOOK / SERVICE */}

                          <td className="px-5 py-5">

                            {feedback.feedbackType ===
                            "Book" ? (

                              <div className="flex items-center gap-2">

                                <div
                                  className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-blue-100
                                    text-blue-600
                                  "
                                >
                                  <FaBookOpen size={13} />
                                </div>

                                <span className="font-bold text-slate-700">
                                  {feedback.book?.title ||
                                    feedback.bookName ||
                                    "Book Information"}
                                </span>

                              </div>

                            ) : (

                              <div className="flex items-center gap-2">

                                <div
                                  className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-[#890C25]/10
                                    text-[#890C25]
                                  "
                                >
                                  <FaBuilding size={13} />
                                </div>

                                <span className="font-bold text-slate-600">
                                  Library Services
                                </span>

                              </div>

                            )}

                          </td>

                          {/* RATING */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-1">
                              {renderStars(
                                feedback.rating || 0
                              )}
                            </div>

                            <p className="mt-1 text-[10px] font-bold text-slate-400">
                              {feedback.rating || 0}/5
                            </p>

                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-5">

                            <span
                              className={`
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                px-3
                                py-1.5
                                text-xs
                                font-black
                                ${
                                  isReviewed
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }
                              `}
                            >

                              {isReviewed ? (
                                <FaCheckCircle
                                  size={11}
                                />
                              ) : (
                                <FaClock
                                  size={11}
                                />
                              )}

                              {isReviewed
                                ? "Reviewed"
                                : "Pending"}

                            </span>

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
                                  bg-blue-50
                                  text-blue-600
                                "
                              >
                                <FaCalendarAlt size={13} />
                              </div>

                              <span className="text-sm font-bold text-slate-600">

                                {feedback.createdAt
                                  ? new Date(
                                      feedback.createdAt
                                    ).toLocaleDateString()
                                  : "-"}

                              </span>

                            </div>

                          </td>

                          {/* ACTION */}

                          <td className="px-5 py-5">

                            <button
                              onClick={() =>
                                openDetails(
                                  feedback
                                )
                              }
                              className={`
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                px-4
                                py-2.5
                                text-xs
                                font-black
                                text-white
                                shadow-sm
                                transition-all
                                hover:-translate-y-0.5
                                hover:shadow-lg
                                ${
                                  isReviewed
                                    ? "bg-slate-700 hover:bg-slate-800"
                                    : "bg-[#890C25] hover:bg-[#65091c]"
                                }
                              `}
                            >

                              {isReviewed ? (
                                <FaEye size={12} />
                              ) : (
                                <FaReply size={12} />
                              )}

                              {isReviewed
                                ? "View Details"
                                : "Review & Respond"}

                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* RESULT COUNT */}

        {filteredFeedbacks.length > 0 && (

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
            {activeTab.toLowerCase()} feedback records
          </div>

        )}

      </div>
    </div>
  );
};

export default ManageFeedback;