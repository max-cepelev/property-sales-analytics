import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateView, DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

interface PickerProps {
  value: string | Date | null;
  onChange: (e: Date | null) => void;
  views?: DateView[];
}

export default function DateSelectorCell({
  value,
  onChange,
  views = ['year', 'month'],
}: PickerProps) {
  const dateValue = dayjs(value);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
      <DatePicker
        views={views}
        // disableMaskedInput={true}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        minDate={dayjs('2020-01-01')}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        maxDate={dayjs('2030-01-01')}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        value={dateValue}
        onChange={onChange}
        slotProps={{
          textField: {
            sx: {
              height: '100%',
              '& .MuiOutlinedInput-input': {
                padding: '0 0 0 10px',
                fontSize: '12px',
                height: '100%',
              },
              '& .MuiOutlinedInput-root': {
                fontSize: 'inherit',
                borderRadius: 0,
                height: '100%',
              },
              '& .MuiButtonBase-root': {
                padding: '0 5px 0 0',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 0,
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}
