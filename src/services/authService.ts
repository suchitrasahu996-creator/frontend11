import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  data: { token: string; user: User };
  message?: string;
}

export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  me: () => api.get<{ success: boolean; data: User }>('/auth/me'),

  logout: () => api.post('/auth/logout'),
};
