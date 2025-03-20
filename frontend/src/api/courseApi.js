import axiosInstance from "./axiosInstance";

export const getAllCourses = async () => {
    try {
        const response = await axiosInstance.get("/courses");
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to fetch courses.";
    }
};

export const getCourseById = async (courseId) => {
    try {
        const response = await axiosInstance.get(`/courses/${courseId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to fetch course details.";
    }
};

export const createCourse = async (courseData) => {
    try {
        const response = await axiosInstance.post("/courses", courseData);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Failed to create course.";
    }
};
