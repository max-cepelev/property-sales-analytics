import { useQuery } from '@apollo/client';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BuildingsMap from '~/features/BuildingsMap';
import PropertyTabs from '~/entities/Property/components/PropertyTabs';
import { Building } from '~/shared/models/gql/graphql';
import { useAuthStore } from '~/shared/store/useAuthStore';
import { useSelectorStore } from '~/shared/store/useSelectorStore';
import BackdropLoading from '~/shared/ui/BackdropLoading';
import ColumnWrapper from '~/shared/ui/ColumnWrapper';
import ToolbarWrapper from '~/shared/ui/ToolbarWrapper';
import BuildingPropertiesMap from '~/widgets/BuildingPropertiesMap';
import SalesChart from '~/widgets/SalesChart';
import { getChartData } from '~/widgets/SalesChart/getChartData';
import { AppColors, PropertyTypes } from '../shared/constants/enums';
import { BUILDING_WITH_DATA } from '~/shared/gql-docs/buildings';
import BuildingInputDialog from '~/features/dialogs/BuildingInputDialog';
import useBuildings from '~/entities/Building/api/useBuildings';
import BuildingView from '~/widgets/BuildingView';

export default function BuildingPage() {
  const user = useAuthStore((store) => store.user);
  const permission = user?.role === 'ADMIN' || user?.role === 'EDITOR' ? true : false;
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useQuery(BUILDING_WITH_DATA, {
    variables: { buildingId: id ? +id : 0 },
  });
  const { create, update, remove } = useBuildings({});
  const [building, setBuilding] = useState<Building | null>(null);
  const propertyType = useSelectorStore((store) => store.propertyType);
  const setPropertyType = useSelectorStore((store) => store.setPropertyType);

  const point: [number, number] | undefined = useMemo(
    () =>
      data?.building?.latitude && data.building.longitude
        ? [data.building.latitude, data.building.longitude]
        : undefined,
    [data],
  );

  return (
    <ColumnWrapper>
      <BackdropLoading open={loading} />
      {data?.building && (
        <ColumnWrapper>
          <ToolbarWrapper sx={{ flexDirection: 'column', padding: 4 }}>
            <BuildingView
              building={data.building}
              propAggregate={data.propAggregate}
              onEdit={() => {
                if (permission) {
                  setBuilding(data.building);
                }
              }}
            />
            <BuildingPropertiesMap
              propAggregate={data.propAggregate}
              livingAggregate={data.propRoomsAggregate}
            />
          </ToolbarWrapper>
          <PropertyTabs
            activeTab={propertyType}
            setTab={(tab) => setPropertyType(tab)}
            salesAggregate={data.salesSumByPropertyType}
            propAggregate={data.propAggregate}
          />
          <SalesChart
            data={
              data.building.sales
                ? getChartData(
                    data.building.sales.filter((item) => item.propertyType === propertyType),
                  )
                : []
            }
            barColor={
              AppColors[Object.keys(PropertyTypes).findIndex((item) => item === propertyType)]
            }
          />
          <ToolbarWrapper>
            <BuildingsMap
              data={data.buildingsForMap || []}
              onClick={(id) => navigate(`/buildings/${id}`)}
              mapCenter={point}
              selectedIds={id ? [+id] : []}
              zoom={15}
            />
          </ToolbarWrapper>
        </ColumnWrapper>
      )}
      <BuildingInputDialog
        open={Boolean(building)}
        onClose={() => setBuilding(null)}
        building={building}
        permission={permission}
        onDelete={(id) => remove({ variables: { id } })}
        onSave={(input) =>
          input.id
            ? update({ variables: { id: input.id, input } })
            : create({ variables: { input } })
        }
      />
    </ColumnWrapper>
  );
}
