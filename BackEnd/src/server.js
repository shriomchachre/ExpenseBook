import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === "production" });

import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server started on port ${process.env.PORT || 3000}.`);
        });
    })
    .catch((err) => {
        console.log("DB connection error:", err);
    });
