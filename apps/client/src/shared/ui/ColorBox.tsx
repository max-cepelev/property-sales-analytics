import { Box, Typography } from '../lib/MUI';

interface IColorBoxProps {
  color?: string;
  text?: string;
}

export default function ColorBox({ color = '', text = '' }: IColorBoxProps) {
  return (
    <div
      style={{
        display: 'grid',
        width: 'auto',
        gap: 5,
        gridTemplateColumns: '20px 1fr',
        alignItems: 'center',
      }}
    >
      <Box
        border={1}
        style={{
          width: 20,
          height: 20,
          backgroundColor: color,
          borderRadius: 5,
          border: 'none',
        }}
      />
      <Typography paddingLeft={1} variant='subtitle1'>
        {text}
      </Typography>
    </div>
  );
}
