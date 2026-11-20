import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaBookOpen,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaCommentDots,
  FaEnvelope,
  FaInfoCircle,
  FaReply,
  FaStar,
  FaUser,
  FaPaperPlane,
} from "react-icons/fa";

import { useFeedback } from "../../context/FeedbackContext";

// =====================================================
// FEEDBACK DETAILS
// =====================================================

const FeedbackDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const {
    getSingleFeedback,
    reviewFeedback,
    loading,
  } = useFeedback();

  // =====================================================
  // STATES
  // =====================================================

  const [feedback, setFeedback] =
    useState(
      location.state?.feedback || null
    );

  const [pageLoading, setPageLoading] =
    useState(!location.state?.feedback);

  const [error, setError] = useState("");

  const [response, setResponse] =
    useState(
      location.state?.feedback?.response || ""
    );

  const [submitting, setSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  // =====================================================
  // FETCH FEEDBACK
  // =====================================================

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setPageLoading(true);
        setError("");

        const data =
          await getSingleFeedback(id);

        setFeedback(data);

        setResponse(
          data?.response || ""
        );
      } catch (err) {
        console.error(
          "Fetch Feedback Details Error:",
          err
        );

        setError(
          err.message ||
            "Failed to load feedback details."
        );
      } finally {
        setPageLoading(false);
      }
    };

    if (id) {
      fetchFeedback();
    }
  }, [id]);

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  // =====================================================
  // TIME FORMAT
  // =====================================================

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // SUBMIT REVIEW
  // =====================================================

  const handleReview = async (e) => {
    e.preventDefault();

    if (!response.trim()) {
      setError(
        "Please write a response before submitting the review."
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");

      const updatedFeedback =
        await reviewFeedback(
          id,
          response.trim()
        );

      // ===============================================
      // UPDATE LOCAL DATA
      // ===============================================

      if (updatedFeedback) {
        setFeedback(
          updatedFeedback.feedback ||
            updatedFeedback
        );

        setResponse(
          updatedFeedback.feedback?.response ||
            updatedFeedback.response ||
            response.trim()
        );
      } else {
        setFeedback((prev) => ({
          ...prev,
          status: "Reviewed",
          response: response.trim(),
        }));
      }

      setSuccessMessage(
        "Feedback reviewed successfully."
      );

    } catch (err) {
      console.error(
        "Review Feedback Error:",
        err
      );

      setError(
        err.message ||
          "Failed to submit feedback review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (pageLoading || loading) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-slate-100
          px-4
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            rounded-3xl
            bg-white
            px-10
            py-12
            text-center
            shadow-xl
          "
        >
          <div
            className="
              h-12
              w-12
              animate-spin
              rounded-full
              border-4
              border-[#890C25]/20
              border-t-[#890C25]
            "
          />

          <p
            className="
              mt-5
              text-sm
              font-black
              text-slate-700
            "
          >
            Loading Feedback...
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-400
            "
          >
            Please wait while we fetch the details.
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && !feedback) {
    return (
      <div
        className="
          min-h-screen
          bg-slate-100
          px-4
          py-10
          sm:px-6
          lg:px-8
        "
      >
        <div className="mx-auto max-w-5xl">

          <Link
            to="/feedback/manage"
            className="
              mb-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-white
              px-5
              py-3
              text-sm
              font-black
              text-[#890C25]
              shadow-sm
              transition
              hover:-translate-x-1
            "
          >
            <FaArrowLeft />
            Back to Manage Feedback
          </Link>

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              rounded-3xl
              border
              border-red-200
              bg-white
              px-6
              py-16
              text-center
              shadow-xl
            "
          >

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-red-100
                text-red-600
              "
            >
              <FaInfoCircle size={25} />
            </div>

            <h2
              className="
                mt-5
                text-2xl
                font-black
                text-slate-800
              "
            >
              Unable to Load Feedback
            </h2>

            <p
              className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
              "
            >
              {error}
            </p>

          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // NO FEEDBACK
  // =====================================================

  if (!feedback) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-slate-100
          px-4
        "
      >
        <div
          className="
            rounded-3xl
            bg-white
            px-10
            py-14
            text-center
            shadow-xl
          "
        >

          <FaCommentDots
            className="mx-auto text-slate-300"
            size={45}
          />

          <h2
            className="
              mt-5
              text-2xl
              font-black
              text-slate-800
            "
          >
            Feedback Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            The requested feedback could not be found.
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const isBookFeedback =
    feedback.feedbackType === "Book";

  const isReviewed =
    feedback.status === "Reviewed";

  const bookTitle =
    feedback.book?.title ||
    feedback.bookName ||
    "Book Information";

  const studentName =
    feedback.student?.name ||
    "Student";

  const studentEmail =
    feedback.student?.email ||
    "";

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
        lg:px-8
        lg:pt-12
      "
    >
      <div className="mx-auto max-w-6xl">

        {/* =============================================
            BACK
        ============================================= */}

        <Link
          to="/feedback/manage"
          className="
            mb-6
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-5
            py-3
            text-sm
            font-black
            text-slate-600
            shadow-sm
            transition-all
            duration-300
            hover:-translate-x-1
            hover:border-[#890C25]/20
            hover:text-[#890C25]
            hover:shadow-md
          "
        >
          <FaArrowLeft />
          Back to Manage Feedback
        </Link>

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
              gap-6
              p-6
              sm:p-8
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            <div>

              <div className="flex items-center gap-4">

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
                    Feedback Management
                  </p>

                  <p className="mt-1 text-xs text-white/50">
                    Library Management System
                  </p>

                </div>

              </div>

              <h1
                className="
                  mt-6
                  text-3xl
                  font-black
                  text-white
                  sm:text-4xl
                "
              >
                Review Feedback
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
                Review the student's feedback and
                provide an official response from
                library management.
              </p>

            </div>

            {/* STATUS */}

            <div
              className={`
                flex
                items-center
                gap-3
                self-start
                rounded-2xl
                border
                px-5
                py-4
                backdrop-blur-md
                lg:self-center
                ${
                  isReviewed
                    ? "border-green-300/30 bg-green-400/10 text-green-100"
                    : "border-yellow-300/30 bg-yellow-400/10 text-yellow-100"
                }
              `}
            >

              {isReviewed ? (
                <FaCheckCircle />
              ) : (
                <FaClock />
              )}

              <div>

                <p className="text-[10px] font-black uppercase tracking-wider opacity-70">
                  Status
                </p>

                <p className="mt-1 text-sm font-black">
                  {feedback.status || "Pending"}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =============================================
            SUCCESS
        ============================================= */}

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
              font-bold
              text-green-700
            "
          >
            <FaCheckCircle />
            {successMessage}
          </div>
        )}

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
            MAIN GRID
        ============================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-3
          "
        >

          {/* ===========================================
              LEFT
          =========================================== */}

          <div
            className="
              space-y-6
              lg:col-span-2
            "
          >

            {/* FEEDBACK INFORMATION */}

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
                  right-0
                  top-0
                  h-1.5
                  bg-gradient-to-r
                  from-[#65091c]
                  via-[#890C25]
                  to-[#D58A98]
                "
              />

              <div className="p-6 sm:p-8">

                <div
                  className="
                    mb-7
                    flex
                    items-center
                    gap-4
                  "
                >

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
                    {isBookFeedback ? (
                      <FaBookOpen />
                    ) : (
                      <FaBuilding />
                    )}
                  </div>

                  <div>

                    <p
                      className="
                        text-xs
                        font-black
                        uppercase
                        tracking-wider
                        text-slate-400
                      "
                    >
                      Feedback Type
                    </p>

                    <h2
                      className="
                        mt-1
                        text-xl
                        font-black
                        text-slate-800
                      "
                    >
                      {feedback.feedbackType}
                    </h2>

                  </div>

                </div>

                {/* DETAILS */}

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                  "
                >

                  {/* BOOK */}

                  {isBookFeedback && (
                    <div
                      className="
                        rounded-2xl
                        border
                        border-slate-100
                        bg-slate-50
                        p-5
                      "
                    >

                      <div className="flex items-center gap-3">

                        <FaBookOpen className="text-blue-600" />

                        <span
                          className="
                            text-xs
                            font-black
                            uppercase
                            tracking-wider
                            text-slate-400
                          "
                        >
                          Book
                        </span>

                      </div>

                      <p
                        className="
                          mt-3
                          text-sm
                          font-black
                          text-slate-700
                        "
                      >
                        {bookTitle}
                      </p>

                      {feedback.book?.author && (
                        <p className="mt-1 text-xs text-slate-400">
                          by {feedback.book.author}
                        </p>
                      )}

                    </div>
                  )}

                  {/* RATING */}

                  <div
                    className="
                      rounded-2xl
                      border
                      border-slate-100
                      bg-slate-50
                      p-5
                    "
                  >

                    <div className="flex items-center gap-3">

                      <FaStar className="text-yellow-500" />

                      <span
                        className="
                          text-xs
                          font-black
                          uppercase
                          tracking-wider
                          text-slate-400
                        "
                      >
                        Rating
                      </span>

                    </div>

                    <div className="mt-3 flex items-center gap-3">

                      <div className="flex gap-1">

                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <FaStar
                              key={star}
                              size={15}
                              className={
                                star <=
                                feedback.rating
                                  ? "text-yellow-400"
                                  : "text-slate-200"
                              }
                            />
                          )
                        )}

                      </div>

                      <span className="text-sm font-black text-slate-700">
                        {feedback.rating} / 5
                      </span>

                    </div>

                  </div>

                  {/* DATE */}

                  <div
                    className="
                      rounded-2xl
                      border
                      border-slate-100
                      bg-slate-50
                      p-5
                    "
                  >

                    <div className="flex items-center gap-3">

                      <FaCalendarAlt className="text-purple-600" />

                      <span
                        className="
                          text-xs
                          font-black
                          uppercase
                          tracking-wider
                          text-slate-400
                        "
                      >
                        Submitted
                      </span>

                    </div>

                    <p
                      className="
                        mt-3
                        text-sm
                        font-black
                        text-slate-700
                      "
                    >
                      {formatDate(
                        feedback.createdAt
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatTime(
                        feedback.createdAt
                      )}
                    </p>

                  </div>

                  {/* STATUS */}

                  <div
                    className="
                      rounded-2xl
                      border
                      border-slate-100
                      bg-slate-50
                      p-5
                    "
                  >

                    <div className="flex items-center gap-3">

                      {isReviewed ? (
                        <FaCheckCircle className="text-green-600" />
                      ) : (
                        <FaClock className="text-yellow-600" />
                      )}

                      <span
                        className="
                          text-xs
                          font-black
                          uppercase
                          tracking-wider
                          text-slate-400
                        "
                      >
                        Current Status
                      </span>

                    </div>

                    <p
                      className={`
                        mt-3
                        text-sm
                        font-black
                        ${
                          isReviewed
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      `}
                    >
                      {feedback.status || "Pending"}
                    </p>

                  </div>

                </div>

                {/* MESSAGE */}

                <div className="mt-6">

                  <div className="mb-3 flex items-center gap-3">

                    <FaCommentDots className="text-[#890C25]" />

                    <h3
                      className="
                        text-sm
                        font-black
                        uppercase
                        tracking-wider
                        text-slate-600
                      "
                    >
                      Student Message
                    </h3>

                  </div>

                  <div
                    className="
                      rounded-2xl
                      border
                      border-slate-100
                      bg-slate-50
                      p-5
                    "
                  >

                    <p
                      className="
                        whitespace-pre-wrap
                        text-sm
                        leading-7
                        text-slate-600
                      "
                    >
                      {feedback.message}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* =========================================
                MANAGEMENT RESPONSE
            ========================================= */}

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
                  right-0
                  top-0
                  h-1.5
                  bg-gradient-to-r
                  from-blue-700
                  via-blue-500
                  to-cyan-400
                "
              />

              <div className="p-6 sm:p-8">

                <div className="flex items-center gap-4">

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
                    <FaReply />
                  </div>

                  <div>

                    <p
                      className="
                        text-xs
                        font-black
                        uppercase
                        tracking-wider
                        text-slate-400
                      "
                    >
                      Management Response
                    </p>

                    <h2
                      className="
                        mt-1
                        text-xl
                        font-black
                        text-slate-800
                      "
                    >
                      Respond to Student
                    </h2>

                  </div>

                </div>

                {/* REVIEWED */}

                {isReviewed ? (

                  <div className="mt-6">

                    <div
                      className="
                        rounded-2xl
                        border
                        border-green-100
                        bg-green-50
                        p-5
                      "
                    >

                      <div className="mb-3 flex items-center gap-2">

                        <FaCheckCircle className="text-green-600" />

                        <p className="text-xs font-black uppercase tracking-wider text-green-700">
                          Reviewed Response
                        </p>

                      </div>

                      <p
                        className="
                          whitespace-pre-wrap
                          text-sm
                          leading-7
                          text-slate-600
                        "
                      >
                        {feedback.response ||
                          "No response available."}
                      </p>

                    </div>

                    {feedback.reviewedBy && (
                      <div
                        className="
                          mt-4
                          flex
                          flex-wrap
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
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-[#890C25]/10
                            text-[#890C25]
                          "
                        >
                          <FaUser />
                        </div>

                        <div>

                          <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                            Reviewed By
                          </p>

                          <p className="mt-1 text-sm font-black text-slate-700">
                            {feedback.reviewedBy.name ||
                              "Management"}
                          </p>

                          {feedback.reviewedBy.email && (
                            <p className="mt-1 text-xs text-slate-400">
                              {feedback.reviewedBy.email}
                            </p>
                          )}

                        </div>

                      </div>
                    )}

                  </div>

                ) : (

                  /* =====================================
                     PENDING RESPONSE FORM
                  ===================================== */

                  <form
                    onSubmit={handleReview}
                    className="mt-6"
                  >

                    <div
                      className="
                        rounded-2xl
                        border
                        border-yellow-100
                        bg-yellow-50
                        p-4
                      "
                    >

                      <div className="flex items-start gap-3">

                        <FaClock
                          className="
                            mt-1
                            shrink-0
                            text-yellow-600
                          "
                        />

                        <div>

                          <p className="text-sm font-black text-yellow-700">
                            This feedback is waiting for review.
                          </p>

                          <p className="mt-1 text-xs leading-5 text-yellow-600/80">
                            Write an official response and
                            submit the review to mark this
                            feedback as Reviewed.
                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="mt-5">

                      <label
                        className="
                          mb-2
                          block
                          text-xs
                          font-black
                          uppercase
                          tracking-wider
                          text-slate-500
                        "
                      >
                        Management Response
                      </label>

                      <textarea
                        value={response}
                        onChange={(e) =>
                          setResponse(
                            e.target.value
                          )
                        }
                        rows={6}
                        placeholder="Write your response to the student..."
                        className="
                          w-full
                          resize-none
                          rounded-2xl
                          border
                          border-slate-200
                          bg-slate-50
                          px-5
                          py-4
                          text-sm
                          leading-7
                          text-slate-700
                          outline-none
                          transition
                          focus:border-[#890C25]
                          focus:bg-white
                          focus:ring-4
                          focus:ring-[#890C25]/10
                        "
                      />

                      <p className="mt-2 text-right text-xs text-slate-400">
                        {response.length} characters
                      </p>

                    </div>

                    <button
                      type="submit"
                      disabled={
                        submitting ||
                        !response.trim()
                      }
                      className="
                        mt-4
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-3
                        rounded-2xl
                        bg-[#890C25]
                        px-6
                        py-4
                        text-sm
                        font-black
                        text-white
                        shadow-lg
                        transition-all
                        duration-300
                        hover:bg-[#65091c]
                        hover:shadow-xl
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >

                      {submitting ? (

                        <>
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

                          Submitting Review...
                        </>

                      ) : (

                        <>
                          <FaPaperPlane />
                          Submit Review
                        </>

                      )}

                    </button>

                  </form>

                )}

              </div>

            </div>

          </div>

          {/* ===========================================
              RIGHT SIDEBAR
          =========================================== */}

          <div className="space-y-6">

            {/* STUDENT */}

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
                  right-0
                  top-0
                  h-1.5
                  bg-gradient-to-r
                  from-[#65091c]
                  via-[#890C25]
                  to-[#D58A98]
                "
              />

              <div className="p-6">

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#890C25]
                    text-white
                    shadow-lg
                  "
                >
                  <FaUser size={20} />
                </div>

                <p
                  className="
                    mt-5
                    text-xs
                    font-black
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Submitted By
                </p>

                <h3
                  className="
                    mt-2
                    text-xl
                    font-black
                    text-slate-800
                  "
                >
                  {studentName}
                </h3>

                {studentEmail && (
                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      gap-2
                      text-xs
                      font-medium
                      text-slate-500
                    "
                  >
                    <FaEnvelope />

                    <span className="break-all">
                      {studentEmail}
                    </span>

                  </div>
                )}

              </div>

            </div>

            {/* RATING */}

            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                bg-gradient-to-br
                from-blue-600
                via-blue-700
                to-blue-900
                p-6
                text-white
                shadow-xl
              "
            >

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-16
                  -right-16
                  h-44
                  w-44
                  rounded-full
                  border
                  border-white/20
                  bg-white/5
                "
              />

              <div className="relative">

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-white/10
                      text-yellow-300
                    "
                  >
                    <FaStar />
                  </div>

                  <p className="text-xs font-black uppercase tracking-wider text-blue-100/70">
                    Rating Given
                  </p>

                </div>

                <p
                  className="
                    mt-5
                    text-5xl
                    font-black
                  "
                >
                  {feedback.rating}

                  <span className="text-xl text-blue-100/50">
                    /5
                  </span>
                </p>

                <div className="mt-4 flex gap-1">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <FaStar
                        key={star}
                        size={16}
                        className={
                          star <=
                          feedback.rating
                            ? "text-yellow-300"
                            : "text-white/20"
                        }
                      />
                    )
                  )}

                </div>

              </div>

            </div>

            {/* INFORMATION */}

            <div
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-xl
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-purple-100
                    text-purple-600
                  "
                >
                  <FaInfoCircle />
                </div>

                <h3
                  className="
                    text-lg
                    font-black
                    text-slate-800
                  "
                >
                  Feedback Information
                </h3>

              </div>

              <div className="mt-6 space-y-4">

                {/* TYPE */}

                <div className="flex items-center justify-between gap-4">

                  <span className="text-xs font-bold text-slate-400">
                    Type
                  </span>

                  <span className="rounded-lg bg-[#890C25]/10 px-3 py-1.5 text-xs font-black text-[#890C25]">
                    {feedback.feedbackType}
                  </span>

                </div>

                <div className="h-px bg-slate-100" />

                {/* BOOK */}

                {isBookFeedback && (
                  <>
                    <div className="flex items-start justify-between gap-4">

                      <span className="text-xs font-bold text-slate-400">
                        Book
                      </span>

                      <span className="max-w-[160px] text-right text-xs font-black text-slate-600">
                        {bookTitle}
                      </span>

                    </div>

                    <div className="h-px bg-slate-100" />
                  </>
                )}

                {/* STATUS */}

                <div className="flex items-center justify-between gap-4">

                  <span className="text-xs font-bold text-slate-400">
                    Status
                  </span>

                  <span
                    className={`
                      rounded-lg
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
                    {feedback.status || "Pending"}
                  </span>

                </div>

                <div className="h-px bg-slate-100" />

                {/* DATE */}

                <div className="flex items-center justify-between gap-4">

                  <span className="text-xs font-bold text-slate-400">
                    Submitted
                  </span>

                  <span className="text-right text-xs font-black text-slate-600">
                    {formatDate(
                      feedback.createdAt
                    )}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default FeedbackDetails;