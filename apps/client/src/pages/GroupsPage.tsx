import { useState } from 'react';
import { IconButton, Typography } from '~/shared/lib/MUI';
import GroupEditDialog from '~/entities/Group/components/GroupEditDialog';
import ColumnWrapper from '~/shared/ui/ColumnWrapper';
import { StyledTableContainer, TableToolbar } from '~/shared/ui/StyledTableComponents';
import useGroupsService from '~/entities/Group/api/useGroupsService';
import { Group } from '~/shared/models/gql/graphql';
import DataGrid from '~/shared/components/DataGrid';
import { useAuthStore } from '~/shared/store/useAuthStore';
import { Icon } from '@mdi/react';
import { mdiPlus } from '@mdi/js';

export default function GroupsPage() {
  const permission = useAuthStore((store) => store.permission);
  const { groups, create, update, remove } = useGroupsService();
  const [state, setState] = useState<{ name: string; id?: number } | null>(null);

  const handleSaveClick = ({ name, id }: { name: string; id?: number }) => {
    id ? update({ variables: { id, name } }) : create({ variables: { name } });
  };

  const handleSelect = (group: Group) => {
    if (permission) {
      setState(group);
    }
  };

  return (
    <ColumnWrapper>
      <StyledTableContainer>
        <TableToolbar>
          <Typography sx={{ flexGrow: 1 }} variant='h6'>
            Группы компаний
          </Typography>
          <IconButton
            color='secondary'
            disabled={!permission}
            onClick={() => setState({ name: '' })}
          >
            <Icon path={mdiPlus} size={1} />
          </IconButton>
        </TableToolbar>
        <DataGrid
          rows={groups}
          columns={[
            { key: 'name', title: 'Наименование' },
            { title: 'Регионы', getCellValue: (row) => row.regions.toString() },
          ]}
          stickyHeader
          onSelect={handleSelect}
          getRowId={(row) => row.id}
        />
      </StyledTableContainer>
      <GroupEditDialog
        open={Boolean(state)}
        group={state}
        onSave={handleSaveClick}
        onClose={() => setState(null)}
        onDelete={(id) => remove({ variables: { id } })}
      />
    </ColumnWrapper>
  );
}
