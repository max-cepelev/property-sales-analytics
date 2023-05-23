import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useBuildings from '~/entities/Building/api/useBuildings';
import BuildingInputDialog from '~/features/dialogs/BuildingInputDialog';
import DataGrid, { GridColumn } from '~/shared/components/DataGrid';
import Pagination from '~/shared/components/Pagination';
import { DecorTypes, PropertyClasses, WallMaterials } from '~/shared/constants/enums';
import { PickFrom } from '~/shared/models/Common';
import { Building } from '~/shared/models/gql/graphql';
import { useAuthStore } from '~/shared/store/useAuthStore';
import { useSelectorStore } from '~/shared/store/useSelectorStore';
import BackdropLoading from '~/shared/ui/BackdropLoading';
import ColumnWrapper from '~/shared/ui/ColumnWrapper';
import { StyledTableContainer } from '~/shared/ui/StyledTableComponents';
import { getQuarter } from '~/shared/utils/getQuarter';
import BuildingsTableToolbar from '~/widgets/BuildigsTableToolbar';

interface GridData
  extends PickFrom<
    Building,
    [
      'id',
      'name',
      'address',
      'completionDate',
      'propertyClass',
      'wallMaterial',
      'decorType',
      'latitude',
      'longitude',
      'complex',
      'developer',
      'group',
    ]
  > {
  groupName: string;
  developerName: string;
  complexName: string;
  propertyClassName: string | null;
  decorTypeName: string | null;
  wallMaterialName: string | null;
}

export default function BuildingsPage() {
  const permission = useAuthStore((store) => store.permission);
  const navigate = useNavigate();
  const [addDialog, setAddDialog] = useState(false);
  const [completed, setCompleted] = useState<boolean | undefined>(undefined);
  const [term, setTerm] = useState('');
  const pageSize = 15;

  const complexId = useSelectorStore((store) => store.complexId);
  const cityId = useSelectorStore((store) => store.cityId);
  const groupId = useSelectorStore((store) => store.groupId);
  const districtId = useSelectorStore((store) => store.districtId);
  const page = useSelectorStore((store) => store.page);
  const setPage = useSelectorStore((store) => store.setPage);

  const startIndex = (page - 1) * pageSize;

  const { buildings, loading, create, update } = useBuildings({
    cityId,
    districtId,
    groupId,
    completed,
    complexId,
  });

  const rows = useMemo(
    () =>
      buildings
        ? buildings.buildings.reduce((rows: GridData[], item) => {
            const text = term.toLowerCase();
            if (
              item.name.toLowerCase().includes(text) ||
              item.address.toLowerCase().includes(text)
            ) {
              rows.push({
                ...item,
                groupName: item.group?.name || '',
                developerName: item.developer?.name || '',
                complexName: item.complex?.name || '',
                completionDate: getQuarter(item.completionDate || null),
                propertyClassName: item.propertyClass ? PropertyClasses[item.propertyClass] : null,
                decorTypeName: item.decorType ? DecorTypes[item.decorType] : null,
                wallMaterialName: item.wallMaterial ? WallMaterials[item.wallMaterial] : null,
              });
            }
            return rows;
          }, [])
        : [],
    [buildings, term],
  );

  const columns: GridColumn<GridData>[] = [
    { key: 'name', title: 'Наименование' },
    { key: 'complexName', title: 'ЖК' },
    { key: 'address', title: 'Адрес' },
    { key: 'developerName', title: 'Застройщик' },
    { key: 'completionDate', title: 'Ввод в эксплуатацию' },
    { key: 'propertyClassName', title: 'Класс недвижимости' },
    { key: 'wallMaterialName', title: 'Материал стен' },
    { key: 'decorTypeName', title: 'Отделка' },
  ];

  useEffect(() => {
    setPage(1);
  }, [rows, setPage]);

  return (
    <ColumnWrapper>
      <BackdropLoading open={loading} />
      <StyledTableContainer>
        <BuildingsTableToolbar
          completed={completed}
          onSetCompleted={(e) => setCompleted(e)}
          permission={permission}
          onAdd={() => setAddDialog(true)}
          onChangeSearchTerm={(value) => setTerm(value)}
        />
        <DataGrid
          rows={rows.slice(startIndex, startIndex + pageSize)}
          maxHeight='70vh'
          onSelect={(row) => navigate(`/buildings/${row.id}`)}
          stickyHeader
          columns={columns}
          getRowId={(row) => row.id}
          noDataText='Список пуст, измените фильтр'
        />
        {/* <BuildingsMap onClick={(id) => navigate(`/buildings/${id}`)} data={rows} /> */}
      </StyledTableContainer>
      <Pagination
        onPageChange={(num) => setPage(num)}
        totalCount={rows.length}
        siblingCount={1}
        currentPage={page}
        pageSize={pageSize}
        className='buildingsPagination'
      />
      <BuildingInputDialog
        open={addDialog}
        onClose={() => setAddDialog(false)}
        permission={permission}
        onSave={(input) =>
          input.id
            ? update({ variables: { id: input.id, input } })
            : create({ variables: { input } })
        }
      />
    </ColumnWrapper>
  );
}
