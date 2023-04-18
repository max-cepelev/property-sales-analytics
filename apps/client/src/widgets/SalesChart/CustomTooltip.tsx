import { SalesChartData } from '.';

import './style.scss';

export default function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data: SalesChartData = payload[0].payload;
    const date = data.date.toLocaleString('ru-RU', {
      month: 'long',
      year: 'numeric',
    });
    return (
      <div className='salesTooltip'>
        <h4 className='salesTooltip__label'>{date}</h4>
        <div>
          Продано объектов: <b>{data.sold}</b>
        </div>
        {data.price && (
          <div>
            Средняя цена <b>{data.price.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}</b>{' '}
            руб/м²
          </div>
        )}
        {data.soldArea && (
          <div>
            Проданная площадь: <b>{data.soldArea}</b> м²
          </div>
        )}
      </div>
    );
  }

  return null;
}
