import { ReactNode } from 'react';
import './style.scss';

interface Props {
  title: string;
  value: number;
  prevValue: string | number | undefined;
  color: string;
  icon: ReactNode;
  unit?: string;
  floatNumbers?: number;
}

export default function AnalyticsCardsItem({
  title,
  value,
  prevValue,
  color,
  icon,
  unit = '',
  floatNumbers = 3,
}: Props) {
  const percent = prevValue ? ((value - Number(prevValue)) / +prevValue) * 100 : null;
  return (
    <div className='infoCard'>
      <div className='infoCard__wrapper'>
        <div className='infoCard__topContent'>
          <div
            style={{
              background: `linear-gradient(195deg, ${color}E0, ${color})`,
            }}
            className='infoCard__icon'
          >
            {icon}
          </div>
          <div className='infoCard__topContent-text'>
            <span>{title}</span>
            <h4>
              {value.toLocaleString('ru-RU', {
                maximumFractionDigits: floatNumbers,
              })}{' '}
              {unit}
            </h4>
          </div>
        </div>
        <hr className='infoCard__divider' />
        <div className='infoCard__bottomContent'>
          <p className='infoCard__bottomContent-text'>
            {percent && (
              <span
                style={{
                  color: percent > 0 ? 'rgb(76, 175, 80)' : 'rgb(244, 67, 53)',
                }}
              >
                {percent > 0
                  ? `+${percent.toLocaleString('ru-RU', {
                      maximumFractionDigits: 2,
                    })}`
                  : percent.toLocaleString('ru-RU', {
                      maximumFractionDigits: 2,
                    })}
                %
              </span>
            )}
            {percent && 'к месяцу'}
          </p>
        </div>
      </div>
    </div>
  );
}
