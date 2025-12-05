import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Hotel, type HotelsMap } from '@/types/api';

interface HotelsState {
  hotels: Hotel[];
}

const initialState: HotelsState = {
  hotels: [],
};

const hotelsSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setHotels(state, action: PayloadAction<{ hotels: HotelsMap }>) {
      state.hotels = Object.values(action.payload.hotels).map((hotel) => ({
        id: hotel.id,
        name: hotel.name,
        img: hotel.img,
        cityId: hotel.cityId,
        cityName: hotel.cityName,
        countryId: hotel.countryId,
        countryName: hotel.countryName,
      }));
    },
  },
});

export const { setHotels } = hotelsSlice.actions;
export default hotelsSlice.reducer;
