import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './use-auth';
import { createLog, deleteLog, listLogs, updateLog, type NewWorkoutLog, type WorkoutLog } from '@/lib/workout-logs';

export function useWorkoutLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) { setLogs([]); setLoading(false); return; }
    setLoading(true);
    try {
      const rows = await listLogs();
      setLogs(rows);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const add = useCallback(async (input: NewWorkoutLog) => {
    const row = await createLog(input);
    setLogs(prev => [row, ...prev]);
    return row;
  }, []);

  const edit = useCallback(async (id: string, patch: Partial<NewWorkoutLog>) => {
    const row = await updateLog(id, patch);
    setLogs(prev => prev.map(l => l.id === id ? row : l));
    return row;
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteLog(id);
    setLogs(prev => prev.filter(l => l.id !== id));
  }, []);

  // map: YYYY-MM-DD -> logs[]
  const byDate = useMemo(() => {
    const m = new Map<string, WorkoutLog[]>();
    for (const l of logs) {
      const arr = m.get(l.logged_at) || [];
      arr.push(l);
      m.set(l.logged_at, arr);
    }
    return m;
  }, [logs]);

  // current streak (consecutive days ending today)
  const streak = useMemo(() => {
    let s = 0;
    const today = new Date();
    for (let d = 0; d < 365; d++) {
      const dt = new Date(today);
      dt.setDate(dt.getDate() - d);
      const key = dt.toISOString().slice(0, 10);
      if (byDate.has(key)) s++;
      else break;
    }
    return s;
  }, [byDate]);

  return { logs, byDate, loading, error, streak, add, edit, remove, refresh };
}
