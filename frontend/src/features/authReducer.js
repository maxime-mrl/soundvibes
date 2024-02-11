import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import RequestServices from "./RequestServices";
const authService = new RequestServices("api/users");

const user = JSON.parse(localStorage.getItem("user"))

const initialState = {
    user: user ? user : null,
    history: [],
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
            // always keep the user
        },
        statusReset: state => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = false;
                state.message = "";
        },
    },
    extraReducers: builder => builder
    /* -------------------------------- SPECIFIC -------------------------------- */
    // success
        .addCase(register.fulfilled, (state, action) => { state.message = `Welcome ${action.payload.username}!` })
        .addCase(login.fulfilled, (state, action) => { state.message = `Welcome back ${action.payload.username}!` })
        .addCase(updateProfile.fulfilled, state => { state.message = "Account successfully updated!" })
        .addCase(setRight.fulfilled, (state, action) => { state.message = action.payload.status })
        
        .addCase(getHistory.fulfilled, (state, action) => { state.history = action.payload })
        .addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.message = "successfully signed out!";
        })
        .addCase(expiredToken.fulfilled, (state) => {
            state.user = null;
            state.isError = true;
            state.message = "Session expired, please login back.";
        })
        .addCase(infos.fulfilled, (state, action) => {
            state.user = {
                ...state.user,
                ...action.payload
            };
        })
        .addCase(deleteAccount.fulfilled, (state) => {
            localStorage.removeItem("user");
            state.user = null;
            state.message = "Successfully deleted account";
        })
    /* --------------------------------- GENERAL -------------------------------- */
    // pending
        .addMatcher(isAnyOf(
            register.pending,
            login.pending,
            infos.pending,
            getHistory.pending,
            updateProfile.pending,
            setRight.pending,
            deleteAccount.pending
        ), state => { state.isLoading = true; })
    // success
        .addMatcher(isAnyOf(
            logout.fulfilled,
            register.fulfilled,
            login.fulfilled,
            updateProfile.fulfilled,
            infos.fulfilled,
            getHistory.fulfilled,
            setRight.fulfilled,
            deleteAccount.fulfilled
        ), state => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
        })
        .addMatcher(isAnyOf(
            register.fulfilled,
            login.fulfilled,
            updateProfile.fulfilled
        ), (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        })
    // rejected
        .addMatcher(isAnyOf(
            register.rejected,
            login.rejected,
            updateProfile.rejected,
            infos.rejected,
            getHistory.rejected,
            setRight.rejected,
            deleteAccount.rejected
        ), (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
});
export const { reset, statusReset } = authSlice.actions;

/* --------------------------- CREATE NEW ACCOUNT --------------------------- */
export const register = createAsyncThunk("auth/register", async (user, thunkAPI) => {
    try {
        return await authService.post("/register", false, user);
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
})

/* ---------------------------------- LOGIN --------------------------------- */
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
    try {
        return await authService.post("/login", false, user);
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
})

/* ----------------------------- GET USER INFOS ----------------------------- */
export const infos = createAsyncThunk("auth/infos", async(_, thunkAPI) => {
    try {
        return await authService.get("/me", thunkAPI.getState().auth.user.token);
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
})

/* -------------------------- GET LISTENING HISTORY ------------------------- */
export const getHistory = createAsyncThunk("auth/history", async(_, thunkAPI) => {
    try {
        return await authService.get("/history", thunkAPI.getState().auth.user.token);
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
})

/* --------------------------- UPDATE USER PROFILE -------------------------- */
export const updateProfile = createAsyncThunk("auth/update", async(userData, thunkAPI) => {
    try {
        return await authService.put("/update", thunkAPI.getState().auth.user.token, userData);
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
})

/* ------------------------ SET RIGHT OF ANOTHER USER ----------------------- */
export const setRight = createAsyncThunk("auth/right", async(data, thunkAPI) => {
    try {
        return await authService.put("/setright", thunkAPI.getState().auth.user.token, data);
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
})

/* ----------------------------- DELETE ACCOUNT ----------------------------- */
export const deleteAccount = createAsyncThunk("auth/delete", async(data, thunkAPI) => {
    try {
        return await authService.del("/delete", thunkAPI.getState().auth.user.token, data);
    } catch (err) {
        return thunkAPI.rejectWithValue(parseError(err));
    }
})

/* --------------------------------- LOGOUT --------------------------------- */
export const logout = createAsyncThunk("auth/logout", async () => localStorage.removeItem('user'));
export const expiredToken = createAsyncThunk("auth/expiredToken", async () => localStorage.removeItem('user'));

function parseError(err) {
    if (err.response && err.response.data.error) return err.response.data.error;
    if (err.message) return err.message;
    else return err.toString();
}

export default authSlice.reducer;
