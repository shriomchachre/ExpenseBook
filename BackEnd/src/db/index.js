import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.DB_URI}/${DB_NAME}`
        );
        console.log(
            `\nDB connected on host: ${connectionInstance.connection.host}.`
        );
    } catch (err) {
        console.log("DB connection error:", err);
        process.exit(1);
    }
};

export default connectDB;
