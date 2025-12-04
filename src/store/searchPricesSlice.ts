import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type PriceOffer, type PricesMap } from '@/types/api';

interface SearchPricesState {
  prices?: PriceOffer[];
  isEmpty: boolean;
  isError: boolean;
}

const initialState: SearchPricesState = {
  prices: undefined,
  isEmpty: false,
  isError: false,
};

const searchPricesSlice = createSlice({
  name: 'searchPrices',
  initialState,
  reducers: {
    setPrices(state, action: PayloadAction<{ prices: PricesMap }>) {
      const prices = Object.values(action.payload.prices).map((price) => ({
        id: price.id,
        amount: price.amount,
        currency: price.currency,
        startDate: price.startDate,
        endDate: price.endDate,
        hotelID: price.hotelID?.toString(),
      }));
      state.prices = prices;
      state.isEmpty = prices.length === 0;
    },
    clearPrices(state) {
      state.prices = [];
      state.isEmpty = true;
      state.isError = false;
    },
    setError(state, action: PayloadAction<{ error: boolean }>) {
      state.isError = action.payload.error;
    },
  },
});

export const { setPrices, clearPrices, setError } = searchPricesSlice.actions;
export default searchPricesSlice.reducer;
