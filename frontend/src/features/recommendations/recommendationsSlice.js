import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import recommendationsService from "./recommendationsService";

const initialState = {
    recommendations: [],
    topListened: [],
    similar: [],
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ""
};

export const recommendationsSlice = createSlice({
    name: "recommendations",
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
        .addCase(getSimilar.pending, state => { state.isLoading = true })
        .addCase(getRecommendations.pending, state => { state.isLoading = true })
        .addCase(getTrending.pending, state => { state.isLoading = true })
    // success
        .addCase(getSimilar.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.similar = action.payload;
        })
        .addCase(getRecommendations.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.recommendations = action.payload;
        })
        .addCase(getTrending.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.topListened = action.payload;
        })
    // rejected
        .addCase(getSimilar.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getRecommendations.rejected, (state, action) => {
            state.recommendations = [];
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getTrending.rejected, (state, action) => {
            state.topListened = [];
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
});
export const { reset, statusReset } = recommendationsSlice.actions;

export const getSimilar = createAsyncThunk("recommendations/similar", async (query, thunkAPI) => {
    try {
        return await recommendationsService.post(`/from`, thunkAPI.getState().auth.user.token, query);
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export const getRecommendations = createAsyncThunk("/recommendations/own", async (_, thunkAPI) => {
    try {
        return await recommendationsService.get(`/own`, thunkAPI.getState().auth.user.token);
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export const getTrending = createAsyncThunk("/recommendations/trending", async (_, thunkAPI) => {
    try {
        return await recommendationsService.get(`/trending`, thunkAPI.getState().auth.user.token);
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export default recommendationsSlice.reducer;