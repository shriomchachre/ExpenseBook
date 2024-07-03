import express from "express";
import { verifyJWT } from "../middlewares/user.middleware.js";
import { verifyMongooseId } from "../middlewares/mongoose.middleware.js";
import { verifyExpenseOwner } from "../middlewares/expense.middleware.js";
import {
    addExpense,
    updateExpense,
    deleteExpense,
    getExpense,
    getCount,
    getAllExpenses,
} from "../controllers/expense.controller.js";

const router = express.Router();

router.route("/").post(verifyJWT, addExpense).get(verifyJWT, getAllExpenses);

router.route("/count").get(verifyJWT, getCount);

router
    .route("/:id")
    .get(verifyJWT, verifyMongooseId, verifyExpenseOwner, getExpense)
    .put(verifyJWT, verifyMongooseId, verifyExpenseOwner, updateExpense)
    .delete(verifyJWT, verifyMongooseId, verifyExpenseOwner, deleteExpense);

export default router;
