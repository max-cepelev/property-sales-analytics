import { usePagination, DOTS } from './usePagination';
import { styled } from '@mui/material';

interface Props {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount: number;
  currentPage: number;
  pageSize: number;
  className: string;
}

const Container = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  listStyleType: 'none',
  backgroundColor: 'inherit',
  maxWidth: 'min-content',
  padding: 0,
  marginLeft: 'auto',
  borderRadius: '3px',
  height: 50,
}));

const Button = styled('button')(() => ({
  textAlign: 'center',
  color: 'rgba(0, 0, 0, 0.87)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  border: 'none',
  width: '25px',
  height: '25px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    cursor: 'pointer',
  },
}));

export default function Pagination(props: Props) {
  const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange && paginationRange[paginationRange.length - 1];
  return (
    <Container>
      <Button
        onClick={onPrevious}
        sx={
          currentPage === 1
            ? {
                pointerEvents: 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                  cursor: 'default',
                },
              }
            : undefined
        }
      >
        &#60;
      </Button>
      {paginationRange &&
        paginationRange.map((pageNumber: any, index: number) => {
          if (pageNumber === DOTS) {
            return (
              <Button
                key={pageNumber + index}
                sx={{ backgroundColor: 'transparent', cursor: 'default' }}
              >
                &#8230;
              </Button>
            );
          }
          return (
            <Button
              key={pageNumber + index}
              sx={
                pageNumber === currentPage
                  ? {
                      backgroundColor: (theme) => theme.palette.primary.main,
                      color: '#ffffff',
                      '&:hover': {
                        cursor: 'default',
                        backgroundColor: (theme) => theme.palette.primary.main,
                      },
                    }
                  : undefined
              }
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          );
        })}
      <Button
        onClick={onNext}
        sx={
          currentPage === lastPage
            ? {
                pointerEvents: 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                  cursor: 'default',
                },
              }
            : undefined
        }
      >
        &#62;
      </Button>
    </Container>
  );
}
