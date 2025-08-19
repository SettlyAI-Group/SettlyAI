import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import exploreReducer from '../store/slices/exploreSlice';
import chatBotReducer from '../store/slices/chatBotSlice';
import searchSuggestionReducer from '../store/slices/searchSuggestSlice';

export const store = configureStore({
  reducer: {
    explore: exploreReducer,
    chatBot: chatBotReducer,
    searchSuggest: searchSuggestionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
