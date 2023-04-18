import { Button, Link, Typography } from '@mui/material';
import BackdropLoading from '../shared/ui/BackdropLoading';
import ColumnWrapper from '../shared/ui/ColumnWrapper';
import { StyledTableContainer, TableToolbar } from '../shared/ui/StyledTableComponents';
import useUsersService from '../entities/User/api/useUsersService';
import DataGrid, { GridColumn } from '~/shared/components/DataGrid';
import { Icon } from '@mdi/react';
import { mdiCheckboxBlankOutline, mdiCheckboxMarked } from '@mdi/js';
import { User } from '~/shared/models/gql/graphql';
import { Roles } from '~/shared/constants/enums';

export default function Users() {
  const { users, loading, activate, deactivate } = useUsersService();
  const columns: GridColumn<
    Pick<User, 'id' | 'email' | 'phone' | 'name' | 'role' | 'activated'>
  >[] = [
    {
      title: 'Имя',
      key: 'name',
    },
    {
      title: 'Email',
      align: 'center',
      component: (row) => (
        <Link target='_blank' href={`mailto:${row.email}`}>
          {row.email}
        </Link>
      ),
    },
    {
      title: 'Телефон',
      key: 'phone',
      align: 'center',
    },
    {
      title: 'Активен',
      component: (row) => (
        <Icon
          size={1}
          path={row.activated ? mdiCheckboxMarked : mdiCheckboxBlankOutline}
          color='grey'
        />
      ),
      align: 'center',
    },
    {
      title: 'Права',
      align: 'center',
      getCellValue: (row) => Roles[row.role],
    },
    {
      title: 'Действия',
      align: 'center',
      width: 250,
      component: (row) =>
        row.activated ? (
          <Button
            disabled={row.role === 'ADMIN'}
            variant='contained'
            color='warning'
            onClick={() => deactivate({ variables: { id: row.id } })}
          >
            Деактивировать
          </Button>
        ) : (
          <Button
            disabled={row.role === 'ADMIN'}
            variant='contained'
            onClick={() => activate({ variables: { id: row.id } })}
          >
            Активировать
          </Button>
        ),
    },
  ];
  return (
    <ColumnWrapper>
      <BackdropLoading open={loading} />
      <StyledTableContainer>
        <TableToolbar>
          <Typography sx={{ width: '100%' }} variant='h6'>
            Пользователи
          </Typography>
        </TableToolbar>
        <DataGrid rows={users} columns={columns} getRowId={(row) => row.id} />
      </StyledTableContainer>
    </ColumnWrapper>
  );
}
