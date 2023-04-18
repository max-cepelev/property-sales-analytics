import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateView, LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

export interface DateSelectorProps {
  onChange: (e: Date | null) => void;
  value: string | Date | null;
  name: string;
  label: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  size?: 'small' | 'medium';
  views?: DateView[];
  openTo?: DateView;
}

export default function DateSelector({
  label,
  onChange,
  value,
  name,
  error,
  helperText,
  views = ['year', 'month', 'day'],
  disabled,
  size = 'medium',
  openTo,
}: DateSelectorProps) {
  const dateValue = dayjs(value);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
      <DatePicker
        onChange={onChange}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        value={dateValue}
        label={label}
        disabled={disabled}
        views={views}
        openTo={openTo}
        slotProps={{
          textField: {
            helperText,
            error,
            name,
            size,
          },
        }}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        minDate={dayjs('2020-01-01')}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        maxDate={dayjs('2035-01-01')}
      />
    </LocalizationProvider>
  );
}
