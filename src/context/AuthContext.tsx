import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, User } from '@/services/authService';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const res = await authService.me();
      setUser(res.data.data);
    } catch {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    const { token: t, user: u } = res.data.data;
    localStorage.setItem('token', t);
    setToken(t);
    setUser(u);
    toast.success('Welcome back!');
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authService.register({ name, email, password });
    const { token: t, user: u } = res.data.data;
    localStorage.setItem('token', t);
    setToken(t);
    setUser(u);
    toast.success('Account created successfully!');
  };

  const logout = () => {
    authService.logout().catch(() => {});
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
