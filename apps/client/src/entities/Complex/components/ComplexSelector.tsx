import {
  Box,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '~/shared/lib/MUI';
import useComplexesService from '../api/useComplexesService';

interface Props {
  currentId: number | null;
  onSelect: (id: number | null) => void;
  size?: 'small' | 'medium';
  disabled?: boolean;
  nullSelect?: boolean;
  fullWidth?: boolean;
  cityId?: number | null;
  districtId?: number | null;
  groupId?: number | null;
  error?: boolean;
}

export default function ComplexSelector({
  currentId,
  onSelect,
  size = 'medium',
  disabled = false,
  nullSelect = false,
  fullWidth = false,
  error = false,
  districtId,
  cityId,
  groupId,
}: Props) {
  const { complexes, loading } = useComplexesService({
    districtId,
    cityId,
    groupId,
  });

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
      fullWidth={fullWidth}
      disabled={disabled}
      error={error}
    >
      <InputLabel id='complex-label'>Жилой комплекс</InputLabel>
      <Select
        disabled={disabled}
        labelId='complex-label'
        id='complex'
        value={currentId || 0}
        onChange={handleChange}
        input={<OutlinedInput label='Жилой комплекс' size={size} error={error} />}
        fullWidth={fullWidth}
        error={error}
      >
        <MenuItem disabled={!nullSelect} value={0}>
          Не выбран
        </MenuItem>
        {complexes?.map((item) => (
          <MenuItem
            key={item.id}
            value={item.id}
            sx={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
