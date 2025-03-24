import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminDashboard = ({ isDarkMode }) => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  // Fetch all courses on mount
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
          logout(); // Log out if not admin
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchCourses();
    else navigate("/login");
  }, [token, navigate, logout]);

  // Handle form input changes
  const handleInputChange = (e, field, lessonIndex = null) => {
    if (lessonIndex !== null) {
      const updatedLessons = [...newCourse.lessons];
      updatedLessons[lessonIndex][field] = e.target.value;
      setNewCourse({ ...newCourse, lessons: updatedLessons });
    } else {
      setNewCourse({ ...newCourse, [field]: e.target.value });
    }
  };

  // Add a new lesson field
  const addLesson = () => {
    setNewCourse({
      ...newCourse,
      lessons: [...newCourse.lessons, { title: "", videoUrl: "", duration: "" }],
    });
  };

  // Submit new course
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
    } catch (err) {
      setError(err.message);
    }
  };

  // Start editing a course
  const startEditing = (course) => {
    setEditingCourse({ ...course, lessons: course.syllabus.map(title => ({ title, videoUrl: "", duration: "" })) });
  };

  // Update course
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
      setCourses(courses.map(c => (c.id === data.course.id ? data.course : c)));
      setEditingCourse(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete course
  const handleDeleteCourse = async (id) => {
    setError("");
    try {
      const response = await fetch(`http://localhost:3000/api/v1/bananasit/admin/courses/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error((await response.json()).message || "Failed to delete course");
      setCourses(courses.filter(c => c.id !== id));
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={logout}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"
            } text-white`}
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 text-red-500 rounded-lg text-center">{error}</div>
        )}

        {/* Add Course Form */}
        <div className={`p-6 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"} mb-8`}>
          <h2 className="text-2xl font-semibold mb-4">Add New Course</h2>
          <form onSubmit={handleAddCourse}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={newCourse.title}
                onChange={(e) => handleInputChange(e, "title")}
                className={`p-3 rounded-lg border ${
                  isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                }`}
                required
              />
              <input
                type="text"
                placeholder="Instructor"
                value={newCourse.instructor}
                onChange={(e) => handleInputChange(e, "instructor")}
                className={`p-3 rounded-lg border ${
                  isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                }`}
                required
              />
              <textarea
                placeholder="Description"
                value={newCourse.description}
                onChange={(e) => handleInputChange(e, "description")}
                className={`p-3 rounded-lg border ${
                  isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                } col-span-2`}
                rows="3"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={newCourse.price}
                onChange={(e) => handleInputChange(e, "price")}
                className={`p-3 rounded-lg border ${
                  isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                }`}
                required
              />
              <select
                value={newCourse.level}
                onChange={(e) => handleInputChange(e, "level")}
                className={`p-3 rounded-lg border ${
                  isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
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
                className={`p-3 rounded-lg border ${
                  isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                }`}
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newCourse.image}
                onChange={(e) => handleInputChange(e, "image")}
                className={`p-3 rounded-lg border ${
                  isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                }`}
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Lessons</h3>
              {newCourse.lessons.map((lesson, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                  <input
                    type="text"
                    placeholder="Lesson Title"
                    value={lesson.title}
                    onChange={(e) => handleInputChange(e, "title", index)}
                    className={`p-3 rounded-lg border ${
                      isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                    }`}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Video URL"
                    value={lesson.videoUrl}
                    onChange={(e) => handleInputChange(e, "videoUrl", index)}
                    className={`p-3 rounded-lg border ${
                      isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                    }`}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={lesson.duration}
                    onChange={(e) => handleInputChange(e, "duration", index)}
                    className={`p-3 rounded-lg border ${
                      isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                    }`}
                    required
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addLesson}
                className={`mt-2 px-4 py-2 rounded-lg ${
                  isDarkMode ? "bg-teal-600 hover:bg-teal-700" : "bg-teal-500 hover:bg-teal-600"
                } text-white`}
              >
                Add Lesson
              </button>
            </div>
            <button
              type="submit"
              className={`mt-6 w-full px-6 py-3 rounded-lg ${
                isDarkMode ? "bg-teal-600 hover:bg-teal-700" : "bg-teal-500 hover:bg-teal-600"
              } text-white font-semibold`}
            >
              Add Course
            </button>
          </form>
        </div>

        {/* Course List */}
        <div className={`p-6 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h2 className="text-2xl font-semibold mb-4">Manage Courses</h2>
          {courses.length === 0 ? (
            <p>No courses available.</p>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-white"} shadow-md`}
                >
                  <h3 className="text-xl font-medium">{course.title}</h3>
                  <p className="text-sm">{course.description}</p>
                  <p className="text-sm mt-1">
                    Instructor: {course.instructor} | Level: {course.level} | Duration: {course.duration} | Price: $
                    {course.price}
                  </p>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => startEditing(course)}
                      className={`px-4 py-2 rounded-lg ${
                        isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                      } text-white`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className={`px-4 py-2 rounded-lg ${
                        isDarkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"
                      } text-white`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Course Modal */}
        {editingCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div
              className={`p-6 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"} w-full max-w-lg max-h-[80vh] overflow-y-auto`}
            >
              <h2 className="text-2xl font-semibold mb-4">Edit Course</h2>
              <form onSubmit={handleUpdateCourse}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={editingCourse.title}
                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    className={`w-full p-3 rounded-lg border ${
                      isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                    }`}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={editingCourse.description}
                    onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                    className={`w-full p-3 rounded-lg border ${
                      isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                    }`}
                    rows="3"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={editingCourse.price}
                    onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value })}
                    className={`w-full p-3 rounded-lg border ${
                      isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                    }`}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Instructor"
                    value={editingCourse.instructor}
                    onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                    className={`w-full p-3 rounded-lg border ${
                      isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                    }`}
                    required
                  />
                  <select
                    value={editingCourse.level}
                    onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                    className={`w-full p-3 rounded-lg border ${
                      isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
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
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                    className={`w-full p-3 rounded-lg border ${
                      isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                    }`}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={editingCourse.image}
                    onChange={(e) => setEditingCourse({ ...editingCourse, image: e.target.value })}
                    className={`w-full p-3 rounded-lg border ${
                      isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
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
                        className={`p-3 rounded-lg border ${
                          isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
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
                        className={`p-3 rounded-lg border ${
                          isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
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
                        className={`p-3 rounded-lg border ${
                          isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                        }`}
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex space-x-4">
                  <button
                    type="submit"
                    className={`flex-1 px-6 py-3 rounded-lg ${
                      isDarkMode ? "bg-teal-600 hover:bg-teal-700" : "bg-teal-500 hover:bg-teal-600"
                    } text-white font-semibold`}
                  >
                    Update Course
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCourse(null)}
                    className={`flex-1 px-6 py-3 rounded-lg ${
                      isDarkMode ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-300 hover:bg-gray-400"
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