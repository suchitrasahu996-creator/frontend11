import api from './api';

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  spent?: number;
  period: string;
  created_at: string;
}

export interface BudgetPayload {
  category: string;
  amount: number;
  period: string;
}

interface ApiResponse<T> { success: boolean; data: T; message?: string; }

export const budgetService = {
  getAll: () => api.get<ApiResponse<Budget[]>>('/budgets'),
  create: (data: BudgetPayload) => api.post<ApiResponse<Budget>>('/budgets', data),
  update: (id: string, data: Partial<BudgetPayload>) => api.put<ApiResponse<Budget>>(`/budgets/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<null>>(`/budgets/${id}`),
};
