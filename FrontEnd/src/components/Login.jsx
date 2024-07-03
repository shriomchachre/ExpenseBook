import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.js";
import { useForm } from "react-hook-form";
import { Input, Button } from "./index.js";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { login as sliceLogin } from "../store/authSlice.js";
import conf from "../conf/conf.js";

function Login() {
    const authService = new AuthService();
    const dispath = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const redirectPath = useSelector((state) => state.authReducer.redirectPath);
    const [error, setError] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);

    const login = async (data) => {
        setError("");
        setIsDisabled(true);
        try {
            const response = await authService.login(data);
            if (response.success) {
                const data = response.data;
                dispath(
                    sliceLogin({
                        authStatus: true,
                        currentUser: data.user,
                    })
                );
                Cookies.set("accessToken", data.accessToken, { expires: conf.accessTokenExpiry });
                Cookies.set("refreshToken", data.refreshToken, { expires: conf.refreshTokenExpiry });
                navigate(redirectPath);
            } else {
                setError(response.message);
            }
            setIsDisabled(false);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(login)}>
            <div className="flex flex-col mx-4 items-center justify-center text-white h-[100svh]">
                <div className="max-w-[20rem] w-full">
                    <div className="flex justify-between items-center text-sm my-6 w-full">
                        <p>
                            <span className="font-light">
                                Don't have an account?{" "}
                            </span>
                            <Link to={"/users/register"}>
                                <span className="font-medium">Register</span>
                            </Link>
                        </p>
                    </div>
                    <h1 className="w-full my-8 font-normal text-xl">Login</h1>
                    <div className="mb-6">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Email"
                            className="w-full text-white bg-[#1f213a] px-2 text-sm rounded-[0.1875rem] h-[2.5rem]"
                            {...register("email", { required: true })}
                        />
                    </div>
                    <div className="mb-6">
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Password"
                            className="w-full outline-none text-white bg-[#1f213a] px-2 text-sm rounded-[0.1875rem] h-[2.5rem]"
                            {...register("password", { required: true })}
                        />
                    </div>
                    {error && (
                        <p className="text-xs mb-2" style={{ color: "#c00" }}>
                            {error}
                        </p>
                    )}
                    <Button
                        className="text-sm bg-[#7c5df9] w-full h-[2.5rem] rounded-[0.1875rem] disabled:opacity-75 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isDisabled}
                    >
                        Login
                    </Button>
                </div>
            </div>
        </form>
    );
}

export default Login;
