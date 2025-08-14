import { configureStore } from '@reduxjs/toolkit';
import exploreReducer from '@/store/slices/exploreSlice';

export const store = configureStore({
  reducer: {
    explore: exploreReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
