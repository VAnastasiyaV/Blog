import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";

import AuthService from "../../services/auth-service";

const user = JSON.parse(localStorage.getItem("user"));

export const signUp = createAsyncThunk(
    'auth/signUp',
    async ({ name, email, password }, thunkApi) => {
        try {
            const response = await AuthService.signUp(name, email, password);
            // if (!!response.user) {
            //     return response.user;
            // };
            // if (!!response.errors) {
            return response;
            // }
        } catch (error) {
            const message = error.message || error.toString();
            throw new Error(message);
            // console.log(error.message)
            // thunkApi.dispatch(setMessage(message));
            // return thunkApi.rejectWithValue();
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, thunkApi) => {
        try {
            const data = await AuthService.login(email, password);
            // if (!!response.user) {
            //     return response.user;
            // };
            // if (!!data.errors) {
            //     return data;
            // }
            // return { user: data };
            return data;
        } catch (error) {
            const message = error.message || error.toString();
            throw new Error(message);
            // thunkApi.dispatch(setMessage(message));
            // return thunkApi.rejectWithValue();
        }
    }
);

export const update = createAsyncThunk(
    'auth/update',
    async ({ token, name, email, password, image }, thunkApi) => {
        try {
            const response = await AuthService.update(token, name, email, password, image);
            return response;
        } catch (error) {
            const message = error.message || error.toString();
            throw new Error(message);
            // thunkApi.dispatch(setMessage(message));
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
    ? { isLoggedIn: true, user, currentUser: null, userErrors: null, loading: false }
    : { isLoggedIn: false, user: null, currentUser: null, userErrors: null, loading: false };

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetUserError(state, action) {
            state.userErrors = null;
        }
    },
    extraReducers: (builder) => {
        return (
            builder.addCase(login.pending, (state, action) => {
                state.loading = true;
            }),
            builder.addCase(signUp.fulfilled, (state, action) => {
                if (!!action.payload.errors) {
                    state.isLoggedIn = false;
                    state.userErrors = action.payload.errors;
                } else {
                    state.isLoggedIn = true;
                    state.user = action.payload.user;
                    state.userErrors = null;
                };

            }),
            // builder.addCase(signUp.rejected, (state, action) => {
            //     state.isLoggedIn = false;
            // }),
            builder.addCase(login.fulfilled, (state, action) => {
                if (!!action.payload.errors) {
                    state.isLoggedIn = false;
                    state.loading = false;
                    state.userErrors = action.payload.errors;
                    state.user = null;
                } else {
                    state.loading = false;
                    state.isLoggedIn = true;
                    state.user = action.payload.user;
                    state.userErrors = null;
                };
            }),
            // builder.addCase(login.rejected, (state, action) => {
            //     state.isLoggedIn = false;
            //     state.user = null;
            // }),
            builder.addCase(getUser.fulfilled, (state, action) => {
                state.currentUser = action.payload;
            }),
            builder.addCase(getUser.rejected, (state, action) => {
                state.currentUser = null;
            }),
            builder.addCase(update.fulfilled, (state, action) => {
                if (!!action.payload.errors) {
                    state.userErrors = action.payload.errors;
                } else {
                    state.user = action.payload.user;
                    state.userErrors = null;
                };
            }),
            builder.addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
            }))
    },
});

const { actions, reducer } = authSlice;
export const { resetUserError } = actions;
export default reducer;
