import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { motion } from "framer-motion";

const Courses = ({ isDarkMode }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You need to log in to view courses.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/v1/bananasit/users/courses", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();
        console.log("Fetched courses:", data); // Debug log
        setCourses(data);
      } catch (error) {
        console.error("Fetch error:", error.message); // Debug log
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 ${isDarkMode ? "bg-gray-950" : "bg-white"}`}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
          className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          Loading courses...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 ${isDarkMode ? "bg-gray-950" : "bg-white"}`}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`text-xl mb-4 text-center max-w-3xl font-sans ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          {error}
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold text-lg transition-all duration-300 shadow-md font-sans`}
          onClick={() => navigate("/login")}
        >
          Log In to Start Learning
        </motion.button>
      </div>
    );
  }

  return (
    <section className={`py-16 ${isDarkMode ? "bg-gray-950 text-gray-100" : "bg-white text-gray-900"} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`text-4xl md:text-5xl font-bold text-center mb-12`}
        >
          Explore Our <span className={`${isDarkMode ? "text-teal-300" : "text-teal-600"}`}>Courses</span>
        </motion.h1>

        {courses.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {courses.slice(0, 4).map((course, index) => (
              <motion.div
                key={course._id || course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CourseCard course={course} isDarkMode={isDarkMode} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-xl text-gray-400">No courses available right now. Check back later! 😊</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
              onClick={() => navigate("/")}
            >
              Go Back Home
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Courses;