
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  // =====================================================
  // DEBUG
  // =====================================================

  console.log("PROTECTED ROUTE USER:", user);
  console.log("PROTECTED ROUTE LOADING:", loading);

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

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <div className="text-center">

          <div
            className="
              mx-auto
              h-12
              w-12
              animate-spin
              rounded-full
              border-4
              border-green-300
              border-t-transparent
            "
          />

          <p className="mt-4 text-green-300">
            Loading...
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!user) {
    console.log("NO USER → LOGIN");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =====================================================
  // CURRENT USER ROLE
  // =====================================================

  const currentRole = normalizeRole(user.role);

  // =====================================================
  // NORMALIZED ALLOWED ROLES
  // =====================================================

  const normalizedAllowedRoles = allowedRoles.map(
    (role) => normalizeRole(role)
  );

  console.log(
    "CURRENT USER ROLE:",
    currentRole
  );

  console.log(
    "ALLOWED ROLES:",
    normalizedAllowedRoles
  );

  // =====================================================
  // ROLE CHECK
  // =====================================================

  if (
    normalizedAllowedRoles.length > 0 &&
    !normalizedAllowedRoles.includes(currentRole)
  ) {
    console.log(
      "ROLE NOT ALLOWED:",
      currentRole
    );

    return (
      <Navigate
        to={`/dashboard/${currentRole}`}
        replace
      />
    );
  }

  // =====================================================
  // AUTHORIZED
  // =====================================================

  console.log(
    "AUTHORIZED USER:",
    user
  );

  return <Outlet />;
};

export default ProtectedRoute;
