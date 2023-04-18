import { Typography } from '~/shared/lib/MUI';
import { Link } from 'react-router-dom';
import ColumnWrapper from '~/shared/ui/ColumnWrapper';

export default function ErrorPage() {
  return (
    <ColumnWrapper sx={{ justifyContent: 'center', alignItems: 'center', minHeight: 350 }}>
      <ColumnWrapper
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '35%',
          padding: 0,
          height: '100%',
          flexDirection: 'column',
        }}
      >
        <Typography variant='h2' fontWeight='bold'>
          404
        </Typography>
        <Typography variant='subtitle1' fontStyle='italic'>
          Страницы не существует
        </Typography>
        <Link to={'/'}>На главную</Link>
      </ColumnWrapper>
    </ColumnWrapper>
  );
}
