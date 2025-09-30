import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import mapSuburbReducer from './mapSuburbSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    mapSuburb: mapSuburbReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
