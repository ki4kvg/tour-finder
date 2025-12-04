import styles from './SearchTourForm.module.scss';
import Button from '@/components/Button/Button.tsx';
import IconLabel from '@/components/IconLabel/IconLabel.tsx';
import { useEffect, useMemo, useState } from 'react';
import { CityIcon, HotelIcon } from '@/assets';
import { useGetCountriesQuery, useSearchGeoQuery } from '@/store/api.ts';
import useDebounce from '@/hooks/useDebounce.ts';
import { type Country, type CountryType, type GeoEntity } from '@/types/api.ts';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import DropdownInput from '@/components/Dropdown/DropdownInput.tsx';

const SEARCH_TOUR = {
  SEARCH_VALUE_ID: 'searchValue',
} as const;

const formSchema = z.object({
  [SEARCH_TOUR.SEARCH_VALUE_ID]: z.string().min(1, { message: 'Будь ласка, введіть інформацію для пошуку' }),
});

export function SearchTourForm() {
  const [searchValueType, setSearchValueType] = useState<CountryType | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const searchField = watch(SEARCH_TOUR.SEARCH_VALUE_ID);

  const { data: countries } = useGetCountriesQuery();

  const debouncedValue = useDebounce(searchField, 300);

  const { data: geoSearchData } = useSearchGeoQuery({ query: debouncedValue }, { skip: !debouncedValue });

  const options = useMemo<GeoEntity[] | Country[]>(() => {
    if (!isOpen) return [];

    const countryList = countries ? Object.values(countries) : [];
    const geoList = geoSearchData ? Object.values(geoSearchData) : [];

    if (!debouncedValue || !searchField) return countryList;

    if (searchValueType === 'country') return countryList;

    if (geoList.length > 0 || searchValueType === 'city' || searchValueType === 'hotel') return geoList;

    return countryList;
  }, [isOpen, countries, geoSearchData, debouncedValue, searchField, searchValueType]);

  const handleClickInput = () => {
    setIsOpen(true);
  };

  const handleSelectOption = (option: GeoEntity | Country) => {
    const type = 'type' in option ? option.type : 'country';
    setSearchValueType(type);
    setValue(SEARCH_TOUR.SEARCH_VALUE_ID, option.name);
    setIsOpen(false);
  };

  const handleClear = () => {
    setValue(SEARCH_TOUR.SEARCH_VALUE_ID, '');
  };

  const renderIcon = (item: GeoEntity | Country) => {
    if ('type' in item) {
      if (item.type === 'hotel') return <HotelIcon />;
      if (item.type === 'city') return <CityIcon />;
    }
    return <img src={item.flag} alt="flag" width={24} />;
  };

  const onSubmit = async (form: any) => {
    //TODO In next task
  };

  const onInvalid = (errors: any) => console.error(errors);

  useEffect(() => {
    if (!searchField) {
      setSearchValueType(undefined);
    }
  }, [searchField]);

  return (
    <div className={styles.wrapper}>
      <p>Форма пошуку турів</p>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <DropdownInput
          isShown={isOpen}
          value={searchField}
          handleClear={handleClear}
          onClick={handleClickInput}
          id={SEARCH_TOUR.SEARCH_VALUE_ID}
          {...register(SEARCH_TOUR.SEARCH_VALUE_ID, { required: true })}
          error={!!errors[SEARCH_TOUR.SEARCH_VALUE_ID]}
          helperText={errors[SEARCH_TOUR.SEARCH_VALUE_ID]?.message}
        >
          {options.map((item) => (
            <IconLabel
              key={item.id}
              onClick={() => handleSelectOption(item)}
              icon={renderIcon(item)}
              label={item.name}
            />
          ))}
        </DropdownInput>
        <Button color="primary" type="submit">
          Знайти
        </Button>
      </form>
    </div>
  );
}
