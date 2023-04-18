import { styled } from '../lib/MUI';

const RowWrapper = styled('div')(() => ({
  display: 'flex',
  flexWrap: 'nowrap',
  columnGap: 10,
}));

export default RowWrapper;
