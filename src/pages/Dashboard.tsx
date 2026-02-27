import { useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import { formatCurrency, formatShortDate } from '@/utils/formatters';
import { DollarSign, TrendingUp, TrendingDown, Receipt } from 'lucide-react';

const Dashboard = () => {
  const { dashboard, loading, fetchDashboard } = useFinance();

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const isLoading = loading.dashboard;

  const statCards = [
    { title: 'Total Balance', value: dashboard?.totalBalance, icon: DollarSign, className: 'stat-card-balance' },
    { title: 'Income', value: dashboard?.totalIncome, icon: TrendingUp, className: 'stat-card-income' },
    { title: 'Expenses', value: dashboard?.totalExpense, icon: TrendingDown, className: 'stat-card-expense' },
    { title: 'Upcoming Bills', value: dashboard?.upcomingBills?.length, icon: Receipt, className: 'stat-card-balance', isCurrency: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">Your financial overview at a glance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className={stat.className}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-28" />
              ) : (
                <p className="text-2xl font-bold">
                  {stat.isCurrency === false ? stat.value ?? 0 : formatCurrency(stat.value ?? 0)}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-72 w-full" /> : <MonthlyTrendChart data={dashboard?.monthlyTrend ?? []} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-72 w-full" /> : <CategoryPieChart data={dashboard?.expenseByCategory ?? []} />}
          </CardContent>
        </Card>
      </div>

      {/* Recent & Bills */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : !dashboard?.recentTransactions?.length ? (
              <p className="text-sm text-muted-foreground">No recent transactions</p>
            ) : (
              <div className="space-y-3">
                {dashboard.recentTransactions.slice(0, 5).map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${t.type === 'income' ? 'bg-success' : 'bg-destructive'}`} />
                      <div>
                        <p className="text-sm font-medium">{t.description}</p>
                        <p className="text-xs text-muted-foreground">{t.category} · {formatShortDate(t.date)}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bills</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : !dashboard?.upcomingBills?.length ? (
              <p className="text-sm text-muted-foreground">No upcoming bills</p>
            ) : (
              <div className="space-y-3">
                {dashboard.upcomingBills.slice(0, 5).map((b) => (
                  <div key={b.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{b.name}</p>
                      <p className="text-xs text-muted-foreground">Due {formatShortDate(b.due_date)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{formatCurrency(b.amount)}</span>
                      <Badge variant={b.is_paid ? 'default' : 'destructive'} className="text-xs">
                        {b.is_paid ? 'Paid' : 'Due'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
