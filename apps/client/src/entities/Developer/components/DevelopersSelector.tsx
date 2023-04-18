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
import useDevelopersService from '../api/useDevelopersService';

interface Props {
  currentId: number | null;
  onSelect: (id: number | null) => void;
  size?: 'small' | 'medium';
  nullSelect?: boolean;
  fullWidth?: boolean;
  groupId?: number | null;
  error?: boolean;
}

export default function DevelopersSelector({
  currentId,
  onSelect,
  size = 'medium',
  nullSelect = false,
  fullWidth = false,
  error = false,
  groupId,
}: Props) {
  const { developers, loading } = useDevelopersService(groupId);

  const handleChange = (event: SelectChangeEvent<typeof currentId>) => {
    const {
      target: { value },
    } = event;
    onSelect(value == 0 ? null : Number(value));
  };

  if (loading)
    return (
      <Box sx={{ minWidth: 135, padding: 1 }}>
        <LinearProgress />
      </Box>
    );

  return (
    <FormControl sx={{ m: 0, minWidth: 135 }} fullWidth={fullWidth} error={error}>
      <InputLabel id='building-label'>Застройщик</InputLabel>
      <Select
        fullWidth={fullWidth}
        labelId='building-label'
        id='building'
        defaultValue={0}
        value={currentId || 0}
        onChange={handleChange}
        error={error}
        input={<OutlinedInput label='Застройщик' size={size} error={error} />}
        sx={{
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      >
        <MenuItem disabled={!nullSelect} value={0}>
          Не выбран
        </MenuItem>
        {developers?.map((item) => (
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
