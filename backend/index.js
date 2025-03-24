import express from "express";
const app = express();
import dotenv from "dotenv";
import { userRouter } from "./src/routes/userRouter.routes.js";
import { courseRoute } from "./src/routes/courseRouter.routes.js";
import { connectionDatabase } from "./src/config/DB.js";
import cors from 'cors';
import testimonialRouter from "./src/routes/testimonial.routes.js";
import adminRoute from "./src/routes/adminRoute.routes.js";
dotenv.config();

// CORS middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/bananasit/testimonials", testimonialRouter); 
app.use('/api/v1/bananasit/users', userRouter);
app.use('/api/v1/bananasit/courses', courseRoute);
app.use('/api/v1/bananasit/admin', adminRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    connectionDatabase();
    console.log(`\n Server is running on ${port}`);
});