import type { SuggestionList } from '@/interfaces/searchSuggestion';

export const SUGGESTION_STORAGE_KEY = 'settly:selectedSuggestion';
export type StoredSuggestion = { label: string; option: SuggestionList };

export function readSelectedSuggestion(): StoredSuggestion | null {
  const rawData = localStorage.getItem(SUGGESTION_STORAGE_KEY);
  if (!rawData) return null;
  try {
    return JSON.parse(rawData) as StoredSuggestion;
  } catch {
    return null;
  }
}
