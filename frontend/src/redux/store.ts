import { configureStore } from '@reduxjs/toolkit';
import exploreReducer from '@/store/slices/exploreSlice';
import chatBotReducer from '@/store/slices/chatBotSlice';
import searchSuggestionReducer from '@/store/slices/searchSuggestSlice';

export const store = configureStore({
  reducer: {
    explore: exploreReducer,
    chatBot: chatBotReducer,
    searchSuggest: searchSuggestionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
