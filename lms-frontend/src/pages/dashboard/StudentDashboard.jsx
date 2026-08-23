import { useAuth } from "../../context/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="rounded-2xl bg-white/10 border border-white/20 p-6">

      <h1 className="text-3xl font-bold text-green-300">
        Student Dashboard
      </h1>

      <p className="mt-3 text-white">
        Welcome, {user?.name}
      </p>

      <p className="mt-2 text-green-200">
        Role: {user?.role}
      </p>

    </div>
  );
};

export default StudentDashboard;