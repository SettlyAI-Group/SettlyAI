import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface MapSuburbState {
  suburb: string | null;
  state: string | null;
  postcode: string | null;
}

const initialState: MapSuburbState = {
  suburb: null,
  state: null,
  postcode: null,
};

export const mapSuburbSlice = createSlice({
  name: 'mapSuburb',
  initialState,
  reducers: {
    setSelectedSuburb(state, action: PayloadAction<{ suburb: string; state: string; postcode: string }>) {
      state.suburb = action.payload.suburb;
      state.state = action.payload.state;
      state.postcode = action.payload.postcode;
    },
    clearSelectedSuburb(state) {
      state.suburb = null;
      state.state = null;
      state.postcode = null;
    },
  },
});

export const { setSelectedSuburb, clearSelectedSuburb } = mapSuburbSlice.actions;
export default mapSuburbSlice.reducer;
