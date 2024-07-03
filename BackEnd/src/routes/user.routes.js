import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/user.middleware.js";
import {
    register,
    login,
    logout,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAvatar,
    updateAccountDetails,
    deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/register").post(upload.single("avatar"), register);

router.route("/login").post(login);

router.route("/logout").get(verifyJWT, logout);

router.route("/refresh-access-token").get(refreshAccessToken);

router
    .route("/profile")
    .get(verifyJWT, getCurrentUser)
    .put(verifyJWT, updateAccountDetails)
    .delete(verifyJWT, deleteUser);

router
    .route("/profile/avatar")
    .put(upload.single("avatar"), verifyJWT, updateAvatar);

router.route("/profile/password").put(verifyJWT, changeCurrentPassword);

export default router;
