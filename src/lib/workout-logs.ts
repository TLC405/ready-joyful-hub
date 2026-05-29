import { supabase } from '@/integrations/supabase/client';

export interface WorkoutLog {
  id: string;
  user_id: string;
  logged_at: string; // YYYY-MM-DD
  exercise_id: string;
  exercise_name: string;
  sets: number | null;
  reps: number | null;
  duration_seconds: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type NewWorkoutLog = Pick<
  WorkoutLog,
  'logged_at' | 'exercise_id' | 'exercise_name' | 'sets' | 'reps' | 'duration_seconds' | 'notes'
>;

export const toDateKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export async function listLogs(opts?: { from?: string; to?: string }) {
  let q = supabase.from('workout_logs').select('*').order('logged_at', { ascending: false }).order('created_at', { ascending: false });
  if (opts?.from) q = q.gte('logged_at', opts.from);
  if (opts?.to) q = q.lte('logged_at', opts.to);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []) as WorkoutLog[];
}

export async function createLog(input: NewWorkoutLog) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error('Not signed in');
  const { data, error } = await supabase
    .from('workout_logs')
    .insert({ ...input, user_id: u.user.id })
    .select('*')
    .single();
  if (error) throw error;
  return data as WorkoutLog;
}

export async function updateLog(id: string, patch: Partial<NewWorkoutLog>) {
  const { data, error } = await supabase
    .from('workout_logs')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as WorkoutLog;
}

export async function deleteLog(id: string) {
  const { error } = await supabase.from('workout_logs').delete().eq('id', id);
  if (error) throw error;
}
