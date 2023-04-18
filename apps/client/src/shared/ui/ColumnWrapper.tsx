import { styled } from '~/shared/lib/MUI';

const ColumnWrapper = styled('div')(() => ({
  // width: "100%",
  display: 'flex',
  flexDirection: 'column',
  rowGap: 15,
  marginBottom: 10,
}));

export default ColumnWrapper;
