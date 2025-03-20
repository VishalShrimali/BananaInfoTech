import express from "express";
import { createTestimonial, deleteTestimonial, getTestimonials } from "../controllers/Testimonial.controllers.js";

const testimonialRouter = express.Router();

testimonialRouter.get("/", getTestimonials);  // Fetch testimonials
testimonialRouter.post("/", createTestimonial);  // Add new testimonial
testimonialRouter.delete("/:id", deleteTestimonial);  // Delete a testimonial

export default testimonialRouter;
