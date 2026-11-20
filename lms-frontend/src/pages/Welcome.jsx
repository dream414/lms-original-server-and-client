import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  // ==========================================
  // BRAND COLORS
  // ==========================================
  const brandColor = "#890C25";
  const brandLightColor = "#D58A98";

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* ==========================================
          FULL HOME BACKGROUND IMAGE
      ========================================== */}
      <img
        src="/lms-home.png"
        alt="The Shaikh Ayaz University Shikarpur"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          object-center
          scale-[1.12]
          translate-y-3

          sm:scale-[1.10]
          sm:translate-y-4

          md:scale-[1.08]
          md:translate-y-5
        "
      />

      {/* ==========================================
          PROFESSIONAL READABILITY OVERLAY
      ========================================== */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-b
          from-black/15
          via-black/30
          to-black/50
        "
      />

      <div className="absolute inset-0 bg-black/10" />

      {/* ==========================================
          HOME CONTENT
      ========================================== */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">

        <div
          className="
            w-full
            max-w-6xl
            -translate-y-5
            text-center

            sm:-translate-y-7
            md:-translate-y-9
          "
        >

          {/* ======================================
              UNIVERSITY LOGO
              SLIGHTLY LARGER
          ====================================== */}
          <div
            className="
              mx-auto
              flex
              h-32
              w-32
              items-center
              justify-center

              sm:h-36
              sm:w-36

              md:h-40
              md:w-40

              lg:h-44
              lg:w-44
            "
          >
            <img
              src="/lms-logo.png"
              alt="University Logo"
              className="
                h-full
                w-full
                object-contain

                drop-shadow-[0_6px_18px_rgba(0,0,0,0.85)]
              "
            />
          </div>

          {/* ======================================
              STYLISH UNIVERSITY NAME
          ====================================== */}
          <h1
            className="
              mt-8

              font-black
              uppercase
              leading-tight
              tracking-[0.08em]

              text-white

              text-xl
              sm:text-2xl
              md:text-3xl
              lg:text-4xl
              xl:text-5xl

              drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]

              [text-shadow:0_3px_0_rgba(137,12,37,0.35),0_6px_18px_rgba(0,0,0,0.75)]

              xl:whitespace-nowrap
            "
          >
            THE SHAIKH AYAZ UNIVERSITY SHIKARPUR
          </h1>

          {/* ======================================
              LIBRARY MANAGEMENT SYSTEM
          ====================================== */}
          <div className="mt-5 flex justify-center">

            <h2
              className="
                inline-block
                rounded-md

                px-5
                py-2.5

                text-xl
                font-bold
                leading-tight
                tracking-wide
                text-white

                shadow-[0_5px_20px_rgba(0,0,0,0.55)]
                drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)]

                sm:px-6
                sm:py-3
                sm:text-2xl

                md:text-3xl
                lg:text-4xl
              "
              style={{
                backgroundColor: brandColor,
              }}
            >
              Library Management System
            </h2>

          </div>

          {/* ======================================
              TAGLINE
          ====================================== */}
          <div className="mt-3 flex justify-center">

            <p
              className="
                inline-block

                border-b-2
                border-white
                pb-1

                text-base
                font-semibold
                italic
                tracking-wide

                drop-shadow-[0_3px_8px_rgba(0,0,0,0.95)]

                sm:text-lg
                md:text-xl
                lg:text-2xl
              "
              style={{
                color: brandLightColor,
              }}
            >
              Revival of Educational Glory of Shikarpur
            </p>

          </div>

          {/* ======================================
              DESCRIPTION
          ====================================== */}
          <p
            className="
              mx-auto
              mt-5
              max-w-2xl

              text-xs
              font-medium
              leading-6
              text-white

              drop-shadow-[0_3px_8px_rgba(0,0,0,1)]

              sm:text-sm
              md:text-base
            "
          >
            A modern digital platform for managing library
            resources, books, academic services and
            university learning resources.
          </p>

          {/* ======================================
              ACTION BUTTONS
          ====================================== */}
          <div
            className="
              mt-7
              flex
              flex-col
              items-center
              justify-center
              gap-3

              sm:flex-row
            "
          >

            {/* LOGIN */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
                w-full
                max-w-xs
                rounded-lg

                px-7
                py-3

                text-sm
                font-semibold
                text-white

                shadow-[0_5px_18px_rgba(0,0,0,0.55)]

                transition
                hover:brightness-110
                hover:shadow-2xl
                active:scale-95

                sm:w-auto
              "
              style={{
                backgroundColor: brandColor,
              }}
            >
              Login to Library
            </button>

            {/* REGISTER */}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="
                w-full
                max-w-xs
                rounded-lg

                border
                border-white/80

                bg-black/20

                px-7
                py-3

                text-sm
                font-semibold
                text-white

                shadow-[0_5px_18px_rgba(0,0,0,0.45)]

                backdrop-blur-sm

                transition
                hover:bg-black/30
                active:scale-95

                sm:w-auto
              "
            >
              Create Account
            </button>

          </div>

          {/* ======================================
              FOOTER
          ====================================== */}
          <p
            className="
              mt-8
              text-[10px]
              text-white

              drop-shadow-[0_3px_7px_rgba(0,0,0,0.95)]

              sm:text-xs
            "
          >
            © {new Date().getFullYear()} The Shaikh Ayaz University Shikarpur
          </p>

        </div>

      </div>

    </div>
  );
};

export default Welcome;

