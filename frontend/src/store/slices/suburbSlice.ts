import { getSuburbReport } from '@/api/suburbApi';
import type { ISuburbReport } from '@/interfaces/suburbReport';
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';


interface SuburbState {
  suburbId: number | null;
  report: ISuburbReport | null;
  loading: boolean;
  error: string | null;
}

const initialState: SuburbState = {
  suburbId: null,
  report: null,
  loading: false,
  error: null,
};

export const fetchSuburbReport = createAsyncThunk<ISuburbReport, number>(
  'suburb/fetchReport',
  async (suburbId, thunkAPI) => {
    try {
      return await getSuburbReport(suburbId);
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);
const suburbSlice = createSlice({
  name: 'suburb',
  initialState,
  reducers: {
    setSuburbId(state, action: PayloadAction<number>) {
      state.suburbId = action.payload;
      localStorage.setItem('suburbId', action.payload.toString());
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSuburbReport.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuburbReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchSuburbReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error';
      });
  },
});

export const { setSuburbId } = suburbSlice.actions;
export default suburbSlice.reducer;


