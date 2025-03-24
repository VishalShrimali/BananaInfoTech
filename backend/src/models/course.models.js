import mongoose from "mongoose";

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
    type: Number, // Changed to Number for consistency
    required: true
  },
  instructor: {
    type: String, // Or mongoose.Schema.Types.ObjectId with ref: "User" if tied to a user
    required: true
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"], // Optional: restrict values
    required: true
  },
  duration: {
    type: String, // e.g., "6 weeks" as shown in frontend
    required: true
  },
  image: {
    type: String, // URL to course image
    default: "https://via.placeholder.com/600x400"
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
  ]
}, { timestamps: true });

// Remove generateAuthToken as it doesn't belong here

export const Course = mongoose.model('Course', courseSchema);