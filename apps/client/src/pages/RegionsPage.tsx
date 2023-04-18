import { useState } from 'react';

import { IconButton, Typography } from '~/shared/lib/MUI';
import RegionEditDialog from '~/entities/Region/components/RegionEditDialog';
import BackdropLoading from '~/shared/ui/BackdropLoading';
import ColumnWrapper from '~/shared/ui/ColumnWrapper';
import { StyledTableContainer, TableToolbar } from '~/shared/ui/StyledTableComponents';
import useRegionsService from '~/entities/Region/api/useRegionsService';
import { useAuthStore } from '~/shared/store/useAuthStore';
import DataGrid from '~/shared/components/DataGrid';
import { Icon } from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { Region } from '~/shared/models/gql/graphql';

export default function RegionsPage() {
  const { regions, create, update, remove, loading } = useRegionsService();
  const [state, setState] = useState<Region | null>(null);
  const user = useAuthStore((store) => store.user);

  return (
    <ColumnWrapper>
      <BackdropLoading open={loading} />
      <StyledTableContainer>
        <TableToolbar>
          <Typography sx={{ flexGrow: 1 }} variant='h6'>
            Регионы
          </Typography>
          <IconButton
            disabled={user?.role === 'USER'}
            color='secondary'
            onClick={() => setState({ name: '', id: 0, groups: [] })}
          >
            <Icon path={mdiPlus} size={1} />
          </IconButton>
        </TableToolbar>
        <DataGrid
          rows={regions}
          columns={[{ key: 'name', title: 'Наименование' }]}
          onSelect={(region) => setState(region)}
          getRowId={(row) => row.id}
        />
      </StyledTableContainer>
      <RegionEditDialog
        open={Boolean(state)}
        region={state}
        onSave={(region) =>
          region.id
            ? update({ variables: { id: region.id, name: region.name } })
            : create({ variables: { name: region.name } })
        }
        onClose={() => setState(null)}
        onDelete={(id) => remove({ variables: { id } })}
      />
    </ColumnWrapper>
  );
}
