import { createContext } from 'react';
import type { User } from '../types';

export interface AuthContextValue {
  currentUser: User | null;
  login: (username: string, password: string) => { ok: boolean; error?: string };
  register: (username: string, password: string, name: string) => { ok: boolean; error?: string };
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);