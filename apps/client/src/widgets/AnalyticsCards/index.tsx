import { Skeleton } from '@mui/material';
import { AppColors, PropertyTypes } from '~/shared/constants/enums';
import { PropertyType, SalesAnalyticsResponse } from '~/shared/models/gql/graphql';
import AnalyticsCardsItem from './AnalyticsCardsItem';

interface Props {
  data?: SalesAnalyticsResponse;
  prevData?: SalesAnalyticsResponse;
  propertyType: PropertyType;
}

export default function AnalyticsCards({ data, prevData, propertyType }: Props) {
  return data ? (
    <div className='cardsWrapper'>
      <AnalyticsCardsItem
        title='Количество'
        value={data.amount || 0}
        prevValue={prevData?.amount || undefined}
        color={AppColors[Object.keys(PropertyTypes).findIndex((item) => item === propertyType)]}
        icon={<img src={`/icons/dashboard/${propertyType}.svg`} alt='home' />}
      />
      <AnalyticsCardsItem
        title='Общая площадь'
        unit='м²'
        floatNumbers={0}
        value={data.area || 0}
        prevValue={prevData?.area || undefined}
        color={AppColors[3]}
        icon={<img src='/icons/dashboard/totalArea.svg' alt='totalArea' />}
      />
      <AnalyticsCardsItem
        title='Средняя площадь'
        unit='м²'
        floatNumbers={2}
        value={(data.area || 0) / (data.amount || 1)}
        prevValue={prevData ? (prevData.area || 0) / (prevData.amount || 1) : undefined}
        color={AppColors[4]}
        icon={<img src='/icons/dashboard/area.svg' alt='area' />}
      />
      <AnalyticsCardsItem
        title='Средняя стоимость'
        unit='млн'
        value={(data.sum || 0) / (data.amount || 1) / 1000000}
        prevValue={prevData ? (prevData.sum || 0) / (prevData.amount || 1) / 1000000 : undefined}
        color={AppColors[5]}
        icon={<img src='/icons/dashboard/price.svg' alt='price' />}
      />
      <AnalyticsCardsItem
        title='Средняя цена за м²'
        value={(data.sum || 0) / (data.area || 1) / 1000}
        prevValue={prevData ? (prevData.sum || 0) / (prevData.area || 1) / 1000 : undefined}
        color={AppColors[6]}
        icon={<img src='/icons/dashboard/pricem2.svg' alt='pricem2' />}
      />
    </div>
  ) : (
    <div className='cardsWrapper'>
      <Skeleton variant='rectangular' width='100%' height='136px' />
      <Skeleton variant='rectangular' width='100%' height='136px' />
      <Skeleton variant='rectangular' width='100%' height='136px' />
      <Skeleton variant='rectangular' width='100%' height='136px' />
      <Skeleton variant='rectangular' width='100%' height='136px' />
    </div>
  );
}
