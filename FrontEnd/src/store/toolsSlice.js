import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    search: "",
    filterBy: "all",
    sortBy: "asc",
    isAddEditPopupOpen: false,
    reload: false,
};

const toolsSlice = createSlice({
    name: "toolsSlice",
    initialState,
    reducers: {
        search: (state, actions) => {
            state.search = actions.payload.search;
        },
        filterBy: (state, actions) => {
            state.filterBy = actions.payload.filterBy;
        },
        sortBy: (state, actions) => {
            state.sortBy = actions.payload.sortBy;
        },
        setIsAddEditPopupOpen: (state, actions) => {
            state.isAddEditPopupOpen = actions.payload.isAddEditPopupOpen;
        },
        setReload: (state, actions) => {
            state.reload = actions.payload.reload;
        },
    },
});

export default toolsSlice.reducer;
export const { search, filterBy, sortBy, setIsAddEditPopupOpen, setReload } =
    toolsSlice.actions;
