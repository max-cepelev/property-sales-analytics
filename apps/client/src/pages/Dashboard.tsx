import { useQuery } from '@apollo/client';
import { Button, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppColors,
  PropertyClass,
  PropertyClasses,
  PropertyTypes,
} from '../shared/constants/enums';

import BackdropLoading from '~/shared/ui/BackdropLoading';
import ColumnWrapper from '~/shared/ui/ColumnWrapper';
import RowWrapper from '~/shared/ui/RowWrapper';
import ToolbarWrapper from '~/shared/ui/ToolbarWrapper';
import { useSelectorStore } from '~/shared/store/useSelectorStore';
import Selector from '~/shared/components/selectors/Selector';
import DistrictSelector from '~/entities/District/components/DistrictSelector';
import PropertyTypeSelector from '~/shared/components/selectors/PropertyTypeSelector';
import AnalyticsCards from '~/widgets/AnalyticsCards';
import PropertyTabs from '~/entities/Property/components/PropertyTabs';
import SalesChart from '~/widgets/SalesChart';
import InfoPanel from '~/features/InfoPanel';
import { getChartData } from '~/widgets/SalesChart/getChartData';
import SalesThree from '~/widgets/SalesThree';
import { SALES_ANALYTICS } from '~/shared/gql-docs/sales';

export default function Dashboard() {
  const districtId = useSelectorStore((store) => store.districtId);
  const propertyType = useSelectorStore((store) => store.propertyType);
  const setPropertyType = useSelectorStore((store) => store.setPropertyType);
  const setDistrictId = useSelectorStore((store) => store.setDistrictId);
  const [propertyClass, setPropertyClass] = useState<PropertyClass | null>(null);
  const [selected, setSelected] = useState<{
    title: string;
    buildingIds: number[];
  }>({ title: 'Пермь', buildingIds: [] });

  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const { data, loading } = useQuery(SALES_ANALYTICS, {
    variables: {
      propertyType,
      buildingIds: selected.buildingIds,
      propertyClass: propertyClass ?? undefined,
      districtId: districtId ? districtId : undefined,
    },
  });

  const index = data ? data.salesAnalytics.findIndex((item) => item.date == currentDate) : -1;

  const handleReset = () => {
    setDistrictId(null);
    setSelected({ title: 'Пермь', buildingIds: [] });
    setPropertyClass(null);
  };

  useEffect(() => {
    data && setCurrentDate(data.salesAnalytics[data.salesAnalytics.length - 1].date);
  }, [data]);

  return (
    <ColumnWrapper sx={{ alignItems: 'flex-end' }}>
      <BackdropLoading open={loading} />
      {currentDate && data && (
        <ToolbarWrapper sx={{ padding: '10px' }}>
          <RowWrapper
            sx={{
              alignItems: 'center',
              marginLeft: 2,
              flexGrow: 1,
              fontWeight: 'bold',
            }}
          >
            {selected.buildingIds.length === 1 ? (
              <Link
                style={{ textDecoration: 'none', fontWeight: 'bold' }}
                to={`/buildings/${selected.buildingIds[0]}`}
              >
                {selected.title},
              </Link>
            ) : (
              <Typography fontWeight='bold' variant='subtitle1'>
                {selected.title},
              </Typography>
            )}
            продажи за
            <Selector
              disableUnderline
              value={currentDate}
              variant='standard'
              options={data.salesAnalytics.map((item) => ({
                id: item.date,
                name: new Date(item.date).toLocaleString('ru-RU', {
                  month: 'long',
                  year: 'numeric',
                }),
              }))}
              onChange={(id) => id && setCurrentDate(id.toString())}
              label='Дата'
            />
          </RowWrapper>
          <Button onClick={handleReset}>Сбросить</Button>
          <DistrictSelector
            currentId={districtId}
            onSelect={(id) => setDistrictId(id)}
            size='small'
            nullSelect
          />
          <Selector
            value={propertyClass}
            options={Object.entries(PropertyClasses).map(([key, value]) => ({
              id: key,
              name: value,
            }))}
            onChange={(id) => setPropertyClass((id as PropertyClass) || null)}
            nullSelect
            label='Класс недвижимости'
          />
          <PropertyTypeSelector
            currentType={propertyType}
            onSelect={(id) => setPropertyType(id)}
            size='small'
          />
        </ToolbarWrapper>
      )}
      <AnalyticsCards
        data={data && index !== -1 ? data.salesAnalytics[index] : undefined}
        prevData={data && index !== -1 ? data.salesAnalytics[index - 1] : undefined}
        propertyType={propertyType}
      />
      <PropertyTabs
        activeTab={propertyType}
        setTab={(tab) => setPropertyType(tab)}
        salesAggregate={data?.salesSumByPropertyType}
        propAggregate={data?.propAggregate}
      />
      {selected.buildingIds.length === 1 && <InfoPanel buildingId={selected.buildingIds[0]} />}
      {data ? (
        <SalesChart
          data={getChartData(data.salesAnalytics)}
          barColor={
            AppColors[Object.keys(PropertyTypes).findIndex((item) => item === propertyType)]
          }
          currentDate={currentDate}
          onClick={(date) => setCurrentDate(date)}
        />
      ) : (
        <Skeleton variant='rectangular' width='100%' height='350px' />
      )}

      {currentDate && (
        <SalesThree
          date={currentDate}
          propertyClass={propertyClass}
          onSelect={(title, buildingIds) => setSelected({ title, buildingIds })}
        />
      )}
    </ColumnWrapper>
  );
}
