// src/components/CourseCard.jsx
import { Link } from "react-router-dom";

const CourseCard = ({ course, isDarkMode }) => {
  // Determine the image source, handling both 'img' and 'image' fields
  const imageSrc = course.img || course.image || "/hello-course-image.jpg";
  
  // Debug log to check the image source
  console.log(`CourseCard image for ${course.title}:`, imageSrc);

  return (
    <div
      className={`p-4 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 ${
        isDarkMode
          ? "bg-gray-900 border border-gray-800 text-gray-100"
          : "bg-white border border-gray-200 text-gray-800"
      }`}
    >
      <img
        src={imageSrc}
        alt={course.title || "Course Image"}
        className="w-full h-40 object-cover rounded-lg"
        onError={(e) => {
          console.error(`Failed to load image for ${course.title}: ${imageSrc}`);
          e.target.src = "/hello-course-image.jpg"; // Fallback on error
        }}
      />
      <h3 className={`mt-3 text-lg font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
        {course.title}
      </h3>
      <p className={`mt-1 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
        {course.instructor || "Instructor not specified"}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <span className={`text-lg font-bold ${isDarkMode ? "text-teal-300" : "text-teal-600"}`}>
          {course.price ? `₹${course.price}` : "Free"}
        </span>
        <Link
          to={`/courses/${course._id}`}
          className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-300 ${
            isDarkMode ? "bg-teal-600 hover:bg-teal-700" : "bg-teal-500 hover:bg-teal-600"
          }`}
        >
          View Course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;