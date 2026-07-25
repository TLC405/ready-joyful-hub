import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, jsonResult, requireAuth, supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_exercise_videos",
  title: "Search exercise videos",
  description:
    "Search the app's exercise video library (TLC TV) by exercise id or keyword and return matching video entries.",
  inputSchema: {
    query: z.string().describe("Keyword or exercise id to match, e.g. 'planche' or 'clutch-flag'."),
    limit: z.number().int().optional().describe("Max rows to return (default 10, max 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }, ctx) => {
    const unauth = requireAuth(ctx);
    if (unauth) return unauth;

    const q = query.trim();
    if (!q) return errorResult("query cannot be empty.");
    const take = Math.min(Math.max(limit ?? 10, 1), 50);

    const { data, error } = await supabaseForUser(ctx)
      .from("exercise_videos")
      .select("*")
      .ilike("exercise_id", `%${q.replace(/[%_]/g, "")}%`)
      .limit(take);

    if (error) return errorResult(error.message);
    return jsonResult({ count: data?.length ?? 0, videos: data ?? [] });
  },
});
