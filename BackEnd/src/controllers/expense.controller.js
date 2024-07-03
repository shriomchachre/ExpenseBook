import { Expense } from "../models/expense.model.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import validate from "../utils/validateForm.js";
import mongoose from "mongoose";

const validateDueDate = (date) => {
    validate.date({ date, required: true });

    const [DD, MM, YYYY] = date.split("/");

    const today = new Date();
    const currentYYYY = today.getFullYear();
    let currentMM = today.getMonth() + 1;
    let currentDD = today.getDate();

    if (Number(YYYY) < currentYYYY || Number(YYYY) > currentYYYY + 1) {
        throw new ApiError(
            400,
            "Please enter a valid date within the range upto 1 year from today."
        );
    }

    let isDateValid = true;

    if (Number(YYYY) === currentYYYY + 1) {
        if (Number(MM) > currentMM) {
            isDateValid = false;
        } else if (Number(MM) === currentMM) {
            if (Number(DD) > currentDD) {
                isDateValid = false;
            }
        }
    } else {
        if (Number(MM) < currentMM) {
            isDateValid = false;
        } else if (Number(MM) === currentMM) {
            if (Number(DD) < currentDD) {
                isDateValid = false;
            }
        }
    }

    if (!isDateValid) {
        throw new ApiError(
            400,
            "Please enter a valid date within the range upto 1 year from today."
        );
    }
};

const validateAndGetClient = async (userEmail, clientEmail) => {
    try {
        if (userEmail === clientEmail) {
            throw new ApiError(
                400,
                "User and client must be distinct entities. Please ensure you are not adding your email in the client's email field."
            );
        }

        const client = await User.findOne({ email: clientEmail });

        if (!client) {
            throw new ApiError(
                400,
                "Client does not exists. Please ask client to register and then try again."
            );
        }

        return client;
    } catch (err) {
        throw new ApiError(
            err?.statusCode || 500,
            err?.message || "Something went wrong while validating client."
        );
    }
};

const validateDescription = (description) => {
    if (description === undefined) {
        throw new ApiError(400, "Description field is missing.");
    }
};

const validateAmount = (amount) => {
    if (amount === undefined) {
        throw new ApiError(400, "Amount field is missing.");
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
        throw new ApiError(400, "Amount should be a number greater than 0.");
    }
};

const validateExpenseStatus = (status) => {
    if (status === undefined) {
        throw new ApiError(400, "Status field is missing.");
    }

    if (typeof status !== "boolean") {
        throw new ApiError(
            400,
            "Type of status is invalid. Please enter a boolean value and try again."
        );
    }
};

const generateObjectId = (id) => {
    return new mongoose.Types.ObjectId(id);
};

const getAggregationPipeline = (userId, search) => {
    return [
        {
            $match: {
                owner: generateObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "client",
                foreignField: "_id",
                as: "clientInfo",
            },
        },
        {
            $unwind: "$clientInfo", // Unwind to access client information
        },
        {
            $match: {
                $or: [
                    {
                        "clientInfo.name": {
                            $regex: search,
                            $options: "i", // Case-insensitive substring match
                        },
                    },
                    {
                        "clientInfo.email": {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        $expr: {
                            $regexMatch: {
                                input: { $toString: "$_id" },
                                regex: search,
                                options: "i",
                            },
                        },
                    },
                ],
            },
        },
    ];
};

const pushStatusStageInPipeline = (status, pipeline) => {
    status = status.trim();

    if (status !== "paid" && status !== "pending") {
        throw new ApiError(
            400,
            "Please enter a valid status either paid or pending."
        );
    }

    pipeline.push({
        $match: {
            status: status === "paid" ? true : false,
        },
    });
};

const addExpense = asyncHandler(async (req, res, next) => {
    try {
        const { clientEmail, dueDate, description, amount, status } = req.body;

        validate.email({ email: clientEmail, required: true });

        const client = await validateAndGetClient(req?.user.email, clientEmail);

        validateDueDate(dueDate);
        validateDescription(description);
        validateAmount(amount);
        validateExpenseStatus(status);

        const expense = new Expense({
            owner: req?.user,
            client,
            dueDate,
            description: description || "",
            amount,
            status: status || false,
        });

        const createdExpense = await expense.save();

        const fetchedExpense = await Expense.findById(
            createdExpense._id
        ).select("-owner -__v");

        const fetchedClient = await User.findById(
            createdExpense.client._id
        ).select("-avatar -password -createdAt -updatedAt -refreshToken -__v");

        fetchedExpense.client = fetchedClient;

        res.status(200).json(
            new ApiResponse(200, "Expense created successfully.", {
                expense: fetchedExpense,
            })
        );
    } catch (err) {
        return next(
            new ApiError(
                err?.statusCode || 500,
                err?.message || "Something went wrong while adding expense."
            )
        );
    }
});

const updateExpense = asyncHandler(async (req, res, next) => {
    try {
        const { clientEmail, dueDate, description, amount, status } = req.body;
        const { id } = req.params;

        validate.email({ email: clientEmail, required: true });

        await validateAndGetClient(req?.user.email, clientEmail);

        validateDueDate(dueDate);
        validateDescription(description);
        validateAmount(amount);
        validateExpenseStatus(status);

        const filter = { _id: generateObjectId(id.toString()) };
        const update = {
            $set: { dueDate, description, amount, status },
        };

        await Expense.updateOne(filter, update);

        const expense = await Expense.findById(id).select("-owner -__v");

        const fetchedClient = await User.findById(expense.client._id).select(
            "-avatar -password -createdAt -updatedAt -refreshToken -__v"
        );

        expense.client = fetchedClient;

        res.status(200).json(
            new ApiResponse(200, "Expense updated successfully.", {
                expense,
            })
        );
    } catch (err) {
        return next(
            new ApiError(
                err?.statusCode || 500,
                err?.message || "Something went wrong while updating expense."
            )
        );
    }
});

const deleteExpense = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;

        await Expense.deleteOne({
            _id: generateObjectId(id.toString()),
        });

        res.status(201).json(
            new ApiResponse(201, "Expense deleted successfully.", {})
        );
    } catch (err) {
        return next(
            new ApiError(
                err?.statusCode || 500,
                err?.message || "Something went wrong while deleting expense."
            )
        );
    }
});

