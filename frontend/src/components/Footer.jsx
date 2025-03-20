import React from "react";
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
const Footer = ({ isDarkMode }) => {
  return (
    <>
      {/* Footer */}
      <footer
        className={`py-12 ${
          isDarkMode
            ? "bg-gradient-to-r from-gray-900 to-gray-800"
            : "bg-gradient-to-r from-gray-100 to-gray-200"
        } text-${
          isDarkMode ? "gray-300" : "gray-700"
        } transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Logo & Short About */}
            <div className="md:col-span-1">
              <h2
                className={`text-3xl font-extrabold ${
                  isDarkMode ? "text-teal-400" : "text-teal-700"
                } tracking-tight`}
              >
                BananaSIT Courses
              </h2>
              <p className="mt-3 text-sm leading-relaxed">
                Empower your future with top-tier, industry-focused courses
                designed to help you succeed.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="md:col-span-1">
              <h3
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-teal-300" : "text-teal-600"
                } mb-4`}
              >
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <ScrollLink
                    to="home"
                    smooth={true}
                    duration={500}
                    className={`relative transition-all duration-300 after:content-[''] after:absolute after:w-0 after:h-[2px] after:${
                      isDarkMode ? "bg-teal-400" : "bg-teal-600"
                    } after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 hover:after:w-full cursor-pointer ${
                      isDarkMode
                        ? "text-gray-300 hover:text-teal-400"
                        : "text-gray-700 hover:text-teal-600"
                    }`}
                  >
                    Home
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink
                    to="courses"
                    smooth={true}
                    duration={500}
                    className={`relative transition-all duration-300 after:content-[''] after:absolute after:w-0 after:h-[2px] after:${
                      isDarkMode ? "bg-teal-400" : "bg-teal-600"
                    } after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 hover:after:w-full cursor-pointer ${
                      isDarkMode
                        ? "text-gray-300 hover:text-teal-400"
                        : "text-gray-700 hover:text-teal-600"
                    }`}
                  >
                    Courses
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink
                    to="about"
                    smooth={true}
                    duration={500}
                    className={`relative transition-all duration-300 after:content-[''] after:absolute after:w-0 after:h-[2px] after:${
                      isDarkMode ? "bg-teal-400" : "bg-teal-600"
                    } after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 hover:after:w-full cursor-pointer ${
                      isDarkMode
                        ? "text-gray-300 hover:text-teal-400"
                        : "text-gray-700 hover:text-teal-600"
                    }`}
                  >
                    About Us
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink
                    to="contact"
                    smooth={true}
                    duration={500}
                    className={`relative transition-all duration-300 after:content-[''] after:absolute after:w-0 after:h-[2px] after:${
                      isDarkMode ? "bg-teal-400" : "bg-teal-600"
                    } after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 hover:after:w-full cursor-pointer ${
                      isDarkMode
                        ? "text-gray-300 hover:text-teal-400"
                        : "text-gray-700 hover:text-teal-600"
                    }`}
                  >
                    Contact
                  </ScrollLink>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-1">
              <h3
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-teal-300" : "text-teal-600"
                } mb-4`}
              >
                Get in Touch
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:support@bananasit.com"
                    className={`${
                      isDarkMode ? "hover:text-teal-400" : "hover:text-teal-600"
                    } transition`}
                  >
                    support@bananasit.com
                  </a>
                </li>
                <li>
                  Phone:{" "}
                  <a
                    href="tel:+1234567890"
                    className={`${
                      isDarkMode ? "hover:text-teal-400" : "hover:text-teal-600"
                    } transition`}
                  >
                    +1 (234) 567-890
                  </a>
                </li>
                <li>Address: 123 Learning Lane, EduCity, 12345</li>
              </ul>
            </div>

            {/* Social Media Links */}
            <div className="md:col-span-1">
              <h3
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-teal-300" : "text-teal-600"
                } mb-4`}
              >
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className={`p-2 rounded-full ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-teal-500 hover:text-white"
                      : "bg-gray-300 text-gray-700 hover:bg-teal-600 hover:text-white"
                  } transition-all duration-300 transform hover:scale-110`}
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className={`p-2 rounded-full ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-teal-500 hover:text-white"
                      : "bg-gray-300 text-gray-700 hover:bg-teal-600 hover:text-white"
                  } transition-all duration-300 transform hover:scale-110`}
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="#"
                  className={`p-2 rounded-full ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-teal-500 hover:text-white"
                      : "bg-gray-300 text-gray-700 hover:bg-teal-600 hover:text-white"
                  } transition-all duration-300 transform hover:scale-110`}
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className={`p-2 rounded-full ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-teal-500 hover:text-white"
                      : "bg-gray-300 text-gray-700 hover:bg-teal-600 hover:text-white"
                  } transition-all duration-300 transform hover:scale-110`}
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="#"
                  className={`p-2 rounded-full ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-teal-500 hover:text-white"
                      : "bg-gray-300 text-gray-700 hover:bg-teal-600 hover:text-white"
                  } transition-all duration-300 transform hover:scale-110`}
                >
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div
            className={`border-t ${
              isDarkMode ? "border-gray-700" : "border-gray-300"
            } mt-10 pt-6 text-center text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            © {new Date().getFullYear()} BananaSIT Courses. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
