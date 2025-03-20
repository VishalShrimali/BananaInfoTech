import React, { useState } from "react";

const ContactUs = ({ isDarkMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "" // 'success' or 'error'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call - replace with your actual endpoint
      const response = await fetch("http://localhost:3000/api/v1/bananasit/users/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setAlert({
        show: true,
        message: "Your message has been sent successfully!",
        type: "success"
      });
      setFormData({ name: "", email: "", message: "" }); // Reset form
    } catch (error) {
      setAlert({
        show: true,
        message: error.message || "Something went wrong. Please try again.",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  return (
    <div className="relative">
      {/* Contact Section */}
      <section
        id="contact"
        className={`py-20 ${
          isDarkMode ? "bg-gray-950" : "bg-white"
        } transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className={`text-4xl md:text-5xl font-bold text-center mb-12 ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Contact{" "}
            <span
              className={`${isDarkMode ? "text-teal-300" : "text-teal-600"}`}
            >
              Us
            </span>
          </h2>
          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-gray-200 focus:ring-teal-500"
                      : "bg-white border-gray-300 text-gray-800 focus:ring-teal-400"
                  } focus:outline-none focus:ring-2 transition-all duration-300`}
                  placeholder="Your Name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-gray-200 focus:ring-teal-500"
                      : "bg-white border-gray-300 text-gray-800 focus:ring-teal-400"
                  } focus:outline-none focus:ring-2 transition-all duration-300`}
                  placeholder="Your Email"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-gray-200 focus:ring-teal-500"
                      : "bg-white border-gray-300 text-gray-800 focus:ring-teal-400"
                  } focus:outline-none focus:ring-2 transition-all duration-300`}
                  placeholder="Your Message"
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${
                  isDarkMode
                    ? "bg-teal-600 hover:bg-teal-700 text-white"
                    : "bg-teal-500 hover:bg-teal-600 text-white"
                } px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md ${
                  isDarkMode ? "shadow-teal-500/20" : "shadow-teal-400/20"
                } disabled:opacity-75 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Alert Message */}
      {alert.show && (
        <div
          className={`fixed top-4 right-4 max-w-sm w-full p-4 rounded-lg shadow-lg transition-all duration-300 transform ${
            alert.type === "success"
              ? "bg-green-500/90 text-white"
              : "bg-red-500/90 text-white"
          } animate-slide-in z-50`}
        >
          <div className="flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {alert.type === "success" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              )}
            </svg>
            <p className="text-sm font-medium">{alert.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;