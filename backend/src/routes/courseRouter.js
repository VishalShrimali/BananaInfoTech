import express from "express";
import jwt from "jsonwebtoken";
import {Course} from "../models/course.models.js";

import {courseAuth} from "../middleware/courseAuth.js";
import { addCourse, deleteCourse, updateCourse, viewCourse } from "../controllers/courseController.js";
import { userAuth } from "../middleware/userAuth.js";

const courseRoute = express.Router();

courseRoute.post('/add', addCourse );

courseRoute.get('/view/:id', userAuth, viewCourse );

courseRoute.put('/update/:id', userAuth, updateCourse);

courseRoute.delete('/remove/:id', courseAuth, deleteCourse);


export { courseRoute }