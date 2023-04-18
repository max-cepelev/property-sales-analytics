import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from '~/shared/lib/MUI';
import React, { useState } from 'react';
import { AppColors, PropertyType, PropertyTypes } from '~/shared/constants/enums';
import BuildingList from './BuildingList';
import TooltipContent from './TooltipContent';
import { mdiChevronDown, mdiChevronRight } from '@mdi/js';
import { Icon } from '@mdi/react';
import { SalesDataByComplex } from '~/shared/models/gql/graphql';
import { SalesAggregate } from '~/entities/Sale/models/Sale';

interface Props {
  complexes: SalesDataByComplex[];
  dataType: keyof SalesAggregate;
  date: string;
  propertyType: PropertyType;
  onSelect: (title: string, buildingIds: number[]) => void;
  paddingLeft?: number;
}

export default function ComplexList({
  complexes,
  dataType,
  date,
  propertyType,
  onSelect,
  paddingLeft,
}: Props) {
  const [complexIndexes, setComplexIndexes] = useState<number[]>([]);

  const handleComplexClick = (index: number) => {
    complexIndexes.includes(index)
      ? setComplexIndexes((prev) => prev.filter((item) => item !== index))
      : setComplexIndexes((prev) => [...prev, index]);
  };
  return (
    <List component='div' disablePadding sx={{ width: '100%' }}>
      {[...complexes]
        .sort((a, b) =>
          b.sales[dataType] && a.sales[dataType] ? b.sales[dataType] - a.sales[dataType] : 1,
        )
        .map((complex, _, complexes) => (
          <React.Fragment key={complex.id}>
            <ListItem
              sx={{
                pl: paddingLeft,
                columnGap: 1,
                height: 30,
                marginBottom: 1,
              }}
            >
              <IconButton onClick={() => handleComplexClick(complex.id)}>
                <Icon
                  path={complexIndexes.includes(complex.id) ? mdiChevronDown : mdiChevronRight}
                  size={1}
                />
              </IconButton>
              <Tooltip
                arrow
                title={
                  <TooltipContent
                    name={complex.name}
                    date={date}
                    number={complex.sales?.number || 0}
                    area={complex.sales?.area || 0}
                    price={complex.sales?.price || 0}
                    groupName={complex.groupName}
                  />
                }
              >
                <ListItemButton
                  sx={{ columnGap: 1 }}
                  onClick={() =>
                    onSelect(
                      complex.name,
                      complex.buildings.map((item) => item.id),
                    )
                  }
                >
                  <ListItemText
                    primary={complex.name}
                    sx={{
                      whiteSpace: 'nowrap',
                      flex: '0 1 245px',
                      '& .MuiTypography-root': {
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      },
                    }}
                  />
                  <Box
                    width={
                      complex.sales && complexes[0]?.sales
                        ? `${(complex.sales[dataType] / complexes[0].sales[dataType]) * 60}%`
                        : 0
                    }
                    height='15px'
                    bgcolor={
                      AppColors[
                        Object.keys(PropertyTypes).findIndex((item) => item === propertyType) + 1
                      ]
                    }
                  />
                  <Typography variant='body2'>
                    {complex.sales ? complex.sales[dataType] : ''}
                  </Typography>
                </ListItemButton>
              </Tooltip>
            </ListItem>
            <Collapse in={complexIndexes.includes(complex.id)} timeout='auto' unmountOnExit>
              <BuildingList
                buildings={complex.buildings}
                dataType={dataType}
                date={date}
                propertyType={propertyType}
                onSelect={onSelect}
                paddingLeft={12}
              />
            </Collapse>
          </React.Fragment>
        ))}
    </List>
  );
}
