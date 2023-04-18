import { Paper, styled, TableCell, tableCellClasses, TableRow } from '@mui/material';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.main,
    // opacity: "0.9",
    borderRadius: 'none',
    boxShadow: 'none',
    fontSize: 'clamp(10px, 2vw, 14px)',
    fontWeight: '700',
    color: theme.palette.primary.main,
    padding: '0 16px 10px 16px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 'clamp(10px, 2vw, 14px)',
    // color: '#000000de',
    fontWeight: 300,
    cursor: 'pointer',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.focus,
  },
}));

export const StyledTableContainer = styled(Paper)(() => ({
  // maxHeight: '75vh',
  maxWidth: '100%',
  marginTop: 20,
  overflow: 'visible',
  borderRadius: '3px',
  boxShadow:
    'rgb(0 0 0 / 10%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0rem 0.125rem 0.25rem -0.0625rem',
}));

export const TableToolbar = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  columnGap: 15,
  marginLeft: '16px',
  marginRight: '16px',
  marginTop: '-18px',
  paddingTop: '8px',
  paddingBottom: '8px',
  paddingLeft: '16px',
  paddingRight: '16px',
  minHeight: '65px',
  marginBottom: 20,
  opacity: 1,
  backgroundColor: theme.palette.primary.main,
  color: '#FFFFFF',
  borderRadius: '3px',
  boxShadow:
    '0rem 0.25rem 1.25rem 0rem rgb(0 0 0 / 14%), 0rem 0.4375rem 0.625rem -0.3125rem rgb(0 187 212 / 40%)',
}));
