import { Column, dateColumn, keyColumn, textColumn } from 'react-datasheet-grid';
import DateSelectorCell from '~/shared/components/selectors/DateSelectorCell';
import { SaleRow } from '../../models/Sale';

export const columns: Column<SaleRow>[] = [
  {
    ...keyColumn<SaleRow, 'date'>('date', dateColumn),
    title: 'Месяц и год',
    maxWidth: 150,

    component: ({ rowData, setRowData }) =>
      DateSelectorCell({
        value: rowData.date,
        onChange: (date) => setRowData({ ...rowData, date }),
      }),
    cellClassName: ({ rowData }) => (rowData.edited ? 'editing' : 'inherit'),
  },
  {
    ...keyColumn<SaleRow, 'amount'>('amount', textColumn),
    title: 'Продано',
    cellClassName: ({ rowData }) => (rowData.edited ? 'editing' : 'inherit'),
  },
  {
    ...keyColumn<SaleRow, 'area'>('area', textColumn),
    title: 'Площадь проданных',
    cellClassName: ({ rowData }) => (rowData.edited ? 'editing' : 'inherit'),
  },
  {
    ...keyColumn<SaleRow, 'sum'>('sum', textColumn),
    title: 'Сумма проданных',
    cellClassName: ({ rowData }) => (rowData.edited ? 'editing' : 'inherit'),
  },
];
