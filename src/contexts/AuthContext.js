'use client';


import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import TokenManager from '@/lib/tokenManager';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => false,
  logout: () => {},
});

async function fetchUser() {
  const token = TokenManager.getToken();
  if (!token) throw new Error('No token');

  const res = await apiFetch('/fetch-auth');
  return res.data;
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: false,
    onError: () => {
      TokenManager.clearToken();
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await apiFetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      TokenManager.setToken(res.token);
      return res;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['user']);
    },
  });

  const login = async (credentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    TokenManager.clearToken();
    queryClient.removeQueries(['user']);
    window.location.href = '/auth';
  };

  return (
    <AuthContext.Provider value={{ user: user ?? null, loading: isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}