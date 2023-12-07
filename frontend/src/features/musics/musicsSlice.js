import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as musicsService from "./musicsService";

const initialState = {
    musics : [],
    infos: [],
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ""
};

export const musicsSlice = createSlice({
    name: "musics",
    initialState,
    reducers:  {
        reset: () => initialState,
        statusReset: state => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
    } },
    extraReducers: builder => builder
    // pending
        .addCase(searchMusics.pending, state => { state.isLoading = true })
        .addCase(getMusic.pending, state => { state.isLoading = true })
        .addCase(addMusic.pending, state => { state.isLoading = true })
        .addCase(deleteSong.pending, state => { state.isLoading = true })
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
        .addCase(addMusic.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.status;
        })
        .addCase(deleteSong.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.status;
            state.musics = state.musics.filter(music => action.payload._id !== music._id);
            if (state.musics.length === 0) state.musics = ["No musics found"]
        })
    // rejected
        .addCase(searchMusics.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getMusic.rejected, (state, action) => {
            state.isLoading = false;
            state.infos = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(addMusic.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(deleteSong.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
});
export const { reset, statusReset } = musicsSlice.actions;

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

export const addMusic = createAsyncThunk("musics/add", async (music, thunkAPI) => {
    try {
        return await musicsService.post(`/add/`, thunkAPI.getState().auth.user.token, music)
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export const deleteSong = createAsyncThunk("musics/delete", async (id, thunkAPI) => {
    try {
        return await musicsService.del(`/delete/${id}`, thunkAPI.getState().auth.user.token)
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export default musicsSlice.reducer;