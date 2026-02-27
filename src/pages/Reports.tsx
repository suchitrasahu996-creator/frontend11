import { useEffect, useState } from 'react';
import { analyticsService } from '@/services/analyticsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import IncomeExpenseBarChart from '@/components/charts/IncomeExpenseBarChart';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

const Reports = () => {
  const [monthly, setMonthly] = useState<any>(null);
  const [categories, setCategories] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [mRes, cRes, sRes] = await Promise.all([
          analyticsService.monthly(),
          analyticsService.categories(),
          analyticsService.summary(),
        ]);
        setMonthly(mRes.data.data);
        setCategories(cRes.data.data);
        setSummary(sRes.data.data);
      } catch (err: any) {
        toast.error(err.response?.data?.error || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold md:text-3xl">Reports</h1><p className="text-muted-foreground">Detailed financial analytics</p></div>
      <div className="grid gap-4 sm:grid-cols-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}</div>
      <Skeleton className="h-96" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold md:text-3xl">Reports</h1><p className="text-muted-foreground">Detailed financial analytics</p></div>

      {summary && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="stat-card-income"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Income</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-success">{formatCurrency(summary.totalIncome ?? 0)}</p></CardContent></Card>
          <Card className="stat-card-expense"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Expenses</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-destructive">{formatCurrency(summary.totalExpense ?? 0)}</p></CardContent></Card>
          <Card className="stat-card-balance"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Net Savings</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatCurrency((summary.totalIncome ?? 0) - (summary.totalExpense ?? 0))}</p></CardContent></Card>
        </div>
      )}

      <Tabs defaultValue="trend">
        <TabsList>
          <TabsTrigger value="trend">Monthly Trend</TabsTrigger>
          <TabsTrigger value="comparison">Income vs Expense</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="trend">
          <Card><CardHeader><CardTitle>Monthly Income & Expense Trend</CardTitle></CardHeader><CardContent><MonthlyTrendChart data={monthly ?? []} /></CardContent></Card>
        </TabsContent>
        <TabsContent value="comparison">
          <Card><CardHeader><CardTitle>Income vs Expense by Month</CardTitle></CardHeader><CardContent><IncomeExpenseBarChart data={monthly ?? []} /></CardContent></Card>
        </TabsContent>
        <TabsContent value="categories">
          <Card><CardHeader><CardTitle>Expense by Category</CardTitle></CardHeader><CardContent><CategoryPieChart data={categories ?? []} /></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
