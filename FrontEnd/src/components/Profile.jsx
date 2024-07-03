import { useState } from "react";
import { Button } from "./index.js";
import AuthService from "../services/auth.js";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { logout as sliceLogout } from "../store/authSlice.js";
import { useDispatch } from "react-redux";

function Profile() {
    const authService = new AuthService();
    const dispath = useDispatch();
    const navigate = useNavigate();
    const [isDisabled, setIsDisabled] = useState(false);

    const logout = async () => {
        setIsDisabled(true);
        const response = await authService.logout();
        if (response.success) {
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            dispath(sliceLogout());
            navigate("/");
        }
        setIsDisabled(false);
    };

    return (
        <div className="w-full h-[100svh] flex justify-center items-center text-white">
            <Button
                className="text-sm bg-[#7c5df9] h-[2.5rem] rounded-[0.1875rem] z-[1000] w-40 disabled:opacity-75 disabled:cursor-not-allowed"
                type="button"
                onClick={logout}
                disabled={isDisabled}
            >
                Logout
            </Button>
        </div>
    );
}

export default Profile;
