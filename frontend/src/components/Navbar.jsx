import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-gray-800/20 ${
        isScrolled
          ? "bg-gray-950/90 backdrop-blur-md shadow-md"
          : isDarkMode
          ? "bg-gray-950"
          : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <h1
          className={`text-3xl font-bold tracking-wide ${
            isDarkMode ? "text-teal-400" : "text-teal-700"
          }`}
        >
          <RouterLink to="/">BananaSIT</RouterLink>
        </h1>

        <div className="hidden md:flex items-center space-x-6">
          {["home", "courses", "testimonials", "about"].map((label) => (
            <ScrollLink
              key={label}
              to={label === "home" ? "home" : label} // Corrected: "hero" instead of "/hero"
              smooth={true}
              duration={500}
              spy={true}
              activeClass="text-teal-500"
              className={`text-lg font-medium relative after:block after:h-[2px] after:bg-teal-500 after:scale-x-0 after:transition-transform after:duration-300 after:origin-left hover:after:scale-x-100 cursor-pointer ${
                isDarkMode
                  ? "text-gray-300 after:bg-teal-400"
                  : "text-gray-700 after:bg-teal-600"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </ScrollLink>
          ))}

          {user ? (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
                navigate("/login");
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold transition-all shadow-md"
            >
              Logout
            </button>
          ) : (
            <RouterLink
              to="/login"
              className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold transition-all shadow-md"
            >
              Get Started
            </RouterLink>
          )}

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-800 text-teal-400 hover:bg-gray-700"
                : "bg-gray-200 text-teal-600 hover:bg-gray-300"
            }`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <button
          className={`md:hidden ${
            isDarkMode ? "text-gray-300" : "text-gray-500"
          } focus:outline-none`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div
          className={`md:hidden absolute top-full left-0 w-full shadow-lg border-t border-gray-800/20 py-4 ${
            isScrolled
              ? "bg-gray-950/90 backdrop-blur-md"
              : isDarkMode
              ? "bg-gray-950"
              : "bg-white"
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            {["home", "courses", "testimonials", "about"].map((label) => (
              <ScrollLink
                key={label}
                to={label === "home" ? "hero" : label} // Corrected: "hero" instead of "/hero"
                smooth={true}
                duration={500}
                spy={true}
                className={`text-lg font-medium ${
                  isDarkMode
                    ? "text-gray-300 hover:text-teal-400"
                    : "text-gray-700 hover:text-teal-600"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </ScrollLink>
            ))}

            {user ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                  navigate("/login");
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md"
              >
                Logout
              </button>
            ) : (
              <RouterLink
                to="/login"
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </RouterLink>
            )}

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800 text-teal-400 hover:bg-gray-700"
                  : "bg-gray-200 text-teal-600 hover:bg-gray-300"
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;