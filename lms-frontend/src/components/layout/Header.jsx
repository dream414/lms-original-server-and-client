import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-green-800 bg-green-950/95 backdrop-blur">

      <div className="flex h-full items-center justify-between px-4 sm:px-5 md:px-6">

        {/* Left Side */}
        <div className="flex items-center gap-3">

          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-xl text-gray-300 hover:bg-green-900 hover:text-white md:hidden"
          >
            ☰
          </button>

          {/* Page Title */}
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            LMS
          </h2>

        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* User Info */}
          <div className="hidden text-right sm:block">

            <p className="max-w-[150px] truncate text-sm font-semibold text-white">
              {user?.name}
            </p>

            <p className="text-xs capitalize text-green-400">
              {user?.role}
            </p>

          </div>

          {/* User Circle */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="rounded-lg border border-green-700 px-3 py-2 text-xs font-medium text-gray-200 transition hover:bg-green-800 hover:text-white sm:px-4 sm:text-sm"
          >
            Logout
          </button>

        </div>

      </div>

    </header>
  );
};

export default Header;