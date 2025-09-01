import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';

interface AuthState {
  accessToken: string | null;
  userName: string | null;
  exp: number | null; // expiration timestamp from JWT
}

const initialToken = localStorage.getItem('access_token');
let decoded: any = null;

if (initialToken) {
  try {
    decoded = jwtDecode(initialToken);
  } catch {}
}

const initialState: AuthState = {
  accessToken: initialToken,
  userName: localStorage.getItem('user_name'),
  exp: decoded?.exp ?? null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ userName: string; accessToken: string }>) {
      const { userName, accessToken } = action.payload;
      const decoded: any = jwtDecode(accessToken);

      state.accessToken = accessToken;
      state.userName = userName;
      state.exp = decoded?.exp ?? null;

      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('user_name', userName);
    },
    clearAuth(state) {
      state.accessToken = null;
      state.userName = null;
      state.exp = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_name');
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;

