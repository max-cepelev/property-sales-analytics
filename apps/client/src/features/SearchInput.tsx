import { styled } from '@mui/material/styles';
import { InputBase, IconButton } from '../shared/lib/MUI';
import { Icon } from '@mdi/react';
import { mdiClose, mdiMagnify } from '@mdi/js';
import { useEffect, useState } from 'react';
import useDebounce from '~/shared/hooks/useDebounce';

const Search = styled('div')(() => ({
  position: 'relative',
  borderRadius: '3px',
  backgroundColor: 'rgba(0,0,0,.05)',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,.10)',
  },
  marginLeft: 0,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  paddingLeft: 4,
  left: 0,
  top: 0,
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
}));

const StyledInputBase = styled(InputBase)(() => ({
  '& .MuiInputBase-input': {
    padding: '8px 30px',
  },
}));

export default function SearchInput({
  onChangeSearchTerm,
}: {
  onChangeSearchTerm: (value: string) => void;
}) {
  const [term, setTerm] = useState('');
  const debouncedValue = useDebounce<string>(term, 500);

  useEffect(() => {
    onChangeSearchTerm(debouncedValue);
  }, [debouncedValue, onChangeSearchTerm]);

  return (
    <Search>
      <SearchIconWrapper>
        <Icon path={mdiMagnify} size={'26px'} color='#277BC0' />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder='Поиск…'
        value={term}
        onChange={({ target }) => setTerm(target.value)}
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton
        sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
        size='small'
        onClick={() => setTerm('')}
      >
        <Icon path={mdiClose} size={'26px'} color='#4e4e4e55' />
      </IconButton>
    </Search>
  );
}
