import { useGetHotelsQuery } from '@/store/api.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHotels } from '@/store/hotelSlice.ts';
import styles from './ToursList.module.scss';
import Loader from '@/components/Loader/Loader.tsx';
import type { RootState } from '@/store/store.ts';
import HotelCard from '@/components/HotelCard/HotelCard.tsx';
import type { LinkedTour } from '@/types/api.ts';

function ToursList() {
  const { countryId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, isLoading } = useGetHotelsQuery({ countryId: countryId as string }, { skip: !countryId });
  const { hotels } = useSelector((state: RootState) => state.hotels);
  const { prices } = useSelector((state: RootState) => state.searchPrices);

  const linkedTours = useMemo(() => {
    if (!prices || !hotels) return [];

    return hotels
      .map((hotel) => ({
        ...hotel,
        tour: prices.find((price) => price.hotelID === hotel.id.toString()) || null,
      }))
      .sort((a, b) => {
        const priceA = a.tour?.amount ?? Infinity;
        const priceB = b.tour?.amount ?? Infinity;
        return priceA - priceB;
      });
  }, [prices, hotels]);

  useEffect(() => {
    if (!countryId) return;

    if (data) {
      dispatch(setHotels({ hotels: data }));
    }
  }, [data, countryId, dispatch]);

  useEffect(() => {
    if (isLoading) return;
    if (!data || prices?.length === 0) {
      navigate('/');
    }
  }, [isLoading, prices?.length, data]);

  return (
    <div className={styles.container}>
      {isLoading && !linkedTours && <Loader size={80} />}
      {linkedTours.map((tour) => (
        <HotelCard key={tour.id} hotel={tour as LinkedTour} />
      ))}
    </div>
  );
}

export default ToursList;
