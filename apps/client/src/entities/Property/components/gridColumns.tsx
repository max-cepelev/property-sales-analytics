import { Column, keyColumn, textColumn } from 'react-datasheet-grid';
import { PropertyRow, PropertyType } from '../../../entities/Property/models/Property';

export const getColumns = (type: PropertyType) => {
  const columns: Column<PropertyRow>[] = [
    {
      ...keyColumn<PropertyRow, 'number'>('number', textColumn),
      title: 'Номер',
      cellClassName: ({ rowData }) => (rowData.edited ? 'editing' : 'inherit'),
      minWidth: 50,
    },
    {
      ...keyColumn<PropertyRow, 'floor'>('floor', textColumn),
      title: 'Этаж',
      cellClassName: ({ rowData }) => (rowData.edited ? 'editing' : 'inherit'),
      minWidth: 50,
    },
    {
      ...keyColumn<PropertyRow, 'entrance'>('entrance', textColumn),
      title: 'Подъезд',
      cellClassName: ({ rowData }) => (rowData.edited ? 'editing' : 'inherit'),
    },
    {
      ...keyColumn<PropertyRow, 'totalArea'>('totalArea', textColumn),
      title: 'Общая площадь',
      cellClassName: ({ rowData }) => (rowData.edited ? 'editing' : 'inherit'),
    },
  ];
  if (type === 'LIVING') {
    columns.push(
      {
        ...keyColumn<PropertyRow, 'rooms'>('rooms', textColumn),
        title: 'Количество комнат',
        cellClassName: ({ rowData }) => (rowData.edited ? 'editing' : 'inherit'),
      },
      {
        ...keyColumn<PropertyRow, 'livingArea'>('livingArea', textColumn),
        title: 'Жилая площадь',
        cellClassName: ({ rowData }) => (rowData.edited ? 'editing' : 'inherit'),
      },
      {
        ...keyColumn<PropertyRow, 'wallHeight'>('wallHeight', textColumn),
        title: 'Высота потолков',
        cellClassName: ({ rowData }) => (rowData.edited ? 'editing' : 'inherit'),
      },
    );
  } else {
    columns.push({
      ...keyColumn<PropertyRow, 'wallHeight'>('wallHeight', textColumn),
      title: 'Высота потолков',
      cellClassName: ({ rowData }) => (rowData.edited ? 'editing' : 'inherit'),
    });
  }
  return columns;
};
