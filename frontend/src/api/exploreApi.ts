import httpClient from './httpClient';

// Get/api/search?q={query}
export const exploreSuburbs = async (query: string): Promise<any> => {
  const response = await httpClient.get('./search', { params: { q: query } });
  return response.data;
};
