import axios from 'axios';

export const toggleFavourite = async (targetType: string, targetId: number) => {
  const response = await axios.post('/api/favourite/toggle', {
    targetType,
    targetId,
  });

  return response.data; // { isSaved: boolean, ... }
};
