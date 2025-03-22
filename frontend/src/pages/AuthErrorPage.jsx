import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AuthErrorPage = ({ isDarkMode }) => {
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? "bg-gray-950" : "bg-gray-100"}`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center px-6"
      >
        <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Oops! You're Logged Out
        </h1>
        <p className={`text-lg mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Looks like your session expired or you haven't logged in yet.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 text-lg font-semibold bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all"
          onClick={() => navigate("/login")}
        >
          Log in Now
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AuthErrorPage;
