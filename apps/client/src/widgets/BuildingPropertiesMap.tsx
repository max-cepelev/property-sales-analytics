import { AppColors } from '~/shared/constants/enums';
import { Typography, Box, styled } from '~/shared/lib/MUI';
import { PropAggregateResponse, PropertyRoomsAggregateResponse } from '~/shared/models/gql/graphql';
import ColorBox from '~/shared/ui/ColorBox';
import ColumnWrapper from '~/shared/ui/ColumnWrapper';

const getPercent = (number?: number | null, total?: number | null) => {
  if (number && total) {
    return total > 0 ? Math.round((number / total) * 100) : 0;
  }
  return 0;
};

const getRoomsAmount = (key: keyof PropertyRoomsAggregateResponse) => {
  switch (key) {
    case 'one':
      return 1;
    case 'two':
      return 2;
    case 'three':
      return 3;
    default:
      return 4;
  }
};

const Container = styled('div')(() => ({
  gridArea: 'propertiesMap',
  display: 'flex',
  flexDirection: 'column',
  rowGap: '15px',
  width: '100%',
}));

const CountWrapper = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: '160px 120px 300px',
  columnGap: 10,
}));

const PercentWrapper = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&:first-of-type': {
    borderTopLeftRadius: '10px',
    borderBottomLeftRadius: '10px',
  },
  '&:last-child': {
    borderTopRightRadius: '10px',
    borderBottomRightRadius: '10px',
  },
}));

interface Props {
  livingAggregate: PropertyRoomsAggregateResponse;
  propAggregate: PropAggregateResponse;
}

export default function BuildingPropertiesMap({ livingAggregate, propAggregate }: Props) {
  return (
    <Container>
      <Typography fontWeight='bold' variant='h5'>
        Квартирография
      </Typography>
      <Box
        sx={{
          width: '100%',
          height: '30px',
          display: 'flex',
          flexWrap: 'nowrap',
          transition: 'all 0.7s',
        }}
      >
        {Object.entries(livingAggregate).map(([key, item], index) => {
          if (item !== 'PropertyRoomsAggregateResponse' && item.count) {
            const percent = getPercent(item.count, propAggregate.living.count);
            return (
              <PercentWrapper
                key={key}
                sx={{
                  backgroundColor: AppColors[index],
                  width: `${percent}%`,
                }}
              >
                {percent}%
              </PercentWrapper>
            );
          }
        })}
      </Box>
      <ColumnWrapper sx={{ rowGap: '10px' }}>
        {Object.entries(livingAggregate).map(([key, item], index) => {
          if (item !== 'PropertyRoomsAggregateResponse' && item.count) {
            return (
              <CountWrapper key={key}>
                <ColorBox
                  color={AppColors[index]}
                  text={`${getRoomsAmount(key as keyof PropertyRoomsAggregateResponse)}-комнатные`}
                />
                <Typography variant='subtitle1'>квартир: {item.count}</Typography>
                <Typography variant='subtitle1'>
                  от {item.minArea} до {item.maxArea} средняя {item.avgArea.toFixed(2)} м²
                </Typography>
              </CountWrapper>
            );
          }
        })}
      </ColumnWrapper>
    </Container>
  );
}
