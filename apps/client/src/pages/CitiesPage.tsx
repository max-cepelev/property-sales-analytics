import { mdiPlus } from '@mdi/js';
import { Icon } from '@mdi/react';
import { IconButton, Typography } from '@mui/material';
import { useState } from 'react';

import RegionsSelector from '~/entities/Region/components/RegionsSelector';
import CityEditDialog from '~/features/dialogs/CityEditDialog';
import DataGrid from '~/shared/components/DataGrid';
import { CityInput } from '~/shared/models/gql/graphql';
import { useAuthStore } from '~/shared/store/useAuthStore';
import { useSelectorStore } from '~/shared/store/useSelectorStore';
import { StyledTableContainer, TableToolbar } from '~/shared/ui/StyledTableComponents';

import useCitiesService from '../entities/City/api/useCitiesService';
import BackdropLoading from '../shared/ui/BackdropLoading';
import ColumnWrapper from '../shared/ui/ColumnWrapper';
import ToolbarButtonsWrapper from '../shared/ui/ToolbarButtonsWrapper';

type GridRow = { id: number; name: string; region: string; regionId: number };

export default function CitiesPage() {
  const [state, setState] = useState<(CityInput & { id?: number }) | null>(null);
  const user = useAuthStore((store) => store.user);

  const regionId = useSelectorStore((store) => store.regionId);
  const setRegionId = useSelectorStore((store) => store.setRegionId);

  const { cities, create, update, remove, loading } = useCitiesService(regionId);

  const rows: GridRow[] = cities.map((city) => ({
    id: city.id,
    name: city.name,
    region: city.region.name,
    regionId: city.regionId,
  }));

  const handleSaveClick = (city: CityInput, cityId?: number) => {
    const { name, regionId } = city;
    cityId
      ? update({ variables: { id: cityId, input: { name, regionId } } })
      : create({ variables: { input: { name, regionId } } });
  };

  return (
    <ColumnWrapper>
      <BackdropLoading open={loading} />
      <StyledTableContainer>
        <TableToolbar>
          <Typography sx={{ flexGrow: 1 }} variant='h6'>
            Города
          </Typography>
          <ToolbarButtonsWrapper>
            <RegionsSelector size='small' currentId={regionId} onSelect={(id) => setRegionId(id)} />
          </ToolbarButtonsWrapper>
          <IconButton
            color='secondary'
            disabled={user?.role === 'USER'}
            onClick={() => setState({ name: '', regionId: regionId ?? 0 })}
          >
            <Icon path={mdiPlus} size={1} />
          </IconButton>
        </TableToolbar>
        <DataGrid
          rows={rows}
          columns={[
            { key: 'name', title: 'Наименование' },
            { key: 'region', title: 'Регион' },
          ]}
          onSelect={(row) => setState({ id: row.id, name: row.name, regionId: row.regionId })}
          getRowId={(row) => row.id}
        />
      </StyledTableContainer>
      <CityEditDialog
        open={user?.role !== 'USER' && Boolean(state)}
        city={state}
        cityId={state?.id}
        onSave={handleSaveClick}
        onClose={() => setState(null)}
        onDelete={(id) => remove({ variables: { id } })}
      />
    </ColumnWrapper>
  );
}
