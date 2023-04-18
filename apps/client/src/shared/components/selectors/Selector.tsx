import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
interface Props {
  options: { id: number | string; name: string }[];
  value: number | string | null;
  onChange: (id: number | string | null) => void;
  label: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  variant?: 'standard' | 'outlined' | 'filled';
  disableUnderline?: boolean;
  nullSelect?: boolean;
  noEmptyText?: string;
  error?: boolean;
  width?: string | number;
}

export default function Selector({
  options,
  value,
  onChange,
  size = 'small',
  fullWidth = false,
  variant = 'outlined',
  nullSelect = false,
  noEmptyText = 'Не выбрано',
  label,
  error,
  width,
}: Props) {
  const handleChange = (event: SelectChangeEvent<typeof value>) => {
    const {
      target: { value },
    } = event;
    onChange(value === 'no-empty' ? null : value);
  };

  return (
    <FormControl fullWidth={fullWidth} variant={variant} sx={{ width }}>
      {variant !== 'standard' && <InputLabel id={`${label}-label`}>{label}</InputLabel>}
      <Select
        size={size}
        fullWidth={fullWidth}
        labelId={`${label}-label`}
        id={label}
        value={value || 'no-empty'}
        onChange={handleChange}
        label={label}
        // variant={variant}
        sx={{ padding: 0, fontWeight: 'bold' }}
        error={error}
        // disableUnderline={disableUnderline}
      >
        {(nullSelect || value === null) && (
          <MenuItem value='no-empty' disabled={!nullSelect}>
            {noEmptyText}
          </MenuItem>
        )}
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
