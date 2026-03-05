import { useState, useEffect, createContext, type ReactNode } from 'react';
import type { User } from '../types';
import initialUsers from '../data/users.json';

export interface AuthContextValue {
  currentUser: User | null;
  login: (username: string, password: string) => { ok: boolean; error?: string };
  register: (username: string, password: string, name: string) => { ok: boolean; error?: string };
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'navbahor_users';
const SESSION_KEY = 'navbahor_session';

const loadUsers = (): User[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as User[];
  } catch {
    // ignore
  }
  const seed = initialUsers as User[];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw) as User;
    } catch {
      // ignore
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [currentUser]);

  const login = (username: string, password: string) => {
    const users = loadUsers();
    const user = users.find(
      (u) => u.username === username.trim() && u.password === password
    );
    if (!user) return { ok: false, error: "Login yoki parol noto'g'ri" };
    setCurrentUser(user);
    return { ok: true };
  };

  const register = (username: string, password: string, name: string) => {
    const users = loadUsers();
    if (users.find((u) => u.username === username.trim())) {
      return { ok: false, error: 'Bu foydalanuvchi nomi allaqachon band' };
    }
    const newUser: User = {
      id: crypto.randomUUID ? parseInt(crypto.randomUUID().replace(/-/g, '').slice(0, 8), 16) : Date.now(),
      username: username.trim(),
      password,
      role: 'user',
      name: name.trim() || username.trim(),
    };
    const updated = [...users, newUser];
    saveUsers(updated);
    setCurrentUser(newUser);
    return { ok: true };
  };

  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};