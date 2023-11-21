import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as playlistsService from "./playlistsService";

const initialState = {
    similar : [],
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ""
};

export const playlistsSlice = createSlice({
    name: "playlists",
    initialState,
    reducers:  { reset: () => initialState },
    extraReducers: builder => builder
    // pending
        .addCase(getSimilar.pending, state => { state.isLoading = true })
    // success
        .addCase(getSimilar.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.similar = action.payload;
        })
    // rejected
        .addCase(getSimilar.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
});
export const { reset } = playlistsSlice.actions;

export const getSimilar = createAsyncThunk("playlist/similar", async (query, thunkAPI) => {
    try {
        console.log(query)
        return await playlistsService.post(`/from`, thunkAPI.getState().auth.user.token, query)
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export default playlistsSlice.reducer;