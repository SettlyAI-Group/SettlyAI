import httpClient from './httpClient';
import type { SuggestionOutputDto } from '@/interfaces/searchSuggestion';
import type { AxiosRequestConfig } from 'axios';

export const searchSuggestion = async (q: string, config?: AxiosRequestConfig): Promise<SuggestionOutputDto[]> => {
  const query = q.trim();
  const response = await httpClient.get<SuggestionOutputDto[]>('./search/suggest', {
    ...config,
    params: { ...(config?.params ?? {}), q: query },
  });
  return response.data ?? [];
};
