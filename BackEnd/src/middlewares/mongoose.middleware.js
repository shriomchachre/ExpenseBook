import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

const verifyMongooseId = async (req, _, next) => {
    const { id } = req.params;
    try {
        new mongoose.Types.ObjectId(id.toString());
        next();
    } catch (err) {
        return next(new ApiError(404, "Not found."));
    }
};

export { verifyMongooseId };
