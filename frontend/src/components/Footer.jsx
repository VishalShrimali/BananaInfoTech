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
                Unlock your potential with cutting-edge, industry-driven courses
                crafted by a team of creative experts. We deliver world-class
                digital learning solutions to help you thrive.
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
                  <ScrollLink to="home" smooth={true} duration={500}>Home</ScrollLink>
                </li>
                <li>
                  <ScrollLink to="courses" smooth={true} duration={500}>Courses</ScrollLink>
                </li>
                <li>
                  <ScrollLink to="about" smooth={true} duration={500}>About Us</ScrollLink>
                </li>
                <li>
                  <ScrollLink to="contact" smooth={true} duration={500}>Contact</ScrollLink>
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
                  Email: <a href="mailto:hello@bananasit.com">hello@bananasit.com</a>
                </li>
                <li>
                  Phone: +91 9898257016
                </li>
                <li>
                  Address: 18, SAI ASHISH BUNGALOWS, BABEN, BARDOLI, Gujarat, India.
                </li>
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
                <a href="https://www.facebook.com/bananasit" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
                <a href="https://www.twitter.com/bananasit" target="_blank" rel="noopener noreferrer"><Twitter size={20} /></a>
                <a href="https://www.instagram.com/bananasit" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
                <a href="https://www.linkedin.com/company/bananasit" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
                <a href="https://www.youtube.com/@bananasit" target="_blank" rel="noopener noreferrer"><Youtube size={20} /></a>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className={`border-t mt-10 pt-6 text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            © {new Date().getFullYear()} BananaSIT Courses. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
