import styled from '@emotion/styled';
import { mdiAccountCircle, mdiLogoutVariant, mdiMenu } from '@mdi/js';
import { Icon } from '@mdi/react';
import { Link, useLocation } from 'react-router-dom';
import useAuthService from '../shared/hooks/useAuthService';
import { Breadcrumbs, IconButton, Tooltip, Typography } from '../shared/lib/MUI';
import { useAuthStore } from '../shared/store/useAuthStore';
import { useSelectorStore } from '../shared/store/useSelectorStore';

import RowWrapper from '../shared/ui/RowWrapper';

const ToolbarWrapper = styled('div')(() => ({
  gridArea: 'toolbar',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  minHeight: 'auto',
  padding: 0,
  paddingRight: '15px',
  zIndex: 1100,
  left: 'auto',
  right: 0,
  boxSizing: 'border-box',
  borderRadius: '0.75rem',
  height: '60px',
}));

export default function Toolbar() {
  const route = useLocation().pathname.split('/').slice(1);
  const { signOut } = useAuthService();
  const toggleDrawer = useSelectorStore((store) => store.toggleDrawer);
  // const navigate = useNavigate();
  const routes = route.slice(0, -1);
  const user = useAuthStore((store) => store.user);
  return (
    <ToolbarWrapper>
      <div>
        <Breadcrumbs
          sx={{
            '& .MuiBreadcrumbs-separator': {},
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <Icon path={mdiMenu} size='24px' />
          </IconButton>
          {routes.map((el) => (
            <Link to={`/${el}`} key={el}>
              <Typography
                variant='button'
                fontWeight='regular'
                textTransform='capitalize'
                color={'dark'}
                sx={{ lineHeight: 0 }}
              >
                {el}
              </Typography>
            </Link>
          ))}
        </Breadcrumbs>
      </div>
      <RowWrapper>
        {user && (
          <Typography textAlign='center' paddingTop='10px' lineHeight='100%' variant='subtitle1'>
            {user.email}
          </Typography>
        )}
        <IconButton size='small'>
          <Icon path={mdiAccountCircle} size='24px' />
        </IconButton>
        <Tooltip title='Выйти'>
          <IconButton onClick={() => signOut()} size='small'>
            <Icon path={mdiLogoutVariant} size='24px' />
          </IconButton>
        </Tooltip>

        {/* <IconButton size='small' aria-controls='notification-menu' aria-haspopup='true'>
          <Icon path={mdiBell} size='24px' />
        </IconButton> */}
      </RowWrapper>
    </ToolbarWrapper>
  );
}
