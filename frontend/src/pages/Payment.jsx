import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Payment = ({ isDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { course, price } = location.state || {};

  if (!course || !price) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: No course information available</p>
      </div>
    );
  }

  const handlePayment = () => {
    // Here you would typically integrate with a payment gateway
    // For now, we'll just simulate a successful payment
    alert("Payment processed successfully!");
    navigate("/courses");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-950" : "bg-white"
      } py-16`}
    >
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Payment for {course.title}
          </h1>
          <p
            className={`mt-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Complete your enrollment
          </p>
        </motion.div>

        <div
          className={`p-6 rounded-lg shadow-md ${
            isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"
          }`}
        >
          <div className="space-y-6">
            <div>
              <span
                className={`block text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Course
              </span>
              <span
                className={`${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                } font-semibold`}
              >
                {course.title}
              </span>
            </div>
            <div>
              <span
                className={`block text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Amount
              </span>
              <span
                className={`${
                  isDarkMode ? "text-teal-300" : "text-teal-600"
                } font-semibold text-xl`}
              >
                ₹{price}
              </span>
            </div>

            {/* Basic payment form - replace with actual payment gateway integration */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                className={`w-full p-3 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-200 border-gray-600"
                    : "bg-white text-gray-800 border-gray-300"
                } border focus:outline-none focus:ring-2 focus:ring-teal-500`}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className={`w-full p-3 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  } border focus:outline-none focus:ring-2 focus:ring-teal-500`}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className={`w-full p-3 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  } border focus:outline-none focus:ring-2 focus:ring-teal-500`}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePayment}
              className={`w-full ${
                isDarkMode
                  ? "bg-teal-600 hover:bg-teal-700"
                  : "bg-teal-500 hover:bg-teal-600"
              } text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300`}
            >
              Pay Now
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Payment;