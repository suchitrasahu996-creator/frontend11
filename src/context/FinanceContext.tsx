import React, { createContext, useContext, useState, useCallback } from 'react';
import { analyticsService, DashboardData } from '@/services/analyticsService';
import { transactionService, Transaction } from '@/services/transactionService';
import { budgetService, Budget } from '@/services/budgetService';
import { goalService, Goal } from '@/services/goalService';
import { billService, Bill } from '@/services/billService';
import { debtService, Debt } from '@/services/debtService';
import { investmentService, Investment } from '@/services/investmentService';
import { toast } from 'sonner';

interface FinanceContextType {
  dashboard: DashboardData | null;
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  bills: Bill[];
  debts: Debt[];
  investments: Investment[];
  loading: Record<string, boolean>;
  fetchDashboard: () => Promise<void>;
  fetchTransactions: (params?: any) => Promise<void>;
  fetchBudgets: () => Promise<void>;
  fetchGoals: () => Promise<void>;
  fetchBills: () => Promise<void>;
  fetchDebts: () => Promise<void>;
  fetchInvestments: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const withLoading = async (key: string, fn: () => Promise<void>) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    try { await fn(); } catch (e: any) {
      toast.error(e.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const fetchDashboard = useCallback(() => withLoading('dashboard', async () => {
    const res = await analyticsService.dashboard();
    setDashboard(res.data.data);
  }), []);

  const fetchTransactions = useCallback((params?: any) => withLoading('transactions', async () => {
    const res = await transactionService.getAll(params);
    setTransactions(res.data.data);
  }), []);

  const fetchBudgets = useCallback(() => withLoading('budgets', async () => {
    const res = await budgetService.getAll();
    setBudgets(res.data.data);
  }), []);

  const fetchGoals = useCallback(() => withLoading('goals', async () => {
    const res = await goalService.getAll();
    setGoals(res.data.data);
  }), []);

  const fetchBills = useCallback(() => withLoading('bills', async () => {
    const res = await billService.getAll();
    setBills(res.data.data);
  }), []);

  const fetchDebts = useCallback(() => withLoading('debts', async () => {
    const res = await debtService.getAll();
    setDebts(res.data.data);
  }), []);

  const fetchInvestments = useCallback(() => withLoading('investments', async () => {
    const res = await investmentService.getAll();
    setInvestments(res.data.data);
  }), []);

  return (
    <FinanceContext.Provider value={{
      dashboard, transactions, budgets, goals, bills, debts, investments, loading,
      fetchDashboard, fetchTransactions, fetchBudgets, fetchGoals, fetchBills, fetchDebts, fetchInvestments,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
};
