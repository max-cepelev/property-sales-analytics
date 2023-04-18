import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useNotification from './useNotification';
import { AxiosError } from 'axios';
import { checkAuth, login, logout, registration } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';
import { RegistrationInput } from '../types/auth';

export default function useAuthService() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { errorNotice } = useNotification();
  const setUser = useAuthStore((store) => store.setUser);

  const check = () => {
    setLoading(true);
    checkAuth()
      .then((res) => {
        localStorage.setItem('token', res.token);
        setUser(res.user);
        if (!res.user.activated) {
          navigate('/no-activate');
        }
      })
      .catch((e: AxiosError<{ message: string; statusCode: number }>) => {
        setUser(null);
        errorNotice(e.response?.data.message || e.message);
        navigate('/login');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const signUp = ({ email, name, password, phone }: RegistrationInput) => {
    setLoading(true);
    registration({ email, name, password, phone })
      .then((res) => {
        setUser(res.user);
        navigate('/no-activate');
      })
      .catch((e: AxiosError<{ message: string; statusCode: number }>) => {
        setUser(null);
        errorNotice(e.response?.data.message || e.message);
        navigate('/login');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const signIn = (email: string, password: string) => {
    setLoading(true);
    login({ email, password })
      .then((res) => {
        localStorage.setItem('token', res.token);
        setUser(res.user);
        navigate('/');
      })
      .catch((e: AxiosError<{ message: string; statusCode: number }>) => {
        setUser(null);
        errorNotice(e.response?.data.message || e.message);
        navigate('/login');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const signOut = () => {
    setLoading(true);
    logout()
      .then(() => {
        setUser(null);
        localStorage.removeItem('token');
        navigate('/login');
      })
      .catch((e: AxiosError<{ message: string; statusCode: number }>) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    check,
    signUp,
    signIn,
    signOut,
    loading,
  };
}
