import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaStar,
  FaCalendarAlt,
  FaClock,
  FaCheck,
  FaPaperPlane,
  FaBookOpen,
  FaClipboardList,
  FaCommentDots,
} from "react-icons/fa";

import { useReview } from "../../context/ReviewContext";

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    currentReview,
    loading,
    error,
    getSingleReview,
    updateReviewStatus,
    respondToReview,
    clearCurrentReview,
    clearError,
  } = useReview();

  const [response, setResponse] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // =====================================================
  // LOAD REVIEW
  // =====================================================

  useEffect(() => {
    if (id) {
      getSingleReview(id).catch(() => {});
    }

    return () => {
      clearCurrentReview();
    };
  }, [id]);

  // =====================================================
  // LOAD EXISTING RESPONSE
  // =====================================================

  useEffect(() => {
    if (currentReview?.response) {
      setResponse(currentReview.response);
    }
  }, [currentReview]);

  // =====================================================
  // SAFE USER DATA
  // =====================================================

  const visitorName =
    currentReview?.visitorName ||
    currentReview?.name ||
    "Anonymous";

  const visitorEmail =
    currentReview?.visitorEmail ||
    currentReview?.email ||
    "No email available";

  const reviewMessage =
    currentReview?.message ||
    currentReview?.comment ||
    "No review message available.";

  // =====================================================
  // STATUS
  // =====================================================

  const isReviewed =
    currentReview?.status?.toLowerCase() ===
    "reviewed";

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // RATING
  // =====================================================

  const renderStars = (rating) => {
    const value = Number(rating) || 0;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={16}
            className={
              star <= value
                ? "text-yellow-500"
                : "text-slate-300"
            }
          />
        ))}
      </div>
    );
  };

  // =====================================================
  // MARK AS REVIEWED
  // =====================================================

  const handleMarkReviewed = async () => {
    try {
      setSuccessMessage("");
      clearError();

      await updateReviewStatus(
        id,
        "Reviewed"
      );

      setSuccessMessage(
        "Review marked as reviewed successfully."
      );

      await getSingleReview(id);
    } catch (err) {
      console.error(
        "Mark reviewed error:",
        err
      );
    }
  };

  // =====================================================
  // RESPONSE
  // =====================================================

  const handleResponse = async (e) => {
    e.preventDefault();

    if (!response.trim()) {
      return;
    }

    try {
      setSuccessMessage("");
      clearError();

      await respondToReview(id, {
        response: response.trim(),
      });

      setSuccessMessage(
        "Response sent successfully."
      );

      // Redirect to Manage Reviews
      setTimeout(() => {
        navigate("/reviews");
      }, 1000);
    } catch (err) {
      console.error(
        "Send response error:",
        err
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && !currentReview) {
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
        "
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div
                className="
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
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
                Loading Review
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Fetching review details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!currentReview && !loading) {
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
        "
      >
        <div className="mx-auto max-w-7xl">
          <div
            className="
              flex
              min-h-[60vh]
              items-center
              justify-center
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
                p-10
                text-center
                shadow-xl
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-12
                  -top-12
                  h-32
                  w-32
                  rounded-full
                  bg-[#890C25]/5
                "
              />

              <div
                className="
                  relative
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  bg-[#890C25]/10
                  text-[#890C25]
                "
              >
                <FaBookOpen size={28} />
              </div>

              <h2 className="relative mt-6 text-xl font-black text-slate-800">
                Review Not Found
              </h2>

              <p className="relative mt-2 text-sm leading-6 text-slate-500">
                The requested review could not be found.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/reviews")
                }
                className="
                  mt-6
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-[#890C25]
                  px-6
                  py-3
                  text-sm
                  font-black
                  text-white
                  shadow-lg
                  shadow-[#890C25]/20
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[#6f091e]
                "
              >
                <FaArrowLeft size={12} />
                Back to Reviews
              </button>
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
    <div
      className="
        min-h-screen
        bg-slate-100
        px-4
        pb-12
        pt-8
        sm:px-6
        sm:pt-10
        lg:px-8
        lg:pt-12
      "
    >
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HERO
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
              <button
                type="button"
                onClick={() =>
                  navigate("/reviews")
                }
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/15
                  bg-white/10
                  px-4
                  py-2
                  text-xs
                  font-black
                  text-white/85
                  backdrop-blur-md
                  transition
                  hover:bg-white/15
                "
              >
                <FaArrowLeft size={10} />
                Back to Reviews
              </button>

              <div className="mb-4 flex items-center gap-3">
                <div
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    border-4
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
                Review Details
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
                View visitor information, rating,
                submitted review and review status.
              </p>
            </div>

            {/* BLUE STATUS CARD */}

            <div
              className="
                group/status
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
                  group-hover/status:scale-125
                "
              />

              <div className="relative">
                <div
                  className="
                    mx-auto
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    border-4
                    border-white/20
                    bg-white/15
                    text-white
                    shadow-xl
                  "
                >
                  {isReviewed ? (
                    <FaCheck size={23} />
                  ) : (
                    <FaClock size={23} />
                  )}
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
                  Review Status
                </p>

                <p className="mt-1 text-2xl font-black text-white">
                  {isReviewed
                    ? "Reviewed"
                    : "Pending"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            ALERTS
        ================================================= */}

        {error && (
          <div
            className="
              mb-6
              flex
              items-center
              justify-between
              gap-4
              rounded-2xl
              border
              border-red-200
              bg-white
              px-5
              py-4
              text-sm
              font-semibold
              text-red-700
              shadow-lg
            "
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={clearError}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-red-50
                text-red-600
              "
            >
              ×
            </button>
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
              bg-white
              px-5
              py-4
              text-sm
              font-semibold
              text-green-700
              shadow-lg
            "
          >
            <span
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-green-100
                text-green-600
              "
            >
              <FaCheck />
            </span>

            {successMessage}
          </div>
        )}

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* =================================================
              USER INFORMATION
          ================================================= */}

          <div
            className="
              group/user
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
                right-0
                top-0
                h-1.5
                w-16
                rounded-br-full
                bg-gradient-to-r
                from-[#65091c]
                via-[#890C25]
                to-[#D58A98]
                transition-all
                duration-500
                group-hover/user:w-full
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -right-14
                -top-14
                h-36
                w-36
                rounded-full
                bg-[#890C25]/5
              "
            />

            <div className="relative">

              {/* AVATAR */}

              <div className="flex flex-col items-center text-center">
                <div
                  className="
                    flex
                    h-24
                    w-24
                    items-center
                    justify-center
                    rounded-full
                    border-4
                    border-[#890C25]/10
                    bg-[#890C25]/10
                    text-[#890C25]
                    shadow-lg
                  "
                >
                  <FaUser size={31} />
                </div>

                <h2 className="mt-5 text-xl font-black text-slate-800">
                  {visitorName}
                </h2>

                <p className="mt-1 text-xs font-bold text-slate-400">
                  Review Author
                </p>
              </div>

              {/* USER BOXES */}

              <div className="mt-7 space-y-4">

                {/* EMAIL */}

                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-100
                        text-blue-600
                      "
                    >
                      <FaEnvelope size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-bold text-slate-700">
                        {visitorEmail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* DATE */}

                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#890C25]/10
                        text-[#890C25]
                      "
                    >
                      <FaCalendarAlt size={14} />
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Submitted
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {formatDate(
                          currentReview.createdAt ||
                            currentReview.date
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* RATING */}

                <div
                  className="
                    rounded-2xl
                    border
                    border-yellow-200
                    bg-yellow-50
                    p-4
                  "
                >
                  <p className="text-[10px] font-black uppercase tracking-wider text-yellow-700">
                    Rating
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        bg-yellow-100
                        text-yellow-500
                      "
                    >
                      <FaStar size={17} />
                    </div>

                    <div>
                      {renderStars(
                        currentReview.rating
                      )}

                      <p className="mt-1 text-sm font-black text-yellow-700">
                        {currentReview.rating || 0}/5
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="space-y-6 lg:col-span-2">

            {/* REVIEW CARD */}

            <div
              className="
                group/review
                relative
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-xl
                sm:p-7
              "
            >
              <div
                className="
                  absolute
                  left-0
                  right-0
                  top-0
                  h-1.5
                  w-16
                  rounded-br-full
                  bg-gradient-to-r
                  from-[#65091c]
                  via-[#890C25]
                  to-[#D58A98]
                  transition-all
                  duration-500
                  group-hover/review:w-full
                "
              />

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      bg-[#890C25]/10
                      text-[#890C25]
                    "
                  >
                    <FaCommentDots size={18} />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-800">
                      Visitor Review
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Submitted feedback
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-yellow-50
                    text-yellow-500
                  "
                >
                  <FaStar size={17} />
                </div>
              </div>

              {/* MESSAGE BOX */}

              <div
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-5
                "
              >
                <p className="whitespace-pre-wrap text-sm font-medium leading-7 text-slate-600">
                  {reviewMessage}
                </p>
              </div>

              {currentReview.createdAt && (
                <div
                  className="
                    mt-4
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    text-slate-400
                  "
                >
                  <FaClock />
                  {formatDateTime(
                    currentReview.createdAt
                  )}
                </div>
              )}
            </div>

            {/* EXISTING RESPONSE */}

            {currentReview.response && (
              <div
                className="
                  rounded-3xl
                  border
                  border-blue-200
                  bg-blue-50
                  p-6
                  shadow-lg
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
                      rounded-full
                      bg-blue-100
                      text-blue-600
                    "
                  >
                    <FaPaperPlane size={14} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-slate-800">
                      Admin Response
                    </h2>

                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      Response already submitted
                    </p>
                  </div>
                </div>

                <div
                  className="
                    mt-5
                    rounded-2xl
                    border
                    border-blue-200
                    bg-white
                    p-4
                  "
                >
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {currentReview.response}
                  </p>
                </div>
              </div>
            )}

            {/* RESPONSE BOX */}

            <div
              className="
                group/response
                relative
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-xl
                sm:p-7
              "
            >
              <div
                className="
                  absolute
                  left-0
                  right-0
                  top-0
                  h-1.5
                  w-16
                  rounded-br-full
                  bg-gradient-to-r
                  from-blue-600
                  via-blue-700
                  to-blue-900
                  transition-all
                  duration-500
                  group-hover/response:w-full
                "
              />

              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-100
                    text-blue-600
                  "
                >
                  <FaPaperPlane size={16} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-800">
                    {currentReview.response
                      ? "Update Response"
                      : "Write Response"}
                  </h2>

                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    Send a response to this visitor
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleResponse}
                className="mt-5"
              >
                <textarea
                  value={response}
                  onChange={(e) =>
                    setResponse(e.target.value)
                  }
                  rows={6}
                  placeholder="Write your response here..."
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
                    leading-6
                    text-slate-700
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-500/10
                  "
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !response.trim()
                    }
                    className="
                      flex
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      bg-gradient-to-r
                      from-blue-600
                      via-blue-700
                      to-blue-900
                      px-5
                      py-3.5
                      text-sm
                      font-black
                      text-white
                      shadow-lg
                      shadow-blue-700/20
                      transition
                      hover:-translate-y-0.5
                      hover:shadow-xl
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <span
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        bg-white/10
                      "
                    >
                      <FaPaperPlane size={12} />
                    </span>

                    {loading
                      ? "Submitting..."
                      : currentReview.response
                      ? "Update Response"
                      : "Send Response"}
                  </button>

                  {!isReviewed && (
                    <button
                      type="button"
                      onClick={
                        handleMarkReviewed
                      }
                      disabled={loading}
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-green-600
                        px-6
                        py-3.5
                        text-sm
                        font-black
                        text-white
                        shadow-lg
                        shadow-green-600/20
                        transition
                        hover:-translate-y-0.5
                        hover:bg-green-700
                        hover:shadow-xl
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        sm:w-52
                      "
                    >
                      <span
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          bg-white/10
                        "
                      >
                        <FaCheck size={12} />
                      </span>

                      Mark as Reviewed
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;