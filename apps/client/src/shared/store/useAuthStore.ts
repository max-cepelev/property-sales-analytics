import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Role } from '../models/gql/graphql';

interface User {
  name: string | null;
  id: number;
  email: string;
  phone: string | null;
  role: Role;
  activated: boolean;
}

interface AuthStore {
  user: User | null;
  permission: boolean;
  ready: boolean;
}

interface AuthStoreActions {
  setUser: (user: User | null) => void;
}

export const useAuthStore = create(
  devtools<AuthStore & AuthStoreActions>(
    (set) => ({
      user: null,
      permission: false,
      ready: false,
      setUser(user) {
        set({
          user,
          ready: true,
          permission: user?.role === 'ADMIN' || user?.role === 'EDITOR' ? true : false,
        });
      },
    }),
    { name: 'auth' },
  ),
);
