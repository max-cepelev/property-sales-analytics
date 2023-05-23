import { useQuery } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import DataGrid, { GridColumn } from '~/shared/components/DataGrid';
import DateSelector from '~/shared/components/selectors/DateSelector';
import { AppColors, PropertyTypes } from '~/shared/constants/enums';
import { BUILDINGS_WITHOUT_SALES } from '~/shared/gql-docs/sales';
import { Chip, Link as MuiLink, Typography } from '~/shared/lib/MUI';
import { BuildingWithoutSales, PropertyType } from '~/shared/models/gql/graphql';
import { useSelectorStore } from '~/shared/store/useSelectorStore';
import BackdropLoading from '~/shared/ui/BackdropLoading';
import ColumnWrapper from '~/shared/ui/ColumnWrapper';
import RowWrapper from '~/shared/ui/RowWrapper';
import { StyledTableContainer, TableToolbar } from '~/shared/ui/StyledTableComponents';
import ToolbarButtonsWrapper from '~/shared/ui/ToolbarButtonsWrapper';
import { getQuarter } from '~/shared/utils/getQuarter';

const getColor = (propType: PropertyType) => {
  if (propType === 'LIVING') {
    return AppColors[0];
  }
  if (propType === 'COMMERCIAL') {
    return AppColors[1];
  }
  if (propType === 'PARKING') {
    return AppColors[2];
  }
};

export function SalesCheckPage() {
  const navigate = useNavigate();
  const setPropertyType = useSelectorStore((store) => store.setPropertyType);
  const setBuildingId = useSelectorStore((store) => store.setBuildingId);
  const now = new Date();
  const [date, setDate] = useState<Date | null>(
    new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
  );
  const { loading, data = { buildingsWithoutSales: [] } } = useQuery(BUILDINGS_WITHOUT_SALES, {
    variables: { date: date?.toISOString() || now.toISOString() },
  });

  const handleChipClick = useCallback((row: BuildingWithoutSales, propType: PropertyType) => {
    setPropertyType(propType);
    setBuildingId(row.id);
    navigate('/sales');
  }, []);

  const columns: GridColumn<BuildingWithoutSales>[] = useMemo(
    () => [
      {
        title: 'Наименование',
        component: (row) => (
          <MuiLink component={Link} to={`/buildings/${row.id}`}>
            {row.name}
          </MuiLink>
        ),
      },
      {
        title: 'Срок сдачи',
        getCellValue: (row) => getQuarter(row.completionDate),
      },
      {
        title: 'Дом РФ ID',
        key: 'domRfId',
      },
      {
        title: 'ДомКлик ID',
        key: 'domClickId',
      },
      {
        title: 'Не заполнены',
        component: (row) => (
          <RowWrapper>
            {row.tags.map((tag) => (
              <Chip
                key={tag}
                label={PropertyTypes[tag]}
                sx={{ backgroundColor: getColor(tag) }}
                size='small'
                variant='filled'
                clickable
                onClick={() => handleChipClick(row, tag)}
              />
            ))}
          </RowWrapper>
        ),
      },
    ],
    [data?.buildingsWithoutSales],
  );

  return (
    <ColumnWrapper>
      <BackdropLoading open={loading} />
      <StyledTableContainer>
        <TableToolbar>
          <Typography sx={{ flexGrow: 1 }} variant='h6'>
            Проверка продаж
          </Typography>
          <ToolbarButtonsWrapper>
            <DateSelector
              size='small'
              views={['month', 'year']}
              onChange={setDate}
              value={date}
              name='date'
              label='Период'
            />
            {/* <Button variant='outlined' onClick={() => chekSales()}>
              Запустить проверку
            </Button> */}
          </ToolbarButtonsWrapper>
        </TableToolbar>
        <DataGrid
          rows={data.buildingsWithoutSales}
          columns={columns}
          // onSelect={handleSelect}
          getRowId={(row) => row.id}
          stickyHeader
        />
      </StyledTableContainer>
    </ColumnWrapper>
  );
}
