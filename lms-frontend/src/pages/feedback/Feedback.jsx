import { useState } from "react";
import {
  FaCommentDots,
  FaBookOpen,
  FaBuilding,
  FaStar,
  FaPaperPlane,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";

import { useFeedback } from "../../context/FeedbackContext";

// =====================================================
// FEEDBACK PAGE
// =====================================================

const Feedback = () => {
  // =====================================================
  // CONTEXT
  // =====================================================

  const {
    createFeedback,
    loading,
    error,
  } = useFeedback();

  // =====================================================
  // STATES
  // =====================================================

  const [feedbackType, setFeedbackType] =
    useState("Library");

  const [bookName, setBookName] =
    useState("");

  const [rating, setRating] =
    useState(0);

  const [message, setMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [formError, setFormError] =
    useState("");

  // =====================================================
  // SELECT RATING
  // =====================================================

  const handleRating = (value) => {
    setRating(value);
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFeedbackType("Library");
    setBookName("");
    setRating(0);
    setMessage("");
  };

  // =====================================================
  // SUBMIT FEEDBACK
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    setSuccessMessage("");

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!feedbackType) {
      setFormError(
        "Please select a feedback type."
      );

      return;
    }

    if (
      feedbackType === "Book" &&
      !bookName.trim()
    ) {
      setFormError(
        "Please enter the book name."
      );

      return;
    }

    if (!rating) {
      setFormError(
        "Please select a rating."
      );

      return;
    }

    if (!message.trim()) {
      setFormError(
        "Please write your feedback."
      );

      return;
    }

    try {
      // ==========================================
      // FEEDBACK DATA
      // ==========================================

      const feedbackData = {
        feedbackType,
        bookName:
          feedbackType === "Book"
            ? bookName.trim()
            : null,
        rating,
        message: message.trim(),
      };

      // ==========================================
      // API CALL
      // ==========================================

      await createFeedback(
        feedbackData
      );

      // ==========================================
      // SUCCESS
      // ==========================================

      setSuccessMessage(
        "Thank you! Your feedback has been submitted successfully."
      );

      resetForm();

      // ==========================================
      // AUTO REMOVE SUCCESS
      // ==========================================

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

    } catch (err) {
      setFormError(
        err.message ||
          "Failed to submit feedback."
      );
    }
  };

  // =====================================================
  // RATING TEXT
  // =====================================================

  const getRatingText = () => {
    if (rating === 1) {
      return "Poor";
    }

    if (rating === 2) {
      return "Fair";
    }

    if (rating === 3) {
      return "Good";
    }

    if (rating === 4) {
      return "Very Good";
    }

    if (rating === 5) {
      return "Excellent";
    }

    return "Select your rating";
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
                Share Your Feedback
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
                Your feedback helps us improve our
                library services and provide a better
                learning experience.
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
                  Your Opinion Matters
                </div>

              </div>

            </div>

            {/* RIGHT CARD */}

            <div
              className="
                group/feedback
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
                  group-hover/feedback:scale-125
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
                  <FaStar size={24} />
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
                  Your Rating
                </p>

                <p
                  className="
                    mt-2
                    text-4xl
                    font-black
                    text-white
                  "
                >
                  {rating || "0"} / 5
                </p>

                <p className="mt-2 text-xs font-semibold text-blue-100/70">
                  {getRatingText()}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            ALERTS
        ================================================= */}

        {(error || formError) && (

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

            {formError || error}

          </div>

        )}

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
            "
          >
            <FaCheckCircle />

            {successMessage}

          </div>

        )}

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-3
          "
        >

          {/* =================================================
              LEFT INFORMATION CARD
          ================================================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-xl
            "
          >

            <div
              className="
                absolute
                left-0
                top-0
                h-1.5
                w-full
                bg-gradient-to-r
                from-[#65091c]
                via-[#890C25]
                to-[#D58A98]
              "
            />

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-[#890C25]/10
                text-[#890C25]
              "
            >
              <FaCommentDots size={23} />
            </div>

            <h2
              className="
                mt-5
                text-2xl
                font-black
                text-slate-800
              "
            >
              Tell Us What You Think
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Share your experience about books,
              library services and your overall
              learning environment.
            </p>

            {/* INFO ITEMS */}

            <div className="mt-7 space-y-4">

              <div
                className="
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-slate-100
                  bg-slate-50
                  p-4
                "
              >

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
                  <FaBookOpen />
                </div>

                <div>

                  <p className="text-sm font-black text-slate-700">
                    Book Feedback
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Share your opinion about a book.
                  </p>

                </div>

              </div>

              <div
                className="
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-slate-100
                  bg-slate-50
                  p-4
                "
              >

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-purple-100
                    text-purple-600
                  "
                >
                  <FaBuilding />
                </div>

                <div>

                  <p className="text-sm font-black text-slate-700">
                    Library Feedback
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Help us improve library services.
                  </p>

                </div>

              </div>

              <div
                className="
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-slate-100
                  bg-slate-50
                  p-4
                "
              >

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-yellow-100
                    text-yellow-600
                  "
                >
                  <FaStar />
                </div>

                <div>

                  <p className="text-sm font-black text-slate-700">
                    Rate Your Experience
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Give us a rating from 1 to 5.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              FEEDBACK FORM
          ================================================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-xl
              xl:col-span-2
              sm:p-8
            "
          >

            {/* TOP LINE */}

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

            {/* FORM HEADER */}

            <div className="mb-8 flex items-center gap-4">

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#890C25]/10
                  text-[#890C25]
                "
              >
                <FaPaperPlane size={20} />
              </div>

              <div>

                <h2
                  className="
                    text-2xl
                    font-black
                    text-slate-800
                  "
                >
                  Submit Feedback
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Please share your honest experience.
                </p>

              </div>

            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit}>

              {/* =============================================
                  FEEDBACK TYPE
              ============================================= */}

              <div>

                <label
                  className="
                    mb-3
                    block
                    text-xs
                    font-black
                    uppercase
                    tracking-wider
                    text-slate-600
                  "
                >
                  Feedback Type
                </label>

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                  "
                >

                  {/* BOOK */}

                  <button
                    type="button"
                    onClick={() =>
                      setFeedbackType("Book")
                    }
                    className={`
                      group/type
                      relative
                      flex
                      items-center
                      gap-4
                      rounded-2xl
                      border-2
                      p-5
                      text-left
                      transition-all
                      duration-300
                      ${
                        feedbackType === "Book"
                          ? "border-[#890C25] bg-[#890C25]/5"
                          : "border-slate-200 bg-white hover:border-[#890C25]/30"
                      }
                    `}
                  >

                    <div
                      className={`
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        transition
                        ${
                          feedbackType === "Book"
                            ? "bg-[#890C25] text-white"
                            : "bg-blue-100 text-blue-600"
                        }
                      `}
                    >
                      <FaBookOpen size={18} />
                    </div>

                    <div>

                      <p className="font-black text-slate-800">
                        Book Feedback
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Share feedback about a specific book.
                      </p>

                    </div>

                  </button>

                  {/* LIBRARY */}

                  <button
                    type="button"
                    onClick={() => {
                      setFeedbackType("Library");
                      setBookName("");
                    }}
                    className={`
                      group/type
                      relative
                      flex
                      items-center
                      gap-4
                      rounded-2xl
                      border-2
                      p-5
                      text-left
                      transition-all
                      duration-300
                      ${
                        feedbackType === "Library"
                          ? "border-[#890C25] bg-[#890C25]/5"
                          : "border-slate-200 bg-white hover:border-[#890C25]/30"
                      }
                    `}
                  >

                    <div
                      className={`
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        transition
                        ${
                          feedbackType === "Library"
                            ? "bg-[#890C25] text-white"
                            : "bg-purple-100 text-purple-600"
                        }
                      `}
                    >
                      <FaBuilding size={18} />
                    </div>

                    <div>

                      <p className="font-black text-slate-800">
                        Library Feedback
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Share feedback about library services.
                      </p>

                    </div>

                  </button>

                </div>

              </div>

              {/* =============================================
                  BOOK NAME
              ============================================= */}

              {feedbackType === "Book" && (

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
                    Book Name
                  </label>

                  <input
                    type="text"
                    value={bookName}
                    onChange={(e) =>
                      setBookName(
                        e.target.value
                      )
                    }
                    placeholder="Enter book name..."
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-5
                      py-4
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
                  />

                </div>

              )}

              {/* =============================================
                  RATING
              ============================================= */}

              <div className="mt-6">

                <label
                  className="
                    mb-3
                    block
                    text-xs
                    font-black
                    uppercase
                    tracking-wider
                    text-slate-600
                  "
                >
                  Rating
                </label>

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-3
                  "
                >

                  {[1, 2, 3, 4, 5].map(
                    (star) => (

                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          handleRating(star)
                        }
                        className={`
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-xl
                          border
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          ${
                            star <= rating
                              ? "border-yellow-300 bg-yellow-100 text-yellow-500 shadow-sm"
                              : "border-slate-200 bg-white text-slate-300 hover:border-yellow-200"
                          }
                        `}
                      >
                        <FaStar size={19} />
                      </button>

                    )
                  )}

                  <span
                    className="
                      ml-2
                      text-sm
                      font-black
                      text-slate-500
                    "
                  >
                    {getRatingText()}
                  </span>

                </div>

              </div>

              {/* =============================================
                  MESSAGE
              ============================================= */}

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
                  Your Feedback
                </label>

                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  rows="7"
                  placeholder="Write your feedback here..."
                  className="
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-5
                    text-sm
                    font-medium
                    leading-6
                    text-slate-700
                    outline-none
                    transition
                    focus:border-[#890C25]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#890C25]/10
                  "
                />

                <p className="mt-2 text-right text-xs font-medium text-slate-400">
                  {message.length} characters
                </p>

              </div>

              {/* =============================================
                  SUBMIT BUTTON
              ============================================= */}

              <div
                className="
                  mt-8
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:justify-end
                "
              >

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-100
                    px-6
                    py-3.5
                    text-sm
                    font-black
                    text-slate-600
                    transition-all
                    duration-300
                    hover:bg-slate-200
                    disabled:opacity-50
                  "
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group/submit
                    flex
                    items-center
                    justify-center
                    gap-3
                    rounded-xl
                    bg-[#890C25]
                    px-7
                    py-3.5
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
                    disabled:opacity-50
                  "
                >

                  {loading ? (

                    <div
                      className="
                        h-5
                        w-5
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      "
                    />

                  ) : (

                    <FaPaperPlane
                      size={14}
                      className="
                        transition
                        duration-300
                        group-hover/submit:translate-x-1
                        group-hover/submit:-translate-y-1
                      "
                    />

                  )}

                  {loading
                    ? "Submitting..."
                    : "Submit Feedback"}

                </button>

              </div>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Feedback;