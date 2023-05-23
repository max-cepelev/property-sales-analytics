import { Paper, Typography } from '@mui/material';

export default function NoAccess() {
  return (
    <Paper
      variant='elevation'
      elevation={3}
      sx={{
        margin: '60px auto',
        height: '50vh',
        width: '60vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant='h6' textAlign='center'>
        У вас нет доступа к этой странице
      </Typography>
    </Paper>
  );
}
