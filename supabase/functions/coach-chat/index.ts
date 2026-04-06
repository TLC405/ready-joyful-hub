import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, personality } = await req.json();
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
