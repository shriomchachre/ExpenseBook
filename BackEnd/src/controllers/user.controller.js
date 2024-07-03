import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";
import validate from "../utils/validateForm.js";

const cookieOptions = {
    path: "/",
    httpOnly: true,
    secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 5,
    maxAge: 1000 * 60 * 60 * 24 * 5,
};

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save();

        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(
            err?.statusCode || 500,
            err?.message || "Something went wrong while generating tokens."
        );
    }
};

const refreshAccessToken = asyncHandler(async (req, res, next) => {
    try {
        const refreshTokenOfUser =
            req.cookies?.refreshToken || req.body?.refreshToken;

        if (!refreshTokenOfUser) {
            throw new ApiError(401, "Unauthorized request.");
        }

        const decodedRefreshToken = jwt.verify(
            refreshTokenOfUser,
            process.env.REFRESH_TOKEN_SECRET
        );

        const fetchedUser = await User.findById(decodedRefreshToken?._id);

        if (!fetchedUser) {
            throw new ApiError(401, "Unauthorized request.");
        }

        const fetchedRefreshToken = fetchedUser?.refreshToken;

        if (refreshTokenOfUser !== fetchedRefreshToken) {
            throw new ApiError(401, "Unauthorized request.");
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(fetchedUser._id);

        res.status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(200, "Access token refreshed.", {
                    accessToken,
                    refreshToken,
                })
            );
    } catch (err) {
        // handeling async error in express
        return next(
            new ApiError(
                err?.statusCode || 500,
                err?.message ||
                    "Something went wrong while refreshing access token."
            )
        );
    }
});

const register = asyncHandler(async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;

        validate.name({ name, required: true });
        validate.email({ email, required: true });
        validate.phone({ phone, required: true });
        validate.password({ password, required: true });

        const fetchedUser = await User.findOne({ email });

        if (fetchedUser) {
            throw new ApiError(409, "User already exists.");
        }

        const avatarLocalPath = req.file?.path;
        const avatar = await uploadOnCloudinary(avatarLocalPath);

        const user = new User({
            name,
            email,
            phone,
            password,
            avatar: avatar || "",
        });

        await user.save();

        // removing email, phone, password, and refreshToken
        const createdUser = await User.findById(user._id).select(
            "-email -phone -password -refreshToken -__v"
        );

        return res.status(201).json(
            new ApiResponse(201, "Registration successful.", {
                user: createdUser,
            })
        );
    } catch (err) {
        return next(
            new ApiError(
                err?.statusCode || 500,
                err?.message ||
                    "Uh-oh! We couldn't create your account right now. Please double-check your information and try again."
            )
        );
    }
});

const login = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        validate.email({ email, required: true });
        validate.password({ password, required: true });

        const fetchedUser = await User.findOne({ email });

        if (!fetchedUser) {
            throw new ApiError(404, "User not found, please register.");
        }

        const isPasswordValid = await fetchedUser.isPasswordCorrect(password);

        if (!isPasswordValid) {
            throw new ApiError(
                400,
                "The email and/or password you specified are not correct."
            );
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(fetchedUser._id);

        const loggedInUser = await User.findById(fetchedUser._id).select(
            "-email -phone -password -refreshToken -__v"
        );

        res.status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(200, "User loggedin successfully.", {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                })
            );
    } catch (err) {
        return next(
            new ApiError(
                err?.statusCode || 500,
                err?.message ||
                    "Oops! Something went wrong while trying to log in. Please check your credentials and try again."
            )
        );
    }
});

const logout = asyncHandler(async (req, res, next) => {
    try {
        const filter = { _id: req.user._id };
        const update = { $set: { refreshToken: null } };

        await User.updateOne(filter, update);

        res.status(200)
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .json(new ApiResponse(200, "User logged out.", {}));
    } catch (err) {
        return next(
            new ApiError(
                err?.statusCode || 500,
                err?.message ||
                    "Sorry, we couldn't log you out at the moment. Please try again later."
            )
        );
    }
});

const getCurrentUser = async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, "Current user fetched successfully.", {
            user: req.user,
        })
    );
};

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
    try {
        const { password, newPassword } = req.body;

        validate.password({ password, required: true });
        validate.password({
            password: newPassword,
            required: true,
            isNewPassword: true,
        });

        const user = await User.findById(req.user._id);
        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            throw new ApiError(400, "Old password is not correct.");
        }

        user.password = newPassword;

        await user.save();

        res.status(200).json(
            new ApiResponse(200, "Password updated successfully.", {})
        );
    } catch (err) {
        return next(
            new ApiError(
                err?.statusCode || 500,
                err?.message ||
                    "We couldn't change your password at the moment. Please ensure your current password is correct and try again."
            )
        );
    }
});

const updateAccountDetails = asyncHandler(async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;

        if (name === undefined || email === undefined || phone === undefined) {
            throw new ApiError(
                400,
                "The full-name, email and/or phone number are missing. Please ensure all fields are present and try again."
            );
        }

        validate.name({ name, required: false });
        validate.email({ email, required: false });
        validate.phone({ phone, required: false });

        if (
            req?.user.name === name &&
            req?.user.email === email &&
            req?.user.email === phone
        ) {
            res.status(200).json(
                new ApiResponse(
                    200,
                    "Account details updated successfully.",
                    req?.user
                )
            );
        }

        const fetchedUser = await User.findById(req?.user._id);

        if (name !== "") fetchedUser.name = name;
        if (email !== "") fetchedUser.email = email;
        if (phone !== "") fetchedUser.phone = phone;

        await fetchedUser.save();

        const updatedUser = await User.findById(req?.user._id).select(
            "-password -refreshToken -__v"
        );

        res.status(200).json(
            new ApiResponse(200, "Account details updated successfully.", {
                user: updatedUser,
            })
        );
    } catch (err) {
        return next(
            new ApiError(
                err?.statusCode || 500,
                err?.message ||
                    "Oops! Something went wrong while updating account details. Please try again later."
            )
        );
    }
});

const updateAvatar = asyncHandler(async (req, res, next) => {
    try {
        const avatarLocalPath = req.file.path;
        const avatar = await uploadOnCloudinary(avatarLocalPath);

        const user = await User.findById(req?.user._id);
        const prevAvatar = user.avatar;

        user.avatar = avatar;

        await user.save();

        if (prevAvatar !== "") await deleteFromCloudinary(prevAvatar);

        res.status(200).json(
            new ApiResponse(200, "Avatar updated successfully.", {})
        );
    } catch (err) {
        return next(
            new ApiError(
                err?.statusCode || 500,
                err?.message ||
                    "Oops! Something went wrong while updating your avatar. Please try again later."
            )
        );
    }
});

const deleteUser = asyncHandler(async (req, res, next) => {
    try {
        const { email } = req.body;

        validate.email({ email, required: true });

        if (email !== req?.user.email) {
            throw new ApiError(
                400,
                "Entered email does not belongs to this account."
            );
        }

        await User.deleteOne({ _id: req?.user._id });

        await deleteFromCloudinary(req?.user.avatar);

        res.status(200).json(
            new ApiResponse(200, "Account deleted successfully.", {})
        );
    } catch (err) {
        return next(
            new ApiError(
                err?.statusCode || 500,
                err?.message ||
                    "Oops! Something went wrong while deleting account. Please try again later."
            )
        );
    }
});

export {
    register,
    login,
    logout,
    refreshAccessToken,
    getCurrentUser,
    changeCurrentPassword,
    updateAvatar,
    deleteUser,
    updateAccountDetails,
};
