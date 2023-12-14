import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import RequestServices from "./RequestServices";
const recommendationsService = new RequestServices("api/recommendations");

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
    /* -------------------------------- SPECIFIC -------------------------------- */
    // success
        .addCase(getSimilar.fulfilled, (state, action) => { state.similar = action.payload })
        .addCase(getRecommendations.fulfilled, (state, action) => { state.recommendations = action.payload })
        .addCase(getTrending.fulfilled, (state, action) => { state.topListened = action.payload })
    // rejected
        .addCase(getSimilar.rejected, state => { state.similar = [] })
        .addCase(getRecommendations.rejected, state => { state.recommendations = [] })
        .addCase(getTrending.rejected, state => { state.topListened = [] })
    /* --------------------------------- GENERAL -------------------------------- */
    // pending
        .addMatcher(isAnyOf(
            getSimilar.pending,
            getRecommendations.pending,
            getTrending.pending
        ), state => { state.isLoading = true; })
    // success
        .addMatcher(isAnyOf(
            getSimilar.fulfilled,
            getRecommendations.fulfilled,
            getTrending.fulfilled
        ), state => {
            state.isLoading = false;
            state.isSuccess = true;
        })
    // rejected
        .addMatcher(isAnyOf(
            getSimilar.rejected,
            getRecommendations.rejected,
            getTrending.rejected
        ), (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
});
export const { reset, statusReset } = recommendationsSlice.actions;

/* ----------------- GET SIMILAR MUSIC BASED ON A TAG/ARTIST ---------------- */
export const getSimilar = createAsyncThunk("recommendations/similar", async (query, thunkAPI) => {
    try {
        return await recommendationsService.post(`/from`, thunkAPI.getState().auth.user.token, query);
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
});

/* ------------------- GET RECOMMENDATION BASED ON HISTORY ------------------ */
export const getRecommendations = createAsyncThunk("/recommendations/own", async (_, thunkAPI) => {
    try {
        return await recommendationsService.get(`/own`, thunkAPI.getState().auth.user.token);
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
});

/* -------------------------- GET TRENDINGS MUSICS -------------------------- */
export const getTrending = createAsyncThunk("/recommendations/trending", async (_, thunkAPI) => {
    try {
        return await recommendationsService.get(`/trending`, thunkAPI.getState().auth.user.token);
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
});

function parseError(err) {
    if (err.response && err.response.data.error) return err.response.data.error;
    if (err.message) return err.message;
    else return err.toString();
}

export default recommendationsSlice.reducer;
