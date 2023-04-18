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
import ComplexList from './ComplexList';
import TooltipContent from './TooltipContent';
import { AppColors, PropertyType, PropertyTypes } from '~/shared/constants/enums';
import { Icon } from '@mdi/react';
import { mdiChevronDown, mdiChevronRight } from '@mdi/js';
import { SalesDataByGroup } from '~/shared/models/gql/graphql';
import { SalesAggregate } from '~/entities/Sale/models/Sale';

interface Props {
  data: SalesDataByGroup[];
  dataType: keyof SalesAggregate;
  date: string;
  propertyType: PropertyType;
  onBuildingsSelect: (title: string, buildingIds: number[]) => void;
  onGroupSelect: (id: number) => void;
}

export default function GroupList({
  data,
  dataType,
  date,
  propertyType,
  onBuildingsSelect,
  onGroupSelect,
}: Props) {
  const [groupIndexes, setGroupIndexes] = useState<number[]>([]);

  const handleGroupClick = (index: number) => {
    groupIndexes.includes(index)
      ? setGroupIndexes((prev) => prev.filter((item) => item !== index))
      : setGroupIndexes((prev) => [...prev, index]);
  };

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      aria-labelledby='nested-list-subheader'
    >
      {data.length ? (
        [...data]
          .sort((a, b) => b.sales[dataType] - a.sales[dataType])
          .map((item, _, arr) => (
            <React.Fragment key={item.id}>
              <ListItem sx={{ columnGap: 1, height: 35, marginBottom: 1 }}>
                <IconButton onClick={() => handleGroupClick(item.id)}>
                  <Icon
                    path={groupIndexes.includes(item.id) ? mdiChevronDown : mdiChevronRight}
                    size={1}
                  />
                </IconButton>
                <Tooltip
                  arrow
                  title={
                    <TooltipContent
                      name={item.name}
                      date={date}
                      number={item.sales.number}
                      area={item.sales.area}
                      price={item.sales.price}
                    />
                  }
                >
                  <ListItemButton sx={{ columnGap: 1 }} onClick={() => onGroupSelect(item.id)}>
                    <ListItemText
                      sx={{
                        whiteSpace: 'nowrap',
                        flex: '0 1 250px',
                        '& .MuiTypography-root': {
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                        },
                      }}
                      primary={item.name}
                    />
                    <Box
                      width={`${(item.sales[dataType] / arr[0].sales[dataType]) * 70}%`}
                      height='18px'
                      bgcolor={
                        AppColors[
                          Object.keys(PropertyTypes).findIndex((item) => item === propertyType)
                        ]
                      }
                    />
                    <Typography variant='body1'>{item.sales[dataType]}</Typography>
                  </ListItemButton>
                </Tooltip>
              </ListItem>
              <Collapse in={groupIndexes.includes(item.id)} timeout='auto' unmountOnExit>
                <ComplexList
                  complexes={item.complexes}
                  dataType={dataType}
                  date={date}
                  propertyType={propertyType}
                  onSelect={onBuildingsSelect}
                  paddingLeft={4}
                />
              </Collapse>
            </React.Fragment>
          ))
      ) : (
        <ListItem
          sx={{
            fontStyle: 'italic',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          Список пуст, измените фильтр
        </ListItem>
      )}
    </List>
  );
}
