// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password
      });
      
      if (!response.data.token) {
        throw new Error('No token received');
      }
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (err) {
      const errorData = err.response?.data || {
        message: err.message || 'Login failed'
      };
      return rejectWithValue(errorData);
    }
  }
);

export const googleSignIn = createAsyncThunk(
  'auth/googleSignIn',
  async ({ idToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/google-signin`, {
        idToken
      });
      
      if (!response.data.token) {
        throw new Error('No token received');
      }
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (err) {
      const errorData = err.response?.data || {
        message: err.message || 'Google sign-in failed'
      };
      return rejectWithValue(errorData);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ firstName, lastName, email, password,PhoneNumber }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, {
        firstName,
        lastName,
        email,
        password,
        PhoneNumber
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.errors?.[0] || 'Registration failed');
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
      const response = await axios.get(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
       localStorage.setItem('user', JSON.stringify(response.data));
       return response.data;
      // If we get here, the token is valid
      // const user = JSON.parse(localStorage.getItem('user'));
      // return user;
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
       localStorage.removeItem('refreshToken');
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
    token: token || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
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
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
    },
    clearError(state) {
      state.error = null;
    },
     setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        let payload = action.payload;
        if (typeof payload === 'object') {
          // Flatten into readable string
          state.error = payload.message 
            || payload.error 
            || (Array.isArray(payload.errors) ? payload.errors.join(', ') : JSON.stringify(payload));
        } else {
          state.error = payload;
        }
      })
      .addCase(googleSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.loading = false;
        let payload = action.payload;
        if (typeof payload === 'object') {
          state.error = payload.message 
            || payload.error 
            || (Array.isArray(payload.errors) ? payload.errors.join(', ') : JSON.stringify(payload));
        } else {
          state.error = payload;
        }
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
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