import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { exercises } from '@/lib/exercises';
import type { NewWorkoutLog, WorkoutLog } from '@/lib/workout-logs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  exercise_id: z.string().min(1),
  exercise_name: z.string().min(1).max(120),
  sets: z.number().int().min(0).max(99).nullable(),
  reps: z.number().int().min(0).max(999).nullable(),
  duration_seconds: z.number().int().min(0).max(60 * 60 * 6).nullable(),
  notes: z.string().max(2000).nullable(),
});

interface Props {
  date: string;
  initial?: WorkoutLog | null;
  onSave: (input: NewWorkoutLog) => Promise<unknown>;
  onCancel?: () => void;
}

export function LogEntryForm({ date, initial, onSave, onCancel }: Props) {
  const [exerciseId, setExerciseId] = useState(initial?.exercise_id || '');
  const [exerciseName, setExerciseName] = useState(initial?.exercise_name || '');
  const [sets, setSets] = useState<string>(initial?.sets?.toString() ?? '');
  const [reps, setReps] = useState<string>(initial?.reps?.toString() ?? '');
  const [duration, setDuration] = useState<string>(initial?.duration_seconds?.toString() ?? '');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setExerciseId(initial.exercise_id);
      setExerciseName(initial.exercise_name);
      setSets(initial.sets?.toString() ?? '');
      setReps(initial.reps?.toString() ?? '');
      setDuration(initial.duration_seconds?.toString() ?? '');
      setNotes(initial.notes || '');
    }
  }, [initial?.id]);

  const list = useMemo(() => exercises.slice().sort((a, b) => a.name.localeCompare(b.name)), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const parsed = schema.safeParse({
      exercise_id: exerciseId,
      exercise_name: exerciseName,
      sets: sets ? Number(sets) : null,
      reps: reps ? Number(reps) : null,
      duration_seconds: duration ? Number(duration) : null,
      notes: notes.trim() || null,
    });
    if (!parsed.success) { setErr('Please pick an exercise and valid numbers.'); return; }
    setSaving(true);
    try {
      await onSave({ ...parsed.data, logged_at: date });
      if (!initial) { setExerciseId(''); setExerciseName(''); setSets(''); setReps(''); setDuration(''); setNotes(''); }
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label htmlFor="exercise-picker" className="text-xs">Exercise</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="exercise-picker"
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between mt-1 font-normal"
            >
              {exerciseName || <span className="text-muted-foreground">Pick an exercise…</span>}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[320px] p-0 pointer-events-auto" align="start">
            <Command>
              <CommandInput placeholder="Search exercises…" />
              <CommandList>
                <CommandEmpty>No exercise found.</CommandEmpty>
                <CommandGroup>
                  {list.map(ex => (
                    <CommandItem
                      key={ex.id}
                      value={ex.name}
                      onSelect={() => { setExerciseId(ex.id); setExerciseName(ex.name); setOpen(false); }}
                    >
                      <Check className={cn('mr-2 h-4 w-4', exerciseId === ex.id ? 'opacity-100' : 'opacity-0')} />
                      <span className="truncate">{ex.name}</span>
                      <span className="ml-auto text-[10px] text-muted-foreground uppercase">{ex.category}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label htmlFor="sets" className="text-xs">Sets</Label>
          <Input id="sets" inputMode="numeric" value={sets} onChange={e => setSets(e.target.value.replace(/\D/g, ''))} placeholder="3" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="reps" className="text-xs">Reps</Label>
          <Input id="reps" inputMode="numeric" value={reps} onChange={e => setReps(e.target.value.replace(/\D/g, ''))} placeholder="10" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="duration" className="text-xs">Hold (sec)</Label>
          <Input id="duration" inputMode="numeric" value={duration} onChange={e => setDuration(e.target.value.replace(/\D/g, ''))} placeholder="30" className="mt-1" />
        </div>
      </div>

      <div>
        <Label htmlFor="notes" className="text-xs">Notes</Label>
        <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="How did it feel? RPE, form cues…" className="mt-1 min-h-[60px]" maxLength={2000} />
      </div>

      {err && <p className="text-xs text-destructive" role="alert">{err}</p>}

      <div className="flex gap-2 pt-1">
        <Button type="submit" disabled={saving || !exerciseId} className="flex-1">
          {saving ? 'Saving…' : initial ? 'Update entry' : 'Add entry'}
        </Button>
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}
