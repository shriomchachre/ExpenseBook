import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    Route,
    RouterProvider,
    createRoutesFromElements,
} from "react-router-dom";
import Root from "./Root.jsx";
import { Protected } from "./components/index.js";
import HomeScreen from "./pages/HomeScreen.jsx";
import LoginScreen from "./pages/LoginScreen.jsx";
import RegisterScreen from "./pages/RegisterScreen.jsx";
import ProfileScreen from "./pages/ProfileScreen.jsx";
import "./index.css";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root />}>
            <Route
                path=""
                element={
                    <Protected authentication={true}>
                        <HomeScreen />
                    </Protected>
                }
            ></Route>
            <Route
                path="users/login"
                element={
                    <Protected authentication={false}>
                        <LoginScreen />
                    </Protected>
                }
            ></Route>
            <Route
                path="users/register"
                element={
                    <Protected authentication={false}>
                        <RegisterScreen />
                    </Protected>
                }
            ></Route>
            <Route
                path="/profile"
                element={
                    <Protected authentication={true}>
                        <ProfileScreen />
                    </Protected>
                }
            ></Route>
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
