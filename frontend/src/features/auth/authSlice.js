import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "./authService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
    user: user ? user : null,
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ""
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:  {
        reset: state => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        }
    },
    extraReducers: builder => builder
    // pending
        .addCase(register.pending, state => { state.isLoading = true })
        .addCase(login.pending, state => { state.isLoading = true })
        .addCase(infos.pending, state => { state.isLoading = true })
        .addCase(updateProfile.pending, state => { state.isLoading = true })
    // success
        .addCase(logout.fulfilled, (state) => { state.user = null })
        .addCase(register.fulfilled, (state, action) => {
            localStorage.setItem("user", JSON.stringify(action.payload));
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        })
        .addCase(login.fulfilled, (state, action) => {
            localStorage.setItem("user", JSON.stringify(action.payload));
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        })
        .addCase(updateProfile.fulfilled, (state, action) => {
            localStorage.setItem("user", JSON.stringify(action.payload));
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        })
        .addCase(infos.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = {
                ...state.user,
                ...action.payload
            };
        })
    // rejected
        .addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            state.user = null;
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            state.user = null;
        })
        .addCase(updateProfile.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(infos.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
});
export const { reset } = authSlice.actions;

export const register = createAsyncThunk("auth/register", async (user, thunkAPI) => {
    try {
        return await authService.post("/register", user);
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
    try {
        return await authService.post("/login", user);
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export const infos = createAsyncThunk("auth/infos", async(thunkAPI) => {
    try {
        if (!user || !user.token) throw new Error("User not found!")
        return await authService.get("/me", user.token);
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export const updateProfile = createAsyncThunk("auth/update", async(userData, thunkAPI) => {
    try {
        if (!user || !user.token) throw new Error("User not found!")
        return await authService.put("/update", user.token, userData);
    } catch (err) {
        if (err.response && err.response.data.error) return thunkAPI.rejectWithValue(err.response.data.error);
        else if (err.message) return thunkAPI.rejectWithValue(err.message);
        else return thunkAPI.rejectWithValue(err.toString());
    }
})

export const logout = createAsyncThunk("auth/logout", async (thunkAPI) => localStorage.removeItem('user'));

export default authSlice.reducer;