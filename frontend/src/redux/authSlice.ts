import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { http } from '@/api/http';

export interface User {
  id: number;
  name: string;
  email: string;
}

type Status = 'unknown' | 'authenticated' | 'guest';

interface AuthState {
  status: Status;
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: User;
  token?: string;
}

const initialState: AuthState = {
  status: 'unknown',
  isAuthenticated: false,
  isLoading: false,
};

export const checkAuthStatus = createAsyncThunk('auth/check', async () => {
  const { data } = await http.get('/auth/me');
  return data as { user?: User; token?: string };
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; token?: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.status = 'authenticated';
    },
    logout(state) {
      state.user = undefined;
      state.token = undefined;
      state.isAuthenticated = false;
      state.status = 'guest';
    },
  },
  extraReducers(builder) {
    builder
      .addCase(checkAuthStatus.pending, s => {
        s.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (s, a) => {
        s.isLoading = false;
        if (a.payload?.user) {
          s.user = a.payload.user;
          s.token = a.payload.token;
          s.isAuthenticated = true;
          s.status = 'authenticated';
        } else {
          s.user = undefined;
          s.token = undefined;
          s.isAuthenticated = false;
          s.status = 'guest';
        }
      })
      .addCase(checkAuthStatus.rejected, s => {
        s.isLoading = false;
        s.user = undefined;
        s.token = undefined;
        s.isAuthenticated = false;
        s.status = 'guest';
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
