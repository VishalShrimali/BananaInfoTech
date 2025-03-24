import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";

const Register = ({ isDarkMode }) => {
  const { login } = useContext(AuthContext); // Use AuthContext for auto-login
  const [name, setName] = useState(""); // Added name field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Toggle for admin (testing only)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isAdmin
        ? "http://localhost:3000/api/v1/bananasit/admin/register"
        : "http://localhost:3000/api/v1/bananasit/users/signup";
      const response = await axios.post(endpoint, {
        name, // Include name in payload
        email,
        password,
      });

      // Auto-login after successful registration
      await login(email, password);
      navigate(isAdmin ? "/admin" : "/"); // Redirect based on isAdmin
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during registration."
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
            Join{" "}
            <span className={`${isDarkMode ? "text-teal-300" : "text-teal-600"}`}>
              BananaSIT
            </span>
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-500 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-teal-500"
                    : "bg-white border-gray-300 text-gray-800 focus:ring-teal-400"
                } focus:outline-none focus:ring-2 transition-all duration-300`}
                placeholder="Enter your name"
                required
                disabled={loading}
              />
            </div>

            {/* Email Field */}
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
                disabled={loading}
              />
            </div>

            {/* Password Field */}
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
                placeholder="Create a password"
                required
                disabled={loading}
              />
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-teal-500"
                    : "bg-white border-gray-300 text-gray-800 focus:ring-teal-400"
                } focus:outline-none focus:ring-2 transition-all duration-300`}
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </div>

            {/* Admin Toggle (Temporary for Testing) */}
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="mr-2"
                disabled={loading}
              />
              <label
                htmlFor="isAdmin"
                className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Register as Admin (Testing Only)
              </label>
            </div>

            {/* Submit Button */}
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
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Login Link */}
          <p
            className={`text-center mt-6 text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className={`${
                isDarkMode
                  ? "text-teal-300 hover:text-teal-200"
                  : "text-teal-600 hover:text-teal-500"
              } font-semibold transition-colors duration-300`}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;