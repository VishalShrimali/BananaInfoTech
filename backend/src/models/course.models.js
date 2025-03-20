import mongoose from "mongoose";
import { connectionDatabase } from "../config/DB.js";
import jwt from "jsonwebtoken";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  lessons: [
    {
      title: { type: String, required: true },
      videoUrl: { type: String, required: true },
      duration: { type: Number, required: true }, // in minutes
      content: { type: String }
    }
  ],
  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

},{timestamps: true});

// JWT AUTH TOKEN GENERATOR
courseSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
      { userId: this._id, email: this.email }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration time
  );
  return token;
};

export const Course = mongoose.model('Course', courseSchema);
