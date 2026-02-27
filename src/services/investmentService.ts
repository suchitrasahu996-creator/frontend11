import api from './api';

export interface Investment {
  id: string;
  user_id: string;
  name: string;
  type: string;
  amount: number;
  current_value: number;
  created_at: string;
}

export interface InvestmentPayload {
  name: string;
  type: string;
  amount: number;
  current_value?: number;
}

interface ApiResponse<T> { success: boolean; data: T; message?: string; }

export const investmentService = {
  getAll: () => api.get<ApiResponse<Investment[]>>('/investments'),
  create: (data: InvestmentPayload) => api.post<ApiResponse<Investment>>('/investments', data),
  update: (id: string, data: Partial<InvestmentPayload>) => api.put<ApiResponse<Investment>>(`/investments/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<null>>(`/investments/${id}`),
};
