import { styled } from '../lib/MUI';

const ToolbarButtonsWrapper = styled('div')(() => ({
  padding: '8px 6px 6px 6px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  backgroundColor: '#f8f9fa',
  flexWrap: 'wrap',
}));

export default ToolbarButtonsWrapper;
