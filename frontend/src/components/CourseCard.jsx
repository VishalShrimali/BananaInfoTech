// src/components/CourseCard.jsx
import { Link } from "react-router-dom";

const CourseCard = ({ course, isDarkMode }) => {
  return (
    <div
      className={`shadow-lg rounded-2xl p-4 transition-all duration-300 transform hover:scale-105 ${
        isDarkMode
          ? "bg-gray-900 border border-gray-800"
          : "bg-white border border-gray-200"
      }`}
    >
      <img
        src={course.imageUrl || "/default-course-image.jpg"}
        alt={course.title}
        className="w-full h-40 object-cover rounded-lg"
      />
      <h3
        className={`text-lg font-semibold mt-3 ${
          isDarkMode ? "text-gray-100" : "text-gray-800"
        }`}
      >
        {course.title}
      </h3>
      <p
        className={`text-sm mt-1 ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {course.instructor || "Instructor not specified"}
      </p>
      <div className="flex justify-between items-center mt-3">
        <span
          className={`font-bold text-lg ${
            isDarkMode ? "text-teal-300" : "text-teal-600"
          }`}
        >
          {course.price ? `$${course.price}` : "Free"}
        </span>
        <Link
          to={`/courses/${course._id}`}
          className={`${
            isDarkMode
              ? "bg-teal-600 hover:bg-teal-700"
              : "bg-teal-500 hover:bg-teal-600"
          } text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300`}
        >
          View Course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;