import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  // =====================================
  // States
  // =====================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================
  // Auth
  // =====================================

  const { register, loading } = useAuth();

  const navigate = useNavigate();

  // =====================================
  // Register Submit
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // =====================================
    // Password Check
    // =====================================

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await register(
        name,
        email,
        password
      );

      console.log("REGISTER SUCCESS:", response);

      setSuccess("Registration successful!");

      // =====================================
      // New User = Student
      // =====================================

      setTimeout(() => {
        navigate("/dashboard/student", {
          replace: true,
        });
      }, 500);

    } catch (error) {
      console.log(
        "REGISTER ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  // =====================================
  // JSX
  // =====================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-700 flex items-center justify-center px-4 py-8">

      {/* =====================================
          Main Container
      ===================================== */}

      <div className="w-full max-w-md">

        {/* =====================================
            Transparent Glass Form
        ===================================== */}

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8">

          {/* =====================================
              Heading
          ===================================== */}

          <div className="text-center mb-7">

            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Create Account
            </h1>

            <p className="text-green-100 mt-2 text-sm sm:text-base">
              Register for your LMS account
            </p>

          </div>

          {/* =====================================
              Error Message
          ===================================== */}

          {error && (
            <div className="mb-4 rounded-lg bg-red-100/95 border border-red-300 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* =====================================
              Success Message
          ===================================== */}

          {success && (
            <div className="mb-4 rounded-lg bg-green-100/95 border border-green-300 text-green-800 px-4 py-3 text-sm">
              {success}
            </div>
          )}

          {/* =====================================
              Register Form
          ===================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* =====================================
                Name
            ===================================== */}

            <div>

              <label
                htmlFor="name"
                className="block text-sm font-semibold text-white mb-2"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your name"
                autoComplete="name"
                required
                className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/95 text-gray-800 placeholder-gray-400 outline-none focus:border-green-300 focus:ring-2 focus:ring-green-300 transition duration-200"
              />

            </div>

            {/* =====================================
                Email
            ===================================== */}

            <div>

              <label
                htmlFor="email"
                className="block text-sm font-semibold text-white mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/95 text-gray-800 placeholder-gray-400 outline-none focus:border-green-300 focus:ring-2 focus:ring-green-300 transition duration-200"
              />

            </div>

            {/* =====================================
                Password
            ===================================== */}

            <div>

              <label
                htmlFor="password"
                className="block text-sm font-semibold text-white mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/95 text-gray-800 placeholder-gray-400 outline-none focus:border-green-300 focus:ring-2 focus:ring-green-300 transition duration-200"
              />

            </div>

            {/* =====================================
                Confirm Password
            ===================================== */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-white mb-2"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/95 text-gray-800 placeholder-gray-400 outline-none focus:border-green-300 focus:ring-2 focus:ring-green-300 transition duration-200"
              />

            </div>

            {/* =====================================
                Register Button
            ===================================== */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating Account..."
                : "Register"}
            </button>

          </form>

          {/* =====================================
              Login Link
          ===================================== */}

          <div className="text-center mt-6">

            <p className="text-green-100 text-sm">

              Already have an account?{" "}

              <Link
                to="/login"
                className="text-white font-semibold hover:text-green-300 transition"
              >
                Login
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;