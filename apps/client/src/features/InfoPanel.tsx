import { useQuery } from '@apollo/client';
import { Typography } from '@mui/material';
import { BUILDING_PANEL_INFO } from '~/shared/gql-docs/buildings';
import { DecorTypes, PropertyClasses, WallMaterials } from '../shared/constants/enums';
import ToolbarWrapper from '../shared/ui/ToolbarWrapper';
import { getQuarter } from '../shared/utils/getQuarter';

interface Props {
  buildingId: number;
}

export default function InfoPanel({ buildingId }: Props) {
  const { data } = useQuery(BUILDING_PANEL_INFO, {
    variables: { id: buildingId },
  });
  return data ? (
    <ToolbarWrapper sx={{ justifyContent: 'space-between' }}>
      <Typography variant='subtitle1'>
        Класс недвижимости:{' '}
        <b>
          {data.building.propertyClass ? PropertyClasses[data.building.propertyClass] : 'не указан'}
        </b>
      </Typography>
      <Typography variant='subtitle1'>
        Материал стен:{' '}
        <b>
          {data.building.wallMaterial ? WallMaterials[data.building.wallMaterial] : 'не указан'}
        </b>
      </Typography>
      <Typography variant='subtitle1'>
        Тип отделки:{' '}
        <b>{data.building.decorType ? DecorTypes[data.building.decorType] : 'не указан'}</b>
      </Typography>
      {data.building.completionDate && (
        <Typography variant='subtitle1'>
          Ввод в эксплуатацию: <b>{getQuarter(data.building.completionDate)}</b>
        </Typography>
      )}
    </ToolbarWrapper>
  ) : null;
}
