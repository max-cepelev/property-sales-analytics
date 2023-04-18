import { useSnackbar } from 'notistack';

export default function useNotification() {
  const { enqueueSnackbar } = useSnackbar();

  const successNotice = (message: string) => {
    enqueueSnackbar(message, {
      variant: 'success',
    });
  };

  const errorNotice = (message: string) => {
    enqueueSnackbar(message, {
      variant: 'error',
    });
  };

  const warningNotice = (message: string) => {
    enqueueSnackbar(message, {
      variant: 'warning',
    });
  };

  const infoNotice = (message: string) => {
    enqueueSnackbar(message, {
      variant: 'info',
    });
  };

  return { successNotice, errorNotice, warningNotice, infoNotice };
}
