import { styled } from '../lib/MUI';

const ToolbarWrapper = styled('div')(() => ({
  padding: 15,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 10,
  backgroundColor: '#ffffff',
  borderRadius: '3px',
  boxShadow:
    'rgb(0 0 0 / 10%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0rem 0.125rem 0.25rem -0.0625rem',
}));

export default ToolbarWrapper;
