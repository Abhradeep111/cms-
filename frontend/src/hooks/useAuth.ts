'use client';

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import type { User } from '@/contexts/AuthContext';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { user, isLoading, isAuthenticated, logout } = useContext(AuthContext);
  return { user, isLoading, isAuthenticated, logout };
}
