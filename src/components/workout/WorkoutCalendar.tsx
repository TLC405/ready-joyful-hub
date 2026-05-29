import { useMemo, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useWorkoutLogs } from '@/hooks/use-workout-logs';
import { useAuth } from '@/hooks/use-auth';
import { toDateKey } from '@/lib/workout-logs';
import { LogEntryForm } from './LogEntryForm';
import { Flame, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WorkoutLog } from '@/lib/workout-logs';
import { useNavigate } from 'react-router-dom';

interface Props {
  className?: string;
  /** Heatmap-only compact preview for the homepage. */
  compact?: boolean;
}

export function WorkoutCalendar({ className, compact }: Props) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { byDate, loading, streak, add, edit, remove } = useWorkoutLogs();
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [editing, setEditing] = useState<WorkoutLog | null>(null);
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  const selectedKey = selected ? toDateKey(selected) : null;
  const dayLogs = selectedKey ? (byDate.get(selectedKey) || []) : [];

  const loggedDays = useMemo(() => Array.from(byDate.keys()).map(k => {
    const [y, m, d] = k.split('-').map(Number);
    return new Date(y, m - 1, d);
  }), [byDate]);

  if (!authLoading && !isAuthenticated) {
    return (
      <div className={cn('border border-foreground/10 bg-card p-6 text-center rounded-lg', className)}>
        <p className="text-sm text-muted-foreground mb-3">Sign in to log workouts and see your calendar.</p>
        <Button onClick={() => navigate('/auth')}>Sign in</Button>
      </div>
    );
  }

  return (
    <div className={cn('border border-foreground/10 bg-card rounded-lg p-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-thunder-orange" aria-hidden="true" />
          <h3 className="font-chalk text-sm tracking-wider text-foreground">
            {streak > 0 ? `${streak}-DAY STREAK` : 'TRAINING LOG'}
          </h3>
        </div>
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" aria-label="Loading" />}
      </div>

      <Calendar
        mode="single"
        selected={selected}
        onSelect={d => { if (d) setSelected(d); }}
        modifiers={{ logged: loggedDays }}
        modifiersClassNames={{
          logged: 'relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-thunder-orange',
        }}
        showOutsideDays
        className={cn('p-0 pointer-events-auto mx-auto')}
      />

      {!compact && (
        <div className="mt-4 pt-4 border-t border-foreground/10">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                {selected?.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div className="text-sm text-foreground">
                {dayLogs.length === 0 ? 'No entries' : `${dayLogs.length} ${dayLogs.length === 1 ? 'entry' : 'entries'}`}
              </div>
            </div>
            <Button size="sm" onClick={() => { setEditing(null); setAdding(true); }} aria-label="Add log entry">
              <Plus className="h-4 w-4 mr-1" /> Log
            </Button>
          </div>

          {dayLogs.length > 0 && (
            <ul className="space-y-1.5 mt-2">
              {dayLogs.map(l => (
                <li key={l.id} className="flex items-start justify-between gap-2 border border-foreground/10 rounded-md p-2 bg-background/50">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-foreground truncate">{l.exercise_name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {[
                        l.sets && l.reps ? `${l.sets} × ${l.reps}` : l.sets ? `${l.sets} sets` : l.reps ? `${l.reps} reps` : null,
                        l.duration_seconds ? `${l.duration_seconds}s hold` : null,
                      ].filter(Boolean).join(' · ') || '—'}
                    </div>
                    {l.notes && <div className="text-[11px] text-muted-foreground/80 mt-0.5 line-clamp-2">{l.notes}</div>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditing(l); setAdding(true); }} aria-label={`Edit ${l.exercise_name}`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => { if (confirm('Delete this entry?')) remove(l.id); }} aria-label={`Delete ${l.exercise_name}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Sheet open={adding} onOpenChange={setAdding}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing ? 'Edit entry' : 'Log a workout'}</SheetTitle>
            <SheetDescription>
              {selected?.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            {selectedKey && (
              <LogEntryForm
                date={selectedKey}
                initial={editing}
                onSave={async (input) => {
                  if (editing) await edit(editing.id, input);
                  else await add(input);
                  setAdding(false);
                  setEditing(null);
                }}
                onCancel={() => { setAdding(false); setEditing(null); }}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
