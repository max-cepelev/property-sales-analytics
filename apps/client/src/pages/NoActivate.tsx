import { Paper, Typography } from '@mui/material';

export default function NoActivate() {
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
      <Typography variant='h6' fontStyle='italic' textAlign='center'>
        Ваша учетная запись не активирована.
        <br /> Мы проверим ваши данные и отправим ссылку для активации вам на почту.
        <br />
        Если письмо долго не приходит, напиште нам на почту{' '}
        <a href='email:info@permnovostroy.ru'>info@permnovostroy.ru</a>
      </Typography>
    </Paper>
  );
}
