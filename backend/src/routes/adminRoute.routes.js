import express from "express";
import {
  adminAddCourse,
  adminViewAllCourses,
  adminUpdateCourse,
  adminDeleteCourse,
  ensureAdmin,
  adminRegister,
} from "../controllers/admin.controllers.js";
import { adminLogin } from "../controllers/admin.controllers.js";
import { adminAuth } from "../middleware/adminAuth.js";

const adminRoute = express.Router();

// Public routes for admin registration and login
adminRoute.post("/register", adminRegister); // No auth required
adminRoute.post("/login", adminLogin);       // No auth required

// Protected admin routes (require adminAuth and ensureAdmin)
adminRoute.use(adminAuth, ensureAdmin); // Apply middleware to all routes below
adminRoute.post("/courses/add", adminAddCourse);         // Add a new course
adminRoute.get("/courses", adminViewAllCourses);        // View all courses
adminRoute.put("/courses/update/:id", adminUpdateCourse); // Update a course
adminRoute.delete("/courses/delete/:id", adminDeleteCourse); // Delete a course

export default adminRoute;