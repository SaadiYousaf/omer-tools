// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5117/api/auth/login', {
        email,
        password
      });
      
      if (!response.data.token) {
        throw new Error('No token received');
      }
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (err) {
      const errorData = err.response?.data || {
        message: err.message || 'Login failed'
      };
      return rejectWithValue(errorData);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ firstName, lastName, email, password,PhoneNumber }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5117/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
        PhoneNumber
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      // Use the profile endpoint to verify the token
      const response = await axios.get('http://localhost:5117/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // If we get here, the token is valid
      const user = JSON.parse(localStorage.getItem('user'));
      return user;
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue(err.response?.data?.message || 'Token verification failed');
    }
  }
);

// Get initial state from localStorage
const getInitialState = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  return {
    user: user ? JSON.parse(user) : null,
    isAuthenticated: !!token,
    loading: false,
    error: null
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify Token
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;