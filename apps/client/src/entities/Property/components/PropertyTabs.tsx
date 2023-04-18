import { Skeleton } from '@mui/material';
import { AppColors, PropertyType } from '~/shared/constants/enums';
import PropertyTab from './PropertyTab';
import { SalesSumByPropertyType, PropAggregateResponse } from '~/shared/models/gql/graphql';

interface Props {
  activeTab: PropertyType;
  setTab: (number: PropertyType) => void;
  salesAggregate?: SalesSumByPropertyType;
  propAggregate?: PropAggregateResponse;
}

export default function PropertyTabs({ activeTab, setTab, salesAggregate, propAggregate }: Props) {
  return salesAggregate && propAggregate ? (
    <div
      style={{
        height: 150,
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <PropertyTab
        title='Квартиры'
        total={propAggregate.living.count}
        sold={salesAggregate.living.amount || 0}
        price={Math.round((salesAggregate.living.sum ?? 0) / (salesAggregate.living.area ?? 1))}
        active={activeTab === 'LIVING'}
        color={AppColors[0]}
        onClick={() => setTab('LIVING')}
      />
      <PropertyTab
        title='Нежилые помещения'
        total={propAggregate.commercial.count || 0}
        sold={salesAggregate.commercial?.amount || 0}
        price={Math.round(
          (salesAggregate.commercial.sum ?? 0) / (salesAggregate.commercial.area ?? 1),
        )}
        active={activeTab === 'COMMERCIAL'}
        color={AppColors[1]}
        onClick={() => setTab('COMMERCIAL')}
      />
      <PropertyTab
        title='Машиноместа'
        total={propAggregate.parking.count || 0}
        price={Math.round((salesAggregate.parking.sum ?? 0) / (salesAggregate.parking.area ?? 1))}
        sold={salesAggregate.parking?.amount || 0}
        active={activeTab === 'PARKING'}
        color={AppColors[2]}
        onClick={() => setTab('PARKING')}
      />
    </div>
  ) : (
    <div
      style={{
        height: 150,
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <Skeleton variant='rectangular' width='32%' height='150px' />
      <Skeleton variant='rectangular' width='32%' height='150px' />
      <Skeleton variant='rectangular' width='32%' height='150px' />
    </div>
  );
}
