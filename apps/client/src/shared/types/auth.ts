import { Role } from '../models/gql/graphql';

export type AuthResponse = {
  user: {
    name: string | null;
    id: number;
    email: string;
    phone: string | null;
    role: Role;
    activated: boolean;
  };
  token: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegistrationInput = LoginInput & {
  name?: string | undefined;
  phone?: string | undefined;
};
