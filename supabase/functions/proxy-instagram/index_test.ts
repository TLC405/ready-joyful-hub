import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const FN_URL = `${SUPABASE_URL}/functions/v1/proxy-instagram`;

async function call(body: unknown, auth?: string) {
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${auth ?? SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json: any = null;
  try { json = JSON.parse(text); } catch { /* ignore */ }
  return { status: res.status, json, text };
}

Deno.test("anon call with valid IG reel URL returns embed html", async () => {
  const r = await call({ url: "https://www.instagram.com/reel/CxYZ123abcd/" });
  assert(r.status === 200, `expected 200, got ${r.status}`);
  assert(r.json?.html, "expected html in response");
});

Deno.test("anon call still works (endpoint is public)", async () => {
  const r = await call({ url: "https://www.instagram.com/p/CxYZ123abcd/" });
  assertEquals(r.status, 200);
});

Deno.test("invalid/expired bearer token still proxies (public endpoint)", async () => {
  const r = await call(
    { url: "https://www.instagram.com/reel/CxYZ123abcd/" },
    "invalid.jwt.token",
  );
  // proxy-instagram does not require auth — should NOT 401
  assert(r.status !== 401, `should not be 401, got ${r.status}`);
});

Deno.test("malformed URL returns 400", async () => {
  const r = await call({ url: "not-a-url" });
  assertEquals(r.status, 400);
  assert(r.json?.error);
});

Deno.test("non-instagram host returns 400", async () => {
  const r = await call({ url: "https://example.com/p/abc/" });
  assertEquals(r.status, 400);
});

Deno.test("missing url returns 400", async () => {
  const r = await call({});
  assertEquals(r.status, 400);
});

Deno.test("oversized url returns 400", async () => {
  const r = await call({ url: "https://instagram.com/" + "a".repeat(600) });
  assertEquals(r.status, 400);
});

Deno.test("CORS preflight returns ok", async () => {
  const res = await fetch(FN_URL, { method: "OPTIONS" });
  await res.text();
  assertEquals(res.status, 200);
  assert(res.headers.get("access-control-allow-origin"));
});
