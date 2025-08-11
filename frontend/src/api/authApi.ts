import httpClient from './httpClient';

export const registerUser = async (userData: any) => {
  const response = await httpClient.post('/auth/register', userData);
  return response.data;
};
