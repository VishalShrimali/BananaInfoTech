import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Login = ({ isDarkMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/bananasit/users/login",
        { email, password }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      } transition-colors duration-300`}
    >
      <div className="max-w-md w-full mx-auto px-6 py-12">
        <div
          className={`rounded-lg shadow-lg p-8 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <h2
            className={`text-3xl font-bold text-center mb-6 ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Login to{" "}
            <span
              className={`${isDarkMode ? "text-teal-300" : "text-teal-600"}`}
            >
              BananaSIT
            </span>
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-500 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-teal-500"
                    : "bg-white border-gray-300 text-gray-800 focus:ring-teal-400"
                } focus:outline-none focus:ring-2 transition-all duration-300`}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-teal-500"
                    : "bg-white border-gray-300 text-gray-800 focus:ring-teal-400"
                } focus:outline-none focus:ring-2 transition-all duration-300`}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="text-right mb-6">
              <Link
                to="/forgot-password"
                className={`text-sm ${
                  isDarkMode
                    ? "text-teal-300 hover:text-teal-200"
                    : "text-teal-600 hover:text-teal-500"
                } transition-colors duration-300`}
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                isDarkMode
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "bg-teal-500 hover:bg-teal-600 text-white"
              } px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md ${
                isDarkMode ? "shadow-teal-500/20" : "shadow-teal-400/20"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p
            className={`text-center mt-6 text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Don’t have an account?{" "}
            <Link
              to="/register"
              className={`${
                isDarkMode
                  ? "text-teal-300 hover:text-teal-200"
                  : "text-teal-600 hover:text-teal-500"
              } font-semibold transition-colors duration-300`}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;