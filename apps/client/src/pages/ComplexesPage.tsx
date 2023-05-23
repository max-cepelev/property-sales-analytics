import { mdiPlus } from '@mdi/js';
import { Icon } from '@mdi/react';
import { useState } from 'react';

import CitySelector from '~/entities/City/components/CitySelector';
import useComplexesService from '~/entities/Complex/api/useComplexesService';
import { ComplexInputSchema } from '~/entities/Complex/schema/complexInputSchema';
import DistrictSelector from '~/entities/District/components/DistrictSelector';
import ComplexEditDialog from '~/features/dialogs/ComplexEditDialog';
import GroupAutocompleteSelector from '~/features/selectors/GroupAutocompleteSelector';
import DataGrid, { GridColumn } from '~/shared/components/DataGrid';
import { Button, IconButton, Link, Typography } from '~/shared/lib/MUI';
import { Complex } from '~/shared/models/gql/graphql';
import { useSelectorStore } from '~/shared/store/useSelectorStore';
import BackdropLoading from '~/shared/ui/BackdropLoading';
import ColumnWrapper from '~/shared/ui/ColumnWrapper';
import { StyledTableContainer, TableToolbar } from '~/shared/ui/StyledTableComponents';
import ToolbarButtonsWrapper from '~/shared/ui/ToolbarButtonsWrapper';

export default function ComplexesPage() {
  const [state, setState] = useState<ComplexInputSchema | null>(null);
  const [addComplexDialog, setAddComplexDialog] = useState(false);

  const groupId = useSelectorStore((store) => store.groupId);
  const setGroupId = useSelectorStore((store) => store.setGroupId);

  const cityId = useSelectorStore((store) => store.cityId);
  const setCityId = useSelectorStore((store) => store.setCityId);

  const districtId = useSelectorStore((store) => store.districtId);
  const setDistrictId = useSelectorStore((store) => store.setDistrictId);

  const { complexes, create, update, remove, loading } = useComplexesService({
    groupId,
    districtId,
    cityId,
  });

  const columns: GridColumn<Complex>[] = [
    { key: 'name', title: 'Наименование' },
    { key: 'shortName', title: 'Сокращенное наименование' },
    { title: 'Застройщик', getCellValue: (row) => row.group.name },
    {
      key: 'website',
      title: 'Сайт',
      component: (row) =>
        row.website ? (
          <Link
            href={`https://${row.website}`}
            target='_blank'
            rel='noreferrer'
            onClick={(e) => e.stopPropagation()}
          >
            {row.website}
          </Link>
        ) : (
          ''
        ),
    },
    {
      key: 'info',
      title: 'Описание',
    },
  ];

  const handleReset = () => {
    setDistrictId(null);
    setGroupId(null);
  };

  const handleCancel = () => {
    setAddComplexDialog(false);
    setState(null);
  };

  const handleSelect = (complex: Complex) => {
    setState({
      id: complex.id,
      name: complex.name,
      shortName: complex.shortName || null,
      cityId: complex.cityId,
      districtId: complex.districtId,
      domClickId: complex.domClickId || null,
      domRfId: complex.domRfId || null,
      groupId: complex.groupId,
      info: complex.info || null,
      website: complex.website || null,
    });
  };

  const handleSaveClick = (complex: ComplexInputSchema) => {
    const { id } = complex;
    id
      ? update({
          variables: {
            id,
            input: complex,
          },
        })
      : create({ variables: { input: complex } });
  };
  return (
    <ColumnWrapper>
      <BackdropLoading open={loading} />
      <StyledTableContainer>
        <TableToolbar>
          <Typography sx={{ flexGrow: 1 }} variant='h6'>
            Жилые комплексы
          </Typography>
          <ToolbarButtonsWrapper>
            <Button onClick={handleReset}>Сбросить</Button>
            <CitySelector size='small' currentId={cityId} onSelect={(id) => setCityId(id)} />
            <DistrictSelector
              size='small'
              currentId={districtId}
              cityId={cityId}
              nullSelect
              onSelect={(id) => setDistrictId(id)}
            />
            <GroupAutocompleteSelector currentId={groupId} onSelect={(id) => setGroupId(id)} />
          </ToolbarButtonsWrapper>
          <IconButton color='secondary' onClick={() => setAddComplexDialog(true)}>
            <Icon path={mdiPlus} size={1} />
          </IconButton>
        </TableToolbar>
        <DataGrid
          rows={complexes}
          columns={columns}
          onSelect={handleSelect}
          stickyHeader
          getRowId={(row) => row.id}
        />
      </StyledTableContainer>
      <ComplexEditDialog
        open={addComplexDialog || Boolean(state)}
        complex={state}
        onSave={handleSaveClick}
        onClose={handleCancel}
        onDelete={(id) => remove({ variables: { id } })}
      />
    </ColumnWrapper>
  );
}
