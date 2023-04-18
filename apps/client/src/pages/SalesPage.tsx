import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { SaleRow } from '~/entities/Sale/models/Sale';
import { dataToRows, rowsToData } from '~/entities/Sale/components/SalesGrid/setGridData';
import PropTypeTabs from '~/entities/Property/components/PropTypeTabs';
import SalesGrid from '~/entities/Sale/components/SalesGrid';

import { Box, Button, Tooltip } from '~/shared/lib/MUI';
import ColumnWrapper from '~/shared/ui/ColumnWrapper';
import BackdropLoading from '~/shared/ui/BackdropLoading';
import { StyledTableContainer, TableToolbar } from '~/shared/ui/StyledTableComponents';
import ToolbarButtonsWrapper from '~/shared/ui/ToolbarButtonsWrapper';
import useNotification from '~/shared/hooks/useNotification';

import BuildingSelectorDialog from '~/widgets/BuildingSelectDialog';
import { useSelectorStore } from '~/shared/store/useSelectorStore';
import { useAuthStore } from '~/shared/store/useAuthStore';
import { BUILDING_WITH_SALES } from '~/shared/gql-docs/buildings';
import { SAVE_SALES } from '~/shared/gql-docs/sales';
import { Icon } from '@mdi/react';
import { mdiContentSave } from '@mdi/js';
import { Link } from 'react-router-dom';

export default function SalesPage() {
  const permission = useAuthStore((store) => store.permission);
  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [rows, setRows] = useState<SaleRow[]>([]);
  const { successNotice, errorNotice } = useNotification();

  const buildingId = useSelectorStore((store) => store.buildingId);
  const propertyType = useSelectorStore((store) => store.propertyType);
  const setPropertyType = useSelectorStore((store) => store.setPropertyType);
  const setBuildingId = useSelectorStore((store) => store.setBuildingId);

  const { data, loading } = useQuery(BUILDING_WITH_SALES, {
    variables: { id: buildingId || 0 },
  });

  const [saveSales] = useMutation(SAVE_SALES, {
    refetchQueries: [{ query: BUILDING_WITH_SALES, variables: { id: buildingId } }],
    onCompleted() {
      successNotice('Сохранено');
    },
    onError(error) {
      errorNotice(error.message);
    },
  });

  const init = useCallback(() => {
    if (data?.building?.sales) {
      const rows = dataToRows(data.building.sales, propertyType);
      setRows(rows);
      setEditMode(false);
    }
  }, [data?.building?.sales, propertyType]);

  const handleSave = () => {
    const data = rows.sort((a, b) =>
      a.date && b.date ? Number(new Date(a.date)) - Number(new Date(b.date)) : 0,
    );
    if (buildingId) {
      const newData = rowsToData(data, buildingId, propertyType);
      saveSales({ variables: { input: newData } });
    }
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
          }}
        >
          {data?.building && (
            <Tooltip title={data.building.name || ''} followCursor placement='bottom-start'>
              <Link to={`/buildings/${data?.building.id}`} className='toolbar-link'>
                {data && `${data.building.name} (${data.building.complex.name})`}
              </Link>
            </Tooltip>
          )}
          <ToolbarButtonsWrapper>
            <PropTypeTabs current={propertyType} onSelect={(id) => setPropertyType(id)} />
            {data?.building?.domRfId && (
              <Button
                variant='outlined'
                target='_blank'
                href={`https://xn--80az8a.xn--d1aqf.xn--p1ai/%D1%81%D0%B5%D1%80%D0%B2%D0%B8%D1%81%D1%8B/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3-%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D1%80%D0%BE%D0%B5%D0%BA/%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82/${data.building.domRfId}`}
              >
                НАШДОМ.РФ
              </Button>
            )}
            <Button onClick={() => setModal(true)} variant='outlined'>
              Выбрать объект
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
          <SalesGrid rows={rows} setRows={setRows} setEditMode={setEditMode} />
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
