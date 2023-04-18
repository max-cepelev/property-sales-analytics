import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import useAuthService from '~/shared/hooks/useAuthService';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  styled,
} from '~/shared/lib/MUI';
import { RegistrationInput, registrationSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';

export const ContentWrapper = styled('div')(() => ({
  paddingTop: 5,
  display: 'flex',
  flexDirection: 'column',
  rowGap: 25,
  minWidth: 300,
}));

export default function AuthDialog() {
  const { signIn, signUp } = useAuthService();
  const [reg, setReg] = useState(false);
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<RegistrationInput>({
    mode: 'onChange',
    resolver: zodResolver(registrationSchema),
    values: {
      email: '',
      password: '',
      name: null,
      phone: null,
    },
  });

  const handleChangePhone = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = event.target.value;
    if (!isNaN(Number(value)) && value.length < 12) {
      setValue('phone', value);
    }
  };

  const onSubmitHandler: SubmitHandler<RegistrationInput> = (values) => {
    reg
      ? signUp({
          email: values.email,
          password: values.password,
          name: values.name ?? undefined,
          phone: values.phone ?? undefined,
        })
      : signIn(values.email, values.password);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  return (
    <Dialog open={true}>
      <DialogTitle sx={{ textAlign: 'center', fontSize: '25px' }}>
        {reg ? 'Регистрация' : 'Вход'}
      </DialogTitle>
      <DialogContent>
        <ContentWrapper>
          {reg ? (
            <TextField
              label='Ваше имя'
              placeholder='Представьтесь'
              error={!!errors['name']}
              helperText={errors['name'] ? errors['name'].message : ''}
              {...register('name')}
            />
          ) : null}
          {reg ? (
            <TextField
              placeholder='8 (999) 999-99-99'
              label='Телефон'
              error={!!errors['phone']}
              type='tel'
              helperText={errors['phone'] ? errors['phone'].message : ''}
              value={watch().phone || ''}
              onChange={handleChangePhone}
            />
          ) : null}
          <TextField
            label='email'
            type='email'
            error={!!errors['email']}
            helperText={errors['email'] ? errors['email'].message : ''}
            {...register('email')}
          />
          <TextField
            label='Пароль'
            type='password'
            error={!!errors['password']}
            helperText={errors['password'] ? errors['password'].message : ''}
            {...register('password')}
          />
        </ContentWrapper>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 2,
          padding: '10px 24px',
        }}
      >
        <Button
          variant='contained'
          fullWidth
          onClick={handleSubmit(onSubmitHandler)}
          onKeyDown={(e) => console.log(e)}
          color='primary'
        >
          {reg ? 'Зарегистрироваться' : 'Войти'}
        </Button>
        {reg ? (
          <Typography textAlign='center' variant='caption'>
            Уже зарегистрированы?{' '}
            <button
              style={{
                color: '#0075ff',
                border: 'none',
                backgroundColor: 'inherit',
                cursor: 'pointer',
              }}
              onClick={() => {
                setValue('name', null);
                setValue('phone', null);
                setReg(false);
              }}
            >
              Войдите.
            </button>
          </Typography>
        ) : (
          <Typography textAlign='center' variant='caption'>
            Нет учетной записи?{' '}
            <button
              style={{
                color: '#0075ff',
                border: 'none',
                backgroundColor: 'inherit',
                cursor: 'pointer',
              }}
              onClick={() => setReg(true)}
            >
              Зарегистрируйтесь.
            </button>
          </Typography>
        )}
      </DialogActions>
    </Dialog>
  );
}
