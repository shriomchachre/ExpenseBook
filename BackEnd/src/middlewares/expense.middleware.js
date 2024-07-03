import { Expense } from "../models/expense.model.js";
import ApiError from "../utils/ApiError.js";

const verifyExpenseOwner = async (req, _, next) => {
    const { id } = req.params;

    const fetchedExpense = await Expense.findById(id);

    if (!fetchedExpense) {
        return next(new ApiError(404, "Not found."));
    }

    const owner = fetchedExpense.owner.toString();
    const user = req?.user._id.toString();

    if (owner !== user) {
        return next(new ApiError(404, "Not found."));
    }

    next();
};

export { verifyExpenseOwner };