const getExpense = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;

        const expense = await Expense.findById(id).select("-owner -__v");

        const fetchedClient = await User.findById(expense.client._id).select(
            "-avatar -password -createdAt -updatedAt -refreshToken -__v"
        );

        expense.client = fetchedClient;

        res.status(200).json(
            new ApiResponse(200, "Expense fetched successfully.", {
                expense,
            })
        );
    } catch (err) {
        return next(
            new ApiError(
                err?.statusCode || 500,
                err?.message || "Something went wrong while deleting expense."
            )
        );
    }
});

const getCount = asyncHandler(async (req, res, next) => {
    try {
        let { search, status } = req.query;

        let count = 0;

        const aggregationPipeline = getAggregationPipeline(
            req?.user._id.toString(),
            search || ""
        );

        if (status) {
            pushStatusStageInPipeline(status, aggregationPipeline);
        }

        const searchResult = await Expense.aggregate(aggregationPipeline);
        count = searchResult.length > 0 ? searchResult.length : 0;

        res.status(200).json(
            new ApiResponse(200, "Count fetched successfully.", {
                count,
            })
        );
    } catch (err) {
        return next(
            new ApiError(
                err?.statusCode || 500,
                err?.message ||
                    "Something went wrong while fetching count of expense."
            )
        );
    }
});

const getAllExpenses = asyncHandler(async (req, res, next) => {
    try {
        let { search, status, sort, page, pageSize } = req.query;

        const aggregationPipeline = getAggregationPipeline(
            req?.user._id.toString(),
            search || ""
        );

        if (status) {
            pushStatusStageInPipeline(status, aggregationPipeline);
        }

        if (sort) {
            if (typeof sort !== "string") {
                throw new ApiError(
                    400,
                    "Type of sort is invalid. Please enter a string value and try again."
                );
            }

            sort = sort.trim();

            const sortInput = sort.split(" ");

            let isSortInputValid = true;

            if (sortInput.length != 2) {
                isSortInputValid = false;
            }

            if (
                Expense.schema.path(sortInput[0]) === undefined &&
                (sortInput[1] !== "asc" || sortInput[1] !== "desc")
            ) {
                isSortInputValid = false;
            }

            if (!isSortInputValid) {
                throw new ApiError(
                    400,
                    "Please enter valid value of sort it should contain fieldName asc/desc."
                );
            }

            const fieldName = sortInput[0];

            aggregationPipeline.push({
                $sort: {
                    [fieldName]: sortInput[1] === "asc" ? 1 : -1,
                },
            });
        }

        if (page === undefined) {
            throw new ApiError(400, "Page is missing in payload.");
        }

        if (pageSize === undefined) {
            throw new ApiError(400, "Page size is missing in payload.");
        }

        const pattern = /^(?:1000|[1-9]\d{0,2})$/;

        if (!pattern.test(page) || !pattern.test(pageSize)) {
            throw new ApiError(
                400,
                "Please enter a valid number between 1 - 1000."
            );
        }

        page = Number(page);
        pageSize = Number(pageSize);

        const expenses = await Expense.aggregate(aggregationPipeline)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .exec()
            .then((result) => result)
            .catch((error) => {
                throw error;
            });

        const updatedExpenses = expenses.map((e) => {
            delete e.client;
            delete e.owner;
            delete e.__v;

            const client = {
                _id: e.clientInfo._id,
                name: e.clientInfo.name,
                email: e.clientInfo.email,
                phone: e.clientInfo.phone,
            };

            e.client = client;

            delete e.clientInfo;
            return e;
        });

        res.status(200).json(
            new ApiResponse(200, "Expenses fetched successfully.", {
                expenses: updatedExpenses,
            })
        );
    } catch (err) {
        return next(
            new ApiError(
                err?.statusCode || 500,
                err?.message || "Something went wrong while fetching expenses."
            )
        );
    }
});

export {
    addExpense,
    updateExpense,
    deleteExpense,
    getExpense,
    getCount,
    getAllExpenses,
};
