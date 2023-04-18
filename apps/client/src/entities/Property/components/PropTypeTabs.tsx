import { mdiCurrencyUsd, mdiHome, mdiParking } from '@mdi/js';
import { Icon } from '@mdi/react';
import { PropertyType, PropertyTypes } from '~/shared/constants/enums';
import { Button, ButtonGroup, Typography } from '~/shared/lib/MUI';

interface Props {
  current: PropertyType;
  onSelect: (id: PropertyType) => void;
}

export default function PropTypeTabs({ current, onSelect }: Props) {
  return (
    <ButtonGroup variant='outlined' size='medium' aria-label='outlined button group'>
      {Object.entries(PropertyTypes).map(([key, value]) => (
        <Button
          key={key}
          variant={key === current ? 'contained' : undefined}
          onClick={() => onSelect(key as PropertyType)}
          disableRipple
          sx={{
            display: 'flex',
            alignItems: 'center',
            columnGap: 1,
            boxShadow: 'none',
            padding: '6px 8px',
          }}
        >
          <Icon
            path={key === 'LIVING' ? mdiHome : key === 'COMMERCIAL' ? mdiCurrencyUsd : mdiParking}
            size={1}
            color={key === current ? '#FFFFFF' : undefined}
          />
          <Typography color={key === current ? '#FFFFFF' : undefined} variant='button'>
            {value}
          </Typography>
        </Button>
      ))}
    </ButtonGroup>
  );
}
