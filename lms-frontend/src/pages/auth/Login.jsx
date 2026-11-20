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