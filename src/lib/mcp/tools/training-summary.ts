import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, jsonResult, requireAuth, supabaseForUser } from "../supabase";

function currentStreak(dates: string[]): number {
  const unique = new Set(dates);
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 400; i++) {
    const key = cursor.toISOString().slice(0, 10);
    if (unique.has(key)) {
      streak++;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    } else if (i === 0) {
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    } else break;
  }
  return streak;
}

export default defineTool({
  name: "training_summary",
  title: "Training summary",
  description:
    "Summarize the signed-in athlete's recent training: session count, current streak, most-trained exercises, and last session date.",
  inputSchema: {
    days: z.number().int().optional().describe("Look-back window in days (default 30, max 365)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ days }, ctx) => {
    const unauth = requireAuth(ctx);
    if (unauth) return unauth;

    const window = Math.min(Math.max(days ?? 30, 1), 365);
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - window);

    const { data, error } = await supabaseForUser(ctx)
      .from("workout_logs")
      .select("logged_at,exercise_name,sets,reps,duration_seconds")
      .gte("logged_at", since.toISOString().slice(0, 10))
      .order("logged_at", { ascending: false });

    if (error) return errorResult(error.message);

    const logs = data ?? [];
    const counts = new Map<string, number>();
    for (const l of logs) counts.set(l.exercise_name, (counts.get(l.exercise_name) ?? 0) + 1);
    const top = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([exercise_name, entries]) => ({ exercise_name, entries }));

    const dates = logs.map((l) => l.logged_at as string);
    return jsonResult({
      window_days: window,
      total_entries: logs.length,
      distinct_training_days: new Set(dates).size,
      current_streak_days: currentStreak(dates),
      last_session: dates[0] ?? null,
      top_exercises: top,
    });
  },
});
