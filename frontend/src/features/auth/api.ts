import api from '@/lib/api';
import type { User } from '@/types/cms';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res: any = await api.post('/api/v1/auth/login', payload);
  return res;
}

export async function logout(): Promise<void> {
  await api.post('/api/v1/auth/logout');
}

export async function getCurrentUser(): Promise<User> {
  const res: any = await api.get('/api/v1/auth/me');
  return res;
}
