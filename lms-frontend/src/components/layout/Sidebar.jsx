import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const brandColor = "#890C25";
  const silverColor = "#F1F5F9";
  const brandLightColor = "#D58A98";
  const blueColor = "#2563EB";

  // =====================================================
  // NORMALIZE ROLE
  // =====================================================

  const normalizeRole = (role) => {
    if (!role) return "";

    return role
      .toString()
      .trim()
      .toLowerCase()
      .replace(/_/g, "-")
      .replace(/\s+/g, "-");
  };

  const userRole = normalizeRole(user?.role);

  // =====================================================
  // ROLE BASED MENU CONFIGURATION
  // =====================================================

  const menuItems = [
    {
      name: "Profile",
      path: "/profile",
      roles: [
        "superadmin",
        "admin",
        "accountant",
        "digital",
        "hod",
        "librarian",
        "library",
        "teacher",
        "staff",
        "student",
        "visitor",
         "researcher",
      ],
    },

    {
      name: "Library Members",
      path: "/users",
      roles: [
        "superadmin",
        "admin",
      ],
    },

    {
      name: "Students",
      path: "/students",
      roles: [
        "superadmin",
        "admin",
        "hod",
        "teacher",
      ],
    },

    {
      name: "Teachers",
      path: "/teachers",
      roles: [
        "superadmin",
        "admin",
        "hod",
      ],
    },

    {
      name: "Staff",
      path: "/staff",
      roles: [
        "superadmin",
        "admin",
        "hod",
      ],
    },

    {
      name: "HOD",
      path: "/hod",
      roles: [
        "superadmin",
        "admin",
      ],
    },

    {
      name: "Librarians",
      path: "/librarians",
      roles: [
        "superadmin",
        "admin",
      ],
    },

    {
      name: "Departments",
      path: "/departments",
      roles: [
        "superadmin",
        "admin",
        "hod",
      ],
    },

    {
      name: "Courses",
      path: "/courses",
      roles: [
        "superadmin",
        "admin",
        "hod",
        "teacher",
        "student",
        "digital",
        "visitor",
      ],
    },

   
    // {
    //   name: "Leave Management",
    //   path: "/leave",
    //   roles: [
    //     "superadmin",
    //     "admin",
    //     "hod",
    //     "staff",
    //     "teacher",
    //     "student",
    //   ],
    // },

  

    {
      name: "Books",
      path: "/library/books",
      roles: [
        "superadmin",
        "admin",
        "librarian",
        "library",
        "teacher",
        "student",
        "staff",
        "visitor",
         "researcher",
      ],
    },

 
   // ========================================
// DIGITAL LIBRARY
// ========================================

{
  name: "Digital Books",
  path: "/digital-library/books",
  roles: [
    "superadmin",
    "admin",
    "digital",
    "librarian",
    "library",
    "teacher",
    "student",
    "visitor",
    "researcher",
  ],
  
},

{
  name: "Add Digital Book",
  path: "/digital-library/add",
  roles: [
    "superadmin",
    "admin",
    "digital",
  ],
},

{
  name: "Manage Digital Books",
  path: "/digital-library/manage",
  roles: [
    "superadmin",
    "admin",
    "digital",
  ],
},

{
  name: "My Digital Books",
  path: "/digital-library/my-books",
  roles: [
    "superadmin",
    "admin",
    "digital",
    "librarian",
    "library",
    "teacher",
    "student",
    "visitor",
    "researcher",
  ],
},

{
  name: "Book Request",
  path: "/requests",
  roles: [
    "student",
  ],
},
    {
      name: "Manage Requests",
      path: "/requests/manage",
      roles: [
        "superadmin",
        "admin",
      ],
    },

    {
      name: "Issue Books",
      path: "/issues",
      roles: [
        "librarian",
      ],
    },

    {
      name: "My Issued Books",
      path: "/my-issued-books",
      roles: [
        "student",
     
      ],
    },

    {
      name: "Return Books",
      path: "/return-books",
      roles: [
        "librarian",
      ],
    },

    {
      name: "Fines",
      path: "/fines",
      roles: [
        "superadmin",
        "admin",
        "librarian",
        "library",
        "student",
        "accountant",
      ],
    },

    // {
    //   name: "Library Members",
    //   path: "/library-members",
    //   roles: [
    //     "superadmin",
    //     "admin",
    //     "librarian",
    //     "library",
    //   ],
    // },

    {
      name: "Feedback",
      path: "/feedback/give",
      roles: [
        "student",
      ],
    },

    {
      name: "My Feedback",
      path: "/feedback/my-feedback",
      roles: [
        "student",
      ],
    },

    {
      name: "Manage Feedback",
      path: "/feedback/manage",
      roles: [
        "superadmin",
        "admin",
        "librarian",
      ],
    },
    // review
    // ========================================
// REVIEWS
// ========================================

{
  name: "Submit Review",
  path: "/reviews/submit",
  roles: [
    "visitor",
  ],
},

{
  name: "Manage Reviews",
  path: "/reviews",
  roles: [
    "superadmin",
    "admin",
    "librarian",
  ],
},

    // {
    //   name: "Accounts",
    //   path: "/accounts",
    //   roles: [
    //     "superadmin",
    //     "admin",
    //     "accountant",
    //   ],
    // },

    // {
    //   name: "Payments",
    //   path: "/payments",
    //   roles: [
    //     "superadmin",
    //     "admin",
    //     "accountant",
    //   ],
    // },

    // {
    //   name: "Transactions",
    //   path: "/transactions",
    //   roles: [
    //     "superadmin",
    //     "admin",
    //     "accountant",
    //   ],
    // },

    {
      name: "Reports",
      path: "/reports",
      roles: [
        "superadmin",
        "admin",
        "hod",
        "librarian",
        "library",
        "accountant",
        "digital",
      ],
    },

  
    {
      name: "Notifications",
      path: "/notifications",
      roles: [
        "superadmin",
        "admin",
        "accountant",
        "digital",
        "hod",
        "librarian",
        "library",
        "teacher",
        "staff",
        "student",
        "researcher"
      ],
    },

  

  {
  name: "Settings",
  path: "/settings",
  roles: [
    "superadmin",
    "admin",
  ],
},
   

    // {
    //   name: "About Library",
    //   path: "/about-library",
    //   roles: [
    //     "visitor",
    //   ],
    // },

    // {
    //   name: "Contact",
    //   path: "/contact",
    //   roles: [
    //     "visitor",
    //   ],
    // },
  ];

  // =====================================================
  // FILTER MENUS BY ROLE
  // =====================================================

  const visibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  // =====================================================
  // DASHBOARD PATH
  // =====================================================

  const dashboardPath = user?.role
    ? `/dashboard/${normalizeRole(user.role)}`
    : "/login";

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      await logout();

      setSidebarOpen?.(false);

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  };

  // =====================================================
  // NAVIGATION LINK CLASS
  // =====================================================

  const navLinkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      isActive
        ? "  bg-white shadow-lg border border-white/20"
        : "text-white/80 hover:bg-white hover:text-[#890C25] hover:shadow-md"
    }`;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`fixed top-16 left-0 z-50 w-64 h-[calc(100vh-4rem)]
        bg-white/10 backdrop-blur-xl border-r border-white/20
        lg:bg-[#890C25]
        transform transition-transform duration-300 ease-in-out
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
        lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">

          {/* User Info */}

          <div className="p-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.charAt(0)?.toUpperCase() ||
                    "U"}
                </div>

                <div className="min-w-0">

                  <h3 className="text-white font-semibold truncate">
                    {user?.name || "User"}
                  </h3>

                  <p className="text-white/60 text-xs capitalize truncate">
                    {userRole || "User"}
                  </p>

                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}

          <nav className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin scrollbar-thumb-white/20">

            {/* Dashboard */}

            <NavLink
              to={dashboardPath}
              className={navLinkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-lg">
                ▣
              </span>

              <span className="font-medium">
                Dashboard
              </span>
            </NavLink>

            {/* Menu Items */}

            <div className="mt-2 space-y-1">

              {visibleMenuItems.map((item) => (
                <NavLink
                  key={`${item.name}-${item.path}`}
                  to={item.path}
                  className={navLinkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                    ◆
                  </span>

                  <span className="font-medium">
                    {item.name}
                  </span>
                </NavLink>
              ))}

            </div>
          </nav>

          {/* Logout */}

          <div className="p-4 border-t border-white/10">

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2
              bg-[#2563EB] hover:bg-blue-700
              text-white font-semibold
              px-4 py-3 rounded-xl
              shadow-lg hover:shadow-blue-500/30
              transition-all duration-300"
            >
              <span>↪</span>

              <span>
                Logout
              </span>
            </button>

          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;