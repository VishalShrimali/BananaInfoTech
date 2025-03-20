// src/pages/Courses.jsx
import { useState, useEffect } from "react";
import CourseCard from "../components/CourseCard";

const Courses = ({ isDarkMode }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await fetch("http://localhost:3000/api/v1/bananasit/users/courses", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setCourses(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Placeholder data for testing
  const placeholderCourses = [
    {
      _id: "1",
      title: "Web Development Fundamentals",
      instructor: "Jane Smith",
      price: 49.99,
      imageUrl: "https://via.placeholder.com/300x200",
    },
    {
      _id: "2",
      title: "Advanced React",
      instructor: "John Doe",
      price: 79.99,
      imageUrl: "https://via.placeholder.com/300x200",
    },
    {
      _id: "3",
      title: "Python for Data Science",
      price: 59.99,
      imageUrl: "https://via.placeholder.com/300x200",
    },
    {
      _id: "4",
      title: "UI/UX Design Basics",
      instructor: "Emily Brown",
      price: 39.99,
      imageUrl: "https://via.placeholder.com/300x200",
    },
  ];

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDarkMode ? "bg-gray-950" : "bg-white"
        }`}
      >
        <p
          className={`text-lg ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          } animate-pulse`}
        >
          Loading courses...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDarkMode ? "bg-gray-950" : "bg-white"
        }`}
      >
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  const displayCourses = courses.length > 0 ? courses : placeholderCourses;

  return (
    <section
      className={`py-16 ${
        isDarkMode ? "bg-gray-950" : "bg-white"
      } transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <h1
          className={`text-4xl md:text-5xl font-bold text-center mb-12 ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Explore Our{" "}
          <span className={`${isDarkMode ? "text-teal-300" : "text-teal-600"}`}>
            Courses
          </span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displayCourses.length > 0 ? (
            displayCourses.slice(0, 4).map((course) => (
              <CourseCard
                key={course._id || course.id} // Handle both _id and id
                course={course}
                isDarkMode={isDarkMode}
              />
            ))
          ) : (
            <p
              className={`text-center col-span-full ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No courses available
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Courses;