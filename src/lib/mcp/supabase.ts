import { createClient } from "@supabase/supabase-js";
import type { ToolContext } from "@lovable.dev/mcp-js";

/**
 * Supabase client scoped to the MCP caller's verified access token so all
 * queries run under the signed-in user's RLS policies.
 */
export function supabaseForUser(ctx: ToolContext) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

export function requireAuth(ctx: ToolContext) {
  if (!ctx.isAuthenticated()) {
    return {
      content: [
        { type: "text" as const, text: "Not authenticated. Connect this app with your account first." },
      ],
      isError: true as const,
    };
  }
  return null;
}

export function errorResult(message: string) {
  return { content: [{ type: "text" as const, text: message }], isError: true as const };
}

export function jsonResult(payload: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
    structuredContent: payload as Record<string, unknown>,
  };
}
