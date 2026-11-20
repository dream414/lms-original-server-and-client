import { useState } from "react";
import {
  FaStar,
  FaPaperPlane,
  FaUser,
  FaEnvelope,
  FaCommentDots,
  FaCheckCircle,
  FaClipboardList,
} from "react-icons/fa";

import { useReview } from "../../context/ReviewContext";

const SubmitReview = () => {
  const {
    createReview,
    loading,
    error,
    clearError,
  } = useReview();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [success, setSuccess] = useState("");

  // =====================================================
  // SUBMIT REVIEW
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    clearError();

    if (!name.trim()) {
      return;
    }

    if (!email.trim()) {
      return;
    }

    if (!comment.trim()) {
      return;
    }

    try {
      await createReview({
        name: name.trim(),
        email: email.trim(),
        rating,
        comment: comment.trim(),
      });

      setSuccess(
        "Thank you! Your review has been submitted successfully."
      );

      setName("");
      setEmail("");
      setRating(5);
      setComment("");
    } catch (err) {
      console.error(
        "Submit review error:",
        err
      );
    }
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
          {/* Decorative circles */}

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
              pointer-events-none
              absolute
              left-20
              top-8
              h-14
              w-14
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

                {/* CIRCLE ICON */}

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
                  <FaStar size={25} />
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
                Share Your Review
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
                Share your experience with our Library
                Management System and help us improve
                the learning and library experience.
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
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Visitor Review
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
                  Your Voice Matters
                </div>

              </div>
            </div>

            {/* =================================================
                BLUE RATING BOX
            ================================================= */}

            <div
              className="
                group/rating
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
                  group-hover/rating:scale-125
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -left-8
                  -top-8
                  h-24
                  w-24
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                "
              />

              <div className="relative">

                {/* CIRCLE */}

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
                    backdrop-blur-md
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
                    text-blue-100/80
                  "
                >
                  Selected Rating
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
                  {rating}
                  <span className="text-2xl">
                    /5
                  </span>
                </p>

                <div className="mt-4 flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <FaStar
                        key={star}
                        size={13}
                        className={
                          star <= rating
                            ? "text-white"
                            : "text-white/30"
                        }
                      />
                    )
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div
            className="
              mb-6
              flex
              items-start
              gap-3
              rounded-3xl
              border
              border-green-200
              bg-white
              px-5
              py-4
              text-green-700
              shadow-lg
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
                rounded-full
                bg-green-100
                text-green-600
                shadow-sm
              "
            >
              <FaCheckCircle />
            </div>

            <div>
              <p className="font-black">
                Review Submitted
              </p>

              <p className="mt-1 text-sm text-green-600/80">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="
              mb-6
              rounded-3xl
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
            {error}
          </div>
        )}

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* =================================================
              REVIEW FORM
          ================================================= */}

          <div
            className="
              group/form
              relative
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-xl
              lg:col-span-2
            "
          >
            {/* TOP LINE */}

            <div
              className="
                absolute
                left-0
                right-0
                top-0
                z-10
                h-1.5
                w-16
                rounded-br-full
                bg-gradient-to-r
                from-[#65091c]
                via-[#890C25]
                to-[#D58A98]
                transition-all
                duration-700
                group-hover/form:w-full
              "
            />

            {/* Decorative circles */}

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

            <div
              className="
                pointer-events-none
                absolute
                -bottom-20
                -left-16
                h-44
                w-44
                rounded-full
                bg-blue-500/5
              "
            />

            <div className="relative p-6 sm:p-8">

              {/* HEADER */}

              <div className="mb-7 flex items-center gap-3">

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
                    shadow-sm
                  "
                >
                  <FaClipboardList size={18} />
                </div>

                <div>
                  <h2
                    className="
                      text-2xl
                      font-black
                      tracking-tight
                      text-slate-800
                    "
                  >
                    Review Form
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Tell us about your experience.
                  </p>
                </div>

              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* NAME */}

                <div>
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
                    Your Name
                  </label>

                  <div className="relative">

                    <div
                      className="
                        absolute
                        left-3
                        top-1/2
                        flex
                        h-8
                        w-8
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-[#890C25]/10
                        text-[#890C25]
                      "
                    >
                      <FaUser size={12} />
                    </div>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearError();
                      }}
                      placeholder="Enter your name"
                      disabled={loading}
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        py-3.5
                        pl-14
                        pr-4
                        text-sm
                        font-medium
                        text-slate-700
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-[#890C25]
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#890C25]/10
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    />

                  </div>
                </div>

                {/* EMAIL */}

                <div>
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
                    Email Address
                  </label>

                  <div className="relative">

                    <div
                      className="
                        absolute
                        left-3
                        top-1/2
                        flex
                        h-8
                        w-8
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-100
                        text-blue-600
                      "
                    >
                      <FaEnvelope size={12} />
                    </div>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError();
                      }}
                      placeholder="Enter your email"
                      disabled={loading}
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        py-3.5
                        pl-14
                        pr-4
                        text-sm
                        font-medium
                        text-slate-700
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-500/10
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    />

                  </div>
                </div>

                {/* RATING */}

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
                    Your Rating
                  </label>

                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-4
                    "
                  >
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <button
                          key={star}
                          type="button"
                          disabled={loading}
                          onClick={() => {
                            setRating(star);
                            clearError();
                          }}
                          className={`
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            border-4
                            transition
                            duration-200
                            hover:-translate-y-0.5
                            hover:scale-105
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            ${
                              star <= rating
                                ? "border-yellow-200 bg-yellow-100 text-yellow-500 shadow-md"
                                : "border-slate-200 bg-white text-slate-300"
                            }
                          `}
                          aria-label={`Rate ${star} star${
                            star > 1 ? "s" : ""
                          }`}
                        >
                          <FaStar size={18} />
                        </button>
                      )
                    )}

                    <div className="ml-2">
                      <p className="text-xs font-bold text-slate-400">
                        Selected
                      </p>

                      <p className="font-black text-[#890C25]">
                        {rating}/5
                      </p>
                    </div>
                  </div>
                </div>

                {/* REVIEW */}

                <div>
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
                    Your Review
                  </label>

                  <div className="relative">

                    <div
                      className="
                        absolute
                        left-3
                        top-4
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        bg-[#890C25]/10
                        text-[#890C25]
                      "
                    >
                      <FaCommentDots size={12} />
                    </div>

                    <textarea
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                        clearError();
                      }}
                      placeholder="Write your review here..."
                      rows={7}
                      disabled={loading}
                      className="
                        w-full
                        resize-none
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        py-4
                        pl-14
                        pr-4
                        text-sm
                        font-medium
                        leading-6
                        text-slate-700
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-[#890C25]
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#890C25]/10
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    />

                  </div>

                  <div className="mt-2 flex justify-between">
                    <p className="text-xs font-medium text-slate-400">
                      Share your honest experience.
                    </p>

                    <p className="text-xs font-semibold text-slate-400">
                      {comment.length} characters
                    </p>
                  </div>
                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group/submit
                    relative
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-3
                    overflow-hidden
                    rounded-2xl
                    bg-[#890C25]
                    px-6
                    py-4
                    text-sm
                    font-black
                    text-white
                    shadow-lg
                    shadow-[#890C25]/20
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#6f091e]
                    hover:shadow-xl
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <span
                    className="
                      absolute
                      -right-8
                      -top-8
                      h-24
                      w-24
                      rounded-full
                      bg-white/5
                      transition
                      duration-500
                      group-hover/submit:scale-150
                    "
                  />

                  <span
                    className="
                      relative
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/20
                      bg-white/10
                    "
                  >
                    {loading ? (
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
                      <FaPaperPlane size={13} />
                    )}
                  </span>

                  <span className="relative">
                    {loading
                      ? "Submitting Review..."
                      : "Submit Review"}
                  </span>
                </button>

              </form>
            </div>
          </div>

          {/* =================================================
              SIDE INFO BOX
          ================================================= */}

          <div
            className="
              group/info
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
                h-1.5
                w-20
                rounded-br-full
                bg-gradient-to-r
                from-[#65091c]
                via-[#890C25]
                to-[#D58A98]
                transition-all
                duration-500
                group-hover/info:w-full
              "
            />

            {/* DECORATIVE CIRCLES */}

            <div
              className="
                pointer-events-none
                absolute
                -right-12
                -top-12
                h-36
                w-36
                rounded-full
                border
                border-[#890C25]/10
                bg-[#890C25]/5
                transition
                duration-500
                group-hover/info:scale-125
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-14
                -left-14
                h-36
                w-36
                rounded-full
                bg-blue-500/5
              "
            />

            <div className="relative p-6 sm:p-7">

              {/* CIRCLE */}

              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  border-4
                  border-[#890C25]/10
                  bg-[#890C25]/10
                  text-[#890C25]
                  shadow-sm
                "
              >
                <FaStar size={23} />
              </div>

              <h3
                className="
                  mt-5
                  text-xl
                  font-black
                  text-slate-800
                "
              >
                Why Your Review Matters
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                Your review helps us understand your
                experience and improve our digital
                library services.
              </p>

              {/* INFO BOXES */}

              <div className="mt-6 space-y-3">

                <div
                  className="
                    group/box
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#890C25]/20
                    hover:bg-white
                    hover:shadow-lg
                  "
                >
                  <div className="flex items-start gap-3">

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#890C25]/10
                        text-[#890C25]
                      "
                    >
                      <FaCommentDots size={13} />
                    </div>

                    <div>
                      <p className="text-sm font-black text-slate-700">
                        Honest Feedback
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Share what you genuinely think about
                        your experience.
                      </p>
                    </div>

                  </div>
                </div>

                <div
                  className="
                    group/box
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:border-blue-200
                    hover:bg-white
                    hover:shadow-lg
                  "
                >
                  <div className="flex items-start gap-3">

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-100
                        text-blue-600
                      "
                    >
                      <FaCheckCircle size={13} />
                    </div>

                    <div>
                      <p className="text-sm font-black text-slate-700">
                        Better Experience
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Your suggestions help us make the
                        system better for everyone.
                      </p>
                    </div>

                  </div>
                </div>

                <div
                  className="
                    group/box
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:border-green-200
                    hover:bg-white
                    hover:shadow-lg
                  "
                >
                  <div className="flex items-start gap-3">

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-green-100
                        text-green-600
                      "
                    >
                      <FaCheckCircle size={13} />
                    </div>

                    <div>
                      <p className="text-sm font-black text-slate-700">
                        Thank You
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        We appreciate you taking the time
                        to share your thoughts.
                      </p>
                    </div>

                  </div>
                </div>

              </div>

              {/* CURRENT RATING BOX */}

              <div
                className="
                  mt-6
                  rounded-3xl
                  border
                  border-blue-200
                  bg-gradient-to-br
                  from-blue-50
                  via-white
                  to-blue-50
                  p-5
                  shadow-sm
                "
              >
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wider
                    text-blue-600
                  "
                >
                  Current Rating
                </p>

                <div className="mt-3 flex items-center gap-3">

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
                    <FaStar size={18} />
                  </div>

                  <div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <FaStar
                            key={star}
                            size={14}
                            className={
                              star <= rating
                                ? "text-yellow-500"
                                : "text-slate-300"
                            }
                          />
                        )
                      )}
                    </div>

                    <span className="text-sm font-black text-blue-700">
                      {rating}/5
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitReview;