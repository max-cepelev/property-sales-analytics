import { AppColors, PropertyType, PropertyTypes } from '~/shared/constants/enums';
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from '~/shared/lib/MUI';
import { useSelectorStore } from '~/shared/store/useSelectorStore';
import TooltipContent from './TooltipContent';
import { Icon } from '@mdi/react';
import { mdiStar, mdiStarOutline } from '@mdi/js';
import { SalesDataByBuilding } from '~/shared/models/gql/graphql';
import { SalesAggregate } from '~/entities/Sale/models/Sale';
interface Props {
  buildings: SalesDataByBuilding[];
  dataType: keyof SalesAggregate;
  date: string;
  propertyType: PropertyType;
  onSelect: (title: string, buildingIds: number[]) => void;
  paddingLeft?: number;
}

export default function BuildingList({
  buildings,
  dataType,
  date,
  propertyType,
  onSelect,
  paddingLeft,
}: Props) {
  const favorites = useSelectorStore((store) => store.favorites);
  const toggleFavorites = useSelectorStore((store) => store.toggleFavorites);
  return (
    <List component='div' disablePadding sx={{ width: '100%' }}>
      {[...buildings]
        .sort((a, b) => b.sales.number - a.sales.number)
        .map((building, _, buildings) => (
          <Tooltip
            key={building.id}
            arrow
            title={
              <TooltipContent
                name={building.name}
                date={date}
                number={building.sales.number}
                area={building.sales.area}
                price={building.sales.price}
                groupName={building.groupName}
                complexName={building.complexName}
                completionDate={building.completionDate}
              />
            }
          >
            <ListItemButton
              sx={{
                pl: paddingLeft,
                columnGap: 1,
                height: 30,
                marginBottom: 1,
              }}
              onClick={() => onSelect(building.name, [building.id])}
            >
              <ListItemText
                primary={building.name}
                sx={{
                  whiteSpace: 'nowrap',
                  flex: '0 1 245px',
                  '& .MuiTypography-root': {
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  },
                }}
              />
              <IconButton
                size='small'
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorites(building.id);
                }}
              >
                {favorites.includes(building.id) ? (
                  <Icon path={mdiStar} color='#faaf00' size={1} />
                ) : (
                  <Icon path={mdiStarOutline} size={1} />
                )}
              </IconButton>
              <Box
                width={
                  building.sales && buildings[0].sales
                    ? `${(building.sales[dataType] / buildings[0].sales[dataType]) * 40}%`
                    : 0
                }
                height='15px'
                bgcolor={
                  AppColors[
                    Object.keys(PropertyTypes).findIndex((item) => item === propertyType) + 2
                  ]
                }
              />
              <Typography variant='caption'>
                {building.sales ? building.sales[dataType] : ''}
              </Typography>
            </ListItemButton>
          </Tooltip>
        ))}
    </List>
  );
}
