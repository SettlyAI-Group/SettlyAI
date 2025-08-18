import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SuggestionOutputDto } from '@/interfaces/searchSuggestion';
import { searchSuggestion } from '@/api/searchSuggestApi';

export const fetchSuggestion = createAsyncThunk<SuggestionOutputDto[], string>(
  'searchSuggest/fetch',
  async (q, thunkAPI) => {
    if (q.trim().length < 3) return [];
    const data = await searchSuggestion(q, { signal: thunkAPI.signal });
    return data;
  }
);

interface SuggestionState {
  suggestions: SuggestionOutputDto[];
  loading: boolean;
  error: string | null;
}

const initialState: SuggestionState = {
  suggestions: [],
  loading: false,
  error: null,
};

const suggestionSlice = createSlice({
  name: 'searchSuggest',
  initialState,
  reducers: {
    clearSuggestions(state) {
      state.suggestions = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSuggestion.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuggestion.fulfilled, (state, action: PayloadAction<SuggestionOutputDto[]>) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchSuggestion.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Error fetching suggestions';
      });
  },
});

export const { clearSuggestions } = suggestionSlice.actions;
export default suggestionSlice.reducer;
