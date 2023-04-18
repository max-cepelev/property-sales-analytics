import {
  Box,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import useDistrictsService from '../api/useDistrictsService';

interface Props {
  size?: 'small' | 'medium';
  currentId: number | null;
  onSelect: (id: number | null) => void;
  nullSelect?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  cityId?: number | null;
  error?: boolean;
}

export default function DistrictSelector({
  currentId,
  onSelect,
  size = 'medium',
  nullSelect = false,
  disabled = false,
  fullWidth = false,
  error = false,
  cityId,
}: Props) {
  const { districts, loading } = useDistrictsService(cityId);

  const handleChange = (event: SelectChangeEvent<typeof currentId>) => {
    const {
      target: { value },
    } = event;
    onSelect(value === 0 ? null : Number(value));
  };

  if (loading)
    return (
      <Box sx={{ minWidth: 135, padding: 1 }}>
        <LinearProgress />
      </Box>
    );

  return (
    <FormControl
      sx={{ m: 0, minWidth: 135 }}
      disabled={disabled}
      fullWidth={fullWidth}
      error={error}
    >
      <InputLabel id='area-label'>Район</InputLabel>
      <Select
        fullWidth={fullWidth}
        labelId='area-label'
        id='area'
        value={currentId || 0}
        onChange={handleChange}
        input={<OutlinedInput label='Район' size={size} />}
        disabled={disabled}
      >
        <MenuItem disabled={!nullSelect} value={0}>
          Все
        </MenuItem>
        {districts.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
