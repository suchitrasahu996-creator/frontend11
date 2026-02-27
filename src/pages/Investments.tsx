import { useEffect, useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { investmentService, InvestmentPayload } from '@/services/investmentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, getInvestmentTypes } from '@/utils/formatters';
import { toast } from 'sonner';

const Investments = () => {
  const { investments, loading, fetchInvestments } = useFinance();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<InvestmentPayload>({ name: '', type: '', amount: 0, current_value: 0 });

  useEffect(() => { fetchInvestments(); }, [fetchInvestments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await investmentService.create(form); toast.success('Investment added'); setOpen(false); setForm({ name: '', type: '', amount: 0, current_value: 0 }); fetchInvestments(); }
    catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const handleDelete = async (id: string) => {
    try { await investmentService.delete(id); toast.success('Investment deleted'); fetchInvestments(); }
    catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const totalValue = investments.reduce((s, i) => s + i.current_value, 0);
  const totalReturn = totalValue - totalInvested;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold md:text-3xl">Investments</h1><p className="text-muted-foreground">Track your investment portfolio</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Investment</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Investment</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>{getInvestmentTypes().map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Amount Invested</Label><Input type="number" step="0.01" min="0" value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} required /></div>
              <div className="space-y-2"><Label>Current Value</Label><Input type="number" step="0.01" min="0" value={form.current_value || ''} onChange={(e) => setForm({ ...form, current_value: parseFloat(e.target.value) || 0 })} required /></div>
              <Button type="submit" className="w-full">Add Investment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="stat-card-balance"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Invested</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatCurrency(totalInvested)}</p></CardContent></Card>
        <Card className="stat-card-income"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Current Value</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatCurrency(totalValue)}</p></CardContent></Card>
        <Card className={totalReturn >= 0 ? 'stat-card-income' : 'stat-card-expense'}><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Return</CardTitle></CardHeader><CardContent><p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-success' : 'text-destructive'}`}>{totalReturn >= 0 ? '+' : ''}{formatCurrency(totalReturn)}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading.investments ? (
            <div className="space-y-2 p-6">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !investments.length ? (
            <div className="p-12 text-center text-muted-foreground">No investments yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Invested</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Return</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((inv) => {
                  const ret = inv.current_value - inv.amount;
                  const retPct = inv.amount > 0 ? (ret / inv.amount) * 100 : 0;
                  return (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.name}</TableCell>
                      <TableCell><Badge variant="secondary">{inv.type}</Badge></TableCell>
                      <TableCell>{formatCurrency(inv.amount)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(inv.current_value)}</TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 ${ret >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {ret >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          <span className="text-sm font-medium">{retPct.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell><Button variant="ghost" size="icon" onClick={() => handleDelete(inv.id)}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Investments;
