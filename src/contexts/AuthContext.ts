import { createContext } from 'react';

interface AuthContextValue {
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export type { AuthContextValue };
