import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Add this thunk to validate the stored token and get user data
export const validateToken = createAsyncThunk('auth/validateToken', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    if (!auth.token) {
      return rejectWithValue('No token found');
    }
    
    // Make a request to validate the token and get user data
    const response = await axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    
    return { user: response.data.user, token: auth.token };
  } catch (error) {
    // If token is invalid, clear it from localStorage
    localStorage.removeItem('token');
    return rejectWithValue(error.response?.data?.message || 'Token validation failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isLoading: true, // Start with loading true
    error: null
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isLoading = false;
      state.error = null;
      if (token) {
        localStorage.setItem('token', token);
      }
      console.log('Credentials set:', { user, token }); // Debug log
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('token');
      console.log('Logged out'); // Debug log
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoading = false;
        state.error = null;
        console.log('Token validated successfully:', action.payload);
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isLoading = false;
        state.error = action.payload;
        console.log('Token validation failed:', action.payload);
      });
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;
export default authSlice.reducer;