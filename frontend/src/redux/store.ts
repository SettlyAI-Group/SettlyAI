import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import mapSuburbReducer from './mapSuburbSlice';
import authReducer from './authSlice';

// Redux persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
};

const rootReducer = combineReducers({
  counter: counterReducer,
  mapSuburb: mapSuburbReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
