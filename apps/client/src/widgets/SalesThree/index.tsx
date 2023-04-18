import { useMemo, useState } from 'react';
import { Checkbox, FormControlLabel, Typography } from '~/shared/lib/MUI';
import GroupList from './GroupList';
import ComplexList from './ComplexList';
import BuildingList from './BuildingList';
import { PropertyClass } from '~/shared/constants/enums';
import ToolbarWrapper from '~/shared/ui/ToolbarWrapper';
import RowWrapper from '~/shared/ui/RowWrapper';
import Selector from '~/shared/components/selectors/Selector';
import { useSelectorStore } from '~/shared/store/useSelectorStore';
import { useQuery } from '@apollo/client';
import { SALES_DATA } from '~/shared/gql-docs/sales';
import { SalesAggregate } from '~/entities/Sale/models/Sale';
import { SalesDataByBuilding, SalesDataByComplex } from '~/shared/models/gql/graphql';

interface Props {
  date: string;
  propertyClass: PropertyClass | null;
  onSelect?: (title: string, buildingIds: number[]) => void;
}

export default function SalesThree({ date, propertyClass, onSelect }: Props) {
  const favoriteFilter = useSelectorStore((store) => store.isFavorites);
  const districtId = useSelectorStore((store) => store.districtId);
  const propertyType = useSelectorStore((store) => store.propertyType);
  const favorites = useSelectorStore((store) => store.favorites);
  const toggleFavoriteFilter = useSelectorStore((store) => store.toggleFavoriteFilter);

  const [activeTab, setActiveTab] = useState(0);

  const dataTypes = [
    {
      id: 'number',
      name: 'Количество',
    },
    {
      id: 'area',
      name: 'Площадь, м²',
    },
    {
      id: 'price',
      name: 'Средняя цена, тыс/м²',
    },
  ];
  const [dataType, setDataType] = useState<keyof SalesAggregate>('number');

  const { data } = useQuery(SALES_DATA, {
    variables: {
      year: new Date(date).getFullYear(),
      month: new Date(date).getMonth(),
      propertyType,
      districtId: districtId ?? undefined,
      favorites: favoriteFilter && favorites.length ? favorites : undefined,
      propertyClass: propertyClass ?? undefined,
    },
    fetchPolicy: 'cache-and-network',
  });

  const { complexes, buildings } = useMemo(() => {
    let complexes: SalesDataByComplex[] = [];
    let buildings: SalesDataByBuilding[] = [];
    if (data) {
      data.salesData.groups.forEach((group) => {
        complexes = complexes.concat(group.complexes);
        group.complexes.forEach((complex) => {
          buildings = buildings.concat(complex.buildings);
        });
      });
    }
    return { complexes, buildings };
  }, [data]);

  const scrollToTop = () => {
    const element = document.querySelector('.container');
    if (element) {
      setTimeout(() => {
        element.scrollTo({
          top: 0,
          // behavior: 'smooth',
        });
      }, 300);
    }
  };

  const handleGroupSelect = (groupId: number) => {
    if (data) {
      const group = data.salesData.groups.find((item) => item.id === groupId);
      if (onSelect && group) {
        const buildingIds = [];
        for (const complex of group.complexes) {
          for (const building of complex.buildings) {
            if (building.sales) {
              buildingIds.push(building.id);
            }
          }
        }
        onSelect(group.name, buildingIds);
      }
      scrollToTop();
    }
  };

  const handleSelect = (title: string, buildingIds: number[]) => {
    onSelect && onSelect(title, buildingIds);
    scrollToTop();
  };

  return (
    <ToolbarWrapper
      sx={{
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <RowWrapper
        sx={{
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Typography
          variant='caption'
          color={activeTab !== 0 ? '#2e87eb' : 'inherit'}
          whiteSpace='nowrap'
          fontSize='clamp(14px, 2vw, 20px)'
          onClick={() => setActiveTab(0)}
          sx={{ cursor: activeTab !== 0 ? 'pointer' : undefined }}
        >
          Застройщики
        </Typography>
        /
        <Typography
          variant='caption'
          whiteSpace='nowrap'
          fontSize='clamp(14px, 2vw, 20px)'
          onClick={() => setActiveTab(1)}
          color={activeTab !== 1 ? '#2e87eb' : 'inherit'}
          sx={{ cursor: activeTab !== 1 ? 'pointer' : undefined }}
        >
          ЖК
        </Typography>
        /
        <Typography
          variant='caption'
          width='100%'
          fontSize='clamp(14px, 2vw, 20px)'
          color={activeTab !== 2 ? '#2e87eb' : 'inherit'}
          sx={{ cursor: activeTab !== 2 ? 'pointer' : undefined }}
          onClick={() => setActiveTab(2)}
        >
          Дома
        </Typography>
        <FormControlLabel
          control={<Checkbox />}
          checked={favoriteFilter}
          label='Избранные'
          onChange={toggleFavoriteFilter}
        />
        <Selector
          variant='outlined'
          options={dataTypes}
          value={dataType}
          onChange={(id) => setDataType(id as keyof SalesAggregate)}
          label='Сортировка'
          width={330}
        />
      </RowWrapper>
      {activeTab === 0 && (
        <GroupList
          data={data?.salesData.groups || []}
          dataType={dataType}
          date={date}
          propertyType={propertyType}
          onBuildingsSelect={handleSelect}
          onGroupSelect={handleGroupSelect}
        />
      )}
      {activeTab === 1 && (
        <ComplexList
          complexes={complexes}
          dataType={dataType}
          date={date}
          propertyType={propertyType}
          onSelect={handleSelect}
        />
      )}
      {activeTab === 2 && (
        <BuildingList
          buildings={buildings}
          dataType={dataType}
          date={date}
          onSelect={handleSelect}
          propertyType={propertyType}
        />
      )}
    </ToolbarWrapper>
  );
}
