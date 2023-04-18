import CircularProgress from '~/shared/components/CircularProgress';
import { Box, styled, Typography } from '~/shared/lib/MUI';

interface Props {
  active: boolean;
  title: string;
  total: number | null;
  sold: number | null;
  price: number | null;
  color: string;
  onClick?: () => void;
}

const Tab = styled('button')(() => ({
  display: 'flex',
  width: '32%',
  border: '2px solid rgba(228, 221, 221, 0.12)',
  borderRadius: '3px',
  padding: '15px',
  transition: 'all 0.3s',
  cursor: 'pointer',
  backgroundColor: '#ffffff',
  boxShadow:
    'rgb(0 0 0 / 10%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0rem 0.125rem 0.25rem -0.0625rem',
}));

export default function PropertyTab({ active, title, total, sold, color, price, onClick }: Props) {
  const percent = total && sold ? Math.round((sold / total) * 100) : 0;
  return (
    <Tab
      sx={
        active
          ? {
              boxShadow: 'none',
              borderWidth: '2px',
              borderColor: color,
            }
          : undefined
      }
      onClick={onClick}
    >
      <Box
        sx={{
          width: '70%',
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          p: {
            margin: 0,
          },
        }}
      >
        {total ? (
          <>
            <Typography fontSize='clamp(12px, 1.5vw, 20px)'>{title}</Typography>
            <Typography fontWeight='bold' fontSize='clamp(10px, 1.5vw, 18px)'>{`Продано ${
              sold || 0
            } из ${total}`}</Typography>
            <Typography className='tab__price'>
              Средняя цена за м² -{' '}
              {(price || 0).toLocaleString('ru-RU', {
                maximumFractionDigits: 0,
              })}{' '}
              руб.
            </Typography>
          </>
        ) : (
          <Typography fontSize='clamp(12px, 1.5vw, 20px)'>{`Отсутствуют ${title.toLowerCase()}`}</Typography>
        )}
      </Box>
      <Box
        sx={{
          width: '30%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress
          sqSize={100}
          strokeWidth={10}
          percentage={percent}
          color={color}
          fontSize={20}
        />
      </Box>
    </Tab>
  );
}
