import { Typography } from '@mui/material';
import { getQuarter } from '~/shared/utils/getQuarter';

interface Props {
  name: string;
  date: string;
  number: number;
  area: number;
  price: number;
  complexName?: string;
  groupName?: string;
  completionDate?: string;
}

export default function TooltipContent({
  name,
  date,
  number,
  area,
  price,
  complexName,
  completionDate,
  groupName,
}: Props) {
  return (
    <div>
      <Typography variant='subtitle1'>{name}</Typography>
      {groupName && <div>Застройщк: {groupName}</div>}
      {complexName && <div>ЖК: {complexName}</div>}
      {completionDate && <div>Сдача: {getQuarter(completionDate)}</div>}
      <div>
        Продажи за{' '}
        {new Date(date).toLocaleString('ru-RU', {
          month: 'long',
          year: 'numeric',
        })}
      </div>
      <div>Количество: {number}</div>
      <div>Площадь: {area.toLocaleString()} м²</div>
      <div>Средняя цена за м²: {price.toLocaleString()} тыс. руб.</div>
    </div>
  );
}
