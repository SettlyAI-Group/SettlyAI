import { configureStore } from "@reduxjs/toolkit";
import suburbReducer from './slices/suburbSlice'

export const store = configureStore({
    reducer:{
        suburb: suburbReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;