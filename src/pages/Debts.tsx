import { useEffect, useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { debtService, DebtPayload } from '@/services/debtService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, Percent } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

const Debts = () => {
  const { debts, loading, fetchDebts } = useFinance();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<DebtPayload>({ name: '', amount: 0, interest_rate: 0 });

  useEffect(() => { fetchDebts(); }, [fetchDebts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await debtService.create(form); toast.success('Debt added'); setOpen(false); setForm({ name: '', amount: 0, interest_rate: 0 }); fetchDebts(); }
    catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const handleDelete = async (id: string) => {
    try { await debtService.delete(id); toast.success('Debt deleted'); fetchDebts(); }
    catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold md:text-3xl">Debts</h1><p className="text-muted-foreground">Track and manage your debts</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Debt</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Debt</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Amount</Label><Input type="number" step="0.01" min="0" value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} required /></div>
              <div className="space-y-2"><Label>Interest Rate (%)</Label><Input type="number" step="0.01" min="0" value={form.interest_rate || ''} onChange={(e) => setForm({ ...form, interest_rate: parseFloat(e.target.value) || 0 })} required /></div>
              <Button type="submit" className="w-full">Add Debt</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="stat-card-expense">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Debt</CardTitle></CardHeader>
        <CardContent><p className="text-3xl font-bold text-destructive">{formatCurrency(totalDebt)}</p></CardContent>
      </Card>

      {loading.debts ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(i => <Skeleton key={i} className="h-32" />)}</div>
      ) : !debts.length ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">No debts — great job!</CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {debts.map((d) => (
            <Card key={d.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">{d.name}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-2xl font-bold">{formatCurrency(d.amount)}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Percent className="h-3 w-3" /> {d.interest_rate}% interest
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Debts;
