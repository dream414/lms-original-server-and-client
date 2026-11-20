import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  // =====================================================
  // BRAND COLORS
  // =====================================================

  const brandColor = "#890C25";
  const brandLightColor = "#D58A98";
  const blueColor = "#2563EB";

  // =====================================================
  // STATES
  // =====================================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await register(name, email, password);

      console.log("REGISTER SUCCESS:", response);

      setSuccess("Registration successful! Redirecting...");

      navigate("/dashboard/student", {
        replace: true,
      });
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-100">

      {/* =================================================
          BACKGROUND DECORATIVE CIRCLES
      ================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* Top Left */}
        <div
          className="absolute -left-24 -top-24 h-72 w-72 rounded-full border"
          style={{
            backgroundColor: `${brandColor}08`,
            borderColor: `${brandColor}15`,
          }}
        />

        {/* Top Right */}
        <div
          className="absolute -right-28 top-10 h-80 w-80 rounded-full border"
          style={{
            backgroundColor: `${blueColor}06`,
            borderColor: `${blueColor}12`,
          }}
        />

        {/* Bottom Left */}
        <div
          className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border"
          style={{
            backgroundColor: `${blueColor}05`,
            borderColor: `${blueColor}10`,
          }}
        />

        {/* Bottom Right */}
        <div
          className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full border"
          style={{
            backgroundColor: `${brandColor}07`,
            borderColor: `${brandColor}12`,
          }}
        />

        {/* Small Decorative Dots */}
        <div
          className="absolute left-[12%] top-[25%] h-3 w-3 rounded-full"
          style={{
            backgroundColor: `${brandColor}25`,
          }}
        />

        <div
          className="absolute right-[15%] top-[35%] h-4 w-4 rounded-full"
          style={{
            backgroundColor: `${blueColor}20`,
          }}
        />

        <div
          className="absolute bottom-[18%] left-[22%] h-4 w-4 rounded-full"
          style={{
            backgroundColor: `${brandColor}20`,
          }}
        />
      </div>

      {/* =================================================
          MAIN WRAPPER
      ================================================= */}

      <div
        className="
          relative z-10 flex min-h-screen w-full
          items-center justify-center
          px-3 py-4
          sm:px-5 sm:py-6
          md:px-8 md:py-8
          lg:h-screen lg:min-h-0 lg:px-4 lg:py-4
          xl:px-5 xl:py-5
        "
      >

        {/* =================================================
            MAIN CARD / CONTAINER
        ================================================= */}

        <div
          className="
            grid w-full max-w-6xl
            grid-cols-1
            overflow-hidden
            rounded-3xl
            border-2
            bg-white/80
            shadow-[0_25px_70px_rgba(0,0,0,0.15)]
            backdrop-blur-2xl

            lg:h-[calc(100vh-2rem)]
            lg:min-h-0
            lg:grid-cols-[0.9fr_1.1fr]

            xl:h-[calc(100vh-2.5rem)]
          "
          style={{
            borderColor: brandColor,
          }}
        >

          {/* =================================================
              DESKTOP LEFT BRAND SECTION
          ================================================= */}

          <div
            className="
              relative hidden
              overflow-hidden
              lg:flex
              lg:min-h-0
              lg:flex-col
              lg:items-center
              lg:justify-center
              lg:px-7
              lg:py-5
              xl:px-10
              xl:py-6
            "
            style={{
              background:
                "linear-gradient(135deg, #890C25 0%, #6f091e 55%, #420512 100%)",
            }}
          >

            {/* Inner Decorative Circles */}

            <div
              className="
                pointer-events-none absolute
                -left-24 -top-24
                h-64 w-64
                rounded-full
                border border-white/10
                bg-white/5
              "
            />

            <div
              className="
                pointer-events-none absolute
                -bottom-28 -right-24
                h-72 w-72
                rounded-full
                border border-white/10
                bg-white/5
              "
            />

            <div
              className="
                pointer-events-none absolute
                right-10 top-16
                h-5 w-5
                rounded-full
                bg-white/10
              "
            />

            <div
              className="
                pointer-events-none absolute
                bottom-24 left-12
                h-4 w-4
                rounded-full
                bg-white/10
              "
            />

            {/* Left Content */}

            <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">

              {/* Logo */}

              <div
                className="
                  mb-4 flex items-center justify-center
                  rounded-3xl
                  bg-white/10
                  p-3
                  shadow-2xl
                  ring-1 ring-white/20

                  lg:h-28 lg:w-28
                  xl:h-32 xl:w-32
                "
              >
                <img
                  src="/lms-logo.png"
                  alt="LMS Logo"
                  className="h-full w-full object-contain"
                />
              </div>

              {/* University */}

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                THE SHAIKH AYAZ UNIVERSITY
              </p>

              {/* Main Title */}

              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white xl:text-3xl">
                Library Management System
              </h2>

              {/* Description */}

              <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
                Manage books, students, issues, returns and library
                activities through one powerful platform.
              </p>

              {/* =================================================
                  FEATURES
              ================================================= */}

              <div className="mt-5 grid w-full grid-cols-3 gap-2">

                {/* Books */}

                <div
                  className="
                    rounded-2xl
                    border border-white/10
                    bg-white/10
                    p-3
                    backdrop-blur-md
                  "
                >
                  <div className="text-xl">📚</div>

                  <p className="mt-1 text-xs font-bold text-white">
                    Books
                  </p>

                  <p className="mt-1 text-[10px] text-white/60">
                    Management
                  </p>
                </div>

                {/* Users */}

                <div
                  className="
                    rounded-2xl
                    border border-white/10
                    bg-white/10
                    p-3
                    backdrop-blur-md
                  "
                >
                  <div className="text-xl">👥</div>

                  <p className="mt-1 text-xs font-bold text-white">
                    Users
                  </p>

                  <p className="mt-1 text-[10px] text-white/60">
                    Management
                  </p>
                </div>

                {/* Services */}

                <div
                  className="
                    rounded-2xl
                    border border-white/10
                    bg-white/10
                    p-3
                    backdrop-blur-md
                  "
                >
                  <div className="text-xl">🏛️</div>

                  <p className="mt-1 text-xs font-bold text-white">
                    Library
                  </p>

                  <p className="mt-1 text-[10px] text-white/60">
                    Services
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              MOBILE BRAND HEADER
          ================================================= */}

          <div
            className="
              relative overflow-hidden
              px-5 py-6
              lg:hidden
            "
            style={{
              background:
                "linear-gradient(135deg, #890C25 0%, #6f091e 55%, #420512 100%)",
            }}
          >

            {/* Decorative Circles */}

            <div
              className="
                pointer-events-none absolute
                -left-20 -top-20
                h-48 w-48
                rounded-full
                border border-white/10
                bg-white/5
              "
            />

            <div
              className="
                pointer-events-none absolute
                -bottom-20 -right-16
                h-48 w-48
                rounded-full
                border border-white/10
                bg-white/5
              "
            />

            {/* Mobile Header Content */}

            <div className="relative z-10 flex flex-col items-center text-center">

              <div className="mb-3 h-20 w-20 rounded-2xl bg-white/10 p-2 ring-1 ring-white/20">
                <img
                  src="/lms-logo.png"
                  alt="LMS Logo"
                  className="h-full w-full object-contain"
                />
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                THE SHAIKH AYAZ UNIVERSITY
              </p>

              <h2 className="mt-1 text-lg font-bold text-white">
                Library Management System
              </h2>

              <p className="mt-1 text-xs text-white/70">
                Create your LMS account
              </p>
            </div>
          </div>

          {/* =================================================
              RIGHT REGISTER SECTION
          ================================================= */}

          <div
            className="
              min-h-0
              overflow-y-auto
              bg-white/70
              px-5 py-6
              sm:px-8 sm:py-8
              md:px-10 md:py-9
              lg:px-8 lg:py-6
              xl:px-10 xl:py-7
            "
          >

            <div className="mx-auto flex min-h-full w-full max-w-xl flex-col justify-center">

              {/* =================================================
                  CREATE ACCOUNT HEADING
              ================================================= */}

              <div className="mb-5 text-center">

                {/* Small Badge */}

                <span
                  className="
                    inline-flex
                    rounded-full
                    px-4 py-1.5
                    text-sm
                    font-semibold
                  "
                  style={{
                    backgroundColor: `${brandLightColor}30`,
                    color: brandColor,
                  }}
                >
                  Create Account
                </span>

                {/* Main Heading */}

                <h1
                  className="
                    mt-3
                    text-3xl
                    font-extrabold
                    tracking-tight
                    sm:text-4xl
                  "
                  style={{
                    color: brandColor,
                  }}
                >
                  Create Account
                </h1>

                {/* Subtitle */}

                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  Register for your LMS account
                </p>
              </div>

              {/* =================================================
                  ALERTS
              ================================================= */}

              {error && (
                <div
                  className="
                    mb-4
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4 py-3
                    text-sm
                    font-medium
                    text-red-700
                  "
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  className="
                    mb-4
                    rounded-xl
                    border
                    border-green-200
                    bg-green-50
                    px-4 py-3
                    text-sm
                    font-medium
                    text-green-700
                  "
                >
                  {success}
                </div>
              )}

              {/* =================================================
                  REGISTER FORM
              ================================================= */}

              <form
                onSubmit={handleSubmit}
                className="space-y-3"
              >

                {/* =================================================
                    NAME
                ================================================= */}

                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    autoComplete="name"
                    required
                    className="
                      w-full
                      rounded-xl
                      border-2
                      border-[#890C25]
                      bg-white
                      px-4 py-3
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[#890C25]
                      focus:ring-4
                      focus:ring-[#890C25]/10
                    "
                  />
                </div>

                {/* =================================================
                    EMAIL
                ================================================= */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="
                      w-full
                      rounded-xl
                      border-2
                      border-[#890C25]
                      bg-white
                      px-4 py-3
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[#890C25]
                      focus:ring-4
                      focus:ring-[#890C25]/10
                    "
                  />
                </div>

                {/* =================================================
                    PASSWORD
                ================================================= */}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                    required
                    className="
                      w-full
                      rounded-xl
                      border-2
                      border-[#890C25]
                      bg-white
                      px-4 py-3
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[#890C25]
                      focus:ring-4
                      focus:ring-[#890C25]/10
                    "
                  />
                </div>

                {/* =================================================
                    CONFIRM PASSWORD
                ================================================= */}

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Confirm Password
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                    className="
                      w-full
                      rounded-xl
                      border-2
                      border-[#890C25]
                      bg-white
                      px-4 py-3
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[#890C25]
                      focus:ring-4
                      focus:ring-[#890C25]/10
                    "
                  />
                </div>

                {/* =================================================
                    REGISTER BUTTON
                ================================================= */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-2
                    w-full
                    rounded-xl
                    px-5 py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:shadow-xl
                    active:translate-y-0
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                  style={{
                    background:
                      "linear-gradient(135deg, #890C25 0%, #6f091e 100%)",
                  }}
                >
                  {loading ? "Creating Account..." : "Register"}
                </button>
              </form>

              {/* =================================================
                  LOGIN LINK
              ================================================= */}

              <div className="mt-5 text-center">

                <p className="text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold transition hover:underline"
                    style={{
                      color: brandColor,
                    }}
                  >
                    Login
                  </Link>
                </p>

              </div>

              {/* =================================================
                  BACK TO WELCOME
              ================================================= */}

              <div className="mt-3 text-center">

                <Link
                  to="/"
                  className="
                    inline-flex
                    items-center
                    text-sm
                    font-semibold
                    text-slate-500
                    transition
                    hover:text-[#890C25]
                  "
                >
                  ← Back to Welcome
                </Link>

              </div>

              {/* =================================================
                  BOTTOM BRANDING
              ================================================= */}

              <div className="mt-6 border-t border-slate-200 pt-4 text-center">

                <p
                  className="text-xs font-bold sm:text-sm"
                  style={{
                    color: brandColor,
                  }}
                >
                  The Shaikh Ayaz University Shikarpur
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Library Management System
                </p>

                <p
                  className="mt-2 text-[10px] font-medium"
                  style={{
                    color: blueColor,
                  }}
                >
                  © {new Date().getFullYear()} The Shaikh Ayaz University
                  Shikarpur
                </p>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;