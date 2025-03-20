import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const db_name = "BananaIST_DB"

const connectionDatabase = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
        const connectionInstance = await mongoose.connect(`${mongoURI}${db_name}`);
        console.log(`\n Database is connected on ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("\n Database Error. : ", error);
        process.exit(1); // Exit if database connection fails
    }
}

export { connectionDatabase };