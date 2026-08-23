import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  // =====================================
  // States
  // =====================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================
  // Auth
  // =====================================

  const { login, loading } = useAuth();

  const navigate = useNavigate();

  // =====================================
  // Submit Login
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      // =================================
      // Login
      // =================================

      const response = await login(
        email,
        password
      );

      console.log(
        "LOGIN SUCCESS:",
        response
      );

      // =================================
      // Get User
      // =================================

      const loggedInUser = response?.user;

      if (!loggedInUser) {
        setError(
          "Login successful, but user information was not received."
        );

        return;
      }

      // =================================
      // Get Role
      // =================================

      const role = loggedInUser.role;

      console.log(
        "USER ROLE:",
        role
      );

      // =================================
      // Role Missing
      // =================================

      if (!role) {
        setError(
          "User role was not found."
        );

        return;
      }

      // =================================
      // Success
      // =================================

      setSuccess(
        "Login successful! Redirecting..."
      );

      // =================================
      // Dashboard Redirect
      // =================================

      navigate(
        `/dashboard/${role}`,
        {
          replace: true,
        }
      );

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-950 via-green-900 to-green-800 flex items-center justify-center px-4 py-8">

      {/* =================================
          Main Container
      ================================= */}

      <div className="w-full max-w-md">

        {/* =================================
            Login Card
        ================================= */}

        <div className="rounded-2xl border border-green-300/20 bg-white/10 backdrop-blur-xl shadow-2xl p-6 sm:p-8">

          {/* =================================
              Heading
          ================================= */}

          <div className="text-center mb-7">

            <h1 className="text-3xl sm:text-4xl font-bold text-green-300">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm sm:text-base text-green-100">
              Login to your LMS account
            </p>

          </div>

          {/* =================================
              Error
          ================================= */}

          {error && (
            <div className="mb-5 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* =================================
              Success
          ================================= */}

          {success && (
            <div className="mb-5 rounded-lg border border-green-300/40 bg-green-400/10 px-4 py-3 text-sm text-green-200">
              {success}
            </div>
          )}

          {/* =================================
              Login Form
          ================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* =================================
                Email
            ================================= */}

            <div>

              <label
                htmlFor="email"
                className="block mb-2 text-sm font-semibold text-green-100"
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
                required
                autoComplete="email"
                className="w-full rounded-lg border border-green-300/30 bg-white/10 px-4 py-3 text-white placeholder-green-100/50 outline-none transition duration-200 focus:border-green-300 focus:ring-2 focus:ring-green-300/20"
              />

            </div>

            {/* =================================
                Password
            ================================= */}

            <div>

              <label
                htmlFor="password"
                className="block mb-2 text-sm font-semibold text-green-100"
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
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-green-300/30 bg-white/10 px-4 py-3 text-white placeholder-green-100/50 outline-none transition duration-200 focus:border-green-300 focus:ring-2 focus:ring-green-300/20"
              />

            </div>

            {/* =================================
                Login Button
            ================================= */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-semibold py-3 px-4 shadow-lg shadow-green-950/30 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >

              {loading
                ? "Logging in..."
                : "Login"}

            </button>

          </form>

          {/* =================================
              Register Link
          ================================= */}

          <p className="mt-6 text-center text-sm text-green-100">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-semibold text-green-300 hover:text-green-200 transition"
            >
              Register
            </Link>

          </p>

          {/* =================================
              Back to Welcome
          ================================= */}

          <div className="mt-4 text-center">

            <Link
              to="/"
              className="text-sm text-green-200/70 hover:text-green-200 transition"
            >
              ← Back to Welcome
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;