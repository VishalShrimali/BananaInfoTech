import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { scroller } from "react-scroll"; // Import scroller for programmatic scrolling

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const axiosInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => axios.interceptors.request.eject(axiosInterceptor);
  }, [token]);

  const fetchUserProfile = async (currentToken) => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/bananasit/users/profile", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      setUser(res.data.user);
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data?.message || error.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    if (typeof email !== "string" || typeof password !== "string") {
      console.error("Email and password must be strings");
      throw new Error("Invalid input: Email and password must be strings");
    }

    try {
      const res = await axios.post("http://localhost:3000/api/v1/bananasit/users/login", {
        email,
        password,
      });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/"); // Redirect to home page
      // Scroll to hero section after navigation
      setTimeout(() => {
        scroller.scrollTo("hero", {
          smooth: true,
          duration: 500,
        });
      }, 100); // Small delay to ensure page loads
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      throw error; // Throw error to be caught in Login component
    }
  };

  const signup = async (name, email, password) => {
    try {
      await axios.post("http://localhost:3000/api/v1/bananasit/users/signup", { name, email, password });
      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);