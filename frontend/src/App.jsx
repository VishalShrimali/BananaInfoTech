import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // We'll add this to all pages
import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses"; // Assuming this lists all courses
import CourseDetail from "./pages/CourseDetails"; // New page
import Testimonials from "./components/Testimonial";
import About from "./components/About";
import ContactUs from "./components/ContactUs";


const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <Router>
      <div
        className={`flex flex-col min-h-screen ${
          isDarkMode ? "bg-gray-950 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Hero isDarkMode={isDarkMode} />} />
            <Route path="/about" element={<About isDarkMode={isDarkMode} />} />
            <Route
              path="/contact"
              element={<ContactUs isDarkMode={isDarkMode} />}
            />
            <Route path="/login" element={<Login isDarkMode={isDarkMode} />} />
            <Route
              path="/register"
              element={<Register isDarkMode={isDarkMode} />}
            />
            <Route
              path="/courses"
              element={<Courses isDarkMode={isDarkMode} />}
            />
            <Route
              path="/courses/:courseId"
              element={<CourseDetail isDarkMode={isDarkMode} />}
            />
            <Route
              path="/testimonials"
              element={<Testimonials isDarkMode={isDarkMode} />}
            />
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
    </Router>
  );
};

export default App;