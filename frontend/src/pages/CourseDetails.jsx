import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CourseDetail = ({ isDarkMode }) => {
  const { courseId } = useParams(); // Get course ID from URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");  // Debugging
        console.log("Token in localStorage:", token);
  
        const response = await fetch(
          `http://localhost:3000/api/v1/bananasit/courses/view/${courseId}`, 
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        console.log("Response Status:", response.status); // Debugging
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
  
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error("Fetch Course Error:", error); // Debugging
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourse();
  }, [courseId]);
  
  // Placeholder course structure if API isn't set up yet
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
      <div
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
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-950" : "bg-white"
        }`}
      >
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  const courseData = course || placeholderCourse;

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-950" : "bg-white"
      } transition-colors duration-300`}
    >
      {/* Course Detail Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
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
              <span
                className={`${isDarkMode ? "text-teal-300" : "text-teal-600"}`}
              >
                {courseData.instructor}
              </span>
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Image and Key Info */}
            <div className="md:col-span-1">
              <img
                src={courseData.image}
                alt={courseData.title}
                className="w-full rounded-lg shadow-md object-cover h-64 md:h-96"
              />
              <div
                className={`mt-6 p-6 rounded-lg shadow-md ${
                  isDarkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-gray-50 border border-gray-200"
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
                  <button
                    className={`w-full mt-4 ${
                      isDarkMode
                        ? "bg-teal-600 hover:bg-teal-700"
                        : "bg-teal-500 hover:bg-teal-600"
                    } text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md`}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Description and Syllabus */}
            <div className="md:col-span-2">
              {/* Description */}
              <div
                className={`p-6 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-gray-50 border border-gray-200"
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

              {/* Syllabus */}
              <div
                className={`mt-6 p-6 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-gray-50 border border-gray-200"
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
                    <li
                      key={index}
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
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;