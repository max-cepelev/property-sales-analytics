import axios from 'axios';
import { API_URL } from '../constants/api-url';
import { AuthResponse, RegistrationInput } from '../types/auth';

const withCredentials = true;

export const registration = async ({ email, password, name, phone }: RegistrationInput) => {
  const { data } = await axios.post<AuthResponse>(
    `${API_URL}/auth/signup`,
    { email, password, name, phone },
    {
      withCredentials,
    },
  );
  return data;
};

export const login = async ({ email, password }: { email: string; password: string }) => {
  const { data } = await axios.post<AuthResponse>(
    `${API_URL}/auth/login`,
    { email, password },
    {
      withCredentials,
    },
  );
  return data;
};

export const checkAuth = async () => {
  const { data } = await axios.get<AuthResponse>(`${API_URL}/auth/refresh`, {
    withCredentials,
  });
  return data;
};

export const logout = async () => {
  const { data } = await axios.get<AuthResponse>(`${API_URL}/auth/logout`, {
    withCredentials,
  });
  return data;
};
