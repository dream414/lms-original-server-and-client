import { useUsers } from "../context/UserContext";

const Staff = () => {
  const {
    staff = [],
    loading,
    error,
  } = useUsers();

  // =====================================================
  // INITIAL
  // =====================================================

  const getInitial = (name) => {
    return (
      name
        ?.trim()
        ?.charAt(0)
        ?.toUpperCase() || "S"
    );
  };

  // =====================================================
  // ACTIVE STATUS
  // =====================================================

  const isActive = (member) => {
    return (
      !member?.status ||
      member?.status?.toString().toLowerCase() === "active"
    );
  };

  // =====================================================
  // TWO DIGIT NUMBER
  // =====================================================

  const formatNumber = (number) => {
    return String(number).padStart(2, "0");
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-[#890C25]/5 px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HERO HEADER
        ================================================= */}

        <div
          className="
            relative
            mb-10
            overflow-hidden
            rounded-[2.5rem]
            bg-gradient-to-br
            from-[#890C25]
            via-[#9d1833]
            to-[#65091c]
            shadow-[0_25px_60px_rgba(137,12,37,0.28)]
          "
        >

          {/* =================================================
              DECORATIVE BACKGROUND
          ================================================= */}

          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-80
              w-80
              rounded-full
              border
              border-white/20
              bg-white/5
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-36
              left-[28%]
              h-80
              w-80
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
              right-[25%]
              top-1/2
              h-40
              w-40
              -translate-y-1/2
              rounded-full
              bg-[#D58A98]/10
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              left-10
              top-10
              h-24
              w-24
              rounded-full
              bg-white/5
              blur-2xl
            "
          />

          {/* =================================================
              HEADER CONTENT
          ================================================= */}

          <div
            className="
              relative
              flex
              flex-col
              gap-8
              p-7
              sm:p-9
              lg:flex-row
              lg:items-center
              lg:justify-between
              lg:p-10
            "
          >

            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div className="max-w-2xl">

              {/* LABEL */}

              <div className="mb-5 flex items-center gap-3">

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
                    backdrop-blur-xl
                  "
                >

                  {/* STAFF / USERS ICON */}

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
                    />
                  </svg>

                </div>

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[#E5A7B2]">
                    Administration
                  </p>

                  <p className="mt-1 text-xs font-medium text-white/50">
                    Learning Management System
                  </p>

                </div>

              </div>

              {/* TITLE */}

              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Staff
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                Manage and explore all registered staff members,
                their account information, and LMS status from
                one place.
              </p>

              {/* INFO PILLS */}

              <div className="mt-6 flex flex-wrap gap-3">

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
                    text-white/80
                    backdrop-blur-md
                  "
                >

                  <span className="h-2 w-2 rounded-full bg-green-400" />

                  Active Accounts

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
                    text-white/80
                    backdrop-blur-md
                  "
                >
                  Staff Directory
                </div>

              </div>

            </div>

            {/* =================================================
                TOTAL STAFF BLUE CARD
            ================================================= */}

            <div
              className="
                relative
                w-full
                overflow-hidden
                rounded-[2rem]
                border
                border-blue-300/30
                bg-gradient-to-br
                from-blue-600
                via-blue-700
                to-blue-900
                p-7
                text-center
                shadow-[0_20px_50px_rgba(37,99,235,0.35)]
                lg:w-56
              "
            >

              {/* DECORATIVE CIRCLES */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-10
                  h-28
                  w-28
                  rounded-full
                  border
                  border-white/10
                  bg-white/10
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-12
                  -left-12
                  h-32
                  w-32
                  rounded-full
                  bg-blue-400/10
                  blur-2xl
                "
              />

              <div className="relative">

                {/* CONTACT ICON BOX */}

                <div
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/20
                    bg-white/15
                    text-white
                    shadow-xl
                    backdrop-blur-xl
                  "
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-1a4 4 0 100-8 4 4 0 000 8zm4-7a4 4 0 010 7.75M6 7a4 4 0 000 7.75"
                    />
                  </svg>

                </div>

                {/* LABEL */}

                <p className="mt-5 text-[11px] font-black uppercase tracking-[0.2em] text-blue-100/70">
                  Total Staff
                </p>

                {/* NUMBER */}

                <div className="relative mt-1 flex justify-center">

                  <span
                    className="
                      select-none
                      text-6xl
                      font-black
                      leading-none
                      tracking-tight
                      text-transparent
                      [-webkit-text-stroke:1.5px_rgba(255,255,255,0.75)]
                    "
                  >
                    {formatNumber(staff.length)}
                  </span>

                </div>

                {/* UNDERLINE */}

                <div className="mx-auto mt-5 h-1 w-12 rounded-full bg-white/60" />

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="h-10 w-1.5 rounded-full bg-[#890C25]" />

              <div>

                <h2 className="text-2xl font-black tracking-tight text-slate-800">
                  All Staff Members
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Browse all registered staff accounts.
                </p>

              </div>

            </div>

          </div>

          <div
            className="
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-[#890C25]/10
              bg-white
              px-5
              py-2.5
              text-xs
              font-black
              text-[#890C25]
              shadow-sm
            "
          >

            <span className="h-2 w-2 rounded-full bg-[#890C25]" />

            {staff.length} Staff
            {staff.length !== 1 ? " Members" : " Member"}

          </div>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div
            className="
              rounded-[2rem]
              border
              border-[#890C25]/10
              bg-white
              p-14
              text-center
              shadow-xl
            "
          >

            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-[#890C25]/10
              "
            >

              <div
                className="
                  h-8
                  w-8
                  animate-spin
                  rounded-full
                  border-4
                  border-[#890C25]/20
                  border-t-[#890C25]
                "
              />

            </div>

            <h3 className="mt-5 text-xl font-black text-slate-800">
              Loading Staff
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Fetching staff records from the LMS...
            </p>

          </div>

        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (

          <div
            className="
              rounded-[2rem]
              border
              border-red-200
              bg-white
              p-12
              text-center
              shadow-xl
            "
          >

            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-red-50
                text-red-500
              "
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m0 3.75h.008M10.29 3.86l-7.5 13A1.5 1.5 0 004.09 19h15.82a1.5 1.5 0 001.3-2.25l-7.5-13a1.5 1.5 0 00-2.6 0z"
                />
              </svg>

            </div>

            <h3 className="mt-5 text-xl font-black text-slate-800">
              Unable to Load Staff
            </h3>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

          </div>

        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading && !error && staff.length === 0 && (

          <div
            className="
              rounded-[2rem]
              border
              border-[#890C25]/10
              bg-white
              p-14
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
                rounded-3xl
                bg-[#890C25]/10
                text-4xl
              "
            >
              👨‍💼
            </div>

            <h3 className="mt-6 text-2xl font-black text-slate-800">
              No Staff Found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              There are currently no registered users with the
              Staff role.
            </p>

          </div>

        )}

        {/* =================================================
            STAFF CARDS
        ================================================= */}

        {!loading && !error && staff.length > 0 && (

          <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">

            {staff.map((member) => {

              const active = isActive(member);

              return (

                <div
                  key={member._id}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[2rem]
                    border
                    border-slate-200
                    bg-white
                    shadow-[0_10px_30px_rgba(15,23,42,0.07)]
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:border-[#890C25]/20
                    hover:shadow-[0_25px_55px_rgba(137,12,37,0.16)]
                  "
                >

                  {/* TOP GRADIENT */}

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

                  {/* DECORATION */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-12
                      -top-12
                      h-36
                      w-36
                      rounded-full
                      bg-[#890C25]/5
                      transition-transform
                      duration-500
                      group-hover:scale-150
                    "
                  />

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -bottom-16
                      -left-16
                      h-40
                      w-40
                      rounded-full
                      border
                      border-[#D58A98]/10
                      bg-[#D58A98]/5
                    "
                  />

                  <div className="relative p-7">

                    {/* =================================================
                        TOP ROW
                    ================================================= */}

                    <div className="flex items-start justify-between">

                      {/* AVATAR */}

                      <div className="relative">

                        <div
                          className="
                            absolute
                            -inset-1
                            rounded-[1.2rem]
                            bg-[#890C25]/10
                            transition
                            duration-300
                            group-hover:bg-[#890C25]/20
                          "
                        />

                        <div
                          className="
                            relative
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-[1.1rem]
                            bg-gradient-to-br
                            from-blue-600
                            to-blue-900
                            text-2xl
                            font-black
                            text-white
                            shadow-lg
                            transition-all
                            duration-300
                            group-hover:scale-105
                          "
                        >
                          {getInitial(member.name)}
                        </div>

                      </div>

                      {/* STATUS */}

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          px-3
                          py-1.5
                          text-[11px]
                          font-black
                          ${
                            active
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-red-200 bg-red-50 text-red-700"
                          }
                        `}
                      >

                        <span
                          className={`
                            h-2
                            w-2
                            rounded-full
                            ${
                              active
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                          `}
                        />

                        {member?.status || "Active"}

                      </span>

                    </div>

                    {/* =================================================
                        NAME
                    ================================================= */}

                    <div className="mt-7">

                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#890C25]/60">
                        Staff Account
                      </p>

                      <h3 className="mt-1 break-words text-xl font-black text-slate-800 transition-colors group-hover:text-[#890C25]">
                        {member.name || "Unnamed Staff"}
                      </h3>

                    </div>

                    {/* =================================================
                        EMAIL BOX
                    ================================================= */}

                    <div
                      className="
                        mt-6
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        border-slate-100
                        bg-slate-50
                        p-4
                        transition-all
                        duration-300
                        group-hover:border-[#890C25]/10
                        group-hover:bg-[#890C25]/5
                      "
                    >

                      {/* EMAIL ICON */}

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-white
                          text-[#890C25]
                          shadow-sm
                        "
                      >

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>

                      </div>

                      <div className="min-w-0">

                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Email Address
                        </p>

                        <p className="mt-1 break-all text-sm font-bold text-slate-700">
                          {member.email || "Not Available"}
                        </p>

                      </div>

                    </div>

                    {/* =================================================
                        FOOTER / ACCOUNT ROLE
                    ================================================= */}

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">

                      <div className="flex items-center gap-2">

                        {/* GREEN PLUS ICON BOX */}

                        <div
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-green-200
                            bg-green-50
                            text-green-600
                            shadow-sm
                            transition-all
                            duration-300
                            group-hover:scale-110
                            group-hover:bg-green-100
                          "
                        >

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>

                        </div>

                        <span className="text-xs font-bold text-slate-400">
                          Account Role
                        </span>

                      </div>

                      {/* GREEN STAFF BADGE */}

                      <span
                        className="
                          rounded-full
                          border
                          border-green-200
                          bg-green-50
                          px-4
                          py-2
                          text-[11px]
                          font-black
                          uppercase
                          tracking-wide
                          text-green-700
                        "
                      >
                        Staff
                      </span>

                    </div>

                    {/* BOTTOM ACCENT */}

                    <div
                      className="
                        mt-6
                        h-1
                        w-12
                        rounded-full
                        bg-[#890C25]
                        transition-all
                        duration-500
                        group-hover:w-full
                      "
                    />

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>

    </div>
  );
};

export default Staff;