import { useEffect, useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { billService, BillPayload } from '@/services/billService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, Check } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { toast } from 'sonner';

const Bills = () => {
  const { bills, loading, fetchBills } = useFinance();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<BillPayload>({ name: '', amount: 0, due_date: '' });

  useEffect(() => { fetchBills(); }, [fetchBills]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await billService.create(form); toast.success('Bill added'); setOpen(false); setForm({ name: '', amount: 0, due_date: '' }); fetchBills(); }
    catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const handlePay = async (id: string) => {
    try { await billService.pay(id); toast.success('Bill marked as paid'); fetchBills(); }
    catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const handleDelete = async (id: string) => {
    try { await billService.delete(id); toast.success('Bill deleted'); fetchBills(); }
    catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold md:text-3xl">Bills</h1><p className="text-muted-foreground">Manage your recurring bills</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Bill</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Bill</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Amount</Label><Input type="number" step="0.01" min="0" value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} required /></div>
              <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} required /></div>
              <Button type="submit" className="w-full">Add Bill</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading.bills ? (
            <div className="space-y-2 p-6">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !bills.length ? (
            <div className="p-12 text-center text-muted-foreground">No bills yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.name}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(b.due_date)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(b.amount)}</TableCell>
                    <TableCell><Badge variant={b.is_paid ? 'default' : 'destructive'}>{b.is_paid ? 'Paid' : 'Unpaid'}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {!b.is_paid && <Button variant="ghost" size="icon" onClick={() => handlePay(b.id)}><Check className="h-4 w-4 text-success" /></Button>}
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Bills;
