import { createApi } from '@reduxjs/toolkit/query/react';
import {
  getCountries,
  getHotel,
  getHotels,
  getPrice,
  getSearchPrices,
  searchGeo,
  startSearchPrices,
  stopSearchPrices,
} from '../../api';
import type {
  CountriesMap,
  GeoResponse,
  GetSearchPricesResponse,
  Hotel,
  HotelsMap,
  PriceOffer,
  StartSearchResponse,
  StopSearchResponse,
} from '@/types/api.ts';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: () => ({ data: null }),
  endpoints: (builder) => ({
    getCountries: builder.query<CountriesMap, void>({
      queryFn: async () => {
        try {
          const res = await getCountries();
          const data = await res.json();
          return { data };
        } catch (error: any) {
          return { error: { status: error.code, error: error.message } };
        }
      },
    }),

    searchGeo: builder.query<GeoResponse, { query: string }>({
      queryFn: async ({ query }) => {
        try {
          const res = await searchGeo(query);
          const data = await res.json();
          return { data };
        } catch (error: any) {
          return { error: { status: error.code, error: error.message } };
        }
      },
    }),

    startSearchPrices: builder.query<StartSearchResponse, { countryID: string }>({
      queryFn: async ({ countryID }) => {
        try {
          const res = await startSearchPrices(countryID);
          const data = await res.json();
          return { data };
        } catch (error: any) {
          return { error: { status: error.code, error: error.message } };
        }
      },
    }),

    getSearchPrices: builder.query<GetSearchPricesResponse, { token: string }>({
      queryFn: async ({ token }) => {
        try {
          const res = await getSearchPrices(token);
          const data = await res.json();
          return { data };
        } catch (error: any) {
          return { error: { status: error.code, error: error.message } };
        }
      },
    }),

    stopSearchPrices: builder.query<StopSearchResponse, { token: string }>({
      queryFn: async ({ token }) => {
        try {
          const res = await stopSearchPrices(token);
          const data = await res.json();
          return { data };
        } catch (error: any) {
          return { error: { status: error.code, error: error.message } };
        }
      },
    }),

    getHotels: builder.query<HotelsMap, { countryID: string }>({
      queryFn: async ({ countryID }) => {
        try {
          const res = await getHotels(countryID);
          const data = await res.json();
          return { data };
        } catch (err: any) {
          return { error: { status: 'CUSTOM_ERROR', error: err.message } };
        }
      },
    }),

    getHotel: builder.query<Hotel, { hotelID: number | string }>({
      queryFn: async ({ hotelID }) => {
        try {
          const res = await getHotel(hotelID);
          const data = await res.json();
          return { data };
        } catch (err: any) {
          return { error: { status: 'CUSTOM_ERROR', error: err.message } };
        }
      },
    }),

    getPrice: builder.query<PriceOffer, { priceId: string }>({
      queryFn: async ({ priceId }) => {
        try {
          const res = await getPrice(priceId);
          const data = await res.json();
          return { data };
        } catch (err: any) {
          return { error: { status: 'CUSTOM_ERROR', error: err.message } };
        }
      },
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetHotelsQuery,
  useGetHotelQuery,
  useGetPriceQuery,
  useGetSearchPricesQuery,
  useSearchGeoQuery,
  useStartSearchPricesQuery,
  useStopSearchPricesQuery,
} = api;
