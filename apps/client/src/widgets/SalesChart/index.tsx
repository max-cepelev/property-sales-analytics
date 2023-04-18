// import { ArrowBackIos, ArrowForwardIos, CloseFullscreen, OpenInFull } from '@mui/icons-material';
import { IconButton, Typography } from '~/shared/lib/MUI';
import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AppColors } from '~/shared/constants/enums';
import ToolbarWrapper from '~/shared/ui/ToolbarWrapper';
import CustomTooltip from './CustomTooltip';
import { Icon } from '@mdi/react';
import {
  mdiArrowCollapse,
  mdiArrowTopRightBottomLeft,
  mdiChevronLeft,
  mdiChevronRight,
} from '@mdi/js';

export interface SalesChartData {
  date: Date;
  dateView: string;
  price: number | null;
  priceView: string;
  sold: number;
  soldArea: number | null;
}

interface Props {
  data: SalesChartData[];
  barColor: string;
  currentDate?: string | null;
  onClick?: (data: string) => void;
}

export default function SalesChart({ data, barColor, currentDate, onClick }: Props) {
  const initState = {
    start: data.length >= 12 ? data.length - 12 : 0,
    end: data.length,
  };
  const [allData, setAllData] = useState(false);
  const [offset, setOffset] = useState<{ start: number; end: number }>(initState);

  const current = currentDate ? new Date(currentDate) : null;

  const sliceData: SalesChartData[] = useMemo(
    () => data.slice(offset.start, offset.end),
    [data, offset],
  );

  const handleToggle = () => {
    if (allData) {
      setAllData(false);
    } else {
      setAllData(true);
    }
  };

  useEffect(() => {
    allData
      ? setOffset({ start: 0, end: data.length })
      : setOffset({
          start: data.length >= 12 ? data.length - 12 : 0,
          end: data.length,
        });
  }, [allData, data.length]);

  if (data.length === 0)
    return (
      <ToolbarWrapper>
        <Typography textAlign='center' variant='h6' width={'100%'} padding={20}>
          Нет данных по продажам
        </Typography>
      </ToolbarWrapper>
    );

  return (
    <ToolbarWrapper sx={{ position: 'relative', padding: '15px 0' }}>
      <IconButton
        onClick={() => setOffset({ start: offset.start - 1, end: offset.end - 1 })}
        disabled={offset.start === 0}
        sx={{ width: '35px', height: '35px', padding: 1 }}
      >
        <Icon path={mdiChevronLeft} size={1} />
      </IconButton>
      <ResponsiveContainer width='100%' height='100%' minHeight='350px'>
        <ComposedChart
          width={500}
          height={350}
          data={sliceData}
          margin={{
            top: 20,
            right: 5,
            bottom: 20,
            left: 5,
          }}
        >
          <CartesianGrid stroke='#f5f5f5' vertical={false} horizontal={false} />
          <XAxis dataKey='dateView' />
          <YAxis hide={true} dataKey='sold' yAxisId='sold' type='number' padding={{ top: 150 }} />
          <YAxis
            hide={true}
            dataKey='price'
            yAxisId='price'
            type='number'
            padding={{ bottom: 150 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend margin={{ top: 15, left: 0, right: 0, bottom: 0 }} />
          <Line
            type='monotone'
            yAxisId='price'
            dataKey='price'
            stroke={AppColors[3]}
            unit=' руб.'
            name='Средняя цена за м², т.р.'
            connectNulls
            animationDuration={300}
          >
            <LabelList dataKey='priceView' position='top' fontSize={14} offset={10} />
          </Line>
          <Bar
            dataKey='sold'
            yAxisId='sold'
            maxBarSize={60}
            fill={barColor}
            name='Количество проданных объектов'
            animationDuration={300}
            label={{ fill: '#000000', position: 'top', fontSize: 14 }}
          >
            {onClick &&
              current &&
              sliceData.map((entry) => {
                const date = entry.date.toISOString();
                return (
                  <Cell
                    onClick={() => onClick(date)}
                    cursor='pointer'
                    fill={
                      `${entry.date.getMonth()}${entry.date.getFullYear()}` ===
                      `${current.getMonth()}${current.getFullYear()}`
                        ? AppColors[4]
                        : barColor
                    }
                    key={date}
                  />
                );
              })}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
      <IconButton
        onClick={() => setOffset({ start: offset.start + 1, end: offset.end + 1 })}
        disabled={offset.end === data.length}
        sx={{ width: '35px', height: '35px', padding: 1 }}
      >
        <Icon path={mdiChevronRight} size={2} />
      </IconButton>
      <IconButton
        title='Все данные'
        onClick={handleToggle}
        sx={{ position: 'absolute', right: '5px', top: '5px' }}
      >
        <Icon path={allData ? mdiArrowCollapse : mdiArrowTopRightBottomLeft} size={1} />
      </IconButton>
    </ToolbarWrapper>
  );
}
