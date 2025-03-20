import axiosInstance from "./axiosInstance";

export const loginUser = async (email, password) => {
    try {
        const response = await axiosInstance.post("/users/login", { email, password });
        localStorage.setItem("token", response.data.token);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Login failed.";
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post("/users/register", userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Registration failed.";
    }
};

export const getUserProfile = async () => {
    try {
        const response = await axiosInstance.get("/users/me");
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to fetch user profile.";
    }
};
