import { DataSheetGrid } from 'react-datasheet-grid';
import { Operation } from 'react-datasheet-grid/dist/types';
import { columns } from './gridColumns';
import { SaleRow } from '../../models/Sale';

interface Props {
  rows: SaleRow[];
  setRows: React.Dispatch<React.SetStateAction<SaleRow[]>>;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SalesGrid({ rows, setRows, setEditMode }: Props) {
  const handleChange = (data: SaleRow[], operation: Operation[]) => {
    const { fromRowIndex, toRowIndex } = operation[0];
    const newData = [...data];
    for (let i = fromRowIndex; i < toRowIndex; i++) {
      newData[i].edited = true;
    }
    setEditMode(true);
    setRows(newData);
  };

  return (
    <DataSheetGrid
      className='salesGrid'
      value={rows}
      onChange={handleChange}
      columns={columns}
      rowHeight={32}
      headerRowHeight={45}
      disableContextMenu
      height={700}
    />
  );
}
