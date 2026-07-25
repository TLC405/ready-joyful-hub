import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, jsonResult, requireAuth, supabaseForUser } from "../supabase";

export default defineTool({
  name: "log_workout",
  title: "Log a workout set",
  description:
    "Log a training entry for the signed-in athlete: exercise name, date, and any of sets, reps, duration, notes.",
  inputSchema: {
    exercise_name: z.string().describe("Human-readable exercise name, e.g. 'Hollow Body Hold'."),
    exercise_id: z
      .string()
      .optional()
      .describe("Slug id from the app's library if known, e.g. 'hollow-body-hold'."),
    logged_at: z
      .string()
      .optional()
      .describe("Date of the session, YYYY-MM-DD. Defaults to today (UTC)."),
    sets: z.number().int().optional().describe("Number of sets performed."),
    reps: z.number().int().optional().describe("Reps per set."),
    duration_seconds: z.number().int().optional().describe("Hold or work duration in seconds."),
    notes: z.string().optional().describe("Free-form coaching notes."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    const unauth = requireAuth(ctx);
    if (unauth) return unauth;

    const name = input.exercise_name.trim();
    if (!name) return errorResult("exercise_name cannot be empty.");

    const loggedAt = (input.logged_at ?? new Date().toISOString().slice(0, 10)).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(loggedAt)) {
      return errorResult("logged_at must be a date in YYYY-MM-DD format.");
    }

    const { data, error } = await supabaseForUser(ctx)
      .from("workout_logs")
      .insert({
        user_id: ctx.getUserId(),
        exercise_name: name,
        exercise_id: input.exercise_id?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        logged_at: loggedAt,
        sets: input.sets ?? null,
        reps: input.reps ?? null,
        duration_seconds: input.duration_seconds ?? null,
        notes: input.notes?.slice(0, 2000) ?? null,
      })
      .select("id,logged_at,exercise_id,exercise_name,sets,reps,duration_seconds,notes")
      .single();

    if (error) return errorResult(error.message);
    return jsonResult({ created: data });
  },
});
