
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

const Header = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    unreadCount,
    getNotifications,
  } = useNotifications();

  // =====================================
  // BRAND COLORS
  // =====================================

  const brandColor = "#890C25";
  const brandLightColor = "#D58A98";

  // =====================================
  // LOAD NOTIFICATIONS
  // =====================================

  useEffect(() => {
    if (user) {
      getNotifications().catch((error) => {
        console.error(
          "HEADER NOTIFICATION ERROR:",
          error
        );
      });
    }
  }, [user]);

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = async () => {
    await logout();

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================
  // OPEN NOTIFICATIONS
  // =====================================

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  return (
    <header
      className="
        fixed
        left-0
        right-0
        top-0
        z-50
        h-16
        border-b
        border-white/15
        shadow-[0_4px_20px_rgba(0,0,0,0.18)]
      "
      style={{
        backgroundColor: brandColor,
      }}
    >
      <div
        className="
          flex
          h-full
          w-full
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >

        {/* =====================================
            LEFT SIDE
        ===================================== */}

        <div className="flex items-center gap-3">

          {/* Mobile Menu Button */}

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              border
              border-white/20
              bg-white/10
              text-white
              transition
              duration-200
              hover:bg-white/20
              active:scale-95
              lg:hidden
            "
            aria-label="Open sidebar"
          >
            <span className="text-xl">
              ☰
            </span>
          </button>

          {/* =================================
              UNIVERSITY LOGO
          ================================= */}

          <div className="flex items-center">

            <img
              src="/lms-logo.png"
              alt="The Shaikh Ayaz University Shikarpur"
              className="
                h-11
                w-11
                object-contain
                drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]

                sm:h-12
                sm:w-12
              "
            />

          </div>

          {/* =================================
              BRAND NAME
          ================================= */}

          <div className="hidden sm:block">

            <h1
              className="
                text-sm
                font-extrabold
                tracking-wide
                text-white
                sm:text-base
              "
            >
              Library Management System
            </h1>

            <p
              className="
                text-[10px]
                font-medium
                sm:text-xs
              "
              style={{
                color: brandLightColor,
              }}
            >
              The Shaikh Ayaz University Shikarpur
            </p>

          </div>

          {/* Mobile Short Name */}

          <div className="sm:hidden">

            <h1
              className="
                text-sm
                font-extrabold
                text-white
              "
            >
              LMS
            </h1>

          </div>

        </div>

        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            sm:gap-4
          "
        >

          {/* =====================================
              NOTIFICATION BELL
          ===================================== */}

          <button
            type="button"
            onClick={handleNotificationClick}
            aria-label="Notifications"
            className="
              relative
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/20
              bg-white/10
              text-white
              shadow-sm
              backdrop-blur-sm
              transition-all
              duration-200
              hover:bg-white/20
              hover:shadow-md
              active:scale-95
            "
          >

            {/* Bell */}

            <span className="text-xl leading-none">
              🔔
            </span>

            {/* =================================
                UNREAD BADGE
            ================================= */}

            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  min-h-[20px]
                  min-w-[20px]
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-[#890C25]
                  bg-red-500
                  px-1
                  text-[9px]
                  font-extrabold
                  leading-none
                  text-white
                  shadow-md
                "
              >
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}

          </button>

          {/* =====================================
              USER CIRCLE
          ===================================== */}

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              border-2
              border-white
              bg-gray-300
              text-sm
              font-extrabold
              text-red-700
              shadow-md

              sm:h-10
              sm:w-10
            "
          >
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>

          {/* =====================================
              USER INFORMATION
          ===================================== */}

          <div
            className="
              hidden
              text-right
              md:block
            "
          >

            <p
              className="
                max-w-[180px]
                truncate
                text-sm
                font-bold
                text-white
              "
            >
              {user?.name || "User"}
            </p>

            <p
              className="
                text-xs
                font-semibold
                capitalize
              "
              style={{
                color: brandLightColor,
              }}
            >
              {user?.role || "Guest"}
            </p>

          </div>

          {/* =====================================
              LOGOUT
          ===================================== */}

          <button
            type="button"
            onClick={handleLogout}
            className="
              rounded-lg
              border
              border-white/30
              bg-blue-800
              px-3
              py-2
              text-xs
              font-semibold
              text-white
              backdrop-blur-sm
              transition
              duration-200
              hover:bg-blue-600
              active:scale-95

              sm:px-4
              sm:text-sm
            "
          >
            Logout
          </button>

        </div>

      </div>
    </header>
  );
};

export default Header;

