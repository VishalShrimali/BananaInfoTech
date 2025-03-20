import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // New state for scroll
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50); // Change state when scrolled past 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-gray-800/20 ${
        isScrolled
          ? "bg-transparent" // Transparent when scrolled
          : isDarkMode
          ? "bg-gray-950" // Solid dark background at top
          : "bg-white" // Solid light background at top
      } shadow-md`}
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
          {["home", "courses", "testimonials", "about"].map((label, index) => (
            <ScrollLink
              key={index}
              to={label}
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

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
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
              ? "bg-transparent" // Transparent when scrolled
              : isDarkMode
              ? "bg-gray-950" // Solid dark background at top
              : "bg-white" // Solid light background at top
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            {["home", "courses", "testimonials", "about"].map((label, index) => (
              <ScrollLink
                key={index}
                to={label}
                smooth={true}
                duration={500}
                spy={true}
                activeClass="text-teal-500"
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

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
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