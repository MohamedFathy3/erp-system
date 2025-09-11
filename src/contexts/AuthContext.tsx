'use client';

import { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import TokenManager from '@/lib/tokenManager';
import {Ticket, Device} from '@/types/ticket'

interface AuthUser {
  id:number;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  remember: boolean;
  role: string | string[];
  phoneExt: string;
  password: string;
  cell: string;
    tickets?: Ticket[];
      latestDevice?: Device;


}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: { email: string; password: string; remember?: boolean }) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: AuthUser) => void; // ✅ أضفناها هنا
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: () => {},
  updateUser: () => {}, // ✅ لازم يبقى موجود default
});

async function fetchUser(): Promise<AuthUser> {
  const token = TokenManager.getToken();
  if (!token) throw new Error('No token');

  const res = await apiFetch('/fetch-auth');
  return res.data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<AuthUser, Error>({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (error) {
      TokenManager.clearToken();
    }
  }, [error]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string; remember?: boolean }) => {
      const res = await apiFetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      TokenManager.setToken(res.token);
      return res;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const login = async (credentials: { email: string; password: string; remember?: boolean }) => {
    try {
      await loginMutation.mutateAsync(credentials);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    TokenManager.clearToken();
    queryClient.removeQueries({ queryKey: ['user'] });
    window.location.href = '/auth';
  };

  // ✅ function updateUser
  const updateUser = (newUser: AuthUser) => {
    queryClient.setQueryData(['user'], newUser);
  };

  return (
    <AuthContext.Provider value={{ user: user ?? null, loading: isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
