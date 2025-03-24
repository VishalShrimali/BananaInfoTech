import { Course } from "../models/course.models.js";
import mongoose from "mongoose";


const addCourse = async (req, res) => {
    try {
        const { title, description, price, instructor, level, duration, image, lessons, studentsEnrolled } = req.body;

        // Validate required fields
        if (!title || !description || !price || !instructor || !level || !duration) {
            return res.status(400).json({ message: "All required fields (title, description, price, instructor, level, duration) must be provided." });
        }

        // Validate level
        const validLevels = ["Beginner", "Intermediate", "Advanced"];
        if (!validLevels.includes(level)) {
            return res.status(400).json({ message: "Level must be Beginner, Intermediate, or Advanced." });
        }

        // Validate price as number
        if (isNaN(price)) {
            return res.status(400).json({ message: "Price must be a number." });
        }

        // Validate lessons if provided
        if (lessons && (!Array.isArray(lessons) || lessons.some(l => !l.title || !l.videoUrl || !l.duration))) {
            return res.status(400).json({ message: "Lessons must be an array with title, videoUrl, and duration for each lesson." });
        }

        const newCourse = await Course.create({
            title,
            description,
            price: Number(price),
            instructor,
            level,
            duration,
            image: image || undefined, // Use default if not provided
            lessons: lessons || [],
            studentsEnrolled: studentsEnrolled || []
        });

        const syllabus = newCourse.lessons.map(lesson => lesson.title);

        return res.status(201).json({
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
        console.log("Error in addCourse: ", error);
        res.status(500).json({
            message: "Server Error.",
            error: error.message
        });
    }
};
const viewCourse = async (req, res) => {
    try {
        const _id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        const course = await Course.findById(_id).populate('studentsEnrolled', 'name email'); // Optional: populate student details

        if (!course) {
            return res.status(404).json({ message: "Course does not exist." });
        }

        // Map lessons to syllabus if needed
        const syllabus = course.lessons.map(lesson => lesson.title);

        res.status(200).json({
            message: "Course Details",
            title: course.title,
            description: course.description,
            instructor: course.instructor,
            duration: course.duration,
            level: course.level,
            price: course.price,
            syllabus: syllabus, // Derived from lessons
            image: course.image,
            lessons: course.lessons // Optional: include full lessons if needed
        });
    } catch (error) {
        console.log("Error is: ", error);
        res.status(500).json({
            message: "Server Error."
        });
    }
};

const updateCourse = async (req, res) => {
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

        // Prepare update object
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
            title: updatedCourse.title,
            description: updatedCourse.description,
            price: updatedCourse.price,
            instructor: updatedCourse.instructor,
            level: updatedCourse.level,
            duration: updatedCourse.duration,
            image: updatedCourse.image,
            syllabus,
            lessons: updatedCourse.lessons
        });
    } catch (error) {
        console.log("Error in updateCourse: ", error);
        res.status(500).json({
            message: "Server Error.",
            error: error.message
        });
    }
};
const deleteCourse = async (req, res) => {
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
        console.log("Error in deleteCourse: ", error);
        res.status(500).json({
            message: "Server Error.",
            error: error.message
        });
    }
};

export {
    addCourse,
    viewCourse,
    updateCourse,
    deleteCourse,
   
}
