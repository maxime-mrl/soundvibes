import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import recommendationsService from "./recommendationsService";

const initialState = {
    recommendations: [],
    topListened: [],
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
        .addCase(getRecommendations.pending, state => { state.isLoading = true })
    // success
        .addCase(getRecommendations.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.recommendations = action.payload;
        })
    // rejected
        .addCase(getRecommendations.rejected, (state, action) => {
            state.recommendations = [];
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
});
export const { reset, statusReset } = recommendationsSlice.actions;

export const getRecommendations = createAsyncThunk("playlist/recommendations", async (_, thunkAPI) => {
    try {
        return await recommendationsService.get(`/recommendations`, thunkAPI.getState().auth.user.token);
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export default recommendationsSlice.reducer;