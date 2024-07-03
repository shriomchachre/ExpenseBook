import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import conf from "../conf/conf.js";
import { useSelector, useDispatch } from "react-redux";
import { logout, setRedirectPath } from "../store/authSlice.js";
import { Loader } from "./index.js";
import Cookies from "js-cookie";

function Protected({ children, authentication = true }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const authStatus = useSelector((state) => state.authReducer.authStatus);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        const route = location.pathname;
        const accessToken = Cookies.get("accessToken");

        if (!accessToken) {
            dispatch(logout());
        }

        if (authentication) {
            if (!authStatus && !accessToken) {
                dispatch(setRedirectPath({ redirectPath: route }));
                navigate(conf.loginRoute);
            }
        }

        if (
            (authStatus || accessToken) &&
            (route === conf.loginRoute || route === conf.registerRoute)
        ) {
            navigate("/");
        }

        setLoading(false);
    }, [navigate, authStatus]);

    return loading ? (
        <div
            className="w-full absolute left-0"
            style={{ top: "calc(50svh - 12.5px)" }}
        >
            <Loader />
        </div>
    ) : (
        <>{children}</>
    );
}

export default Protected;
