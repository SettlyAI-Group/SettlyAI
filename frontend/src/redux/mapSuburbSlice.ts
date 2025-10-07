import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import type { IApiSuburbData, IMapSuburbState } from '@/interfaces/map';

const initialState: IMapSuburbState = {
  overview: null,
};

export const mapSuburbSlice = createSlice({
  name: 'mapSuburb',
  initialState,
  reducers: {
    setSelectedSuburb(state, action: PayloadAction<IApiSuburbData>) {
      state.overview = action.payload;
    },
    clearSelectedSuburb(state) {
      state.overview = null;
    },
  },
});

export const { setSelectedSuburb, clearSelectedSuburb } = mapSuburbSlice.actions;
export const selectMapSuburb = (state: RootState) => state.mapSuburb;
export const selectSelectedOverview = (state: RootState): IApiSuburbData | null => state.mapSuburb.overview;
export default mapSuburbSlice.reducer;
