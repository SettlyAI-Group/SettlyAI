import httpClient from './httpClient';
import type { IUser, ILoginUser } from '@/interfaces/user';

export const registerUser = async (userData: IUser) => {
  const response = await httpClient.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (userData: ILoginUser) => {
  const response = await httpClient.post('/auth/login', userData);
  return response.data;
};
