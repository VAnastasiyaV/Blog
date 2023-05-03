import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";

import ArticleService from "../../services/article-service";

let erorrsNumber = 0;

export const getArticles = createAsyncThunk(
    'articles/getArticles',
    async (offset, thunkApi) => {
        try {
            const articles = await ArticleService.getArticles(offset);
            erorrsNumber = 0;
            return articles;
        } catch (error) {
            erorrsNumber++;
            if (erorrsNumber < 6) {
                thunkApi.dispatch(getArticles(offset));
            } else {
                return thunkApi.rejectWithValue();
            }
        }
    }
);

export const getCurrentArticle = createAsyncThunk(
    'articles/getCurrentArticle',
    async (slug, thunkApi) => {
        try {
            const article = await ArticleService.getCurrentArticle(slug);
            erorrsNumber = 0;
            return article;
        } catch (error) {
            erorrsNumber++;
            if (erorrsNumber < 6) {
                thunkApi.dispatch(getCurrentArticle(slug));
            } else {
                const message = error.message || error.toString();
                thunkApi.dispatch(setMessage(message));
            }
        }
    }
);

export const create = createAsyncThunk(
    'article/create',
    async ({ title, description, text, tagsList, token }, thunkApi) => {
        try {
            const data = await ArticleService.createArticle(title, description, text, tagsList, token);
            return { data };
        } catch (error) {
            const message = error.message || error.toString();
            thunkApi.dispatch(setMessage(message));
        }
    }
);

export const getTags = createAsyncThunk(
    'articles/getTags',
    async (thunkApi) => {
        try {
            const tags = await ArticleService.getTags();
            erorrsNumber = 0;
            return tags;
        } catch (error) {
            erorrsNumber++;
            if (erorrsNumber < 6) {
                thunkApi.dispatch(getTags());
            } else {
                const message = error.message || error.toString();
                thunkApi.dispatch(setMessage(message));
            }
        }
    }
);

export const edit = createAsyncThunk(
    'article/edit',
    async ({ title, description, text, tagsList, token, slug }, thunkApi) => {
        try {
            const data = await ArticleService.editArticle(title, description, text, tagsList, token, slug);
            return { data };
        } catch (error) {
            const message = error.message || error.toString();
            thunkApi.dispatch(setMessage(message));
        }
    }
);

const processRes = async (response) => {
    if (response.status >= 200 && response.status < 300) {
        const response1 = await response.json();
        return response1;
    }

    if (response.status === 422) {
        const response1 = await response.json();
        const value = Object.values(response1.errors);
        const errorMessage = `${value[1].code}`;
        throw new Error(errorMessage);
    }
    throw new Error()
}

export const likeArticle = createAsyncThunk(
    'article/like',
    async ({ slug, token }, thunkApi) => {
        try {
            const response = await ArticleService.likeArticle(slug, token);
            return processRes(response);
        } catch (error) {
            const message = error.message || error.toString();
            thunkApi.dispatch(setMessage(message));
        }
    }
);

export const dislikeArticle = createAsyncThunk(
    'article/dislike',
    async ({ slug, token }, thunkApi) => {
        try {
            const response = await ArticleService.dislikeArticle(slug, token);
            return processRes(response);
        } catch (error) {
            const message = error.message || error.toString();
            thunkApi.dispatch(setMessage(message));
        }
    }
);

export const deleteArticle = createAsyncThunk(
    'article/delete',
    async ({ slug, token }, thunkApi) => {
        try {
            const response = await ArticleService.deleteArticle(slug, token);
            if (response.status >= 200 && response.status <= 300) {
                return response.status
            }
            if (response.status === 422) {
                const response1 = await response.json();
                const value = Object.values(response1.errors);
                const errorMessage = `${value[1].code}`;
                throw new Error(errorMessage);
            }
            throw new Error()
        } catch (error) {
            const message = error.message || error.toString();
            thunkApi.dispatch(setMessage(message));
        }
    }
);

const initialState = {
    allArticles: [],
    myArticles: [],
    tags: [],
    currentPage: 1,
    loading: true,
    currentArticle: null,
    error: null
};

const articlesSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
        changePage(state, action) {
            const currentPage = action.payload;
            const offset = (currentPage - 1) * 5;
            state.currentPage = currentPage;
            getArticles(offset);
        }
    },
    extraReducers: (builder) => {
        return (builder.addCase(getArticles.pending, (state, action) => {
            state.loading = true;
        }),
            builder.addCase(getCurrentArticle.pending, (state, action) => {
                state.loading = true;
            }),
            builder.addCase(deleteArticle.pending, (state, action) => {
                state.loading = true;
            }),
            builder.addCase(getArticles.fulfilled, (state, action) => {
                state.allArticles = action.payload.articles;
                state.currentArticle = null;
                state.loading = false;
            }),
            builder.addCase(getCurrentArticle.fulfilled, (state, action) => {
                state.currentArticle = action.payload;
                state.loading = false;
            }),
            builder.addCase(edit.fulfilled, (state, action) => {
                state.currentArticle = action.payload.data;
            }),
            builder.addCase(create.fulfilled, (state, action) => {
                state.myArticles = action.payload.article;
            }),
            builder.addCase(likeArticle.fulfilled, (state, action) => {
                state.currentArticle = action.payload.article;
            }),
            builder.addCase(dislikeArticle.fulfilled, (state, action) => {
                state.currentArticle = action.payload.article;
            }),
            builder.addCase(deleteArticle.fulfilled, (state, action) => {
                state.currentArticle = null;
                state.loading = false;
            }),
            builder.addCase(getArticles.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            }))
    },
});

const { actions, reducer } = articlesSlice;
export const { changePage } = actions;
export default reducer;
