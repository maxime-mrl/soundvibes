import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as playlistsService from "./playlistsService";

const initialState = {
    playlists: [],
    playlist: null,
    similar: [],
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
    // pending
        .addCase(getSimilar.pending, state => { state.isLoading = true })
        .addCase(getPlaylist.pending, state => { state.isLoading = true })
        .addCase(getOwn.pending, state => { state.isLoading = true })
        .addCase(newPlaylist.pending, state => { state.isLoading = true })
        .addCase(updatePlaylist.pending, state => { state.isLoading = true })
    // success
        .addCase(getSimilar.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.similar = action.payload;
        })
        .addCase(getPlaylist.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.playlist = action.payload;
        })
        .addCase(getOwn.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.playlists = action.payload;
        })
        .addCase(newPlaylist.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.playlists = [
                ...state.playlists,
                action.payload
            ];
            state.message = `Successfully created playlist "${action.payload.name}!`;
        })
        .addCase(updatePlaylist.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.playlists = state.playlists.map(playlist => action.payload._id === playlist._id ? action.payload : playlist)
            state.message = `Successfully updated playlist "${action.payload.name}!`;
        })
    // rejected
        .addCase(getSimilar.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getPlaylist.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getOwn.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(newPlaylist.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(updatePlaylist.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
});
export const { reset, statusReset } = playlistsSlice.actions;

export const getSimilar = createAsyncThunk("playlist/similar", async (query, thunkAPI) => {
    try {
        return await playlistsService.post(`/from`, thunkAPI.getState().auth.user.token, query);
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export const getPlaylist = createAsyncThunk("playlist/get", async (id, thunkAPI) => {
    try {
        return await playlistsService.get(`/get/${id}`, thunkAPI.getState().auth.user.token);
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export const getOwn = createAsyncThunk("playlist/own", async (_, thunkAPI) => {
    try {
        return await playlistsService.get(`/getown`, thunkAPI.getState().auth.user.token);
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export const newPlaylist = createAsyncThunk("playlist/new", async (query, thunkAPI) => {
    try {
        return await playlistsService.post(`/create`, thunkAPI.getState().auth.user.token, query);
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export const updatePlaylist = createAsyncThunk("playlist/update", async (query, thunkAPI) => {
    try {
        return await playlistsService.put(`/update/${query.id}`, thunkAPI.getState().auth.user.token, query);
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export default playlistsSlice.reducer;