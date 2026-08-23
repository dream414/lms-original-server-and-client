import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-black px-4 py-8">

      {/* Background Glow */}
      <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-green-500/10 blur-3xl"></div>

      <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-green-400/10 blur-3xl"></div>

      {/* Main Content */}
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">

        {/* LMS Logo */}
        <div className="mb-7 flex h-36 w-36 items-center justify-center rounded-full border border-green-400/40 bg-green-950/60 p-2 shadow-2xl shadow-green-900/40 sm:h-44 sm:w-44">

          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-green-500/60 bg-black/30">

            <img
              src="/lms-logo.png"
              alt="LMS Logo"
              className="h-full w-full rounded-full object-cover"
            />

          </div>

        </div>

        {/* Brand */}
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
          LMS
        </p>

        {/* Heading */}
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Welcome to
          <span className="block text-green-400">
            Learning Management System
          </span>
        </h1>

        {/* Description */}
        <p className="mt-5 max-w-md text-sm leading-6 text-gray-400 sm:text-base">
          A simple and powerful platform to manage learning,
          courses, books, students and academic activities.
        </p>

        {/* Get Started */}
        <button
          onClick={() => navigate("/login")}
          className="group mt-8 flex w-full max-w-xs items-center justify-center gap-3 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-900/30 transition-all duration-300 hover:bg-green-500 hover:shadow-green-700/30 active:scale-95 sm:text-base"
        >
          Get Started

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>

        {/* Bottom Features */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-500 sm:text-sm">

          <span>Secure</span>

          <span className="text-green-700">•</span>

          <span>Simple</span>

          <span className="text-green-700">•</span>

          <span>Smart</span>

        </div>

      </div>

    </div>
  );
};

export default Welcome;