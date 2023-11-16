import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as musicsService from "./musicsService";

const initialState = {
    musics : [],
    infos: [], // maybe
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ""
};

export const musicsSlice = createSlice({
    name: "musics",
    initialState,
    reducers:  { reset: () => initialState },
    extraReducers: builder => builder
    // pending
        .addCase(searchMusics.pending, state => { state.isLoading = true })
        .addCase(getMusic.pending, state => { state.isLoading = true })
    // success
        .addCase(searchMusics.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.musics = action.payload;
        })
        .addCase(getMusic.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.infos = action.payload;
        })
    // rejected
        .addCase(searchMusics.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getMusic.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
});
export const { reset } = musicsSlice.actions;

export const searchMusics = createAsyncThunk("musics/search", async (query, thunkAPI) => {
    try {
        return await musicsService.get(`/search/${query}`, thunkAPI.getState().auth.user.token)
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export const getMusic = createAsyncThunk("musics/get", async (query, thunkAPI) => {
    try {
        return await musicsService.get(`/get/${query}`, thunkAPI.getState().auth.user.token)
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export default musicsSlice.reducer;