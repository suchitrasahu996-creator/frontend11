import { useEffect, useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { goalService, GoalPayload } from '@/services/goalService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, PiggyBank } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { toast } from 'sonner';

const Goals = () => {
  const { goals, loading, fetchGoals } = useFinance();
  const [open, setOpen] = useState(false);
  const [saveDialogId, setSaveDialogId] = useState<string | null>(null);
  const [saveAmount, setSaveAmount] = useState(0);
  const [form, setForm] = useState<GoalPayload>({ name: '', target_amount: 0, target_date: '' });

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await goalService.create(form); toast.success('Goal created'); setOpen(false); setForm({ name: '', target_amount: 0, target_date: '' }); fetchGoals(); }
    catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const handleSave = async () => {
    if (!saveDialogId) return;
    try { await goalService.save(saveDialogId, saveAmount); toast.success('Amount saved!'); setSaveDialogId(null); setSaveAmount(0); fetchGoals(); }
    catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const handleDelete = async (id: string) => {
    try { await goalService.delete(id); toast.success('Goal deleted'); fetchGoals(); }
    catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold md:text-3xl">Goals</h1><p className="text-muted-foreground">Save towards your financial goals</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Goal</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Goal</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2"><Label>Goal Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Target Amount</Label><Input type="number" step="0.01" min="0" value={form.target_amount || ''} onChange={(e) => setForm({ ...form, target_amount: parseFloat(e.target.value) || 0 })} required /></div>
              <div className="space-y-2"><Label>Target Date</Label><Input type="date" value={form.target_date} onChange={(e) => setForm({ ...form, target_date: e.target.value })} required /></div>
              <Button type="submit" className="w-full">Create Goal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Save dialog */}
      <Dialog open={!!saveDialogId} onOpenChange={() => setSaveDialogId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Savings</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Amount</Label><Input type="number" step="0.01" min="0" value={saveAmount || ''} onChange={(e) => setSaveAmount(parseFloat(e.target.value) || 0)} /></div>
            <Button onClick={handleSave} className="w-full">Save Amount</Button>
          </div>
        </DialogContent>
      </Dialog>

      {loading.goals ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(i => <Skeleton key={i} className="h-44" />)}</div>
      ) : !goals.length ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">No goals yet</CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((g) => {
            const pct = Math.min((g.current_amount / g.target_amount) * 100, 100);
            return (
              <Card key={g.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">{g.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setSaveDialogId(g.id)}><PiggyBank className="h-4 w-4 text-primary" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(g.id)}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{formatCurrency(g.current_amount)}</span>
                    <span className="font-medium">{formatCurrency(g.target_amount)}</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                  <p className="text-xs text-muted-foreground">Target: {formatDate(g.target_date)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Goals;
