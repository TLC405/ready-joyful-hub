import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useWorkoutLogs } from '@/hooks/use-workout-logs';
import { useAuth } from '@/hooks/use-auth';
import { toDateKey, type WorkoutLog } from '@/lib/workout-logs';
import { LogEntryForm } from './LogEntryForm';
import { Flame, Plus, Pencil, Trash2, Loader2, CalendarDays, ArrowRight, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
interface Props { className?: string; compact?: boolean; }
export function WorkoutCalendar({ className, compact }: Props) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { logs, byDate, loading, error, streak, add, edit, remove, refresh } = useWorkoutLogs();
  const [selected, setSelected] = useState<Date>(new Date());
  const [editing, setEditing] = useState<WorkoutLog | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<WorkoutLog | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const selectedKey = toDateKey(selected);
  const dayLogs = byDate.get(selectedKey) || [];
  const loggedDays = useMemo(() => Array.from(byDate.keys()).map(k => { const [y,m,d] = k.split('-').map(Number); return new Date(y,m-1,d); }), [byDate]);
  const monthLogs = logs.filter(l => l.logged_at.startsWith(format(selected, 'yyyy-MM')));
  const openAdd = () => { if (!isAuthenticated) { navigate('/auth'); return; } setEditing(null); setAdding(true); };
  async function deleteEntry() {
    if (!deleting) return;
    setBusy(true);
    try { await remove(deleting.id); setDeleting(null); toast.success('Entry deleted'); }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Could not delete entry'); }
    finally { setBusy(false); }
  }
  return <div className={cn('min-w-0', className)}>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div><p className="mb-1 text-xs font-semibold text-thunder-blue">YOUR TRAINING JOURNAL</p><h2 className="font-chalk text-2xl">Every session counts.</h2></div>
      <Button variant="thunder" onClick={openAdd}><Plus />Log workout</Button>
    </div>
    <div className="mb-5 grid grid-cols-3 divide-x divide-border/15 border-y border-border/15 py-4">
      {[{ label: 'Day streak', value: streak, icon: Flame }, { label: 'This month', value: monthLogs.length, icon: CalendarDays }, { label: 'Sets logged', value: monthLogs.reduce((s,l) => s + (l.sets ?? 0),0), icon: Plus }].map(({ label,value,icon: Icon }) => <div key={label} className="px-3 first:pl-0"><div className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><Icon className="h-3.5 w-3.5 text-thunder-orange" />{label}</div><p className="mt-1 font-chalk text-2xl">{loading || authLoading ? '—' : value}</p></div>)}
    </div>
    {error && <div role="alert" className="mb-4 flex items-center justify-between gap-3 border-l-2 border-destructive bg-destructive/5 p-3 text-sm"><span>Your journal could not be loaded.</span><Button variant="ghost" size="icon" onClick={refresh} aria-label="Retry loading journal"><RefreshCw /></Button></div>}
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="training-calendar min-w-0">
        <Calendar mode="single" selected={selected} onSelect={d => { if (d) setSelected(d); }} modifiers={{ logged: loggedDays }} modifiersClassNames={{ logged: 'relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-thunder-orange' }} showOutsideDays className="p-0" classNames={{ months: 'w-full', month: 'space-y-3 w-full', caption: 'flex justify-center relative items-center h-11', caption_label: 'font-semibold text-sm', nav_button: 'h-10 w-10 inline-flex items-center justify-center rounded-md border border-border/15 hover:bg-muted', head_row: 'grid grid-cols-7', head_cell: 'text-muted-foreground text-xs text-center py-2', row: 'grid grid-cols-7 mt-1', cell: 'relative min-w-0 p-0 text-center', day: 'h-11 w-full rounded-md text-sm font-medium hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring', day_today: 'text-thunder-blue border border-thunder-blue/40', day_selected: 'bg-primary text-primary-foreground hover:bg-primary focus:bg-primary', table: 'w-full border-collapse' }} />
        <p className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-thunder-orange" />Logged training day</p>
      </div>
      {!compact && <div className="min-w-0 border-t border-border/15 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
        <div className="mb-4 flex items-center justify-between gap-2"><div><p className="text-xs text-thunder-blue">{format(selected, 'EEEE')}</p><h3 className="mt-1 font-chalk text-xl">{format(selected, 'MMMM d')}</h3></div><span className="text-xs text-muted-foreground">{dayLogs.length} {dayLogs.length === 1 ? 'entry' : 'entries'}</span></div>
        {authLoading || loading ? <div className="flex min-h-36 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" />Loading journal…</div> : !isAuthenticated ? <div className="py-5"><CalendarDays className="mb-3 h-7 w-7 text-thunder-blue" /><p className="text-sm font-semibold">Your journal starts here.</p><p className="mt-1 text-sm text-muted-foreground">Sign in to save your training.</p><Button variant="outline" onClick={() => navigate('/auth')} className="mt-4">Sign in<ArrowRight /></Button></div> : dayLogs.length === 0 ? <div className="py-6"><CalendarDays className="mb-3 h-7 w-7 text-muted-foreground" /><p className="text-sm font-medium">A fresh page.</p><p className="mt-1 text-sm text-muted-foreground">No workouts logged for this day.</p><Button variant="link" className="mt-2 px-0" onClick={openAdd}><Plus />Add a session</Button></div> : <ul className="divide-y divide-border/10">{dayLogs.map(l => <li key={l.id} className="py-3 first:pt-0"><div className="flex items-start gap-2"><div className="min-w-0 flex-1"><p className="break-words text-sm font-semibold">{l.exercise_name}</p><p className="mt-1 text-xs text-thunder-blue">{[l.sets != null ? `${l.sets} sets` : null,l.reps != null ? `${l.reps} reps` : null,l.duration_seconds != null ? `${l.duration_seconds}s` : null].filter(Boolean).join(' · ') || 'Session logged'}</p>{l.notes && <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{l.notes}</p>}</div><Button size="icon" variant="ghost" aria-label={`Edit ${l.exercise_name}`} onClick={() => { setEditing(l); setAdding(true); }}><Pencil /></Button><Button size="icon" variant="ghost" className="text-destructive" aria-label={`Delete ${l.exercise_name}`} onClick={() => setDeleting(l)}><Trash2 /></Button></div></li>)}</ul>}
      </div>}
    </div>
    <Sheet open={adding} onOpenChange={setAdding}><SheetContent side="right" className="safe-top safe-bottom w-full overflow-y-auto sm:max-w-md"><SheetHeader className="text-left"><SheetTitle className="font-chalk text-2xl">{editing ? 'Edit session' : 'Log a workout'}</SheetTitle><SheetDescription>{format(selected, 'EEEE, MMMM d, yyyy')}</SheetDescription></SheetHeader><div className="mt-6"><LogEntryForm key={editing?.id ?? selectedKey} date={selectedKey} initial={editing} onSave={async input => { if (editing) await edit(editing.id,input); else await add(input); setAdding(false); setEditing(null); toast.success(editing ? 'Session updated' : 'Workout saved'); }} onCancel={() => { setAdding(false); setEditing(null); }} /></div></SheetContent></Sheet>
    <AlertDialog open={Boolean(deleting)} onOpenChange={open => { if (!open && !busy) setDeleting(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete this entry?</AlertDialogTitle><AlertDialogDescription>{deleting?.exercise_name} will be removed from your journal.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={busy}>Keep entry</AlertDialogCancel><AlertDialogAction disabled={busy} onClick={e => { e.preventDefault(); deleteEntry(); }}>{busy ? 'Deleting…' : 'Delete entry'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div>;
}
