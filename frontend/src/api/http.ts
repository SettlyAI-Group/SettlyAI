import axios from 'axios';
import { store } from '@/redux/store';
import type { RootState } from '@/redux/store';
export const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
});
http.interceptors.request.use(config => {
  const state = store.getState() as RootState;
  const token: string | undefined = state?.auth?.token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
http.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.log('Unauthorized, redirecting to login...');
    }
    return Promise.reject(error);
  }
);
