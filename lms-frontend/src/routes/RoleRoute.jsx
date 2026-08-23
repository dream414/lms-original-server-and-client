import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles = [] }) => {

  const { user, loading } = useAuth();

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-black flex items-center justify-center">

        <p className="text-green-400 text-lg">
          Loading...
        </p>

      </div>
    );
  }


  // Login نہیں کیا
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // Role Check
  if (!allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to="/access-denied"
        replace
      />
    );
  }


  // Allowed
  return <Outlet />;
};

export default RoleRoute;