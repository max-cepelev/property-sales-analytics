import 'dayjs/locale/ru';

import { DatePicker, DateView, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

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
  const handleDateChange = (e: dayjs.Dayjs) => {
    console.log(e.format('YYYY-MM-DD'));
    onChange(e.isValid() ? e.toDate() : null);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
      <DatePicker
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        onChange={handleDateChange}
        value={dayjs(value)}
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
        minDate={dayjs('2020-01-01')}
        maxDate={dayjs('2035-01-01')}
      />
    </LocalizationProvider>
  );
}
