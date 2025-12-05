import styles from './TourDetails.module.scss';
import Loader from '@/components/Loader/Loader.tsx';
import { useLocation, useParams } from 'react-router-dom';
import { useGetHotelQuery, useGetPriceQuery } from '@/store/api.ts';
import HotelDetailsCard from '@/components/HotelDetailsCard/HotelDetailsCard.tsx';

function TourDetails() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const priceId = params.get('priceId');

  const { hotelId } = useParams();

  const { data: hotelData, isLoading: isHotelLoading } = useGetHotelQuery(
    { hotelId: Number(hotelId) },
    { skip: !hotelId },
  );
  const { data: priceData, isLoading: isPriceOfferLoading } = useGetPriceQuery(
    { priceId: priceId! },
    { skip: !priceId },
  );

  if (isHotelLoading || isPriceOfferLoading || !hotelData || !priceData) return <Loader size={80} />;

  return (
    <div className={styles.container}>
      {isHotelLoading || (isPriceOfferLoading && <Loader size={80} />)}
      <HotelDetailsCard hotel={hotelData} priceOffer={priceData} />
    </div>
  );
}

export default TourDetails;
