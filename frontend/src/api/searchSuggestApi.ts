import httpClient from './httpClient';
import type { SuggestionOutputDto } from '@/interfaces/searchSuggestion';
import type { AxiosRequestConfig } from 'axios';

export const searchSuggestion = async (q: string, config?: AxiosRequestConfig): Promise<SuggestionOutputDto[]> => {
  const query = q.trim();
  const url = './search/suggest';
  const params = { ...(config?.params ?? {}), q: query };
  const options: AxiosRequestConfig = { ...config, params };

  const { data } = await httpClient.get<SuggestionOutputDto[]>(url, options);
  return data ?? [];
};
