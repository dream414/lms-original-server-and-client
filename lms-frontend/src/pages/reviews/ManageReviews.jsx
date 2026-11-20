import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaEye,
  FaCheck,
  FaClock,
  FaSearch,
  FaUser,
  FaStar,
  FaFilter,
  FaClipboardList,
  FaEnvelope,
  FaCommentDots,
} from "react-icons/fa";

import { useReview } from "../../context/ReviewContext";

const ManageReviews = () => {
  const navigate = useNavigate();

  const {
    reviews,
    loading,
    error,
    getAllReviews,
    clearError,
  } = useReview();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // =====================================================
  // LOAD REVIEWS
  // =====================================================

  useEffect(() => {
    getAllReviews().catch(() => {});
  }, []);

  // =====================================================
  // SAFE ARRAY
  // =====================================================

  const reviewList = Array.isArray(reviews)
    ? reviews
    : [];

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredReviews = reviewList.filter(
    (review) => {
      const searchText = search
        .trim()
        .toLowerCase();

      const visitorName =
        review.visitorName ||
        review.name ||
        "";

      const visitorEmail =
        review.visitorEmail ||
        review.email ||
        "";

      const reviewMessage =
        review.message ||
        review.comment ||
        "";

      const reviewStatus =
        review.status ||
        "";

      const matchesSearch =
        visitorName
          .toLowerCase()
          .includes(searchText) ||
        visitorEmail
          .toLowerCase()
          .includes(searchText) ||
        reviewMessage
          .toLowerCase()
          .includes(searchText);

      let matchesStatus = true;

      if (statusFilter === "reviewed") {
        matchesStatus =
          review.status?.toLowerCase() ===
          "reviewed";
      }

      if (statusFilter === "pending") {
        matchesStatus =
          review.status?.toLowerCase() !==
          "reviewed";
      }

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  // =====================================================
  // REVIEWED CHECK
  // =====================================================

  const isReviewed = (review) => {
    return (
      review.status?.toLowerCase() ===
      "reviewed"
    );
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // RATING
  // =====================================================

  const getRatingValue = (rating) => {
    return Number(rating) || 0;
  };

  // =====================================================
  // COUNTS
  // =====================================================

  const totalReviews =
    reviewList.length;

  const pendingReviews =
    reviewList.filter(
      (review) =>
        review.status?.toLowerCase() !==
        "reviewed"
    ).length;

  const reviewedReviews =
    reviewList.filter(
      (review) =>
        review.status?.toLowerCase() ===
        "reviewed"
    ).length;

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
                Manage Reviews
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
                View visitor reviews, check ratings
                and manage submitted feedback from
                one place.
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
                  Visitor Reviews
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
                  {filteredReviews.length} Showing
                </div>

              </div>
            </div>

            {/* =================================================
                BLUE TOTAL CARD
            ================================================= */}

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
                  Total Reviews
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
                  {String(totalReviews).padStart(
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
            ERROR
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
                transition
                hover:bg-red-100
              "
            >
              ×
            </button>
          </div>
        )}

        {/* =================================================
            STAT BOXES
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">

          {/* TOTAL */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-blue-200
              bg-white
              p-5
              shadow-lg
              transition
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full border border-blue-100 bg-blue-50 transition duration-500 group-hover:scale-125" />

            <div className="relative flex items-center justify-between">

              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                  All Reviews
                </p>

                <p className="mt-1 text-3xl font-black text-slate-800">
                  {totalReviews}
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Total submissions
                </p>
              </div>

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  border-4
                  border-blue-100
                  bg-blue-50
                  text-blue-600
                  shadow-sm
                "
              >
                <FaClipboardList size={18} />
              </div>

            </div>
          </div>

          {/* PENDING */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-yellow-200
              bg-white
              p-5
              shadow-lg
              transition
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full border border-yellow-100 bg-yellow-50 transition duration-500 group-hover:scale-125" />

            <div className="relative flex items-center justify-between">

              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-yellow-600">
                  Pending
                </p>

                <p className="mt-1 text-3xl font-black text-slate-800">
                  {pendingReviews}
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Waiting for review
                </p>
              </div>

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  border-4
                  border-yellow-100
                  bg-yellow-50
                  text-yellow-600
                  shadow-sm
                "
              >
                <FaClock size={18} />
              </div>

            </div>
          </div>

          {/* REVIEWED */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-green-200
              bg-white
              p-5
              shadow-lg
              transition
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full border border-green-100 bg-green-50 transition duration-500 group-hover:scale-125" />

            <div className="relative flex items-center justify-between">

              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-green-600">
                  Reviewed
                </p>

                <p className="mt-1 text-3xl font-black text-slate-800">
                  {reviewedReviews}
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Completed reviews
                </p>
              </div>

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  border-4
                  border-green-100
                  bg-green-50
                  text-green-600
                  shadow-sm
                "
              >
                <FaCheck size={18} />
              </div>

            </div>
          </div>

        </div>

        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <div
          className="
            group/search
            relative
            mb-6
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-lg
          "
        >
          <div
            className="
              absolute
              left-0
              top-0
              h-1.5
              w-20
              rounded-br-full
              bg-gradient-to-r
              from-[#65091c]
              via-[#890C25]
              to-[#D58A98]
              transition-all
              duration-500
              group-hover/search:w-full
            "
          />

          <div className="relative flex flex-col gap-4 md:flex-row">

            {/* SEARCH */}

            <div className="relative flex-1">

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
                <FaSearch size={12} />
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by name, email or review..."
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
                  font-semibold
                  text-slate-700
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-[#890C25]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#890C25]/10
                "
              />

            </div>

            {/* FILTER */}

            <div className="relative md:w-56">

              <div
                className="
                  absolute
                  left-3
                  top-1/2
                  z-10
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
                <FaFilter size={12} />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="
                  w-full
                  appearance-none
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  py-3.5
                  pl-14
                  pr-4
                  text-sm
                  font-semibold
                  text-slate-700
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              >
                <option value="all">
                  All Reviews
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="reviewed">
                  Reviewed
                </option>
              </select>

            </div>
          </div>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        {loading ? (
          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-16
              text-center
              shadow-xl
            "
          >
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
              Loading Reviews
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Fetching visitor reviews...
            </p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border-2
              border-dashed
              border-[#890C25]/20
              bg-white
              px-6
              py-16
              text-center
              shadow-xl
            "
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#890C25]/5" />

            <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-blue-500/5" />

            <div className="relative">

              <div
                className="
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
                <FaStar size={27} />
              </div>

              <h3 className="mt-6 text-xl font-black text-slate-800">
                No Reviews Found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search
                  ? "No reviews match your search."
                  : "There are no reviews available yet."}
              </p>

            </div>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {filteredReviews.map(
              (review) => {

                const visitorName =
                  review.visitorName ||
                  review.name ||
                  "Anonymous";

                const visitorEmail =
                  review.visitorEmail ||
                  review.email ||
                  "No email";

                const reviewMessage =
                  review.message ||
                  review.comment ||
                  "No review message available.";

                const rating =
                  getRatingValue(
                    review.rating
                  );

                return (
                  <div
                    key={
                      review._id ||
                      review.id
                    }
                    className="
                      group/card
                      relative
                      overflow-hidden
                      rounded-3xl
                      border
                      border-slate-200
                      bg-white
                      p-5
                      shadow-lg
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-2xl
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
                        w-16
                        rounded-br-full
                        bg-gradient-to-r
                        from-[#65091c]
                        via-[#890C25]
                        to-[#D58A98]
                        transition-all
                        duration-500
                        group-hover/card:w-full
                      "
                    />

                    {/* DECORATIVE CIRCLE */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        -right-12
                        -top-12
                        h-28
                        w-28
                        rounded-full
                        bg-[#890C25]/5
                        transition
                        duration-500
                        group-hover/card:scale-125
                      "
                    />

                    {/* PERSON */}

                    <div className="relative flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">

                        <div
                          className="
                            flex
                            h-14
                            w-14
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border-4
                            border-[#890C25]/10
                            bg-[#890C25]/10
                            text-[#890C25]
                            shadow-sm
                            transition
                            duration-300
                            group-hover/card:bg-[#890C25]
                            group-hover/card:text-white
                          "
                        >
                          <FaUser size={17} />
                        </div>

                        <div className="min-w-0">

                          <h3 className="truncate text-sm font-black text-slate-800">
                            {visitorName}
                          </h3>

                          <div className="mt-1 flex items-center gap-1.5">

                            <FaEnvelope
                              size={9}
                              className="shrink-0 text-slate-400"
                            />

                            <p className="truncate text-xs font-semibold text-slate-400">
                              {visitorEmail}
                            </p>

                          </div>

                        </div>
                      </div>

                      {/* STATUS */}

                      {isReviewed(review) ? (
                        <span
                          className="
                            flex
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            border-green-200
                            bg-green-50
                            px-3
                            py-1.5
                            text-[10px]
                            font-black
                            text-green-700
                          "
                        >
                          <FaCheck size={9} />
                          Reviewed
                        </span>
                      ) : (
                        <span
                          className="
                            flex
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            border-yellow-200
                            bg-yellow-50
                            px-3
                            py-1.5
                            text-[10px]
                            font-black
                            text-yellow-700
                          "
                        >
                          <FaClock size={9} />
                          Pending
                        </span>
                      )}
                    </div>

                    {/* RATING + DATE */}

                    <div
                      className="
                        relative
                        mt-5
                        flex
                        items-center
                        justify-between
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-3
                      "
                    >
                      <div className="flex items-center gap-1">

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

                      <span className="text-[11px] font-bold text-slate-400">
                        {formatDate(
                          review.createdAt ||
                            review.date
                        )}
                      </span>
                    </div>

                    {/* REVIEW MESSAGE */}

                    <div
                      className="
                        mt-4
                        min-h-[125px]
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-4
                        shadow-sm
                      "
                    >
                      <div className="mb-2 flex items-center gap-2">

                        <span
                          className="
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
                        </span>

                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Review
                        </p>

                      </div>

                      <p className="text-sm font-medium leading-6 text-slate-600 line-clamp-4">
                        {reviewMessage}
                      </p>
                    </div>

                    {/* RESPONSE */}

                    {review.response && (
                      <div
                        className="
                          mt-4
                          rounded-2xl
                          border
                          border-blue-200
                          bg-blue-50
                          p-4
                        "
                      >
                        <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                          Admin Response
                        </p>

                        <p className="mt-2 text-sm font-medium leading-5 text-slate-600 line-clamp-2">
                          {review.response}
                        </p>
                      </div>
                    )}

                    {/* BUTTON */}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/reviews/${
                            review._id ||
                            review.id
                          }`
                        )
                      }
                      className="
                        group/view
                        mt-5
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-[#890C25]
                        px-4
                        py-3.5
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
                      "
                    >
                      <span
                        className="
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-full
                          bg-white/10
                        "
                      >
                        <FaEye size={12} />
                      </span>

                      View Details
                    </button>
                  </div>
                );
              }
            )}
          </div>
        )}

        {/* =================================================
            RESULT COUNT
        ================================================= */}

        {reviewList.length > 0 && (
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
              {filteredReviews.length}
            </span>{" "}
            of{" "}
            <span className="font-black text-slate-600">
              {reviewList.length}
            </span>{" "}
            reviews
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageReviews;