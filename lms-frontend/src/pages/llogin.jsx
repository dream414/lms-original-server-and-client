import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const  lLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  // =========================
  // TYPING ANIMATION
  // =========================
  const words = [
    "Learning",
    "Growing",
    "Achieving",
    "Your Future",
  ];

  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const typingSpeed = isDeleting ? 70 : 130;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length + 1));

        if (displayText === currentWord) {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        setDisplayText(currentWord.substring(0, displayText.length - 1));

        if (displayText === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex]);

  // =========================
  // LOGIN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const response = await login(email, password);

      const user = response?.user;
      const role = user?.role;

      setSuccess("Login successful!");

      if (role) {
        navigate(`/dashboard/${role}`, {
          replace: true,
        });
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid email or password."
      );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 relative overflow-hidden">

        {/* =====================================================
            ANIMATED BACKGROUND
        ====================================================== */}

        {/* Large Glow */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-cyan-300/20 rounded-full blur-3xl animate-pulse"></div>

        {/* Small Pulse Circles */}
        <div className="absolute top-[12%] left-[8%] w-3 h-3 bg-blue-300 rounded-full animate-ping opacity-70"></div>

        <div className="absolute top-[20%] left-[25%] w-2 h-2 bg-white rounded-full animate-pulse"></div>

        <div className="absolute top-[15%] right-[15%] w-4 h-4 bg-blue-300 rounded-full animate-ping opacity-60"></div>

        <div className="absolute top-[38%] right-[7%] w-2.5 h-2.5 bg-cyan-200 rounded-full animate-pulse"></div>

        <div className="absolute bottom-[22%] left-[12%] w-4 h-4 bg-blue-300 rounded-full animate-ping opacity-60"></div>

        <div className="absolute bottom-[12%] left-[30%] w-2 h-2 bg-white rounded-full animate-pulse"></div>

        <div className="absolute bottom-[28%] right-[25%] w-3 h-3 bg-blue-200 rounded-full animate-ping opacity-60"></div>

        <div className="absolute top-[55%] left-[5%] w-2 h-2 bg-cyan-200 rounded-full animate-pulse"></div>

        {/* Floating Rings */}
        <div className="absolute top-[18%] right-[32%] w-16 h-16 border border-white/10 rounded-full animate-spin-slow"></div>

        <div className="absolute bottom-[15%] right-[8%] w-24 h-24 border border-white/10 rounded-full animate-float"></div>

        <div className="absolute top-[65%] left-[22%] w-10 h-10 border border-blue-200/20 rounded-full animate-float"></div>

        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className="relative z-20 bg-white/95 backdrop-blur-xl border-b border-blue-100 shadow-lg">

          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4">

            <div className="flex items-center justify-between">

              {/* University Logo + Name */}
              <div className="flex items-center gap-4">

                <div className="bg-white rounded-full p-1 shadow-md">
                  <img
                    src="/lms-logo.png"
                    alt="LMS Logo"
                    className="h-16 w-16 sm:h-[72px] sm:w-[72px] object-contain"
                  />
                </div>

                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-blue-950">
                    Learning Management System
                  </h1>

                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    The Shaikh Ayaz University Shikarpur
                  </p>
                </div>

              </div>

              {/* Back */}
              <Link
                to="/"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-blue-200 text-blue-700 font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
              >
                <span className="text-lg">←</span>
                Back to Welcome
              </Link>

            </div>

          </div>

        </header>

        {/* =====================================================
            MAIN
        ====================================================== */}

        <main className="relative z-10 min-h-[calc(100vh-105px)] flex items-center justify-center px-5 py-10">

          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 xl:gap-20 items-center">

            {/* =================================================
                LEFT CONTENT
            ================================================== */}

            <section className="text-white hidden lg:block">

              <div className="max-w-xl">

                {/* Badge */}
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-7">

                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-300"></span>
                  </span>

                  <span className="text-sm font-medium text-blue-50">
                    University LMS Portal
                  </span>

                </div>

                {/* Heading */}
                <h2 className="text-5xl xl:text-6xl font-extrabold leading-tight">

                  Empower Your

                  <span className="block mt-2 text-blue-200">
                    {displayText}
                    <span className="ml-1 animate-blink">|</span>
                  </span>

                </h2>

                <p className="mt-7 text-blue-100 text-lg leading-8 max-w-lg">
                  Access your courses, academic resources, learning materials,
                  attendance and university activities through a modern
                  Learning Management System.
                </p>

                {/* Feature Cards */}
                <div className="mt-10 grid grid-cols-2 gap-4">

                  {/* Card 1 */}
                  <div className="group p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300">

                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                      📚
                    </div>

                    <h3 className="font-bold text-white">
                      Digital Learning
                    </h3>

                    <p className="text-sm text-blue-100 mt-1">
                      Learn and access resources anywhere.
                    </p>

                  </div>

                  {/* Card 2 */}
                  <div className="group p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300">

                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                      🎓
                    </div>

                    <h3 className="font-bold text-white">
                      Academic Portal
                    </h3>

                    <p className="text-sm text-blue-100 mt-1">
                      Manage your academic activities.
                    </p>

                  </div>

                  {/* Card 3 */}
                  <div className="group p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300">

                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                      💻
                    </div>

                    <h3 className="font-bold text-white">
                      Smart Access
                    </h3>

                    <p className="text-sm text-blue-100 mt-1">
                      Access your learning platform easily.
                    </p>

                  </div>

                  {/* Card 4 */}
                  <div className="group p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300">

                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                      🔐
                    </div>

                    <h3 className="font-bold text-white">
                      Secure System
                    </h3>

                    <p className="text-sm text-blue-100 mt-1">
                      Your academic data stays protected.
                    </p>

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                LOGIN CARD
            ================================================== */}

            <section className="w-full flex justify-center lg:justify-end">

              <div className="w-full max-w-md animate-card">

                <div className="relative bg-white rounded-[28px] shadow-2xl overflow-hidden">

                  {/* Top Gradient */}
                  <div className="h-1.5 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-700">
                    <div className="h-full w-20 bg-white/60 animate-line"></div>
                  </div>

                  <div className="p-7 sm:p-9">

                    {/* =================================================
                        LOGO
                    ================================================== */}

                    <div className="flex justify-center mb-6">

                      <div className="relative">

                        {/* Logo Glow */}
                        <div className="absolute inset-0 rounded-full bg-blue-300/40 blur-2xl animate-pulse"></div>

                        {/* Rotating Border */}
                        <div className="absolute -inset-3 border border-blue-200 rounded-full animate-spin-slow"></div>

                        {/* Logo */}
                        <div className="relative bg-white rounded-full p-3 shadow-xl border border-blue-100">

                          <img
                            src="/lms-logo.png"
                            alt="LMS Logo"
                            className="h-28 w-28 sm:h-32 sm:w-32 object-contain"
                          />

                        </div>

                      </div>

                    </div>

                    {/* Heading */}
                    <div className="text-center mb-7">

                      <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                        Welcome Back
                      </p>

                      <h2 className="text-3xl font-extrabold text-blue-950 mt-1">
                        Login to LMS
                      </h2>

                      <p className="text-gray-500 text-sm mt-2">
                        Login to your LMS account
                      </p>

                    </div>

                    {/* Error */}
                    {error && (
                      <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                      </div>
                    )}

                    {/* Success */}
                    {success && (
                      <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">
                        {success}
                      </div>
                    )}

                    {/* =================================================
                        FORM
                    ================================================== */}

                    <form onSubmit={handleSubmit} className="space-y-5">

                      {/* Email */}
                      <div>

                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Email Address
                        </label>

                        <div className="relative">

                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                            ✉
                          </span>

                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 outline-none transition-all duration-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          />

                        </div>

                      </div>

                      {/* Password */}
                      <div>

                        <label
                          htmlFor="password"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Password
                        </label>

                        <div className="relative">

                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                            🔒
                          </span>

                          <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 outline-none transition-all duration-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          />

                        </div>

                      </div>

                      {/* Login Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="relative overflow-hidden w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group"
                      >

                        {/* Shine */}
                        {!loading && (
                          <span className="absolute top-0 -left-20 h-full w-16 bg-white/20 skew-x-[-20deg] group-hover:left-[120%] transition-all duration-700"></span>
                        )}

                        <span className="relative flex items-center justify-center gap-2">

                          {loading ? (
                            <>
                              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                              Logging in...
                            </>
                          ) : (
                            <>
                              Login
                              <span className="text-lg group-hover:translate-x-1 transition-transform">
                                →
                              </span>
                            </>
                          )}

                        </span>

                      </button>

                    </form>

                    {/* Register */}
                    <div className="text-center mt-7">

                      <p className="text-sm text-gray-500">

                        Don't have an account?{" "}

                        <Link
                          to="/register"
                          className="font-bold text-blue-700 hover:text-blue-900 transition-colors"
                        >
                          Register
                        </Link>

                      </p>

                    </div>

                    {/* Mobile Back */}
                    <div className="text-center mt-5 sm:hidden">

                      <Link
                        to="/"
                        className="text-sm font-medium text-blue-600"
                      >
                        ← Back to Welcome
                      </Link>

                    </div>

                  </div>

                  {/* Bottom */}
                  <div className="h-1 bg-gradient-to-r from-blue-800 via-blue-400 to-blue-800"></div>

                </div>

              </div>

            </section>

          </div>

        </main>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="relative z-10 text-center pb-5 px-4">

          <p className="text-xs sm:text-sm text-blue-100">
            © {new Date().getFullYear()} The Shaikh Ayaz University
            Shikarpur. All rights reserved.
          </p>

        </footer>

      </div>

      {/* =====================================================
          CUSTOM ANIMATIONS
      ====================================================== */}

      <style>{`

        /* Card Entrance */
        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-card {
          animation: cardEntrance 0.8s ease-out;
        }

        /* Slow Spin */
        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spinSlow 12s linear infinite;
        }

        /* Floating */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-18px);
          }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        /* Typing Cursor */
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }

          51%,
          100% {
            opacity: 0;
          }
        }

        .animate-blink {
          animation: blink 0.8s infinite;
        }

        /* Top Line */
        @keyframes movingLine {
          0% {
            transform: translateX(-100px);
          }

          50% {
            transform: translateX(420px);
          }

          100% {
            transform: translateX(-100px);
          }
        }

        .animate-line {
          animation: movingLine 3s ease-in-out infinite;
        }

      `}</style>
    </>
  );
};

export default lLogin;













































import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  // =====================================================
  // COLORS
  // =====================================================

  const brandColor = "#890C25";
  const blueColor = "#2563EB";

  // =====================================================
  // STATES
  // =====================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // TYPING ANIMATION
  // =====================================================

  const typingText = "Digital Library";

  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;

    const currentLength = typedText.length;

    if (!isDeleting && currentLength < typingText.length) {
      timeout = setTimeout(() => {
        setTypedText(
          typingText.substring(0, currentLength + 1)
        );
      }, 120);
    } else if (
      !isDeleting &&
      currentLength === typingText.length
    ) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1800);
    } else if (isDeleting && currentLength > 0) {
      timeout = setTimeout(() => {
        setTypedText(
          typingText.substring(0, currentLength - 1)
        );
      }, 75);
    } else if (isDeleting && currentLength === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting]);

  // =====================================================
  // AUTH
  // =====================================================

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  // =====================================================
  // LOGIN HANDLER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const response = await login(email, password);

      console.log("LOGIN SUCCESS:", response);

      const loggedInUser = response?.user;

      if (!loggedInUser) {
        setError(
          "Login successful, but user information was not received."
        );
        return;
      }

      const role = loggedInUser.role;

      console.log("USER ROLE:", role);

      if (!role) {
        setError("User role was not found.");
        return;
      }

      setSuccess("Login successful! Redirecting...");

      navigate(`/dashboard/${role}`, {
        replace: true,
      });
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-x-hidden
        overflow-y-auto
        bg-slate-100
      "
    >
      {/* =================================================
          BACKGROUND DECORATIVE CIRCLES
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* TOP LEFT */}

        <div
          className="
            absolute
            -left-28
            -top-28
            h-64
            w-64
            rounded-full
            border
            border-white/70
            bg-white/20
            backdrop-blur-sm

            sm:-left-32
            sm:-top-32
            sm:h-80
            sm:w-80

            md:h-96
            md:w-96
          "
        />

        {/* RIGHT */}

        <div
          className="
            absolute
            -right-24
            top-[25%]
            h-56
            w-56
            rounded-full
            border
            border-white/70
            bg-white/20
            backdrop-blur-sm

            sm:-right-28
            sm:h-72
            sm:w-72

            md:h-80
            md:w-80
          "
        />

        {/* BOTTOM LEFT */}

        <div
          className="
            absolute
            -bottom-28
            left-[10%]
            h-56
            w-56
            rounded-full
            border
            border-white/60
            bg-white/15

            sm:-bottom-36
            sm:left-[18%]
            sm:h-72
            sm:w-72

            md:h-80
            md:w-80
          "
        />

        {/* SMALL CIRCLE */}

        <div
          className="
            absolute
            right-[20%]
            top-[16%]
            h-14
            w-14
            rounded-full
            border
            border-white/60
            bg-white/15

            sm:right-[25%]
            sm:h-20
            sm:w-20
          "
        />

        {/* SMALL CIRCLE */}

        <div
          className="
            absolute
            bottom-[12%]
            right-[5%]
            h-20
            w-20
            rounded-full
            border
            border-white/60
            bg-white/15

            sm:h-28
            sm:w-28
          "
        />

      </div>

      {/* =================================================
          PAGE WRAPPER
      ================================================= */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          w-full
          flex-col
          px-2.5
          py-2

          sm:px-4
          sm:py-3

          md:px-5

          lg:px-7
          lg:py-3
        "
      >

        {/* =================================================
            UNIVERSITY HEADER
        ================================================= */}

        <header
          className="
            mx-auto
            w-full
            max-w-7xl
            flex-shrink-0
            rounded-2xl
            border
            border-white/10
            px-2.5
            py-2
            shadow-xl

            sm:rounded-3xl
            sm:px-4
            sm:py-2.5

            md:px-5

            lg:py-3
          "
          style={{
            background:
              "linear-gradient(135deg, #890C25 0%, #6f091e 55%, #420512 100%)",
          }}
        >

          <div className="flex items-center gap-2.5 sm:gap-4">

            {/* LMS LOGO */}

            <div
              className="
                flex
                h-10
                w-10
                flex-shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                border
                border-white/30
                bg-white
                shadow-lg

                sm:h-12
                sm:w-12

                md:h-14
                md:w-14

                lg:h-16
                lg:w-16
                lg:rounded-2xl
              "
            >

              <img
                src="/lms-logo.png"
                alt="Library Management System Logo"
                className="h-full w-full object-contain p-1"
              />

            </div>

            {/* UNIVERSITY INFORMATION */}

            <div className="min-w-0 flex-1">

              <p
                className="
                  mb-0.5
                  text-[7px]
                  font-bold
                  uppercase
                  leading-none
                  tracking-[0.12em]
                  text-white/65

                  sm:text-[9px]
                  sm:tracking-[0.15em]

                  md:text-[10px]
                "
              >
                The Shaikh Ayaz University
              </p>

              <h1
                className="
                  break-words
                  text-xs
                  font-black
                  leading-tight
                  text-white

                  sm:text-base

                  md:text-lg

                  lg:text-2xl
                "
              >
                The Shaikh Ayaz University Shikarpur
              </h1>

              <p
                className="
                  mt-0.5
                  break-words
                  text-[7px]
                  font-semibold
                  tracking-wide
                  text-white/90

                  sm:text-[9px]

                  md:text-[10px]

                  lg:text-xs
                "
              >
                Library Management System
              </p>

            </div>

          </div>

        </header>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main
          className="
            mx-auto
            grid
            w-full
            max-w-7xl
            flex-1
            grid-cols-1
            items-center
            gap-5
            py-5

            sm:gap-6
            sm:py-6

            md:gap-7
            md:py-7

            lg:grid-cols-[1.15fr_0.85fr]
            lg:gap-8
            lg:py-3

            xl:gap-10
          "
        >

          {/* =================================================
              LEFT SIDE
              NOW VISIBLE ON ALL SCREEN SIZES
          ================================================= */}

          <section
            className="
              flex
              w-full
              flex-col
              justify-center
              px-1
              text-center

              sm:px-3

              md:px-5

              lg:items-start
              lg:px-3
              lg:text-left

              xl:px-7
            "
          >

            {/* BADGE */}

            <div
              className="
                mb-3
                inline-flex
                self-center
                items-center
                gap-2
                rounded-full
                border
                border-white/60
                bg-white/50
                px-3.5
                py-1.5
                shadow-sm
                backdrop-blur-md

                lg:self-start
              "
            >

              <span
                className="
                  h-2
                  w-2
                  animate-pulse
                  rounded-full
                "
                style={{
                  backgroundColor: blueColor,
                }}
              />

              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-slate-700
                "
              >
                Smart Library System
              </span>

            </div>

            {/* MAIN HEADING */}

            <h2
              className="
                w-full
                text-3xl
                font-black
                leading-[1.05]
                text-slate-900

                sm:text-4xl

                md:text-5xl

                lg:text-4xl

                xl:text-5xl

                2xl:text-[58px]
              "
            >

              Welcome to

              <span
                className="
                  mt-1.5
                  block
                  break-words
                "
                style={{
                  color: brandColor,
                }}
              >
                {typedText}
                <span className="animate-pulse">|</span>
              </span>

            </h2>

            {/* DESCRIPTION */}

            <p
              className="
                mt-3
                w-full
                max-w-xl
                text-xs
                leading-relaxed
                text-slate-600

                sm:text-sm

                md:text-base

                lg:text-xs

                xl:text-sm

                2xl:text-base
              "
            >
              Access books, manage issued books, submit return
              requests and explore your digital library account
              through one powerful platform.
            </p>

            {/* FEATURES */}

            <div
              className="
                mt-5
                grid
                w-full
                max-w-2xl
                grid-cols-1
                gap-3

                min-[420px]:grid-cols-3
              "
            >

              {/* FEATURE 1 */}

              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  p-3
                  text-left
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-1

                  min-[420px]:p-3
                "
                style={{
                  background:
                    "linear-gradient(135deg, #890C25 0%, #6f091e 100%)",
                }}
              >

                <div
                  className="
                    mb-2
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-600
                    text-base
                    text-white
                    shadow-md
                  "
                >
                  📚
                </div>

                <h3 className="text-[11px] font-bold text-white">
                  Digital Books
                </h3>

                <p className="mt-0.5 text-[9px] text-white/60">
                  Explore resources
                </p>

              </div>

              {/* FEATURE 2 */}

              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  p-3
                  text-left
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-1
                "
                style={{
                  background:
                    "linear-gradient(135deg, #890C25 0%, #6f091e 100%)",
                }}
              >

                <div
                  className="
                    mb-2
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-600
                    text-base
                    text-white
                    shadow-md
                  "
                >
                  🔄
                </div>

                <h3 className="text-[11px] font-bold text-white">
                  Easy Returns
                </h3>

                <p className="mt-0.5 text-[9px] text-white/60">
                  Manage your books
                </p>

              </div>

              {/* FEATURE 3 */}

              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  p-3
                  text-left
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-1
                "
                style={{
                  background:
                    "linear-gradient(135deg, #890C25 0%, #6f091e 100%)",
                }}
              >

                <div
                  className="
                    mb-2
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-600
                    text-base
                    text-white
                    shadow-md
                  "
                >
                  🔐
                </div>

                <h3 className="text-[11px] font-bold text-white">
                  Secure Access
                </h3>

                <p className="mt-0.5 text-[9px] text-white/60">
                  Protected account
                </p>

              </div>

            </div>

          </section>

          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <section
            className="
              flex
              w-full
              items-center
              justify-center
              px-0

              sm:px-2

              lg:justify-end
            "
          >

            <div
              className="
                w-full
                max-w-[390px]
                rounded-[1.7rem]
                border
                border-white/10
                px-4
                py-4
                shadow-2xl

                sm:rounded-[2rem]
                sm:px-6
                sm:py-5
              "
              style={{
                background:
                  "linear-gradient(135deg, #890C25 0%, #6f091e 55%, #420512 100%)",
              }}
            >

              {/* =================================================
                  LOGIN LOGO
              ================================================= */}

              <div className="mb-2.5 text-center">

                <div
                  className="
                    mx-auto
                    mb-1.5
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-xl
                    border
                    border-white/20
                    bg-white/10
                    shadow-lg
                    backdrop-blur-md

                    sm:h-12
                    sm:w-12
                    sm:rounded-2xl
                  "
                >

                  <img
                    src="/lms-logo.png"
                    alt="Library Logo"
                    className="h-full w-full object-contain p-1.5"
                  />

                </div>

                <h2
                  className="
                    text-xl
                    font-black
                    text-white

                    sm:text-2xl
                  "
                >
                  Welcome Back
                </h2>

                <p className="mt-0.5 text-xs text-white/60">
                  Sign in to your library account
                </p>

              </div>

              {/* =================================================
                  ERROR MESSAGE
              ================================================= */}

              {error && (
                <div
                  className="
                    mb-2.5
                    rounded-xl
                    border
                    border-red-300/30
                    bg-red-500/20
                    p-2
                    text-center
                    text-xs
                    text-red-100
                  "
                >
                  {error}
                </div>
              )}

              {/* =================================================
                  SUCCESS MESSAGE
              ================================================= */}

              {success && (
                <div
                  className="
                    mb-2.5
                    rounded-xl
                    border
                    border-green-300/30
                    bg-green-500/20
                    p-2
                    text-center
                    text-xs
                    text-green-100
                  "
                >
                  {success}
                </div>
              )}

              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleSubmit}
                className="space-y-2.5"
              >

                {/* EMAIL */}

                <div>

                  <label
                    className="
                      mb-1
                      block
                      text-xs
                      font-semibold
                      text-white/90
                    "
                  >
                    Email Address
                  </label>

                  <div className="relative">

                    <span
                      className="
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-sm
                        text-white/50
                      "
                    >
                      ✉
                    </span>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="Enter your email"
                      required
                      className="
                        w-full
                        rounded-xl
                        border
                        border-white/20
                        bg-white/10
                        py-2
                        pl-10
                        pr-4
                        text-sm
                        text-white
                        outline-none
                        transition-all
                        placeholder:text-white/40
                        focus:border-blue-400
                        focus:bg-white/15
                        focus:ring-2
                        focus:ring-blue-500/20
                      "
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div>

                  <label
                    className="
                      mb-1
                      block
                      text-xs
                      font-semibold
                      text-white/90
                    "
                  >
                    Password
                  </label>

                  <div className="relative">

                    <span
                      className="
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-sm
                        text-white/50
                      "
                    >
                      🔒
                    </span>

                    <input
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      required
                      className="
                        w-full
                        rounded-xl
                        border
                        border-white/20
                        bg-white/10
                        py-2
                        pl-10
                        pr-4
                        text-sm
                        text-white
                        outline-none
                        transition-all
                        placeholder:text-white/40
                        focus:border-blue-400
                        focus:bg-white/15
                        focus:ring-2
                        focus:ring-blue-500/20
                      "
                    />

                  </div>

                </div>

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    shadow-blue-900/30
                    transition-all
                    duration-300
                    hover:bg-blue-700
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {loading ? (
                    <>
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white/40
                          border-t-white
                        "
                      />

                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <span>→</span>
                    </>
                  )}

                </button>

              </form>

              {/* =================================================
                  REGISTER
              ================================================= */}

              <div className="mt-3 text-center">

                <p className="text-xs text-white/60 sm:text-sm">

                  Don't have an account?{" "}

                  <Link
                    to="/register"
                    className="
                      font-bold
                      text-blue-300
                      transition-colors
                      hover:text-white
                    "
                  >
                    Create Account
                  </Link>

                </p>

              </div>

              {/* =================================================
                  CARD FOOTER
              ================================================= */}

              <div
                className="
                  mt-3
                  border-t
                  border-white/10
                  pt-2
                  text-center
                "
              >

                <p
                  className="
                    break-words
                    text-[8px]
                    uppercase
                    tracking-[0.14em]
                    text-white/40
                  "
                >
                  The Shaikh Ayaz University Shikarpur
                </p>

                <p className="mt-0.5 text-[9px] text-white/30">
                  Library Management System
                </p>

              </div>

            </div>

          </section>

        </main>

        {/* =================================================
            MOBILE FOOTER
        ================================================= */}

        <div
          className="
            flex
            flex-shrink-0
            justify-center
            pb-0.5
          "
        >

          <p
            className="
              max-w-full
              break-words
              px-2
              text-center
              text-[8px]
              text-slate-400

              sm:text-[9px]
            "
          >
            The Shaikh Ayaz University Shikarpur • Library Management System
          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;