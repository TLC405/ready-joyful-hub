import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, jsonResult, requireAuth, supabaseForUser } from "../supabase";

export default defineTool({
  name: "delete_workout_log",
  title: "Delete a workout log",
  description: "Permanently delete one of the signed-in athlete's workout log entries by id.",
  inputSchema: {
    id: z.string().describe("The workout log id (uuid) to delete."),
  },
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    const unauth = requireAuth(ctx);
    if (unauth) return unauth;

    const { data, error } = await supabaseForUser(ctx)
      .from("workout_logs")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) return errorResult(error.message);
    if (!data?.length) return errorResult(`No workout log found with id ${id}.`);
    return jsonResult({ deleted: id });
  },
});
