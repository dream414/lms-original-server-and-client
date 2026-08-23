import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  console.log("PROTECTED ROUTE USER:", user);
  console.log("PROTECTED ROUTE LOADING:", loading);

  // =====================================
  // Login/Request Loading
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <div className="text-center">

          <div className="w-12 h-12 border-4 border-green-300 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-green-300">
            Loading...
          </p>

        </div>
      </div>
    );
  }

  // =====================================
  // User Not Logged In
  // =====================================

  if (!user) {
    console.log("NO USER → LOGIN");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =====================================
  // Role Check
  // =====================================

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    console.log(
      "ROLE NOT ALLOWED:",
      user.role
    );

    return (
      <Navigate
        to={`/dashboard/${user.role}`}
        replace
      />
    );
  }

  // =====================================
  // Authorized
  // =====================================

  console.log(
    "AUTHORIZED USER:",
    user
  );

  return <Outlet />;
};

export default ProtectedRoute;