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
import useGroupsService from '../api/useGroupsService';

interface Props {
  size?: 'small' | 'medium';
  currentId: number | null;
  onSelect: (id: number | null) => void;
  nullSelect?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  error?: boolean;
}

export default function GroupsSelector({
  currentId,
  onSelect,
  size = 'medium',
  nullSelect = false,
  disabled = false,
  fullWidth = false,
  error = false,
}: Props) {
  const { groups, loading } = useGroupsService();

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
    <FormControl
      sx={{ m: 0, minWidth: 135 }}
      disabled={disabled}
      fullWidth={fullWidth}
      error={error}
    >
      <InputLabel id='group-label'>Группа компаний</InputLabel>
      <Select
        fullWidth={fullWidth}
        labelId='group-label'
        id='group'
        value={currentId || 0}
        onChange={handleChange}
        input={<OutlinedInput label='Группа компаний' size={size} error={error} />}
        disabled={disabled}
        error={error}
      >
        <MenuItem disabled={!nullSelect} value={0}>
          Не выбрана
        </MenuItem>
        {groups.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
