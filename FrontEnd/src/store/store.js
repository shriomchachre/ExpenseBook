import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import toolsReducer from "./toolsSlice.js";
import expenseReducer from "./expenseSlice.js";

const rootReducer = combineReducers({
    authReducer,
    toolsReducer,
    expenseReducer,
});

export const store = configureStore({
    reducer: rootReducer,
});
