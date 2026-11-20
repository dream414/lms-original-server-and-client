import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  FaBook,
  FaBookOpen,
  FaDigitalTachograph,
  FaStar,
  FaArrowRight,
  FaSearch,
  FaUniversity,
  FaInfoCircle,
  FaUsers,
  FaGlobe,
  FaQuoteLeft,
} from "react-icons/fa";

const VisitorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#FFF5F7] p-4 md:p-6">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#890C25] via-[#76091F] to-[#520615] p-6 shadow-2xl mt-9 md:p-8">

        {/* Animated Top Line */}
        <div className="absolute left-0 top-0 h-[3px] w-full overflow-hidden">
          <div className="h-full w-1/3 animate-pulse bg-gradient-to-r from-white via-[#D58A98] to-blue-400" />
        </div>

        {/* Decorative Circles */}
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10 bg-white/5" />

        <div className="absolute -bottom-24 -left-16 h-60 w-60 rounded-full border border-white/10 bg-white/5" />

        <div className="absolute right-32 top-20 h-16 w-16 rounded-full bg-white/5 blur-xl" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between ">

          {/* Hero Content */}

          <div className="max-w-2xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
              <FaUniversity />
              Library Resource Center
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Visitor Dashboard
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/75 md:text-base">
              Welcome back,{" "}
              <span className="font-semibold text-white">
                {user?.name || "Visitor"}
              </span>
              . Explore books, digital resources and discover
              everything available in our library.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white">
                Role: {user?.role || "Visitor"}
              </span>

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white">
                Explore Library
              </span>

            </div>
          </div>

          {/* Hero Icon */}

          <div className="flex justify-start lg:justify-end">

            <div className="flex h-28 w-28 items-center justify-center rounded-[30px] border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-md md:h-32 md:w-32">

              <FaBookOpen className="text-5xl md:text-6xl" />

            </div>

          </div>

        </div>
      </div>

      {/* =====================================================
          WELCOME / INTRO SECTION
      ====================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Main Welcome Card */}

        <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 shadow-lg lg:col-span-2">

          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[#FFF0F3] blur-3xl" />

          <div className="relative z-10">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0F3] text-2xl text-[#890C25]">
                <FaGlobe />
              </div>

              <div>

                <p className="text-sm font-semibold text-slate-500">
                  Explore & Discover
                </p>

                <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                  Welcome to the Library
                </h2>

              </div>

            </div>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-500">
              Browse the library collection, explore digital resources,
              discover available books and share your experience with
              the library community.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              <Link
                to="/library/books"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#890C25] px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#76091F] hover:shadow-lg"
              >
                <FaSearch />
                Explore Books
              </Link>

              <Link
                to="/digital-library/books"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-lg"
              >
                <FaDigitalTachograph />
                Digital Library
              </Link>

            </div>

          </div>
        </div>

        {/* Visitor Profile */}

        <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 p-6 shadow-xl">

          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full border border-white/10 bg-white/5" />

          <div className="relative z-10">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl text-white">
              <FaUsers />
            </div>

            <p className="mt-6 text-xs font-medium text-white/60">
              Visitor Profile
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-white">
              {user?.name || "Library Visitor"}
            </h2>

            <p className="mt-2 text-sm text-white/70">
              {user?.email || "Welcome to the library"}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white">
              <FaGlobe />
              Visitor Access
            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          QUICK ACCESS
      ====================================================== */}

      <div className="mt-6">

        <div className="mb-5">

          <p className="text-sm font-semibold text-slate-500">
            Library Services
          </p>

          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
            Quick Access
          </h2>

        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

          {/* Books */}

          <Link
            to="/library/books"
            className="group rounded-[26px] border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#D58A98] hover:shadow-xl"
          >

            <div className="flex items-center justify-between">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0F3] text-xl text-[#890C25] transition-transform duration-300 group-hover:scale-110">
                <FaBook />
              </div>

              <FaArrowRight className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-[#890C25]" />

            </div>

            <h3 className="mt-5 font-bold text-slate-900">
              Book Catalog
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Browse available books and explore the library collection.
            </p>

          </Link>

          {/* Digital Library */}

          <Link
            to="/digital-library/my-books"
            className="group rounded-[26px] border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
          >

            <div className="flex items-center justify-between">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl text-blue-600 transition-transform duration-300 group-hover:scale-110">
                <FaDigitalTachograph />
              </div>

              <FaArrowRight className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-blue-600" />

            </div>

            <h3 className="mt-5 font-bold text-slate-900">
              Digital Library
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Discover digital books and online library resources.
            </p>

          </Link>

          {/* Feedback */}

          <Link
            to="/reviews/submit"
            className="group rounded-[26px] border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#D58A98] hover:shadow-xl"
          >

            <div className="flex items-center justify-between">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0F3] text-xl text-[#890C25] transition-transform duration-300 group-hover:scale-110">
                <FaStar />
              </div>

              <FaArrowRight className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-[#890C25]" />

            </div>

            <h3 className="mt-5 font-bold text-slate-900">
              Give Review
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Share your experience and provide valuable feedback.
            </p>

          </Link>

          {/* Library Info */}

          <Link
            to="/profile"
            className="group rounded-[26px] border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
          >

            <div className="flex items-center justify-between">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl text-blue-600 transition-transform duration-300 group-hover:scale-110">
                <FaInfoCircle />
              </div>

              <FaArrowRight className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-blue-600" />

            </div>

            <h3 className="mt-5 font-bold text-slate-900">
              Library Information
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Learn more about library services and resources.
            </p>

          </Link>

        </div>
      </div>

      {/* =====================================================
          VISITOR EXPERIENCE SECTION
      ====================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Discover Books */}

        <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg">

          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#FFF0F3] blur-2xl" />

          <div className="relative z-10">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#890C25]">
              <FaBookOpen />
            </div>

            <h3 className="mt-5 text-xl font-extrabold text-slate-900">
              Discover Books
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Explore the available collection and find resources
              that match your interests.
            </p>

            <Link
              to="library/books"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#890C25] transition-all hover:gap-3"
            >
              Browse Collection
              <FaArrowRight />
            </Link>

          </div>
        </div>

        {/* Digital Resources */}

        <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg">

          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-50 blur-2xl" />

          <div className="relative z-10">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FaDigitalTachograph />
            </div>

            <h3 className="mt-5 text-xl font-extrabold text-slate-900">
              Digital Resources
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Access digital reading materials and explore online
              resources from the library.
            </p>

            <Link
              to="digital-library/books"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition-all hover:gap-3"
            >
              Explore Digital Library
              <FaArrowRight />
            </Link>

          </div>
        </div>

        {/* Share Experience */}

        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#890C25] via-[#76091F] to-[#520615] p-6 shadow-xl">

          <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
              <FaQuoteLeft />
            </div>

            <h3 className="mt-5 text-xl font-extrabold text-white">
              Share Your Experience
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/65">
              Your feedback helps improve the library experience
              for everyone.
            </p>

            <Link
              to="/feedback"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white transition-all hover:gap-3"
            >
              Give Feedback
              <FaArrowRight />
            </Link>

          </div>
        </div>

      </div>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div className="mt-6 flex flex-col gap-3 rounded-[26px] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-md md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#890C25]">
            <FaUniversity />
          </div>

          <div>

            <p className="text-sm font-bold text-[#890C25]">
              Library Resource Center
            </p>

            <p className="text-xs text-slate-400">
              Explore books, digital resources and library services.
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <FaBookOpen />
          Library Management System
        </div>

      </div>

    </div>
  );
};

export default VisitorDashboard;