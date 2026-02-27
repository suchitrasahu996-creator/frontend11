import api from './api';

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  created_at: string;
}

export interface TransactionPayload {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const transactionService = {
  getAll: (params?: { month?: string; type?: string; category?: string }) =>
    api.get<ApiResponse<Transaction[]>>('/transactions', { params }),

  create: (data: TransactionPayload) =>
    api.post<ApiResponse<Transaction>>('/transactions', data),

  update: (id: string, data: Partial<TransactionPayload>) =>
    api.put<ApiResponse<Transaction>>(`/transactions/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/transactions/${id}`),
};
