import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/auth.service";

// Get user from local storage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null,
    student: null, // Nueva propiedad para almacenar la información del estudiante
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    ROLE: user ? user?.usuario?.rol : null,
};

// Register user
export const register = createAsyncThunk(
    'auth/register', 
    async (user, thunkAPI) => {
        try {
            return await authService.register(user);
        } catch (error) {
            const message = 
            (error.response && 
                error.response.data && 
                error.response.data.msg) || 
                error.message || 
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Login user
export const login = createAsyncThunk(
    'auth/login',
    async (user, thunkAPI) => {
        try {
            return await authService.login(user);
        } catch (error) {
            const message =
            (error.response && 
                error.response.data && 
                error.response.data.msg) ||
                error.message || 
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout();
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
            state.ROLE = null;
            state.student = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.ROLE = action.payload.usuario.rol;
                if (action.payload.usuario.rol === 'STUDENT_ROLE') {
                    state.student = action.payload.estudiante || null;
                }
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.ROLE = null;
                state.student = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.ROLE = action.payload.usuario.rol;
                if (action.payload.usuario.rol === 'STUDENT_ROLE') {
                    state.student = action.payload.estudiante || null;
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.ROLE = null;
                state.student = null;
            })
            .addCase(logout.pending, (state) => {
                state.user = null;
                state.student = null;
            });
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
