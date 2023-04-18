import { useMemo } from 'react';
import { DynamicDataSheetGrid } from 'react-datasheet-grid';
import { Operation } from 'react-datasheet-grid/dist/types';
import { PropertyType } from '~/shared/constants/enums';
import { PropertyRow } from '../models/Property';
import { getColumns } from './gridColumns';

interface Props {
  rows: PropertyRow[];
  setRows: React.Dispatch<React.SetStateAction<PropertyRow[]>>;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  propType: PropertyType;
}

export default function PropertiesGrid({ rows, setRows, setEditMode, propType }: Props) {
  const columns = useMemo(() => getColumns(propType), [propType]);

  const handleChange = (data: PropertyRow[], operation: Operation[]) => {
    const { fromRowIndex, toRowIndex } = operation[0];
    const newData = [...data];
    for (let i = fromRowIndex; i < toRowIndex; i++) {
      newData[i].edited = true;
    }
    setEditMode(true);
    setRows(newData);
  };

  return (
    <DynamicDataSheetGrid
      className='propertiesGrid'
      value={rows}
      onChange={handleChange}
      columns={columns}
      rowHeight={32}
      headerRowHeight={40}
      // disableContextMenu
      height={600}
    />
  );
}
