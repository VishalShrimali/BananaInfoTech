import { useState } from "react";
import { useParams } from "react-router-dom";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

const courses = {
  "mern-stack": {
    title: "MERN Stack Mastery",
    video: "/videos/mern-intro.mp4",
    lessons: [
      { id: 1, title: "Introduction to MERN", video: "/videos/mern-intro.mp4" },
      { id: 2, title: "Setting up MongoDB", video: "/videos/mongodb-setup.mp4" },
      { id: 3, title: "Building REST APIs", video: "/videos/rest-api.mp4" },
      { id: 4, title: "Frontend with React", video: "/videos/react-frontend.mp4" },
    ],
  },
  "ai-ml": {
    title: "AI & ML Bootcamp",
    video: "/videos/ai-intro.mp4",
    lessons: [
      { id: 1, title: "Understanding AI", video: "/videos/ai-intro.mp4" },
      { id: 2, title: "Machine Learning Basics", video: "/videos/ml-basics.mp4" },
      { id: 3, title: "Neural Networks", video: "/videos/neural-networks.mp4" },
    ],
  },
};

const CourseWatchPage = () => {
  const { courseId } = useParams();
  const course = courses[courseId];

  const [currentLesson, setCurrentLesson] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!course) {
    return <div className="text-center text-xl mt-10">Course not found 😢</div>;
  }

  const videoRef = useState(null);

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextLesson = () => {
    if (currentLesson < course.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const prevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

      {/* Video Player */}
      <div className="relative">
        <video
          ref={videoRef}
          src={course.lessons[currentLesson].video}
          controls
          className="w-full rounded-lg shadow-lg"
        />
        <div className="mt-4 flex justify-center items-center gap-6">
          <button
            onClick={prevLesson}
            disabled={currentLesson === 0}
            className={`px-4 py-2 bg-gray-200 rounded-full ${currentLesson === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
          >
            <SkipBack size={24} />
          </button>
          <button onClick={togglePlayPause} className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={nextLesson}
            disabled={currentLesson === course.lessons.length - 1}
            className={`px-4 py-2 bg-gray-200 rounded-full ${currentLesson === course.lessons.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>

      {/* Course Lessons */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Course Lessons</h2>
        <ul className="space-y-2">
          {course.lessons.map((lesson, index) => (
            <li
              key={lesson.id}
              onClick={() => setCurrentLesson(index)}
              className={`p-3 rounded-lg cursor-pointer ${
                index === currentLesson ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {lesson.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseWatchPage;
