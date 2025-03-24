import mongoose from "mongoose";
import { Course } from "../models/course.models.js"; // Adjust path to your Course model
import User from "../models/user.models.js";// Adjust path to your User model
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
// Middleware to check if user is admin (used internally or exported separately)
const ensureAdmin = async (req, res, next) => {
    try {
      const user = req.user;
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin only." });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Server Error.", error: error.message });
    }
  };
  
  const adminRegister = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      console.log("Request body:", req.body);
  
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
      }
  
      if (role && role !== "admin") {
        return res.status(400).json({ message: "This endpoint is for admin registration only" });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email already in use" });
  
      const user = await User.create({
        name,
        email,
        password, // Let pre-save hook hash it
        role: "admin",
      });
      console.log("Created user:", user);
  
      const token = user.generateAuthToken();
      console.log("Generated token:", token);
  
      if (!token) throw new Error("Token generation failed");
  
      res.status(201).json({ message: "Admin registered", token, role: "admin" });
    } catch (error) {
      console.error("Error in adminRegister:", error.message);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  const adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Login request:", { email, password }); // Debug incoming data
  
      const user = await User.findOne({ email });
      console.log("Found user:", user ? user : "No user found");
  
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials - User not found" });
      }
  
      const passwordMatch = await user.comparePassword(password);
      console.log("Password match:", passwordMatch);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials - Password incorrect" });
      }
  
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
  
      const token = user.generateAuthToken();
      console.log("Generated token:", token);
  
      if (!token) throw new Error("Token generation failed");
  
      res.status(200).json({ 
        message: "Admin login successful", 
        token, 
        role: user.role 
      });
    } catch (error) {
      console.error("Error in adminLogin:", error.message);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
// Add a new course (Admin only)
const adminAddCourse = async (req, res) => {
  try {
    const { title, description, price, instructor, level, duration, image, lessons } = req.body;

    // Validate required fields
    if (!title || !description || !price || !instructor || !level || !duration) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const validLevels = ["Beginner", "Intermediate", "Advanced"];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ message: "Level must be Beginner, Intermediate, or Advanced." });
    }

    if (isNaN(price)) {
      return res.status(400).json({ message: "Price must be a number." });
    }

    if (lessons && (!Array.isArray(lessons) || lessons.some(l => !l.title || !l.videoUrl || !l.duration))) {
      return res.status(400).json({ message: "Lessons must be an array with title, videoUrl, and duration." });
    }

    const newCourse = await Course.create({
      title,
      description,
      price: Number(price),
      instructor,
      level,
      duration,
      image: image || undefined,
      lessons: lessons || [],
      studentsEnrolled: []
    });

    const syllabus = newCourse.lessons.map(lesson => lesson.title);

    res.status(201).json({
      message: "Course added successfully",
      course: {
        id: newCourse._id,
        title: newCourse.title,
        description: newCourse.description,
        price: newCourse.price,
        instructor: newCourse.instructor,
        level: newCourse.level,
        duration: newCourse.duration,
        image: newCourse.image,
        syllabus,
        lessons: newCourse.lessons
      }
    });
  } catch (error) {
    console.log("Error in adminAddCourse: ", error);
    res.status(500).json({ message: "Server Error.", error: error.message });
  }
};

// View all courses (Admin only)
const adminViewAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().select("-studentsEnrolled"); // Exclude sensitive data if needed

    res.status(200).json({
      message: "All courses retrieved successfully",
      courses: courses.map(course => ({
        id: course._id,
        title: course.title,
        description: course.description,
        price: course.price,
        instructor: course.instructor,
        level: course.level,
        duration: course.duration,
        image: course.image,
        syllabus: course.lessons.map(lesson => lesson.title)
      }))
    });
  } catch (error) {
    console.log("Error in adminViewAllCourses: ", error);
    res.status(500).json({ message: "Server Error.", error: error.message });
  }
};

// Update a course (Admin only)
const adminUpdateCourse = async (req, res) => {
  try {
    const _id = req.params.id;
    const { title, description, price, instructor, level, duration, image, lessons } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(_id);
    if (!course) {
      return res.status(404).json({ message: "Course does not exist." });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price !== undefined) {
      if (isNaN(price)) return res.status(400).json({ message: "Price must be a number." });
      updateData.price = Number(price);
    }
    if (instructor) updateData.instructor = instructor;
    if (level) {
      const validLevels = ["Beginner", "Intermediate", "Advanced"];
      if (!validLevels.includes(level)) {
        return res.status(400).json({ message: "Level must be Beginner, Intermediate, or Advanced." });
      }
      updateData.level = level;
    }
    if (duration) updateData.duration = duration;
    if (image) updateData.image = image;
    if (lessons) {
      if (!Array.isArray(lessons) || lessons.some(l => !l.title || !l.videoUrl || !l.duration)) {
        return res.status(400).json({ message: "Lessons must be an array with title, videoUrl, and duration." });
      }
      updateData.lessons = lessons;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    const syllabus = updatedCourse.lessons.map(lesson => lesson.title);

    res.status(200).json({
      message: "Course updated successfully",
      course: {
        id: updatedCourse._id,
        title: updatedCourse.title,
        description: updatedCourse.description,
        price: updatedCourse.price,
        instructor: updatedCourse.instructor,
        level: updatedCourse.level,
        duration: updatedCourse.duration,
        image: updatedCourse.image,
        syllabus,
        lessons: updatedCourse.lessons
      }
    });
  } catch (error) {
    console.log("Error in adminUpdateCourse: ", error);
    res.status(500).json({ message: "Server Error.", error: error.message });
  }
};

// Delete a course (Admin only)
const adminDeleteCourse = async (req, res) => {
  try {
    const _id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findByIdAndDelete(_id);

    if (!course) {
      return res.status(404).json({ message: "Course does not exist." });
    }

    res.status(200).json({
      message: "Course deleted successfully",
      deletedCourse: {
        id: course._id,
        title: course.title
      }
    });
  } catch (error) {
    console.log("Error in adminDeleteCourse: ", error);
    res.status(500).json({ message: "Server Error.", error: error.message });
  }
};

export {
  adminAddCourse,
  adminViewAllCourses,
  adminUpdateCourse,
  adminDeleteCourse,
  ensureAdmin,
  adminLogin,
  adminRegister // Export if used as standalone middleware
};