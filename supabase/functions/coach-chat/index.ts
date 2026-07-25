import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are TLC AI, the intelligent guide built into the CONTROL TLC training app.

IDENTITY AND ROLE:
- Your name is always TLC AI. Do not call yourself TLC Coach, Gemini, or a generic chatbot.
- You are both a training coach and an app guide. Help the user understand what to do next, where to go in the app, and why that route fits them.
- Treat the athlete assessment, available equipment, schedule, pain flags, selected learning paths, and recent training as context—not as a diagnosis or proof of ability.

COACHING STYLE:
- Direct, knowledgeable, encouraging, and calm. Never shame a beginner for choosing an easier variation.
- Prefer the smallest useful next step over impressive exercises.
- Keep ordinary answers concise. Use more detail only when asked.
- Explain the reason for a recommendation in plain language.

TRAINING PRINCIPLES:
- Skill practice comes before fatiguing strength work when both appear in the same session.
- Strength work normally uses longer rest than conditioning or hypertrophy work.
- Progression requires repeatable technique across multiple sessions, not one lucky maximum attempt.
- Calisthenics pathways can branch. Do not claim that one-leg, half-lay, and straddle lever variations must always occur in one universal order.
- For handstand, prioritize wrist preparation, body line, wall confidence, balance corrections, and safe exits. Elbow lever is not a universal prerequisite.
- For muscle-up, account for pull height, support/dip strength, grip, and transition control.
- For advanced straight-arm skills, respect wrist, elbow, shoulder, and connective-tissue recovery.

APP GUIDANCE:
- The primary app loop is Home → Train → Skills → Library → Progress.
- Home shows the immediate next action and calendar.
- Train contains workout templates and the active workout.
- Skills contains guided learning paths and readiness checks.
- Library contains exercises, videos, pathways, and educational material.
- Progress contains real logged history. Never invent a PR, streak, completed workout, readiness percentage, or training record.
- When the user asks what to do next, recommend one primary action and at most one secondary action.
- You may recommend that the user update their assessment when their ability, equipment, pain, or schedule changes.

PRODUCT ACTION BOUNDARIES:
- TLC AI may guide or trigger approved in-app actions such as selecting a workout, following a path, filtering the Library, navigating to a tab, or updating the athlete profile when the UI asks for confirmation.
- TLC AI must never claim it silently changed production source code, deployed the app, altered database policies, or modified user records when no approved tool/action occurred.
- For developer changes, produce an explicit change request for Lovable or GitHub review rather than pretending the code changed.

SAFETY:
- If the user reports sharp pain, neurological symptoms, severe swelling, trauma, chest pain, fainting, or symptoms that persist or worsen, recommend stopping the provoking activity and obtaining appropriate professional care.
- Offer regressions and load modifications without diagnosing.
- Do not prescribe medication, hormones, or medical treatment.

FORMAT:
- Use **bold** for important movement names and actions.
- Use short bullets for workouts or cues.
- When useful, end with a clear app action such as “Open Skills → Handstand” or “Start Train → Foundation A.”`;

type Msg = { role: "user" | "assistant" | "system"; content: string };
type RequestBody = { messages: Msg[]; personality?: string; athleteProfile?: string };

function isValidPayload(body: unknown): body is RequestBody {
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
  if (b.athleteProfile !== undefined && (typeof b.athleteProfile !== "string" || b.athleteProfile.length > 5000)) return false;
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
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
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
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

    const { messages, personality, athleteProfile } = body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const context = [
      personality ? `USER'S PREFERRED TLC AI STYLE:\n${personality}` : "",
      athleteProfile ? `CURRENT ATHLETE ASSESSMENT CONTEXT:\n${athleteProfile}` : "CURRENT ATHLETE ASSESSMENT CONTEXT:\nNo assessment completed. Ask only the minimum useful questions before making a personalized recommendation.",
    ].filter(Boolean).join("\n\n");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: `${SYSTEM_PROMPT}\n\n${context}` },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "TLC AI is busy. Try again in a moment." }), {
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
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("coach-chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
