import mongoose from "mongoose";

async function mongodb() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in the environment variables');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database....");
    } catch (error) {
        console.error("Failed to connect to database:", error);
    }
}
export default mongodb;
