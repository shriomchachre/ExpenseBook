import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.js";
import { useForm } from "react-hook-form";
import { Input, Button } from "./index.js";

function Register() {
    const authService = new AuthService();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);

    const signup = async (data, e) => {
        setError("");
        setSuccess("");
        setIsDisabled(true);
        try {
            const response = await authService.register(data);
            if (response.success) setSuccess(response.message);
            else setError(response.message);
            e.target.reset();
            setIsDisabled(false);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(signup)}>
            <div className="flex flex-col mx-4 items-center justify-center text-white h-[100svh]">
                <div className="max-w-[20rem] w-full">
                    <div className="flex justify-between items-center text-sm my-6 w-full">
                        <p>
                            <span className="font-light">
                                Already have an account?{" "}
                            </span>
                            <Link to={"/users/login"}>
                                <span className="font-medium">Login</span>
                            </Link>
                        </p>
                    </div>
                    <h1 className="w-full my-8 font-normal text-xl">
                        Register
                    </h1>

                    <div className="mb-6">
                        <Input
                            label="Name"
                            type="text"
                            placeholder="Name"
                            className="w-full text-white bg-[#1f213a] px-2 text-sm rounded-[0.1875rem] h-[2.5rem]"
                            {...register("name", { required: true })}
                        />
                    </div>
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
                            label="Phone"
                            type="text"
                            placeholder="Phone"
                            className="w-full text-white bg-[#1f213a] px-2 text-sm rounded-[0.1875rem] h-[2.5rem]"
                            {...register("phone", { required: true })}
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
                    {success && (
                        <p
                            className="text-xs mb-2"
                            style={{ color: "rgb(22 163 74)" }}
                        >
                            {success}
                        </p>
                    )}
                    <Button
                        className="text-sm bg-[#7c5df9] w-full h-[2.5rem] rounded-[0.1875rem] disabled:opacity-75 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isDisabled}
                    >
                        Register
                    </Button>
                </div>
            </div>
        </form>
    );
}

export default Register;
