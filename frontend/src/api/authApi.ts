import httpClient from './httpClient';
import type { IUser } from '@/interfaces/user';

export const registerUser = async (userData: IUser) => {
  const response = await httpClient.post('/auth/register', userData);
  return response.data;
};
