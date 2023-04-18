import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';

interface Props {
  data: string[];
  prop: string;
  currentValue: string | null;
  label: string;
  onSelect: (value: string | null) => void;
}

export default function StringSelector({ data, prop, currentValue, onSelect, label }: Props) {
  const handleChange = (event: SelectChangeEvent<typeof currentValue>) => {
    const {
      target: { value },
    } = event;
    onSelect(value === '0' ? null : value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id={`${prop}-label`}>{label}</InputLabel>
      <Select
        labelId={`${prop}-label`}
        id={`${prop}-id`}
        value={currentValue || '0'}
        onChange={handleChange}
        input={<OutlinedInput label={label} size='small' id={`${prop}-id`} />}
      >
        <MenuItem value='0'>Не выбрано</MenuItem>
        {data.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
