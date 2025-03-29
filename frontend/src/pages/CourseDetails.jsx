import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import Modal from "react-modal";

// Bind modal to your app element (for accessibility)
Modal.setAppElement("#root");

const CourseDetail = ({ isDarkMode }) => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [transactionId, setTransactionId] = useState(null); // Store transaction ID
  const navigate = useNavigate();
  const topRef = useRef(null);

  const upiId = "24vishalmali@okhdfcbank";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseId]);

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
        setCourse({
          title: data.title,
          description: data.description,
          instructor: data.instructor,
          duration: data.duration,
          level: data.level,
          price: data.price,
          syllabus: data.syllabus,
          image: data.image,
          lessons: data.lessons || [],
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

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
    lessons: [
      { title: "Introduction", videoUrl: "https://example.com/video1.mp4", duration: "10 mins" },
      { title: "Core Concepts", videoUrl: "https://example.com/video2.mp4", duration: "15 mins" },
      { title: "Advanced Topics", videoUrl: "https://example.com/video3.mp4", duration: "20 mins" },
      { title: "Project", videoUrl: "https://example.com/video4.mp4", duration: "25 mins" },
    ],
  };

  // Check if payment was already confirmed (e.g., on page reload)
  useEffect(() => {
    const paymentStatus = localStorage.getItem(`payment_${courseId}`);
    if (paymentStatus === "confirmed") {
      setIsPaymentConfirmed(true);
    }
  }, [courseId]);

  // Generate a unique transaction ID
  const generateTransactionId = () => {
    return `TXN_${courseId}_${Date.now()}`; // Simple transaction ID format
  };

  // Generate UPI QR code with transaction ID
  const generateUpiQrCode = async (courseData) => {
    const txnId = generateTransactionId();
    setTransactionId(txnId);

    const upiLink = `upi://pay?pa=${upiId}&pn=CoursePayment&am=${courseData.price}&cu=INR&tn=Payment for ${courseData.title}&tr=${txnId}`;
    try {
      const qrUrl = await QRCode.toDataURL(upiLink);
      setQrCodeUrl(qrUrl);
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      console.error("Error generating QR code:", err);
      setError("Failed to generate QR code. Please try again.");
    }
  };

  // Poll the backend to check payment status
  useEffect(() => {
    if (!qrCodeUrl || !transactionId || isPaymentConfirmed) return;

    const pollPaymentStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/v1/bananasit/users/check-payment/${transactionId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to check payment status: ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();
        if (data.status === "completed") {
          setIsPaymentConfirmed(true);
          localStorage.setItem(`payment_${courseId}`, "confirmed");
          setQrCodeUrl(null);
          if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }
      } catch (err) {
        console.error("Error checking payment status:", err.message);
        setError("Failed to verify payment. Please try again.");
      }
    };

    const interval = setInterval(pollPaymentStatus, 5000);

    // Stop polling after 5 minutes (300,000 ms)
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!isPaymentConfirmed) {
        setError("Payment not confirmed within 5 minutes. Please try again.");
        setQrCodeUrl(null);
      }
    }, 300000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [qrCodeUrl, transactionId, isPaymentConfirmed, courseId]);

  const playLesson = (videoUrl) => {
    setCurrentVideoUrl(videoUrl);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoUrl("");
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
        <div className="max-w-7xl mx-auto px-6" ref={topRef}>
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
                      ₹{courseData.price}
                    </span>
                  </div>
                  {!isPaymentConfirmed ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => generateUpiQrCode(courseData)}
                      className={`w-full mt-4 ${
                        isDarkMode
                          ? "bg-teal-600 hover:bg-teal-700"
                          : "bg-teal-500 hover:bg-teal-600"
                      } text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md`}
                    >
                      Generate Payment QR
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className={`w-full mt-4 text-center p-3 rounded-lg ${
                        isDarkMode ? "bg-green-600" : "bg-green-500"
                      } text-white font-semibold`}
                    >
                      Payment is done! Enjoy your course.
                    </motion.div>
                  )}
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

              {qrCodeUrl && !isPaymentConfirmed && (
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
                    Scan to Pay
                  </h2>
                  <img src={qrCodeUrl} alt="UPI Payment QR" className="mx-auto" />
                  <p
                    className={`mt-4 text-center ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Scan this QR code with any UPI app to pay ₹{courseData.price} for {courseData.title}. <br />
                    Waiting for payment confirmation...
                  </p>
                </div>
              )}

              {isPaymentConfirmed && (
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
                    Course Lessons
                  </h2>
                  <ul className="space-y-3">
                    {courseData.lessons.map((lesson, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center">
                          <span
                            className={`w-2 h-2 rounded-full mr-3 ${
                              isDarkMode ? "bg-teal-300" : "bg-teal-600"
                            }`}
                          />
                          <div>
                            <p
                              className={`${
                                isDarkMode ? "text-gray-200" : "text-gray-800"
                              } font-semibold`}
                            >
                              {lesson.title}
                            </p>
                            <p
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Duration: {lesson.duration}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => playLesson(lesson.videoUrl)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                            isDarkMode
                              ? "bg-teal-600 hover:bg-teal-700 text-white"
                              : "bg-teal-500 hover:bg-teal-600 text-white"
                          }`}
                        >
                          Play
                        </motion.button>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

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

      {/* Video Modal */}
      <Modal
        isOpen={isVideoModalOpen}
        onRequestClose={closeVideoModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: isDarkMode ? "#1F2937" : "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "20px",
            width: "80%",
            maxWidth: "800px",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
        }}
      >
        <h2
          className={`text-2xl font-semibold mb-4 ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Lesson Video
        </h2>
        <video
          src={currentVideoUrl}
          controls
          autoPlay
          className="w-full rounded-lg"
          style={{ maxHeight: "400px" }}
        />
        <button
          onClick={closeVideoModal}
          className={`mt-4 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-600 hover:bg-gray-700 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          Close
        </button>
      </Modal>
    </motion.div>
  );
};

export default CourseDetail;