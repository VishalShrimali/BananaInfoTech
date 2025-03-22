import { useState, useEffect } from "react"; // Added useEffect
import { Routes, Route, Navigate } from "react-router-dom"; // Added Navigate
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetails";
import Testimonials from "./components/Testimonial";
import About from "./components/About";
import ContactUs from "./components/ContactUs";
import AuthErrorPage from "./pages/AuthErrorPage";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Set to true if token exists
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/auth-error" />;
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
        isAuthenticated={isAuthenticated} // Pass auth state to Navbar
        setIsAuthenticated={setIsAuthenticated} // Allow Navbar to update auth
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Hero isDarkMode={isDarkMode} />} />
          <Route path="/about" element={<About isDarkMode={isDarkMode} />} />
          <Route path="/contact" element={<ContactUs isDarkMode={isDarkMode} />} />
          <Route
            path="/login"
            element={<Login isDarkMode={isDarkMode} setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/register" element={<Register isDarkMode={isDarkMode} />} />
          
          {/* Protected Routes */}
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
            path="/testimonials"
            element={<Testimonials isDarkMode={isDarkMode} />}
          />
          <Route
            path="/auth-error"
            element={<AuthErrorPage isDarkMode={isDarkMode} />}
          />
          
          {/* 404 - Page Not Found */}
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

export default App;