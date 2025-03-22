import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import { motion } from "framer-motion"; // Added for animations

const CourseDetail = ({ isDarkMode }) => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For navigation on error or back button

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required. Please log in.");
        }

        const response = await fetch(
          `http://localhost:3000/api/v1/bananasit/courses/view/${courseId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();
        setCourse(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Placeholder course structure
  const placeholderCourse = {
    id: courseId,
    title: "Sample Course",
    description: "Learn the fundamentals of this amazing subject with expert guidance.",
    instructor: "John Doe",
    duration: "6 weeks",
    level: "Intermediate",
    price: 99.99,
    syllabus: ["Introduction", "Core Concepts", "Advanced Topics", "Project"],
    image: "https://via.placeholder.com/600x400",
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-950" : "bg-white"
        }`}
      >
        <p
          className={`text-lg ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          } animate-pulse`}
        >
          Loading course details...
        </p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`min-h-screen flex flex-col items-center justify-center ${
          isDarkMode ? "bg-gray-950" : "bg-white"
        }`}
      >
        <p className="text-red-500 text-lg mb-4">Error: {error}</p>
        <button
          onClick={() => navigate("/login")}
          className={`px-6 py-3 ${
            isDarkMode ? "bg-teal-600 hover:bg-teal-700" : "bg-teal-500 hover:bg-teal-600"
          } text-white rounded-lg font-semibold transition-all duration-300`}
        >
          Go to Login
        </button>
      </motion.div>
    );
  }

  const courseData = course || placeholderCourse;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-950" : "bg-white"
      } transition-colors duration-300`}
    >
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12 flex justify-between items-center"
          >
            <div>
              <h1
                className={`text-4xl md:text-5xl font-bold ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {courseData.title}
              </h1>
              <p
                className={`mt-2 text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Taught by{" "}
                <span className={`${isDarkMode ? "text-teal-300" : "text-teal-600"}`}>
                  {courseData.instructor}
                </span>
              </p>
            </div>
            <button
              onClick={() => navigate("/courses")}
              className={`px-4 py-2 ${
                isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
              } rounded-lg`}
            >
              Back to Courses
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-1"
            >
              <img
                src={courseData.image}
                alt={courseData.title}
                className="w-full rounded-lg shadow-md object-cover h-64 md:h-96"
              />
              <div
                className={`mt-6 p-6 rounded-lg shadow-md ${
                  isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div className="space-y-4">
                  <div>
                    <span
                      className={`block text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Duration
                    </span>
                    <span
                      className={`${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      } font-semibold`}
                    >
                      {courseData.duration}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`block text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Level
                    </span>
                    <span
                      className={`${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      } font-semibold`}
                    >
                      {courseData.level}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`block text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Price
                    </span>
                    <span
                      className={`${
                        isDarkMode ? "text-teal-300" : "text-teal-600"
                      } font-semibold text-xl`}
                    >
                      ${courseData.price}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full mt-4 ${
                      isDarkMode
                        ? "bg-teal-600 hover:bg-teal-700"
                        : "bg-teal-500 hover:bg-teal-600"
                    } text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md`}
                  >
                    Enroll Now
                  </motion.button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2"
            >
              <div
                className={`p-6 rounded-lg ${
                  isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"
                }`}
              >
                <h2
                  className={`text-2xl font-semibold mb-4 ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  About This Course
                </h2>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } leading-relaxed`}
                >
                  {courseData.description}
                </p>
              </div>

              <div
                className={`mt-6 p-6 rounded-lg ${
                  isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"
                }`}
              >
                <h2
                  className={`text-2xl font-semibold mb-4 ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Syllabus
                </h2>
                <ul className="space-y-3">
                  {courseData.syllabus.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mr-3 ${
                          isDarkMode ? "bg-teal-300" : "bg-teal-600"
                        }`}
                      />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default CourseDetail;