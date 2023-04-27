import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";

import AuthService from "../../services/auth-service";

const user = JSON.parse(localStorage.getItem("user"));

export const signUp = createAsyncThunk(
    'auth/signUp',
    async ({ name, email, password }, thunkApi) => {
        try {
            const response = await AuthService.signUp(name, email, password);
            // thunkApi.dispatch(setMessage(response.user.username));
            return response.user;
        } catch (error) {
            const message = error.message || error.toString();
            thunkApi.dispatch(setMessage(message));
            return thunkApi.rejectWithValue();
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, thunkApi) => {
        try {
            const data = await AuthService.login(email, password);
            return { user: data };
        } catch (error) {
            const message = error.message || error.toString();
            thunkApi.dispatch(setMessage(message));
            return thunkApi.rejectWithValue();
        }
    }
);

export const update = createAsyncThunk(
    'auth/update',
    async ({ token, name, email, password, image }, thunkApi) => {
        try {
            const response = await AuthService.update(token, name, email, password, image);
            return response.user;
        } catch (error) {
            const message = error.message || error.toString();
            thunkApi.dispatch(setMessage(message));
            // return thunkApi.rejectWithValue();
        }
    }
);

export const getUser = createAsyncThunk(
    'auth/getUser',
    async (token, thunkApi) => {
        try {
            const response = await AuthService.getCurrentUser(token);
            return response;
        } catch (error) {
            const message = error.message || error.toString();
            thunkApi.dispatch(setMessage(message));
            return thunkApi.rejectWithValue();
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async () => {
    AuthService.logout();
});

const initialState = user
    ? { isLoggedIn: true, user, currentUser: null }
    : { isLoggedIn: false, user: null, currentUser: null };

const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers: (builder) => {
        return (builder.addCase(signUp.fulfilled, (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload;
        }),
            builder.addCase(signUp.rejected, (state, action) => {
                state.isLoggedIn = false;
            }),
            builder.addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.user = action.payload.user;
            }),
            builder.addCase(login.rejected, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
            }),
            builder.addCase(getUser.fulfilled, (state, action) => {
                state.currentUser = action.payload;
            }),
            builder.addCase(getUser.rejected, (state, action) => {
                state.currentUser = null;
            }),
            builder.addCase(update.fulfilled, (state, action) => {
                state.user = action.payload;
            }),
            builder.addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
            }))
    },
});

const { reducer } = authSlice;
export default reducer;
