import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB');
        });
        await mongoose.connect(`${process.env.MONGODB_URL}/quickgpt`)
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export default connectDB;