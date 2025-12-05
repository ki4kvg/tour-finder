import { useGetHotelsQuery } from '@/store/api.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHotels } from '@/store/hotelSlice.ts';
import styles from './HotelList.module.scss';
import Loader from '@/components/Loader/Loader.tsx';
import type { RootState } from '@/store/store.ts';
import HotelCard from '@/components/HotelCard/HotelCard.tsx';
import type { LinkedTour } from '@/types/api.ts';

function HotelList() {
  const { countryId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, isLoading } = useGetHotelsQuery({ countryId: countryId as string }, { skip: !countryId });
  const { hotels } = useSelector((state: RootState) => state.hotels);
  const { prices } = useSelector((state: RootState) => state.searchPrices);

  const linkedTours = useMemo(() => {
    if (!prices || !hotels) return [];
    return hotels.map((hotel) => ({
      ...hotel,
      tour: prices.find((price) => price.hotelID === hotel.id.toString()),
    }));
  }, [prices, hotels]);

  useEffect(() => {
    localStorage.setItem('linkedTour', JSON.stringify(linkedTours));
  }, [linkedTours]);

  useEffect(() => {
    if (!countryId) return;

    if (data) {
      dispatch(setHotels({ hotels: data }));
    }
  }, [data, countryId, dispatch]);

  if (!prices || !hotels) navigate('/');

  return (
    <div className={styles.container}>
      {isLoading && <Loader size={80} />}
      {linkedTours.map((tour) => (
        <HotelCard key={tour.id} hotel={tour as LinkedTour} />
      ))}
    </div>
  );
}

export default HotelList;
