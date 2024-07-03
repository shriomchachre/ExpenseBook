import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(
    express.json({
        type: ["application/json", "text/plain"],
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));

// Routes
import userRouter from "./routes/user.routes.js";
import expenseRouter from "./routes/expense.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/expenses", expenseRouter);

// Error handlers
app.all("*", (req, res) => {
    res.status(404).json(new ApiError(404, "Not found."));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    res.status(statusCode).json(err);
});

export { app };
