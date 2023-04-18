import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@mdi/react';
import { List, Tooltip, ListItemButton, Box, ListItemText } from '~/shared/lib/MUI';
import { useAuthStore } from '~/shared/store/useAuthStore';
import { useSelectorStore } from '~/shared/store/useSelectorStore';
import { useTheme } from '@mui/material';
import { routes } from '~/app/router';

export function Menu() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useAuthStore((store) => store.user);
  const isDrawerOpen = useSelectorStore((store) => store.isDrawerOpen);
  const { palette } = useTheme();
  return (
    <List
      component='nav'
      sx={{
        overflowY: 'auto',
        padding: '10px',
        height: '100%',
        // backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      {routes[0].children?.map((route) => {
        const selected = pathname.replace('/', '') == route.path;
        if (user && route.handle && route.handle.roles.includes(user.role)) {
          return (
            <Tooltip key={route.path || 'index'} title={route.handle.title} placement='right' arrow>
              <ListItemButton
                sx={{
                  borderRadius: '3px',
                  marginBottom: '5px',
                  height: 35,
                  padding: '5px',
                  columnGap: 2,
                  position: 'relative',
                  '&:before': selected
                    ? {
                        content: '""',
                        position: 'absolute',
                        left: '-10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        height: '70%',
                        width: '4px',
                        backgroundColor: palette.primary.main,
                      }
                    : undefined,
                }}
                onClick={() => navigate(route.path || '/')}
              >
                <Box
                  component='span'
                  sx={{
                    background: '#c2f4db1f',
                    width: '24px',
                    height: '24px',
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon path={route.handle.icon} color={palette.primary.main} size='18px' />
                </Box>
                {isDrawerOpen && (
                  <ListItemText
                    sx={{
                      transition: 'color .3s',
                      color: selected ? palette.primary.main : '#ffffff',
                      '& .MuiListItemText-primary': {
                        // fontWeight: 'bold',
                        fontSize: 'clamp(14px, 2vw, 16px)',
                      },
                      '&:hover': !selected
                        ? {
                            color: palette.primary.main,
                          }
                        : undefined,
                    }}
                    primary={route.handle.title}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        }
      })}
    </List>
  );
}
