import { styled } from '@mui/material';

const Wrapper = styled('div')(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f7f7f7',
  borderRadius: '5px',
}));

export default function CustomImage({ url, alt }: { url: string | null; alt?: string | null }) {
  return (
    <Wrapper>
      <img
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '5px',
        }}
        src={url || '/img/no-image.svg'}
        alt={alt ?? 'image'}
      />
    </Wrapper>
  );
}
