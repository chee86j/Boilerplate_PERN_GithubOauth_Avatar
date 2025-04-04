import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Helper function to validate token
const isValidToken = (token) => {
  return Boolean(token) && typeof token === 'string' && token.length > 0;
};

// Async thunk for fetching user data
export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (_, { rejectWithValue, getState }) => {
    const token = getState().auth.token || localStorage.getItem('token');
    
    // If no token, return early without making the API call
    if (!isValidToken(token)) {
      return rejectWithValue('No valid token');
    }

    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      localStorage.removeItem('token'); // Clear invalid token
      return rejectWithValue(
        error.response?.status === 401 ? 'No valid token' :
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch user data'
      );
    }
  },
  {
    // This condition prevents the thunk from running if we don't have a token
    condition: (_, { getState }) => {
      const token = getState().auth.token || localStorage.getItem('token');
      return isValidToken(token);
    }
  }
);

// Async thunk for logging out
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      // Clear token from localStorage
      localStorage.removeItem('token');
      // Dispatch regular logout action
      dispatch(logout());
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear the token and logout on error
      localStorage.removeItem('token');
      dispatch(logout());
      return false;
    }
  }
);

const storedToken = localStorage.getItem('token');
const initialState = {
  user: null,
  token: isValidToken(storedToken) ? storedToken : null,
  isAuthenticated: isValidToken(storedToken),
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      if (isValidToken(token)) {
        state.token = token;
        state.user = user || null;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('token', token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  }
});

export const { setCredentials, logout, clearError } = authSlice.actions;
export default authSlice.reducer;