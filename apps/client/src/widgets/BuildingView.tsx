import { mdiPencil } from '@mdi/js';
import { Icon } from '@mdi/react';

import CustomImage from '~/shared/components/CustomImage';
import { DecorTypes, PropertyClasses, WallMaterials } from '~/shared/constants/enums';
import { Box, Divider, IconButton, styled, Typography } from '~/shared/lib/MUI';
import { Building, PropAggregateResponse } from '~/shared/models/gql/graphql';
import RowWrapper from '~/shared/ui/RowWrapper';
import { getQuarter } from '~/shared/utils/getQuarter';

interface Props {
  building: Building;
  propAggregate: PropAggregateResponse;
  onEdit?: () => void;
}

const Wrapper = styled('div')(() => ({
  display: 'grid',
  width: '100%',
  columnGap: 'clamp(50px, 4vw, 80px)',
  rowGap: 'clamp(15px, 6vh, 20px)',
  gridTemplateColumns: '2fr minmax(500px, 1fr)',
  gridTemplateRows: 'auto 460px 1fr',
  gridTemplateAreas: `
    'title         title'
    'image         info'
    'propertiesMap propertiesMap'
    `,
}));

const TextWrapper = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  h4: {
    color: '#666666',
    fontSize: 'clamp(12px, 1.2vw, 16px)',
    margin: 0,
  },
  span: {
    color: '#111111',
    fontSize: 'clamp(12px, 1.2vw, 16px)',
  },
}));

export default function BuildingView({ building, onEdit, propAggregate }: Props) {
  return (
    <Wrapper>
      <Box gridArea='title' display='flex' flexDirection='column' justifyContent='space-between'>
        <RowWrapper>
          <Typography width='100%' fontWeight='bold' variant='h4'>
            {building?.complex?.name}
          </Typography>
          {onEdit && (
            <IconButton onClick={onEdit}>
              <Icon path={mdiPencil} size={1} />
            </IconButton>
          )}
        </RowWrapper>
        <Typography
          fontWeight='bold'
          color='#666666'
        >{`${building?.city?.region?.name}, г. ${building?.city?.name}, ${building.address}`}</Typography>
      </Box>
      <Box gridArea='image' width='100%' height='100%'>
        <CustomImage url={building?.img || null} alt={building.name} />
      </Box>
      <Box gridArea='info' display='flex' flexDirection='column' rowGap={2}>
        <TextWrapper>
          <h4>Группа компаний</h4>
          <span>{building?.group?.name || 'Не входит в группу компаний'}</span>
        </TextWrapper>
        <TextWrapper>
          <h4>Застройщик</h4>
          <span>{building?.developer?.name || ''}</span>
        </TextWrapper>
        <Divider
          sx={{
            height: '0.07rem',
            marginBottom: '0.8rem 0',
            opacity: 0.5,
            backgroundColor: 'transparent',
            backgroundImage:
              'linear-gradient(to right, rgba(255, 255, 255, 0),#666666, rgba(255, 255, 255, 0))',
          }}
          className='buildingView__info-divider'
        />
        <TextWrapper>
          <h4>Срок сдачи</h4>
          <span>{getQuarter(building?.completionDate) || ''}</span>
        </TextWrapper>
        <TextWrapper>
          <h4>Жилая площадь, м²</h4>
          <span>{propAggregate?.living?.totalArea.toFixed(2) || 0}</span>
        </TextWrapper>
        <TextWrapper>
          <h4>Количество квартир</h4>
          <span>{`${propAggregate?.living?.count}`}</span>
        </TextWrapper>
        <TextWrapper>
          <h4>Количество этажей</h4>
          <span>{propAggregate?.living?.floors ?? 'Не указано'}</span>
        </TextWrapper>
        <TextWrapper>
          <h4>Количество подъездов</h4>
          <span>{propAggregate?.living?.entrances ?? 'Не указано'}</span>
        </TextWrapper>
        <TextWrapper>
          <h4>Класс недвижимости</h4>
          <span>
            {building.propertyClass ? PropertyClasses[building.propertyClass] : 'Не указан'}
          </span>
        </TextWrapper>
        <TextWrapper>
          <h4>Материал стен</h4>
          <span>{building.wallMaterial ? WallMaterials[building.wallMaterial] : 'Не указан'}</span>
        </TextWrapper>
        <TextWrapper>
          <h4>Тип отделки</h4>
          <span>{building.decorType ? DecorTypes[building.decorType] : 'Не указан'}</span>
        </TextWrapper>
        <TextWrapper>
          <h4>Количество нежилых</h4>
          <span>{`${propAggregate?.commercial?.count}`}</span>
        </TextWrapper>
        <TextWrapper>
          <h4>Количество машино-мест</h4>
          <span>{`${propAggregate?.parking?.count}`}</span>
        </TextWrapper>
      </Box>
    </Wrapper>
  );
}
