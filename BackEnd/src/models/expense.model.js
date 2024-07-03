import mongoose from "mongoose";

const Schema = mongoose.Schema;

const expenseSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        dueDate: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        amount: {
            type: Number,
            default: 0,
            required: true,
        },
        status: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    { timestamps: true }
);

export const Expense = mongoose.model("Expense", expenseSchema);
