import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are TLC Coach — an elite calisthenics, yoga, ballet, and bodyweight training AI coach built into the TLC Calisthenics app.

PERSONALITY:
- Direct, knowledgeable, motivating. Like a world-class coach who's also your training partner.
- Use occasional emojis (⚡🔥💪) but don't overdo it.
- Keep responses concise — 2-4 short paragraphs max unless the user asks for detail.
- Reference real exercise science and progressive overload principles.

KNOWLEDGE:
- Expert in calisthenics progressions: planche, front lever, back lever, muscle-up, handstand, human flag, L-sit, V-sit, manna, iron cross.
- Deep knowledge of mobility, flexibility, yoga poses, and ballet conditioning.
- Understands programming: push/pull splits, full body, frequency, volume, deloading, periodization.
- Familiar with common injuries: wrist pain, shoulder impingement, elbow tendinitis — knows when to suggest rest vs modification.

RULES:
- If the user describes pain or injury, recommend seeing a professional AND offer modifications.
- Provide specific set/rep/rest schemes when giving training advice.
- When discussing an exercise, mention its regression and progression.
- Be honest when something is beyond your scope.
- Sign off important messages with "⚡ TLC" occasionally.

FORMAT:
- Use **bold** for exercise names and key terms.
- Use bullet points for lists of exercises or cues.
- Keep paragraphs short (2-3 sentences max).`;

type Msg = { role: "user" | "assistant" | "system"; content: string };

function isValidPayload(body: unknown): body is { messages: Msg[]; personality?: string } {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  if (!Array.isArray(b.messages) || b.messages.length === 0 || b.messages.length > 50) return false;
  for (const m of b.messages) {
    if (!m || typeof m !== "object") return false;
    const mm = m as Record<string, unknown>;
    if (!["user", "assistant", "system"].includes(String(mm.role))) return false;
    if (typeof mm.content !== "string" || mm.content.length === 0 || mm.content.length > 8000) return false;
  }
  if (b.personality !== undefined && (typeof b.personality !== "string" || b.personality.length > 500)) return false;
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth: require a valid Supabase JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    if (!isValidPayload(body)) {
      return new Response(JSON.stringify({ error: "Invalid request payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { messages, personality } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const personalityAddendum = personality
      ? `\n\nUSER'S PREFERRED COACH STYLE: ${personality}`
      : "";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + personalityAddendum },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Coach is taking a breather — too many requests. Try again in a moment! 🧘" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Add funds in Settings → Workspace → Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("coach-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
