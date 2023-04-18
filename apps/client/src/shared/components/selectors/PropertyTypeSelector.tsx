import { PropertyType, PropertyTypes } from '~/shared/constants/enums';
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '~/shared/lib/MUI';

interface Props {
  currentType: PropertyType;
  onSelect: (type: PropertyType) => void;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

export default function PropertyTypeSelector({
  currentType,
  onSelect,
  size = 'small',
  fullWidth = false,
}: Props) {
  const handleChange = (event: SelectChangeEvent<PropertyType>) => {
    const {
      target: { value },
    } = event;
    onSelect(value as PropertyType);
  };

  return (
    <FormControl fullWidth={fullWidth} sx={{ minWidth: 135 }}>
      <InputLabel id='prop-type'>Тип недвижимости</InputLabel>
      <Select
        labelId='prop-type'
        id='type'
        value={currentType}
        onChange={handleChange}
        input={<OutlinedInput label='Тип недвижимости' size={size} />}
        fullWidth={fullWidth}
      >
        {Object.entries(PropertyTypes)?.map(([key, value]) => (
          <MenuItem
            key={key}
            value={key}
            sx={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
