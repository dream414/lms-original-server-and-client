import { useAuth } from "../../context/AuthContext";

const HODDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-black p-6">
      <h1 className="text-3xl font-bold text-white">
        HOD Dashboard
      </h1>

      <p className="mt-2 text-green-300">
        Welcome, {user?.name}
      </p>

      <p className="mt-1 text-gray-400">
        Role: {user?.role}
      </p>
    </div>
  );
};

export default HODDashboard;