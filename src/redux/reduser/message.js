import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message1: "",
};

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setMessage: (state, action) => {
            return { message1: action.payload };
        },
        clearMessage: () => {
            return { message1: "" };
        },
    },
});

const { reducer, actions } = messageSlice;

export const { setMessage, clearMessage } = actions;
export default reducer;