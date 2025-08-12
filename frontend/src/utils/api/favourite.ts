import axios from 'axios';
type TargetType = 'suburb' | 'property';
type FavouriteStatus = { isSaved: boolean; favouriteId?: number };
//await for JWT to be completed
const authHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
// const getUserId = () => {
//   const raw = localStorage.getItem('userId');
//   return raw ? Number(raw) : undefined;
// };
// axios.get('/api/favourite/single', {
//   params: { targetType, targetId, userId: getUserId() },
// });
// axios.post(
//   '/api/favourite/toggle',
//   { targetType, targetId },
//   { params: { userId: getUserId() } }
// );
export const getFavouriteByTarget = async (
  targetType: TargetType,
  targetId: number
): Promise<FavouriteStatus> => {
  // const userId = getUserId();
  const { data } = await axios.get<FavouriteStatus>('/api/favourite/single', {
    params: { targetType, targetId },
    headers: { ...authHeaders() },
  });
  return data;
};
export const toggleFavourite = async (
  targetType: TargetType,
  targetId: number
): Promise<FavouriteStatus> => {
  // const userId = getUserId();
  const { data } = await axios.post<FavouriteStatus>(
    '/api/favourite/toggle',
    { targetType, targetId },
    {
      // params: { userId: TEST_USER_ID },
      headers: { ...authHeaders() },
    }
  );
  return data;
};
