import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        console.log("Connected to DB");
        const MONGO_URI =  process.env.MONGODB_URI;
        if (!MONGO_URI) {
            throw new Error("Please provide MONGODB_URI in the environment variables");
        }
        try {
            await mongoose.connect(MONGO_URI);
            console.log("MongoDB connected");
        } catch (error) {
            console.error("MongoDB connection failed", error);
            throw error;
        }
    } catch (error) {
        console.log(error);
    }
}










