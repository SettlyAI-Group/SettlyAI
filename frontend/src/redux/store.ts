import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import mapSuburbReducer from './mapSuburbSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    mapSuburb: mapSuburbReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
