import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';
import type { User } from '../services/api';

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<User>;
  register: (data: {
    username: string;
    password: string;
    fullName: string;
    email: string;
    phone: string;
  }) => Promise<User>;
  logout: () => void;
  updateProfile: (fields: {
    fullName: string;
    email: string;
    phone: string;
    preferredLanguage: string;
  }) => Promise<User>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'civicpulse.user';

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser);

  const remember = (next: User | null) => {
    setUser(next);
    try {
      if (next) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAdmin: user?.role === 'ADMIN',
      login: async (username, password) => {
        const loggedIn = await api.login(username, password);
        remember(loggedIn);
        return loggedIn;
      },
      register: async (data) => {
        const created = await api.register(data);
        remember(created);
        return created;
      },
      logout: () => remember(null),
      updateProfile: async (fields) => {
        if (!user) {
          throw new Error('Not logged in');
        }
        const updated = await api.updateProfile(user.id, fields);
        remember(updated);
        return updated;
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}