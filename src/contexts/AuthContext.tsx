'use client';

import { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Ticket, Device } from '@/types/ticket';

interface AuthUser {
  id: number;
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
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: () => {},
  updateUser: () => {},
});

async function fetchUser(): Promise<AuthUser | null> {
  try {
    const res = await apiFetch('/fetch-auth'); 
    return res.data;
  } catch (error) {
    return null;
  }
}
  
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // تسجيل الاستعلام الذي يتم تحميله
  const { data: user, isLoading } = useQuery<AuthUser | null, Error>({
    queryKey: ['user'],
    queryFn: async () => {
      const fetchedUser = await fetchUser();
      return fetchedUser;
    },
    staleTime: 60 * 1000,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string; remember?: boolean }) => {
      const res = await apiFetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
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
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
  try {
    await apiFetch('/logout', {
      method: 'POST',
      credentials: 'include' ,
        body: JSON.stringify({}) 

    });
  } catch (error) {
    // optional error handling
  }

  queryClient.removeQueries({ queryKey: ['user'] });
  window.location.href = '/auth';
};


  const updateUser = (newUser: AuthUser) => {
    queryClient.setQueryData(['user'], newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        loading: isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(AuthContext);
}
