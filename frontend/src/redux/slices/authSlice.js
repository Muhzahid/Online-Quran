import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token') || null;

const initialState = {
  user: null,
  token,
  isAuthenticated: Boolean(token),
  isLoading: Boolean(token),
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      if (token) {
        localStorage.setItem('token', token);
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, setUser, setLoading, setError, logout } =
  authSlice.actions;
export default authSlice.reducer;
