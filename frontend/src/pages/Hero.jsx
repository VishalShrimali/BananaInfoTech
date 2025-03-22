import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import Courses from "./Courses";
import About from "../components/About";
import Testimonial from "../components/Testimonial";
import Footer from "../components/Footer";
import ContactUs from "../components/ContactUs";

const Hero = ({ isDarkMode }) => {
  return (
    <div>
      {/* Hero Section */}
      <section
        id="home"
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-950" : "bg-white"
        } transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1
            className={`text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-wide ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Master Skills with{" "}
            <span
              className={`${isDarkMode ? "text-teal-400" : "text-teal-700"}`}
            >
              BananaSIT
            </span>
          </h1>
          <p
            className={`text-xl md:text-2xl ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } mb-8 max-w-3xl mx-auto`}
          >
            Elevate your career with expert-led courses designed for success in a
            fast-paced world.
          </p>
          <ScrollLink
            to="courses"
            smooth={true}
            duration={500}
            className={`inline-block bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-md cursor-pointer`}
          >
            Explore Courses
          </ScrollLink>
          <div className="mt-12">
            <div
              className={`w-16 h-16 mx-auto rounded-full ${
                isDarkMode ? "bg-teal-400/20" : "bg-teal-600/20"
              } animate-pulse`}
            ></div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses">
        <Courses isDarkMode={isDarkMode} />
      </section>

      {/* About Section */}
      <section id="about">
        <About isDarkMode={isDarkMode} />
      </section>

      {/* Testimonials Section */}
      <section id="testimonials">
        <Testimonial isDarkMode={isDarkMode} />
      </section>

      {/* Contact Section (already has id="contact" in ContactUs) */}
      <section id="contact">
        <ContactUs isDarkMode={isDarkMode} />
      </section>

      {/* Footer Section */}
      {/* <section id="footer">
        <Footer isDarkMode={isDarkMode} />
      </section> */}
    </div>
  );
};

export default Hero;

