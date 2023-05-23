import { useMutation, useQuery } from '@apollo/client';
import { mdiContentSave } from '@mdi/js';
import { Icon } from '@mdi/react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PropertiesGrid from '~/entities/Property/components/PropertiesGrid';
import PropTypeTabs from '~/entities/Property/components/PropTypeTabs';
import { PropertyRow } from '~/entities/Property/models/Property';
import { BUILDING_WITH_PROPERTIES } from '~/shared/gql-docs/buildings';
import { SAVE_ALL_PROPERTIES } from '~/shared/gql-docs/properties';
import useNotification from '~/shared/hooks/useNotification';
import { Box, Button, Tooltip } from '~/shared/lib/MUI';
import { PropertyInput } from '~/shared/models/gql/graphql';
import { useAuthStore } from '~/shared/store/useAuthStore';
import { useSelectorStore } from '~/shared/store/useSelectorStore';
import BackdropLoading from '~/shared/ui/BackdropLoading';
import ColumnWrapper from '~/shared/ui/ColumnWrapper';
import { StyledTableContainer, TableToolbar } from '~/shared/ui/StyledTableComponents';
import ToolbarButtonsWrapper from '~/shared/ui/ToolbarButtonsWrapper';
import { floatToString, intToString, stringToFloat, stringToInt } from '~/shared/utils/helpers';
import BuildingSelectorDialog from '~/widgets/BuildingSelectDialog';

export default function PropertiesPage() {
  const permission = useAuthStore((store) => store.permission);
  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [rows, setRows] = useState<PropertyRow[]>([]);
  const { successNotice, errorNotice } = useNotification();

  const buildingId = useSelectorStore((store) => store.buildingId);
  const propertyType = useSelectorStore((store) => store.propertyType);
  const setPropertyType = useSelectorStore((store) => store.setPropertyType);
  const setBuildingId = useSelectorStore((store) => store.setBuildingId);

  const { data, loading } = useQuery(BUILDING_WITH_PROPERTIES, {
    variables: { id: buildingId || 1 },
  });

  const [saveAll] = useMutation(SAVE_ALL_PROPERTIES, {
    refetchQueries: [{ query: BUILDING_WITH_PROPERTIES }, 'getBuildingWithProps'],
    onCompleted() {
      successNotice('Сохранено');
    },
    onError(error) {
      errorNotice(error.message);
    },
  });

  const init = useCallback(() => {
    if (data) {
      const props =
        data.building?.properties?.reduce((all: PropertyRow[], item) => {
          if (item.propertyType === propertyType) {
            all.push({
              id: item.id,
              number: item.number || null,
              floor: intToString(item.floor),
              entrance: intToString(item.entrance),
              totalArea: floatToString(item.totalArea),
              livingArea: floatToString(item.livingArea),
              rooms: intToString(item.rooms),
              wallHeight: floatToString(item.wallHeight),
              buildingId: item.buildingId,
              edited: false,
            });
          }
          return all;
        }, []) || [];
      setRows(props);
    }
    setEditMode(false);
  }, [data, propertyType]);

  const handleSave = () => {
    const newData = rows.reduce((all: PropertyInput[], item) => {
      if (
        item.edited &&
        propertyType &&
        buildingId &&
        item.number &&
        item.totalArea &&
        item.floor
      ) {
        const newItem: PropertyInput = {
          id: item.id,
          number: item.number,
          floor: stringToInt(item.floor),
          entrance: item.entrance ? stringToInt(item.entrance) : null,
          totalArea: stringToFloat(item.totalArea),
          livingArea: item.livingArea ? stringToFloat(item.livingArea) : null,
          rooms: item.rooms ? stringToInt(item.rooms) : null,
          wallHeight: item.wallHeight ? stringToFloat(item.wallHeight) : null,
          propertyType,
          buildingId,
        };
        all.push(newItem);
      }
      return all;
    }, []);
    saveAll({ variables: { input: newData } });
  };

  const handleCancel = () => {
    init();
  };

  const handleSelect = (id: number) => {
    setBuildingId(id);
  };

  useEffect(() => {
    init();
  }, [data, propertyType, init]);

  return (
    <ColumnWrapper>
      <BackdropLoading open={loading} />
      <StyledTableContainer>
        <TableToolbar
          sx={{
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          {data?.building && (
            <Tooltip title={data?.building.name || ''} followCursor placement='bottom-start'>
              <Link to={`/buildings/${data?.building.id}`} className='toolbar-link'>
                {data && `${data.building.name} (${data.building.complex.name})`}
              </Link>
            </Tooltip>
          )}
          <ToolbarButtonsWrapper sx={{ padding: '6px 10px' }}>
            <PropTypeTabs current={propertyType} onSelect={(id) => setPropertyType(id)} />
            <Button onClick={() => setModal(true)} variant='outlined' sx={{ minWidth: 130 }}>
              Выбор дома
            </Button>
            <Button
              disabled={!permission || !editMode}
              onClick={handleSave}
              startIcon={<Icon path={mdiContentSave} />}
              variant='contained'
            >
              Сохранить
            </Button>
            <Button disabled={!editMode} variant='contained' color='error' onClick={handleCancel}>
              Отменить
            </Button>
          </ToolbarButtonsWrapper>
        </TableToolbar>
        {data?.building ? (
          <PropertiesGrid
            rows={rows}
            setRows={setRows}
            setEditMode={setEditMode}
            propType={propertyType}
          />
        ) : (
          <Box padding={8} display='flex' justifyContent='center' alignItems='center'>
            <Button onClick={() => setModal(true)} variant='contained'>
              Выбрать объект
            </Button>
          </Box>
        )}
      </StyledTableContainer>
      <BuildingSelectorDialog
        open={modal}
        onClose={() => setModal(false)}
        onSelect={handleSelect}
        disabledItems={false}
      />
    </ColumnWrapper>
  );
}
