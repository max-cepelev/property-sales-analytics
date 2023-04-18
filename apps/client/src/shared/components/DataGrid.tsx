import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled, TableCell, tableCellClasses, Typography } from '@mui/material';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.main,
    // opacity: "0.9",
    borderRadius: 'none',
    boxShadow: 'none',
    fontSize: 'clamp(10px, 1.5vw, 14px)',
    fontWeight: '700',
    color: theme.palette.primary.main,
    padding: '0 16px 10px 16px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 'clamp(10px, 1.5vw, 14px)',
    // color: '#000000de',
    fontWeight: 300,
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
}));

export interface GridColumn<T> {
  title: string;
  key?: keyof T;
  maxWidth?: number;
  width?: number;
  component?: (rowData: T) => React.ReactNode;
  headerComponent?: React.ReactNode;
  getCellValue?: (rowData: T) => string | number | null;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  cellClassName?: (rowData: T) => string;
  cellColor?: (rowData: T) => string;
}

type Props<T> = {
  rows: T[];
  columns: GridColumn<T>[];
  getRowId: (row: T) => string | number;
  className?: string;
  onSelect?: (row: T) => void;
  stickyHeader?: boolean;
  maxHeight?: string | number;
  noDataText?: string;
  rowHeight?: number | string;
};

export default function DataGrid<T>({
  rows,
  columns,
  getRowId,
  onSelect,
  stickyHeader = false,
  maxHeight = '71vh',
  className,
  noDataText = 'Нет данных',
  rowHeight,
}: Props<T>) {
  return (
    <div
      className={className || ''}
      style={{
        overflowY: 'auto',
        maxHeight,
        width: '100%',
        boxShadow: '5px 5px 5px -5px rgba(34, 60, 80, 0.6)',
      }}
    >
      <Table sx={{ minWidth: 700 }} aria-label='customized table' stickyHeader={stickyHeader}>
        <TableHead>
          <StyledTableRow>
            {rows.length > 0 &&
              columns.map((col) => (
                <StyledTableCell
                  key={col.title}
                  align={col.align}
                  sx={{ maxWidth: col.maxWidth ? col.maxWidth : undefined }}
                >
                  {col.headerComponent ? col.headerComponent : col.title}
                </StyledTableCell>
              ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <StyledTableRow
                key={getRowId(row)}
                onClick={() => onSelect && onSelect(row)}
                sx={{
                  cursor: onSelect ? 'pointer' : undefined,
                  height: rowHeight,
                  '&:hover': {
                    backgroundColor: onSelect ? (theme) => theme.palette.action.focus : undefined,
                  },
                }}
              >
                {columns.map((col) => (
                  <StyledTableCell
                    key={col.title}
                    scope='row'
                    sx={{
                      maxWidth: col.maxWidth ? col.maxWidth : undefined,
                      height: '100%',
                      backgroundColor: col.cellColor ? col.cellColor(row) : undefined,
                    }}
                    width={col.width ?? undefined}
                    align={col.align}
                    className={col.cellClassName ? col.cellClassName(row) : undefined}
                  >
                    {col.component ? (
                      col.component(row)
                    ) : (
                      <Typography fontSize='inherit' fontWeight='inherit'>{`${
                        col.getCellValue
                          ? col.getCellValue(row) || ''
                          : col.key
                          ? row[col.key] || ''
                          : ''
                      }`}</Typography>
                    )}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <StyledTableCell
                width='100%'
                sx={{
                  border: 'solid 1px #e8ebed',
                }}
              >
                <Typography fontStyle='italic' textAlign='center' fontSize='inherit'>
                  {noDataText}
                </Typography>
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
