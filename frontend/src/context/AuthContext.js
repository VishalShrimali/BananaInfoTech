import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            fetchUserProfile();
        }
    }, [token]);

    const fetchUserProfile = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/user/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data.user);
        } catch (error) {
            console.error("Error fetching profile:", error);
            logout();
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post("http://localhost:5000/api/user/login", { email, password });
            setToken(res.data.token);
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            navigate("/courses"); // Redirect to courses after login
        } catch (error) {
            console.error("Login failed:", error);
            alert(error.response?.data?.message || "Login failed");
        }
    };

    const signup = async (name, email, password) => {
        try {
            await axios.post("http://localhost:5000/api/user/signup", { name, email, password });
            alert("Signup successful! Please log in.");
            navigate("/login");
        } catch (error) {
            console.error("Signup failed:", error);
            alert(error.response?.data?.message || "Signup failed");
        }
    };

    const logout = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
