import httpClient from './httpClient';
import type { IUser, IVerifyEmailRequest } from '@/interfaces/user';

export const registerUser = async (userData: IUser) => {
  const response = await httpClient.post('/auth/register', userData);
  return response.data;
};

export const verifyEmail = async (data: IVerifyEmailRequest) => {
  const response = await httpClient.post('/auth/activate', data);
  return response.data;
};

export const sendVerificationCode = async (
  userId: number,
  verificationType: number
) => {
  const response = await httpClient.post('/auth/send-verification-code', {
    userId,
    verificationType,
  });
  return response.data;
};
