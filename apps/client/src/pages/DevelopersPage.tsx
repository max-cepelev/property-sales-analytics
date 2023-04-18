import { IconButton, Link, Typography } from '~/shared/lib/MUI';
import { useState } from 'react';
import DeveloperEditDialog from '~/features/dialogs/DeveloperEditDialog';
import BackdropLoading from '~/shared/ui/BackdropLoading';
import ColumnWrapper from '~/shared/ui/ColumnWrapper';
import { StyledTableContainer, TableToolbar } from '~/shared/ui/StyledTableComponents';
import ToolbarButtonsWrapper from '~/shared/ui/ToolbarButtonsWrapper';
import useDevelopersService from '~/entities/Developer/api/useDevelopersService';

import { Developer } from '~/shared/models/gql/graphql';
import { useSelectorStore } from '~/shared/store/useSelectorStore';
import DataGrid, { GridColumn } from '~/shared/components/DataGrid';
import { useAuthStore } from '~/shared/store/useAuthStore';
import { DeveloperInput } from '~/entities/Developer/schema/developerInputSchema';
import { Icon } from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import GroupAutocompleteSelector from '~/features/selectors/GroupAutocompleteSelector';

export default function DevelopersPage() {
  const permission = useAuthStore((store) => store.permission);
  const [addModal, setAddModal] = useState(false);
  const [state, setState] = useState<DeveloperInput | null>(null);
  const groupId = useSelectorStore((store) => store.groupId);
  const setGroupId = useSelectorStore((store) => store.setGroupId);

  const { developers, create, update, remove, loading } = useDevelopersService(groupId);

  const columns: GridColumn<Developer>[] = [
    { title: 'Группа компаний', getCellValue: (row) => row.group.name },
    { key: 'name', title: 'Наименование' },
    { key: 'inn', title: 'ИНН' },
    { key: 'actualAddress', title: 'Адрес' },
    { key: 'manager', title: 'Руководитель' },
    { key: 'phone', title: 'Телефон', width: 200 },
    {
      key: 'email',
      title: 'E-Mail',
      component: (row) => (row.email ? <Link href={`mailto:${row.email}`}>{row.email}</Link> : ''),
    },
  ];

  const handleClick = (developer: Developer) => {
    if (permission) {
      setState({
        id: developer.id,
        name: developer.name,
        fullName: developer.fullName,
        legalAddress: developer.legalAddress || null,
        actualAddress: developer.actualAddress || null,
        inn: developer.inn,
        kpp: developer.kpp || null,
        ogrn: developer.ogrn || null,
        email: developer.email || null,
        phone: developer.phone || null,
        manager: developer.manager || null,
        website: developer.website || null,
        info: developer.info || null,
        groupId: developer.groupId,
      });
    }
  };

  const handleSaveClick = (developer: DeveloperInput) => {
    developer.id
      ? update({
          variables: { id: developer.id, input: developer },
        })
      : create({ variables: { input: developer } });
  };

  const handleClose = () => {
    setState(null);
    setAddModal(false);
  };

  return (
    <ColumnWrapper>
      <BackdropLoading open={loading} />
      <StyledTableContainer>
        <TableToolbar>
          <Typography sx={{ flexGrow: 1 }} variant='h6'>
            Застройщики
          </Typography>
          <ToolbarButtonsWrapper>
            <GroupAutocompleteSelector currentId={groupId} onSelect={(id) => setGroupId(id)} />
          </ToolbarButtonsWrapper>
          <IconButton disabled={!permission} color='secondary' onClick={() => setAddModal(true)}>
            <Icon path={mdiPlus} size={1} />
          </IconButton>
        </TableToolbar>
        <DataGrid
          rows={developers}
          columns={columns}
          onSelect={handleClick}
          stickyHeader
          getRowId={(row) => row.id}
        />
      </StyledTableContainer>
      <DeveloperEditDialog
        open={addModal || Boolean(state)}
        developer={state || undefined}
        onSave={handleSaveClick}
        onClose={handleClose}
        onDelete={(id) => remove({ variables: { id } })}
      />
    </ColumnWrapper>
  );
}
