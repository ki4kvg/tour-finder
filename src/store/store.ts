import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/store/api.ts';
import searchPricesReducer from './searchPricesSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    searchPrices: searchPricesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
