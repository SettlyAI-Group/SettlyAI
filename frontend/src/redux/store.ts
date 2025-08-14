import { configureStore } from '@reduxjs/toolkit';
import exploreReducer from '@/store/slices/exploreSlice';
import chatBotReducer from '@/store/slices/chatBotSlice';

export const store = configureStore({
  reducer: {
    explore: exploreReducer,
    chatBot: chatBotReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
