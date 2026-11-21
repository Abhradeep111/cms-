import axios, { AxiosError } from 'axios';

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, '') : '') ||
  'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  withCredentials: true, // Send and receive HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to extract cookie by name in browser
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

// Request interceptor to attach CSRF token if present
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const csrfToken = getCookie('corpx_csrf_token');
    if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // If unauthorized and currently in dashboard, redirect to login
      if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/homepage')) {
        window.location.href = '/login';
      }
    }
    const message = (error.response?.data as any)?.detail || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(typeof message === 'string' ? message : JSON.stringify(message)));
  },
);

export default api;
