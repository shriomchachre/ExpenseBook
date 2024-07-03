import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    expense: null,
};

const expenseSlice = createSlice({
    name: "expenseSlice",
    initialState,
    reducers: {
        setExpense: (state, actions) => {
            state.expense = actions.payload.expense;
        },
    },
});

export default expenseSlice.reducer;
export const { setExpense } = expenseSlice.actions;
