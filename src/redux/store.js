import { configureStore } from '@reduxjs/toolkit';
import articleReducer from './reduser/article';
import authReducer from "./reduser/auth";
import messageReducer from "./reduser/message";

const store = configureStore({
    reducer: {
        articles: articleReducer,
        auth: authReducer,
        message: messageReducer,
    },
});

export default store;