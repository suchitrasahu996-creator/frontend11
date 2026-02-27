import api from './api';

export interface Debt {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  interest_rate: number;
  created_at: string;
}

export interface DebtPayload {
  name: string;
  amount: number;
  interest_rate: number;
}

interface ApiResponse<T> { success: boolean; data: T; message?: string; }

export const debtService = {
  getAll: () => api.get<ApiResponse<Debt[]>>('/debts'),
  create: (data: DebtPayload) => api.post<ApiResponse<Debt>>('/debts', data),
  update: (id: string, data: Partial<DebtPayload>) => api.put<ApiResponse<Debt>>(`/debts/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<null>>(`/debts/${id}`),
};
