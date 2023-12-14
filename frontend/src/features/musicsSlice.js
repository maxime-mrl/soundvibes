import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import RequestServices from "./RequestServices";
const musicsService = new RequestServices("api/musics");

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
    /* -------------------------------- SPECIFIC -------------------------------- */
    // success
        .addCase(searchMusics.fulfilled, (state, action) => { state.musics = action.payload })
        .addCase(getMusic.fulfilled, (state, action) => { state.infos = action.payload })
        .addCase(addMusic.fulfilled, (state, action) => { state.message = action.payload.status })
        .addCase(deleteSong.fulfilled, (state, action) => {
            state.message = action.payload.status;
            state.musics = state.musics.filter(music => action.payload._id !== music._id);
            if (state.musics.length === 0) state.musics = ["No musics found"]
        })
    // rejected
        .addCase(getMusic.rejected, state => { state.infos = false })
    /* --------------------------------- GENERAL -------------------------------- */
    // pending
        .addMatcher(isAnyOf(
            searchMusics.pending,
            getMusic.pending,
            addMusic.pending,
            deleteSong.pending
        ), state => { state.isLoading = true; })
    // success
        .addMatcher(isAnyOf(
            searchMusics.fulfilled,
            getMusic.fulfilled,
            addMusic.fulfilled,
            deleteSong.fulfilled
        ), state => {
            state.isLoading = false;
            state.isSuccess = true;
        })
    // rejected
        .addMatcher(isAnyOf(
            searchMusics.rejected,
            getMusic.rejected,
            addMusic.rejected,
            deleteSong.rejected
        ), (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
});
export const { reset, statusReset } = musicsSlice.actions;

/* ------------------------------ SEARCH A SONG ----------------------------- */
export const searchMusics = createAsyncThunk("musics/search", async (query, thunkAPI) => {
    try {
        return await musicsService.get(`/search/${query}`, thunkAPI.getState().auth.user.token)
    } catch (err) {
        console.log("erruer")
        return thunkAPI.rejectWithValue(parseError(err));
    }
});

/* ----------------------------- GET SONG INFOS ----------------------------- */
export const getMusic = createAsyncThunk("musics/get", async (query, thunkAPI) => {
    try {
        return await musicsService.get(`/get/${query}`, thunkAPI.getState().auth.user.token)
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
});

/* ------------------------------ ADD NEW SONG ------------------------------ */
export const addMusic = createAsyncThunk("musics/add", async (music, thunkAPI) => {
    try {
        return await musicsService.post(`/add/`, thunkAPI.getState().auth.user.token, music)
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
});

/* ------------------------------- DELETE SONG ------------------------------ */
export const deleteSong = createAsyncThunk("musics/delete", async (id, thunkAPI) => {
    try {
        return await musicsService.del(`/delete/${id}`, thunkAPI.getState().auth.user.token)
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
});

function parseError(err) {
    if (err.response && err.response.data.error) return err.response.data.error;
    if (err.message) return err.message;
    else return err.toString();
}

export default musicsSlice.reducer;
