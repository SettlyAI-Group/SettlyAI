import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ExploreState {
  query: string;
}

const initialState: ExploreState = {
  query: '',
};

const exploreSlice = createSlice({
  name: 'explore',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
  },
});

export const { setQuery } = exploreSlice.actions;
export default exploreSlice.reducer;
