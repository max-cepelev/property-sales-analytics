import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { PropertyType, PropertyTypes } from '~/shared/constants/enums';

interface Props {
  current: PropertyType;
  onSelect: (id: PropertyType) => void;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

export default function PropTypeSelector({
  size = 'small',
  current,
  onSelect,
  fullWidth = false,
}: Props) {
  const handleChange = (event: SelectChangeEvent<PropertyType>) => {
    const {
      target: { value },
    } = event;
    onSelect(value as PropertyType);
  };

  return (
    <Select
      size={size}
      fullWidth={fullWidth}
      labelId='propType-label'
      id='propType'
      value={current}
      onChange={handleChange}
    >
      {Object.entries(PropertyTypes).map(([key, value]) => {
        const prop = key as PropertyType;
        return (
          <MenuItem key={prop} value={prop}>
            {value}
          </MenuItem>
        );
      })}
    </Select>
  );
}
