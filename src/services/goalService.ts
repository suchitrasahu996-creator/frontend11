import api from './api';

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  created_at: string;
}

export interface GoalPayload {
  name: string;
  target_amount: number;
  current_amount?: number;
  target_date: string;
}

interface ApiResponse<T> { success: boolean; data: T; message?: string; }

export const goalService = {
  getAll: () => api.get<ApiResponse<Goal[]>>('/goals'),
  create: (data: GoalPayload) => api.post<ApiResponse<Goal>>('/goals', data),
  save: (id: string, amount: number) => api.patch<ApiResponse<Goal>>(`/goals/${id}/save`, { amount }),
  delete: (id: string) => api.delete<ApiResponse<null>>(`/goals/${id}`),
};
