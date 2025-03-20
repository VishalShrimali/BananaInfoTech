import React, { useEffect, useState } from "react";

const Testimonial = ({ isDarkMode }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/bananasit/testimonials");
        if (!response.ok) {
          throw new Error("Failed to fetch testimonials");
        }
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section
      id="testimonials"
      className={`py-20 ${
        isDarkMode ? "bg-gray-900" : "bg-gradient-to-b from-gray-50 to-white"
      } transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2
          className={`text-4xl md:text-5xl font-bold text-center mb-16 ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          } relative`}
        >
          <span className="relative z-10">
            What Our Students Say About{" "}
            <span className={`${isDarkMode ? "text-teal-300" : "text-teal-600"}`}>
              BananaSIT
            </span>
          </span>
          <span
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 rounded-full ${
              isDarkMode ? "bg-teal-300/30" : "bg-teal-600/30"
            }`}
          />
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 animate-pulse">
            Loading testimonials...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No testimonials available.
          </p>
        ) : (
          <div className="relative">
            <div className="overflow-hidden px-4 md:px-16">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial._id || testimonial.id}
                    className="min-w-full px-4"
                  >
                    <div
                      className={`relative rounded-xl shadow-lg p-8 mx-auto max-w-2xl transform transition-all duration-300 hover:scale-105 ${
                        isDarkMode
                          ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50"
                          : "bg-white/80 backdrop-blur-sm border border-gray-200/50"
                      }`}
                    >
                      <span
                        className={`absolute -top-4 left-6 text-4xl ${
                          isDarkMode ? "text-teal-300/20" : "text-teal-600/20"
                        }`}
                      >
                        ❝
                      </span>
                      <p
                        className={`text-base md:text-lg italic mb-6 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        } text-center relative z-10`}
                      >
                        {testimonial.quote}
                      </p>
                      <div className="flex items-center justify-center">
                        <img
                          src={testimonial.imageUrl || "https://via.placeholder.com/50"}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-teal-500/20"
                        />
                        <div className="text-center">
                          <h4
                            className={`text-xl font-semibold ${
                              isDarkMode ? "text-gray-100" : "text-gray-800"
                            }`}
                          >
                            {testimonial.name}
                          </h4>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-teal-300" : "text-teal-600"
                            }`}
                          >
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className={`absolute left-4 md:left-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-md transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800/80 text-teal-300 hover:bg-gray-700"
                  : "bg-white/80 text-teal-600 hover:bg-gray-100"
              } hover:scale-110`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className={`absolute right-4 md:right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-md transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800/80 text-teal-300 hover:bg-gray-700"
                  : "bg-white/80 text-teal-600 hover:bg-gray-100"
              } hover:scale-110`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? isDarkMode
                        ? "bg-teal-300 w-8"
                        : "bg-teal-600 w-8"
                      : isDarkMode
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonial;