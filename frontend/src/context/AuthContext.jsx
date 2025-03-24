import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check token validity and fetch user profile on mount
  useEffect(() => {
    const verifyAndFetchProfile = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          const verifyRes = await axios.get(
            "http://localhost:3000/api/v1/bananasit/users/verify-token",
            {
              headers: { Authorization: `Bearer ${savedToken}` },
            }
          );
          if (verifyRes.status === 200) {
            setToken(savedToken);
            await fetchUserProfile(savedToken);
          }
        } catch (error) {
          console.error(
            "Token verification failed:",
            error.response?.data?.message || error.message
          );
          logout(); // Clear invalid/expired token
        }
      } else {
        setLoading(false);
      }
    };
    verifyAndFetchProfile();
  }, []);

  // Axios interceptor for token injection
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
      throw new Error(error.response?.data?.message || "Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, isAdmin = false) => {
    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error("Invalid input: Email and password must be strings");
    }

    try {
      const endpoint = isAdmin
        ? "http://localhost:3000/api/v1/bananasit/admin/login"
        : "http://localhost:3000/api/v1/bananasit/users/login";
      const res = await axios.post(endpoint, { email, password });
      const { token, role } = res.data; // Expect role from backend
      setToken(token);
      localStorage.setItem("token", token);
      setUser({ email, role });

      navigate(role === "admin" ? "/admin" : "/");
      if (role !== "admin") {
        setTimeout(() => {
          scroller.scrollTo("hero", { smooth: true, duration: 500 });
        }, 100);
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const signup = async (name, email, password, isAdmin = false) => {
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      throw new Error("Invalid input: Name, email, and password must be strings");
    }

    try {
      const endpoint = isAdmin
        ? "http://localhost:3000/api/v1/bananasit/admin/register"
        : "http://localhost:3000/api/v1/bananasit/users/signup";
      const res = await axios.post(endpoint, { name, email, password });
      const { token, role } = res.data; // Expect role from backend
      setToken(token);
      localStorage.setItem("token", token);
      setUser({ name, email, role });

      navigate(role === "admin" ? "/admin" : "/");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Signup failed");
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