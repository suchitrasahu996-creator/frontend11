import api from './api';

export interface Bill {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  due_date: string;
  is_paid: boolean;
  created_at: string;
}

export interface BillPayload {
  name: string;
  amount: number;
  due_date: string;
}

interface ApiResponse<T> { success: boolean; data: T; message?: string; }

export const billService = {
  getAll: () => api.get<ApiResponse<Bill[]>>('/bills'),
  create: (data: BillPayload) => api.post<ApiResponse<Bill>>('/bills', data),
  pay: (id: string) => api.patch<ApiResponse<Bill>>(`/bills/${id}/pay`),
  delete: (id: string) => api.delete<ApiResponse<null>>(`/bills/${id}`),
};
