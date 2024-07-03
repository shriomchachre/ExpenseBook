import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const verifyJWT = async (req, _, next) => {
    try {
        const accessToken =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!accessToken) {
            return next(new ApiError(401, "Unauthorized request."));
        }

        const decodedAccessToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        const fetchedUser = await User.findById(decodedAccessToken?._id).select(
            "-password -refreshToken"
        );

        if (!fetchedUser) {
            return next(new ApiError(401, "Unauthorized request."));
        }

        req.user = fetchedUser;
        next();
    } catch (err) {
        return next(
            new ApiError(
                err?.statusCode || 401,
                err?.message || "Unauthorized request."
            )
        );
    }
};

export { verifyJWT };
