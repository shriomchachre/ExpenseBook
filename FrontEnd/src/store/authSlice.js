import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authStatus: false,
    currentUser: null,
    redirectPath: "/",
};

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        login: (state, actions) => {
            state.authStatus = actions.payload.authStatus;
            state.currentUser = actions.payload.currentUser;
        },
        logout: (state, actions) => {
            state.authStatus = false;
            state.currentUser = null;
            state.redirectPath = "/";
        },
        setRedirectPath: (state, actions) => {
            state.redirectPath = actions.payload.redirectPath;
        },
    },
});

export default authSlice.reducer;
export const { login, logout, setRedirectPath } = authSlice.actions;
