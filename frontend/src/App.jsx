import { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate, BrowserRouter as Router } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetails";
import Payment from "./pages/Payment"; // Add this import
import Testimonials from "./components/Testimonial";
import About from "./components/About";
import ContactUs from "./components/ContactUs";
import AuthErrorPage from "./pages/AuthErrorPage";
import AdminDashboard from "./components/AdminDashboard";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { token, logout } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/auth-error" />;
  };

  const ProtectedAdminRoute = ({ children }) => {
    if (!token) return <Navigate to="/auth-error" />;
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.role === "admin" ? children : <Navigate to="/auth-error" />;
  };

  return (
    <div
      className={`flex flex-col min-h-screen ${
        isDarkMode ? "bg-gray-950 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <Navbar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isAuthenticated={!!token}
        setIsAuthenticated={logout}
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Hero isDarkMode={isDarkMode} />} />
          <Route path="/about" element={<About isDarkMode={isDarkMode} />} />
          <Route path="/contact" element={<ContactUs isDarkMode={isDarkMode} />} />
          <Route path="/login" element={<Login isDarkMode={isDarkMode} />} />
          <Route path="/register" element={<Register isDarkMode={isDarkMode} />} />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses isDarkMode={isDarkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId"
            element={
              <ProtectedRoute>
                <CourseDetail isDarkMode={isDarkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:courseId"
            element={
              <ProtectedRoute>
                <Payment isDarkMode={isDarkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard isDarkMode={isDarkMode} />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/testimonials" element={<Testimonials isDarkMode={isDarkMode} />} />
          <Route path="/auth-error" element={<AuthErrorPage isDarkMode={isDarkMode} />} />
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

const RootApp = () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default RootApp;