import styled from '@emotion/styled';
import { useTheme } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoIcon from '../shared/components/icons/LogoIcon';
import { Typography } from '../shared/lib/MUI';
import { useSelectorStore } from '../shared/store/useSelectorStore';

const StyledDrawer = styled('div')(() => ({
  boxShadow: '0rem 1.25rem 1.6875rem 0rem rgb(0 0 0 / 5%)',
  backgroundColor: '#181824',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1200,
  height: '100%',
  gridArea: 'drawer',
  overflowY: 'auto',
  rowGap: 10,
}));

const Logo = styled('button')(() => ({
  display: 'flex',
  alignItems: 'center',
  padding: 10,
  border: 'none',
  font: 'inherit',
  color: 'inherit',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  paddingBottom: 0,
}));

export default function Drawer({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const isDrawerOpen = useSelectorStore((store) => store.isDrawerOpen);
  const theme = useTheme();
  return (
    <StyledDrawer>
      <Logo onClick={() => navigate('/')}>
        {/* <img style={{ maxWidth: '40px', maxHeight: '40px' }} src='/icons/logo.png' alt='logo' /> */}
        <LogoIcon color={theme.palette.primary.main} />
        {isDrawerOpen && (
          <Typography
            variant='h5'
            color='#FFFFFF'
            textAlign='center'
            fontWeight='bold'
            paddingLeft={2}
          >
            PRO Метры
          </Typography>
        )}
      </Logo>
      {children}
    </StyledDrawer>
  );
}
