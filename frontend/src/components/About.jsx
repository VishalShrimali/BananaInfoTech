import React from 'react';

const About = ({ isDarkMode }) => {  // Added isDarkMode as a prop
  return (
    <div>
      {/* About Us Section */}
      <section
        id="about"
        className={`py-16 ${
          isDarkMode ? "bg-gray-950" : "bg-white"
        } transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className={`text-4xl md:text-5xl font-bold text-center mb-12 ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            About{" "}
            <span
              className={`${isDarkMode ? "text-teal-300" : "text-teal-600"}`}
            >
              BananaSIT
            </span>
          </h2>
          <div className="text-center mb-16">
            <p
              className={`text-lg md:text-xl ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } max-w-3xl mx-auto leading-relaxed`}
            >
              At BananaSIT, we’re on a mission to empower individuals through
              education. Our platform offers expert-led courses designed to help
              you master new skills, advance your career, and unlock your full
              potential in today’s fast-paced world.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;