import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import RequestServices from "./RequestServices";
const playlistsService = new RequestServices("api/playlists");

const initialState = {
    playlists: [],
    playlist: null,
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ""
};

export const playlistsSlice = createSlice({
    name: "playlists",
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
        .addCase(getPlaylist.fulfilled, (state, action) => { state.playlist = action.payload })
        .addCase(getOwn.fulfilled, (state, action) => { state.playlists = action.payload })
        .addCase(newPlaylist.fulfilled, (state, action) => {
            state.playlists = [
                ...state.playlists,
                action.payload
            ];
            state.message = `Successfully created playlist "${action.payload.name}!`;
        })
        .addCase(updatePlaylist.fulfilled, (state, action) => {
            state.playlists = state.playlists.map(playlist => action.payload._id === playlist._id ? action.payload : playlist);
            if (state.playlist && state.playlist._id === action.payload._id) state.playlist = action.payload;
            state.message = `Successfully updated playlist "${action.payload.name}!`;
        })
        .addCase(deletePlaylist.fulfilled, (state, action) => {
            state.playlists = state.playlists.filter(playlist => action.payload._id !== playlist._id);
            if (state.playlist && state.playlist._id === action.payload._id) state.playlist = false;
            state.message = `Successfully deleted playlist!`;
        })
    // rejected
        .addCase(getPlaylist.rejected, state => { state.playlist = false })
    /* --------------------------------- GENERAL -------------------------------- */
    // pending
        .addMatcher(isAnyOf(
            getPlaylist.pending,
            getOwn.pending,
            newPlaylist.pending,
            updatePlaylist.pending,
            deletePlaylist.pending
        ), state => { state.isLoading = true; })
    // success
        .addMatcher(isAnyOf(
            getPlaylist.fulfilled,
            getOwn.fulfilled,
            newPlaylist.fulfilled,
            updatePlaylist.fulfilled,
            deletePlaylist.fulfilled
        ), state => {
            state.isLoading = false;
            state.isSuccess = true;
        })
    // rejected
        .addMatcher(isAnyOf(
            getPlaylist.rejected,
            getOwn.rejected,
            newPlaylist.rejected,
            updatePlaylist.rejected,
            deletePlaylist.rejected
        ), (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
});
export const { reset, statusReset } = playlistsSlice.actions;

/* -------------------------- GET A PLAYLIST BY ID -------------------------- */
export const getPlaylist = createAsyncThunk("playlist/get", async (id, thunkAPI) => {
    try {
        return await playlistsService.get(`/get/${id}`, thunkAPI.getState().auth.user.token);
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
});

/* ------------------------ GET EVERY PLAYLIST OWNED ------------------------ */
export const getOwn = createAsyncThunk("playlist/own", async (_, thunkAPI) => {
    try {
        return await playlistsService.get(`/getown`, thunkAPI.getState().auth.user.token);
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
});

/* -------------------------- CREATE A NEW PLAYLIST ------------------------- */
export const newPlaylist = createAsyncThunk("playlist/new", async (query, thunkAPI) => {
    try {
        return await playlistsService.post(`/create`, thunkAPI.getState().auth.user.token, query);
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
});

/* ---------------------------- UPDATE A PLAYLIST --------------------------- */
export const updatePlaylist = createAsyncThunk("playlist/update", async (query, thunkAPI) => {
    try {
        return await playlistsService.put(`/update/${query.id}`, thunkAPI.getState().auth.user.token, query);
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
});

/* ---------------------------- DELETE A PLAYLIST --------------------------- */
export const deletePlaylist = createAsyncThunk("playlist/delete", async (id, thunkAPI) => {
    try {
        return await playlistsService.del(`/delete/${id}`, thunkAPI.getState().auth.user.token);
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
});

function parseError(err) {
    if (err.response && err.response.data.error) return err.response.data.error;
    if (err.message) return err.message;
    else return err.toString();
}

export default playlistsSlice.reducer;
