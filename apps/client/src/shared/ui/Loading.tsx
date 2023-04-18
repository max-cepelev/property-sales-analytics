import { LinearProgress, styled } from '~/shared/lib/MUI';

const Wrapper = styled('div')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
}));

const Loading = () => {
  return (
    <div
      style={{
        margin: 'auto',
        minHeight: '40vh',
        maxWidth: 320,
        display: 'flex',
        alignItems: 'center',
        justifyItems: 'center',
      }}
    >
      <Wrapper>
        <LinearProgress />
      </Wrapper>
    </div>
  );
};

export default Loading;
