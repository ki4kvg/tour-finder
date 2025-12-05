import styles from './SearchTourForm.module.scss';
import Button from '@/components/Button/Button.tsx';
import IconLabel from '@/components/IconLabel/IconLabel.tsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CityIcon, HotelIcon } from '@/assets';
import {
  useGetCountriesQuery,
  useLazyGetSearchPricesQuery,
  useLazyStartSearchPricesQuery,
  useLazyStopSearchPricesQuery,
  useSearchGeoQuery,
} from '@/store/api.ts';
import useDebounce from '@/hooks/useDebounce.ts';
import { type Country, type CountryType, type GeoEntity } from '@/types/api.ts';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import DropdownInput from '@/components/Dropdown/DropdownInput.tsx';
import Loader from '@/components/Loader/Loader.tsx';
import useWaitAndRefetch from '@/hooks/useWaitRefetch.ts';
import { useDispatch, useSelector } from 'react-redux';
import { setError, setPrices } from '@/store/searchPricesSlice.ts';
import type { RootState } from '@/store/store.ts';
import EmptyState from '@/components/EmptyState/EmptyState.tsx';
import { useNavigate } from 'react-router-dom';
import { useLatestRequestGuard } from '@/hooks/useLatestRequest.ts';

const SEARCH_TOUR = {
  SEARCH_VALUE_ID: 'searchValue',
  SELECTED_OBJECT_ID: 'selectedValue',
} as const;

const formSchema = z.object({
  [SEARCH_TOUR.SEARCH_VALUE_ID]: z.string().min(1, 'Будь ласка, введіть інформацію для пошуку'),
  [SEARCH_TOUR.SELECTED_OBJECT_ID]: z
    .object({
      countryId: z.union([z.string(), z.number()]),
    })
    .optional(),
});

export function SearchTourForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useRef<string>('');

  const [searchValueType, setSearchValueType] = useState<CountryType | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const [isPricesLoading, setIsPricesLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [waitUntil, setWaitUntil] = useState<string | null>(null);

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
  const selectedValue = watch(SEARCH_TOUR.SELECTED_OBJECT_ID);
  const debouncedValue = useDebounce(searchField, 300);

  const { data: countries } = useGetCountriesQuery();
  const { data: geoSearchData } = useSearchGeoQuery({ query: debouncedValue }, { skip: !debouncedValue });

  const [startSearchPrice] = useLazyStartSearchPricesQuery();
  const [getSearchPrices] = useLazyGetSearchPricesQuery();
  const [stopSearch] = useLazyStopSearchPricesQuery();

  const { isEmpty, isError } = useSelector((state: RootState) => state.searchPrices);

  const { runWithGuard, invalidate } = useLatestRequestGuard();

  useWaitAndRefetch(
    waitUntil,
    () => dispatch(setError({ error: true })),
    async () => {
      if (!token.current) return;
      try {
        const result = await runWithGuard(async () => {
          return await getSearchPrices({ token: token.current }).unwrap();
        });

        if (!result) return;

        dispatch(
          setPrices({
            prices: result.prices,
          }),
        );
        token.current = '';
        if (Object.keys(result.prices).length === 0) return;
        navigate(`/tours/${selectedValue!.countryId}`);
      } catch (error) {
        console.error('Error fetching prices', error);
      } finally {
        setIsPricesLoading(false);
      }
    },
  );

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
    setValue(SEARCH_TOUR.SELECTED_OBJECT_ID, {
      countryId: type === 'country' ? option.id : option.countryId,
    });
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
    setIsPricesLoading(true);
    if (token.current) {
      setIsCanceling(true);
      try {
        await stopSearch({ token: token.current });
        invalidate();
        token.current = '';
        setWaitUntil(null);
      } finally {
        setIsCanceling(false);
      }
    }
    try {
      const result = await runWithGuard(async () => {
        const countryId = form[SEARCH_TOUR.SELECTED_OBJECT_ID].countryId;
        return await startSearchPrice({ countryId }).unwrap();
      });

      if (!result) return;

      setWaitUntil(result.waitUntil);
      token.current = result.token;
    } catch (error) {
      console.error(error, 'Error starting search');
    }
  };

  const onInvalid = (errors: any) => console.error('onInvalid', errors);

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
        <Button color="primary" type="submit" disabled={isCanceling}>
          Знайти
        </Button>
        {isCanceling && <Loader text="Пошук скасовується" />}

        {!isCanceling && isPricesLoading && <Loader text="Виконується пошук" />}

        {!isCanceling && !isPricesLoading && isError && <p className={styles.error_text}>Помилка пошуку</p>}

        {!isCanceling && !isPricesLoading && !isError && isEmpty && (
          <EmptyState text="За вашим запитом турів не знайдено" />
        )}
      </form>
    </div>
  );
}
