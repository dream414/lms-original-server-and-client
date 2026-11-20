import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  // =====================================================
  // ROLE NORMALIZER
  // =====================================================

  const normalizeRole = (role) => {
    if (!role) return "user";

    return role
      .toString()
      .trim()
      .toLowerCase()
      .replace(/_/g, "-")
      .replace(/\s+/g, "-");
  };

  const currentRole = normalizeRole(user?.role);

  // =====================================================
  // ROLE DISPLAY NAME
  // =====================================================

  const roleName = {
    superadmin: "Super Admin",
    admin: "Admin",
    student: "Student",
    teacher: "Teacher",
    librarian: "Librarian",
    library: "Library Staff",
    hod: "Head of Department",
    staff: "Staff",
    visitor: "Visitor",
    accountant: "Accountant",
    "account-1": "Accountant",
    researcher: "Researcher",
    digital: "Digital Library",
  };

  const displayRole =
    roleName[currentRole] ||
    user?.role ||
    "User";

  // =====================================================
  // USER INITIAL
  // =====================================================

  const userInitial =
    user?.name
      ?.charAt(0)
      ?.toUpperCase() || "U";

  // =====================================================
  // STATUS
  // =====================================================

  const isActive =
    !user?.status ||
    user?.status?.toLowerCase() === "active";

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-10 sm:px-6 sm:pt-12 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* =================================================
            PROFILE HEADER
        ================================================= */}

        <div className="relative mb-6 overflow-hidden rounded-3xl bg-[#890C25] shadow-2xl">

          {/* Decorative Circles */}

          <div
            className="
              absolute
              -right-20
              -top-20
              h-64
              w-64
              rounded-full
              border
              border-white/20
              bg-white/5
            "
          />

          <div
            className="
              absolute
              -bottom-28
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
              absolute
              right-32
              top-20
              h-20
              w-20
              rounded-full
              bg-[#D58A98]/10
              blur-2xl
            "
          />

          {/* Header Content */}

          <div className="relative flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center">

            {/* Avatar */}

            <div
              className="
                flex
                h-28
                w-28
                shrink-0
                items-center
                justify-center
                rounded-full
                border-4
                border-white/30
                bg-white
                text-4xl
                font-extrabold
                text-[#890C25]
                shadow-2xl
              "
            >
              {userInitial}
            </div>

            {/* User Info */}

            <div className="min-w-0">

              <p
                className="
                  text-sm
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#D58A98]
                "
              >
                My Profile
              </p>

              <h1
                className="
                  mt-1
                  truncate
                  text-3xl
                  font-extrabold
                  text-white
                  sm:text-4xl
                "
              >
                {user?.name || "User"}
              </h1>

              <p className="mt-2 text-sm text-white/75 sm:text-base">
                Manage and view your account information.
              </p>

              {/* Role Badge */}

              <div className="mt-4 flex flex-wrap items-center gap-3">

                <span
                  className="
                    rounded-full
                    border
                    border-white/20
                    bg-white/10
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-white
                    backdrop-blur-md
                  "
                >
                  {displayRole}
                </span>

                <span
                  className="
                    rounded-full
                    bg-white
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-[#890C25]
                    shadow-md
                  "
                >
                  {isActive
                    ? "Active Account"
                    : "Inactive Account"}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* =================================================
              PERSONAL INFORMATION CARD
          ================================================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border-2
              border-[#890C25]/20
              bg-white
              shadow-xl
              lg:col-span-2
            "
          >

            {/* =================================================
                DECORATIVE CIRCLES
            ================================================= */}

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
                border-[#890C25]/10
                bg-[#890C25]/[0.025]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -right-8
                -top-8
                h-40
                w-40
                rounded-full
                border
                border-[#D58A98]/20
                bg-[#D58A98]/[0.04]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-28
                left-1/4
                h-64
                w-64
                rounded-full
                border
                border-[#890C25]/10
                bg-[#890C25]/[0.025]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-10
                left-1/3
                h-36
                w-36
                rounded-full
                border
                border-[#D58A98]/15
                bg-[#D58A98]/[0.035]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                right-32
                top-24
                h-24
                w-24
                rounded-full
                bg-[#D58A98]/15
                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                bottom-10
                left-10
                h-20
                w-20
                rounded-full
                bg-[#890C25]/10
                blur-2xl
              "
            />

            {/* =================================================
                CARD HEADER
            ================================================= */}

            <div
              className="
                relative
                flex
                items-center
                justify-between
                border-b
                border-slate-200
                bg-gradient-to-r
                from-slate-50
                via-white
                to-[#D58A98]/5
                px-6
                py-6
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#890C25]
                    text-white
                    shadow-lg
                    shadow-[#890C25]/20
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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

                  <h2 className="text-xl font-extrabold text-slate-800">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your registered account details
                  </p>

                </div>

              </div>

              <div
                className="
                  hidden
                  rounded-full
                  border
                  border-[#890C25]/10
                  bg-[#890C25]/5
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-[#890C25]
                  sm:block
                "
              >
                Account Details
              </div>

            </div>

            {/* =================================================
                INFORMATION GRID
            ================================================= */}

            <div className="relative grid gap-5 p-6 sm:grid-cols-2 mt-5">

              {/* =================================================
                  FULL NAME
              ================================================= */}

              <div
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#890C25]/30
                  hover:shadow-2xl
                "
              >

                {/* Top Accent */}

                <div
                  className="
                    absolute
                    left-0
                    top-0
                    h-1.5
                    w-20
                    rounded-br-full
                    bg-[#890C25]
                  "
                />

                {/* Decorative Circle */}

                <div
                  className="
                    absolute
                    -right-10
                    -top-10
                    h-24
                    w-24
                    rounded-full
                    bg-[#890C25]/10
                    transition
                    duration-300
                    group-hover:scale-125
                  "
                />

                <div
                  className="
                    absolute
                    -bottom-8
                    -right-8
                    h-16
                    w-16
                    rounded-full
                    border
                    border-[#D58A98]/20
                  "
                />

                <div className="relative">

                  <div className="mb-4 flex items-center justify-between">

                    <p className="text-sm font-semibold text-slate-500">
                      Full Name
                    </p>

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#890C25]/10
                        text-lg
                        text-[#890C25]
                        transition
                        duration-300
                        group-hover:bg-[#890C25]
                        group-hover:text-white
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
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
                        />
                      </svg>
                    </div>

                  </div>

                  <p className="break-words text-xl font-extrabold text-[#890C25]">
                    {user?.name || "Not Available"}
                  </p>

                  <div className="mt-4 h-1 w-16 rounded-full bg-[#890C25]" />

                </div>

              </div>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-blue-500/30
                  hover:shadow-2xl
                "
              >

                {/* Top Accent */}

                <div
                  className="
                    absolute
                    right-0
                    top-0
                    h-1.5
                    w-20
                    rounded-bl-full
                    bg-blue-600
                  "
                />

                {/* Decorative Circle */}

                <div
                  className="
                    absolute
                    -bottom-10
                    -right-10
                    h-24
                    w-24
                    rounded-full
                    bg-blue-500/10
                    transition
                    duration-300
                    group-hover:scale-125
                  "
                />

                <div
                  className="
                    absolute
                    -left-8
                    -top-8
                    h-16
                    w-16
                    rounded-full
                    border
                    border-blue-200
                  "
                />

                <div className="relative">

                  <div className="mb-4 flex items-center justify-between">

                    <p className="text-sm font-semibold text-slate-500">
                      Email Address
                    </p>

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-100
                        text-lg
                        text-blue-600
                        transition
                        duration-300
                        group-hover:bg-blue-600
                        group-hover:text-white
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
                          d="M3 8.25l9 6 9-6M4.5 19.5h15A1.5 1.5 0 0021 18V6a1.5 1.5 0 00-1.5-1.5h-15A1.5 1.5 0 003 6v12a1.5 1.5 0 001.5 1.5z"
                        />
                      </svg>
                    </div>

                  </div>

                  <p className="break-all text-base font-extrabold text-blue-600">
                    {user?.email || "Not Available"}
                  </p>

                  <div className="mt-4 h-1 w-16 rounded-full bg-blue-600" />

                </div>

              </div>

              {/* =================================================
                  ROLE
              ================================================= */}

              <div
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-purple-500/30
                  hover:shadow-2xl
                "
              >

                {/* Top Accent */}

                <div
                  className="
                    absolute
                    left-0
                    top-0
                    h-1.5
                    w-20
                    rounded-br-full
                    bg-purple-600
                  "
                />

                {/* Decorative Circle */}

                <div
                  className="
                    absolute
                    -bottom-10
                    -left-10
                    h-24
                    w-24
                    rounded-full
                    bg-purple-500/10
                    transition
                    duration-300
                    group-hover:scale-125
                  "
                />

                <div
                  className="
                    absolute
                    -right-8
                    -top-8
                    h-16
                    w-16
                    rounded-full
                    border
                    border-purple-200
                  "
                />

                <div className="relative">

                  <div className="mb-4 flex items-center justify-between">

                    <p className="text-sm font-semibold text-slate-500">
                      Account Role
                    </p>

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-purple-100
                        text-lg
                        text-purple-600
                        transition
                        duration-300
                        group-hover:bg-purple-600
                        group-hover:text-white
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
                          d="M9 12l2 2 4-4m5.25-2.25v6.75A2.25 2.25 0 0118 16.75H6a2.25 2.25 0 01-2.25-2.25V7.75A2.25 2.25 0 016 5.5h12a2.25 2.25 0 012.25 2.25z"
                        />
                      </svg>
                    </div>

                  </div>

                  <span
                    className="
                      inline-flex
                      rounded-full
                      bg-purple-600
                      px-4
                      py-2
                      text-sm
                      font-bold
                      text-white
                      shadow-md
                    "
                  >
                    {displayRole}
                  </span>

                  <div className="mt-4 h-1 w-16 rounded-full bg-purple-600" />

                </div>

              </div>

              {/* =================================================
                  STATUS
              ================================================= */}

              <div
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-green-500/30
                  hover:shadow-2xl
                "
              >

                {/* Top Accent */}

                <div
                  className={`
                    absolute
                    bottom-0
                    right-0
                    h-1.5
                    w-20
                    rounded-tl-full
                    ${
                      isActive
                        ? "bg-green-500"
                        : "bg-red-500"
                    }
                  `}
                />

                {/* Decorative Circle */}

                <div
                  className={`
                    absolute
                    -right-10
                    -top-10
                    h-24
                    w-24
                    rounded-full
                    transition
                    duration-300
                    group-hover:scale-125
                    ${
                      isActive
                        ? "bg-green-500/10"
                        : "bg-red-500/10"
                    }
                  `}
                />

                <div className="relative">

                  <div className="mb-4 flex items-center justify-between">

                    <p className="text-sm font-semibold text-slate-500">
                      Account Status
                    </p>

                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        transition
                        duration-300
                        ${
                          isActive
                            ? "bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white"
                            : "bg-red-100 text-red-600 group-hover:bg-red-500 group-hover:text-white"
                        }
                      `}
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
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>

                  </div>

                  <span
                    className={`
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      px-4
                      py-2
                      text-sm
                      font-bold
                      ${
                        isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >

                    <span
                      className={`
                        h-2.5
                        w-2.5
                        rounded-full
                        ${
                          isActive
                            ? "bg-green-500"
                            : "bg-red-500"
                        }
                      `}
                    />

                    {user?.status || "Active"}

                  </span>

                  <div
                    className={`
                      mt-4
                      h-1
                      w-16
                      rounded-full
                      ${
                        isActive
                          ? "bg-green-500"
                          : "bg-red-500"
                      }
                    `}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              ACCOUNT SUMMARY
          ================================================= */}

          <div
            className="
              overflow-hidden
              rounded-3xl
              border-2
              border-[#890C25]/20
              bg-white
              shadow-xl
            "
          >

            {/* Header */}

            <div className="bg-[#890C25] px-6 py-5">

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#D58A98]
                "
              >
                Account
              </p>

              <h2
                className="
                  mt-1
                  text-xl
                  font-extrabold
                  text-white
                "
              >
                Account Summary
              </h2>

            </div>

            {/* Summary */}

            <div className="space-y-4 p-6">

              {/* Role */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  rounded-2xl
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
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#890C25]/10
                      text-[#890C25]
                    "
                  >
                    ★
                  </div>

                  <div>

                    <p className="text-xs font-semibold text-slate-400">
                      Role
                    </p>

                    <p className="text-sm font-bold text-slate-800">
                      {displayRole}
                    </p>

                  </div>

                </div>

              </div>

              {/* Status */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  rounded-2xl
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
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-100
                      text-blue-600
                    "
                  >
                    ●
                  </div>

                  <div>

                    <p className="text-xs font-semibold text-slate-400">
                      Status
                    </p>

                    <p className="text-sm font-bold text-slate-800">
                      {user?.status || "Active"}
                    </p>

                  </div>

                </div>

              </div>

              {/* Access */}

              <div
                className="
                  rounded-2xl
                  border
                  border-[#D58A98]/40
                  bg-[#D58A98]/10
                  p-4
                "
              >

                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-[#890C25]
                  "
                >
                  Access Level
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    font-semibold
                    leading-6
                    text-slate-700
                  "
                >
                  Your dashboard and sidebar options are automatically
                  controlled according to your assigned role. You will
                  have access to the modules, features, and actions
                  relevant to your responsibilities.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            ROLE ACCESS INFORMATION
        ================================================= */}

        <div
          className="
            mt-6
            overflow-hidden
            rounded-3xl
            border-2
            border-[#890C25]/20
            bg-white
            shadow-xl
          "
        >

          {/* Header */}

          <div
            className="
              border-b
              border-slate-200
              bg-slate-50
              px-6
              py-5
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  h-9
                  w-1.5
                  rounded-full
                  bg-blue-600
                "
              />

              <div>

                <h2 className="text-xl font-extrabold text-slate-800">
                  Role Access
                </h2>

                <p className="text-sm text-slate-500">
                  Your current system access level.
                </p>

              </div>

            </div>

          </div>

          {/* Content */}

          <div className="p-6">

            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                bg-gradient-to-r
                from-[#890C25]
                to-[#6f091e]
                p-5
                shadow-lg
              "
            >

              {/* Decorative Circles */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-10
                  h-32
                  w-32
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
                  -bottom-12
                  left-1/3
                  h-36
                  w-36
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
                  gap-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                <div>

                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      text-[#D58A98]
                    "
                  >
                    Current Role
                  </p>

                  <h3
                    className="
                      mt-1
                      text-2xl
                      font-extrabold
                      capitalize
                      text-white
                    "
                  >
                    {displayRole}
                  </h3>

                </div>

                <div
                  className="
                    rounded-2xl
                    border
                    border-white/20
                    bg-white/10
                    px-5
                    py-3
                    text-center
                    backdrop-blur-md
                  "
                >

                  <p className="text-xs font-semibold text-white/60">
                    System Access
                  </p>

                  <p className="mt-1 text-sm font-extrabold text-white">
                    Role Based
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;