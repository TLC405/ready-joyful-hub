import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, jsonResult, requireAuth, supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_workout_logs",
  title: "List workout logs",
  description:
    "List the signed-in athlete's logged training sets, newest first. Optionally filter by date range (YYYY-MM-DD).",
  inputSchema: {
    from: z.string().optional().describe("Earliest log date, YYYY-MM-DD."),
    to: z.string().optional().describe("Latest log date, YYYY-MM-DD."),
    limit: z.number().int().optional().describe("Max rows to return (default 50, max 200)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ from, to, limit }, ctx) => {
    const unauth = requireAuth(ctx);
    if (unauth) return unauth;

    const take = Math.min(Math.max(limit ?? 50, 1), 200);
    let query = supabaseForUser(ctx)
      .from("workout_logs")
      .select("id,logged_at,exercise_id,exercise_name,sets,reps,duration_seconds,notes")
      .order("logged_at", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(take);

    if (from) query = query.gte("logged_at", from);
    if (to) query = query.lte("logged_at", to);

    const { data, error } = await query;
    if (error) return errorResult(error.message);
    return jsonResult({ count: data?.length ?? 0, logs: data ?? [] });
  },
});
