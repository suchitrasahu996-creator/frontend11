import api from './api';

export interface DashboardData {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  recentTransactions: Array<{
    id: string;
    type: string;
    category: string;
    amount: number;
    description: string;
    date: string;
  }>;
  upcomingBills: Array<{
    id: string;
    name: string;
    amount: number;
    due_date: string;
    is_paid: boolean;
  }>;
  expenseByCategory: Array<{ category: string; amount: number }>;
  monthlyTrend: Array<{ month: string; income: number; expense: number }>;
}

interface ApiResponse<T> { success: boolean; data: T; message?: string; }

export const analyticsService = {
  dashboard: () => api.get<ApiResponse<DashboardData>>('/analytics/dashboard'),
  summary: () => api.get<ApiResponse<any>>('/analytics/summary'),
  monthly: () => api.get<ApiResponse<any>>('/analytics/monthly'),
  categories: () => api.get<ApiResponse<any>>('/analytics/categories'),
  yearly: () => api.get<ApiResponse<any>>('/analytics/yearly'),
};
