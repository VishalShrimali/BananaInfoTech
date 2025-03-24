import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import { loginUser, removeUser, signUpUser,  updateUser, userProfile, listCourses, contactUs } from "../controllers/userController.js";
import { adminAuth } from "../middleware/adminAuth.js";
const userRouter = express.Router();


userRouter.get('/profile/:id', userAuth, userProfile );

userRouter.post('/login',loginUser );

userRouter.post('/signup', signUpUser );

userRouter.get('/courses', userAuth , listCourses );

userRouter.put('/update/:id', updateUser);

userRouter.post('/contact', contactUs);

userRouter.delete('/delete/:id', userAuth, removeUser);

export { userRouter };
