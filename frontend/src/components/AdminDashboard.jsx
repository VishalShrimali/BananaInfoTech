import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminDashboard = ({ isDarkMode }) => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "",
    instructor: "",
    level: "Beginner",
    duration: "",
    image: "",
    lessons: [{ title: "", videoUrl: "", duration: "" }],
  });
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/bananasit/admin/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error((await response.json()).message || "Failed to fetch courses");
        const data = await response.json();
        setCourses(data.courses);
      } catch (err) {
        if (err.message.includes("Access denied")) {
          logout();
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchCourses();
    else navigate("/login");
  }, [token, navigate, logout]);

  const handleInputChange = (e, field, lessonIndex = null) => {
    if (lessonIndex !== null) {
      const updatedLessons = [...newCourse.lessons];
      updatedLessons[lessonIndex][field] = e.target.value;
      setNewCourse({ ...newCourse, lessons: updatedLessons });
    } else {
      setNewCourse({ ...newCourse, [field]: e.target.value });
    }
  };

  const addLesson = () => {
    setNewCourse({
      ...newCourse,
      lessons: [...newCourse.lessons, { title: "", videoUrl: "", duration: "" }],
    });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:3000/api/v1/bananasit/admin/courses/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCourse),
      });
      if (!response.ok) throw new Error((await response.json()).message || "Failed to add course");
      const data = await response.json();
      setCourses([...courses, data.course]);
      setNewCourse({
        title: "",
        description: "",
        price: "",
        instructor: "",
        level: "Beginner",
        duration: "",
        image: "",
        lessons: [{ title: "", videoUrl: "", duration: "" }],
      });
      setIsAddFormOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditing = (course) => {
    setEditingCourse({
      ...course,
      lessons: course.syllabus.map((title) => ({ title, videoUrl: "", duration: "" })),
    });
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/bananasit/admin/courses/update/${editingCourse.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editingCourse),
        }
      );
      if (!response.ok) throw new Error((await response.json()).message || "Failed to update course");
      const data = await response.json();
      setCourses(courses.map((c) => (c.id === data.course.id ? data.course : c)));
      setEditingCourse(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    setError("");
    try {
      const response = await fetch(`http://localhost:3000/api/v1/bananasit/admin/courses/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error((await response.json()).message || "Failed to delete course");
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"} animate-pulse`}>
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <button
            onClick={logout}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isDarkMode
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 text-red-500 rounded-lg text-center">{error}</div>
        )}

        {/* Toggle Add Course Button */}
        <div className="mb-8">
          <button
            onClick={() => setIsAddFormOpen(!isAddFormOpen)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
              isDarkMode
                ? "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/20"
                : "bg-teal-500 hover:bg-teal-600 text-white shadow-teal-400/20"
            }`}
          >
            {isAddFormOpen ? "Close Form" : "Add New Course"}
          </button>
        </div>

        {/* Add Course Form */}
        {isAddFormOpen && (
          <div
            className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${
              isDarkMode ? "bg-gray-800" : "bg-gray-50"
            } mb-8`}
          >
            <h2 className="text-2xl font-semibold mb-6">Add New Course</h2>
            <form onSubmit={handleAddCourse}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Title"
                  value={newCourse.title}
                  onChange={(e) => handleInputChange(e, "title")}
                  className={`p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  required
                />
                <input
                  type="text"
                  placeholder="Instructor"
                  value={newCourse.instructor}
                  onChange={(e) => handleInputChange(e, "instructor")}
                  className={`p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newCourse.description}
                  onChange={(e) => handleInputChange(e, "description")}
                  className={`p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 col-span-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  rows="3"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newCourse.price}
                  onChange={(e) => handleInputChange(e, "price")}
                  className={`p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  required
                />
                <select
                  value={newCourse.level}
                  onChange={(e) => handleInputChange(e, "level")}
                  className={`p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <input
                  type="text"
                  placeholder="Duration (e.g., 6 weeks)"
                  value={newCourse.duration}
                  onChange={(e) => handleInputChange(e, "duration")}
                  className={`p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newCourse.image}
                  onChange={(e) => handleInputChange(e, "image")}
                  className={`p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Lessons</h3>
                {newCourse.lessons.map((lesson, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <input
                      type="text"
                      placeholder="Lesson Title"
                      value={lesson.title}
                      onChange={(e) => handleInputChange(e, "title", index)}
                      className={`p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Video URL"
                      value={lesson.videoUrl}
                      onChange={(e) => handleInputChange(e, "videoUrl", index)}
                      className={`p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Duration (minutes)"
                      value={lesson.duration}
                      onChange={(e) => handleInputChange(e, "duration", index)}
                      className={`p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      required
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLesson}
                  className={`mt-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isDarkMode
                      ? "bg-teal-600 hover:bg-teal-700 text-white"
                      : "bg-teal-500 hover:bg-teal-600 text-white"
                  }`}
                >
                  Add Lesson
                </button>
              </div>
              <button
                type="submit"
                className={`mt-6 w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode
                    ? "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/20"
                    : "bg-teal-500 hover:bg-teal-600 text-white shadow-teal-400/20"
                }`}
              >
                Add Course
              </button>
            </form>
          </div>
        )}

        {/* Course List */}
        <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h2 className="text-2xl font-semibold mb-6">Manage Courses</h2>
          {courses.length === 0 ? (
            <p className="text-center text-gray-500">No courses available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`p-5 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200 border border-gray-600"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <div className="flex flex-col h-full">
                    {course.image && (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-40 object-cover rounded-t-xl mb-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold mb-2 truncate">{course.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">{course.description}</p>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Instructor:</span> {course.instructor}
                      </p>
                      <p>
                        <span className="font-medium">Level:</span> {course.level}
                      </p>
                      <p>
                        <span className="font-medium">Duration:</span> {course.duration}
                      </p>
                      <p>
                        <span className="font-medium">Price:</span> ₹{course.price}
                      </p>
                      <p className="font-semibold">
                        <span className="font-medium">Enrolled:</span>{" "}
                        {course.enrolledCount || 0} students
                      </p>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => startEditing(course)}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          isDarkMode
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          isDarkMode
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Course Modal */}
        {editingCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div
              className={`p-6 rounded-xl shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto ${
                isDarkMode ? "bg-gray-800 text-gray-200" : "bg-gray-50 text-gray-800"
              }`}
            >
              <h2 className="text-2xl font-semibold mb-6">Edit Course</h2>
              <form onSubmit={handleUpdateCourse}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={editingCourse.title}
                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={editingCourse.description}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, description: e.target.value })
                    }
                    className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    rows="3"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={editingCourse.price}
                    onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value })}
                    className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Instructor"
                    value={editingCourse.instructor}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, instructor: e.target.value })
                    }
                    className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    required
                  />
                  <select
                    value={editingCourse.level}
                    onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                    className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Duration"
                    value={editingCourse.duration}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, duration: e.target.value })
                    }
                    className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={editingCourse.image}
                    onChange={(e) => setEditingCourse({ ...editingCourse, image: e.target.value })}
                    className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  />
                  {editingCourse.lessons.map((lesson, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Lesson Title"
                        value={lesson.title}
                        onChange={(e) => {
                          const updatedLessons = [...editingCourse.lessons];
                          updatedLessons[index].title = e.target.value;
                          setEditingCourse({ ...editingCourse, lessons: updatedLessons });
                        }}
                        className={`p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-gray-200"
                            : "bg-white border-gray-300 text-gray-800"
                        }`}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Video URL"
                        value={lesson.videoUrl}
                        onChange={(e) => {
                          const updatedLessons = [...editingCourse.lessons];
                          updatedLessons[index].videoUrl = e.target.value;
                          setEditingCourse({ ...editingCourse, lessons: updatedLessons });
                        }}
                        className={`p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-gray-200"
                            : "bg-white border-gray-300 text-gray-800"
                        }`}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Duration"
                        value={lesson.duration}
                        onChange={(e) => {
                          const updatedLessons = [...editingCourse.lessons];
                          updatedLessons[index].duration = e.target.value;
                          setEditingCourse({ ...editingCourse, lessons: updatedLessons });
                        }}
                        className={`p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-gray-200"
                            : "bg-white border-gray-300 text-gray-800"
                        }`}
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex space-x-4">
                  <button
                    type="submit"
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isDarkMode
                        ? "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/20"
                        : "bg-teal-500 hover:bg-teal-600 text-white shadow-teal-400/20"
                    }`}
                  >
                    Update Course
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCourse(null)}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-600 hover:bg-gray-700 text-gray-200"
                        : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;