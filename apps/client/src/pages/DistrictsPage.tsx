import { mdiPlus } from '@mdi/js';
import { Icon } from '@mdi/react';
import { useState } from 'react';

import CitySelector from '~/entities/City/components/CitySelector';
import useDistrictsService from '~/entities/District/api/useDistrictsService';
import { DistrictDto } from '~/entities/District/models/District';
import DistrictEditDialog from '~/features/dialogs/DistrictEditDialog';
import DataGrid from '~/shared/components/DataGrid';
import { IconButton, Typography } from '~/shared/lib/MUI';
import { useAuthStore } from '~/shared/store/useAuthStore';
import { useSelectorStore } from '~/shared/store/useSelectorStore';
import BackdropLoading from '~/shared/ui/BackdropLoading';
import ColumnWrapper from '~/shared/ui/ColumnWrapper';
import { StyledTableContainer, TableToolbar } from '~/shared/ui/StyledTableComponents';
import ToolbarButtonsWrapper from '~/shared/ui/ToolbarButtonsWrapper';

export default function DistrictsPage() {
  const user = useAuthStore((store) => store.user);
  const permission = user?.role === 'ADMIN' || user?.role === 'EDITOR';
  const [state, setState] = useState<DistrictDto | null>(null);
  const cityId = useSelectorStore((store) => store.cityId);
  const setCityId = useSelectorStore((store) => store.setCityId);

  const { districts, loading, create, update, remove } = useDistrictsService(cityId);

  const handleSelect = (district: DistrictDto) => {
    setState(district);
  };

  const handleSaveClick = (district: DistrictDto) => {
    const { id, name, cityId } = district;
    id
      ? update({ variables: { id, input: { name, cityId } } })
      : create({ variables: { input: { name, cityId } } });
  };

  return (
    <ColumnWrapper>
      <BackdropLoading open={loading} />
      <StyledTableContainer>
        <TableToolbar>
          <Typography sx={{ flexGrow: 1 }} variant='h6'>
            Районы
          </Typography>
          <ToolbarButtonsWrapper>
            <CitySelector size='small' currentId={cityId} onSelect={(id) => setCityId(id)} />
          </ToolbarButtonsWrapper>
          <IconButton
            color='secondary'
            disabled={!permission}
            onClick={() => setState({ name: '', cityId: cityId || 0 })}
          >
            <Icon path={mdiPlus} size={1} />
          </IconButton>
        </TableToolbar>
        <DataGrid
          rows={districts}
          columns={[
            { key: 'name', title: 'Район' },
            { title: 'Город', getCellValue: (row) => row.city?.name || '' },
          ]}
          onSelect={handleSelect}
          getRowId={(row) => row.id}
        />
      </StyledTableContainer>
      <DistrictEditDialog
        open={permission && Boolean(state)}
        district={state}
        onSave={handleSaveClick}
        onClose={() => setState(null)}
        onDelete={(id) => remove({ variables: { id } })}
      />
    </ColumnWrapper>
  );
}
