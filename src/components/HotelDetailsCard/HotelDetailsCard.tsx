import styles from './HotelDetailsCard.module.scss';
import type { Hotel, PriceOffer } from '@/types/api.ts';
import IconLabel from '@/components/IconLabel/IconLabel.tsx';
import { formatPrice } from '@/helpers/formatPrice.ts';
import Button from '@/components/Button/Button.tsx';
import { CityIcon, MarkerIcon, PointIcon } from '@/assets';
import { replaceSeparator } from '@/helpers/replaceSeparator.ts';
import { formatDate } from '@/helpers/formatDate.ts';

type Props = {
  hotel: Hotel;
  priceOffer: PriceOffer;
};

function HotelDetailsCard(props: Props) {
  const { hotel, priceOffer } = props;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>{hotel.name}</h2>
        <div className={styles.location}>
          <IconLabel label={hotel.countryName} icon={<MarkerIcon />} />
          <IconLabel label={hotel.cityName} icon={<CityIcon />} />
        </div>
        <img src={hotel.img} alt="Hotel" />
      </div>

      <div className={styles.description}>
        <h3>Опис</h3>
        <p>{hotel.description}</p>
      </div>
      <div className={styles.services}>
        <h3>Сервіси</h3>
        {hotel.services && (
          <div className={styles.services_list}>
            {Object.entries(hotel.services).map(
              ([key, value]) =>
                value === 'yes' && <IconLabel key={key} label={replaceSeparator(key, '_')} icon={<PointIcon />} />,
            )}
          </div>
        )}
      </div>
      <div className={styles.footer}>
        <p>{formatDate(priceOffer.startDate)}</p>
        <div className={styles.price}>
          <h2>{`${formatPrice(priceOffer.amount)} ${priceOffer.currency.toUpperCase()}`}</h2>
          <Button color={'secondary'}>Відкрити ціну</Button>
        </div>
      </div>
    </div>
  );
}

export default HotelDetailsCard;
