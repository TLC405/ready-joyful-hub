const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

function fallbackEmbed(url: string) {
  const match = url.match(/instagram\.com\/(p|reel|reels)\/([a-zA-Z0-9_-]+)/)
  if (!match) return null

  return `<iframe src="https://www.instagram.com/${match[1]}/${match[2]}/embed/captioned" width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {


    const body = await req.json().catch(() => null);
    const url = body?.url;
    if (!url || typeof url !== 'string' || url.length > 500) {
      return new Response(JSON.stringify({ error: 'Missing or invalid url parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Validate it's actually an Instagram URL
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (!/(^|\.)instagram\.com$/i.test(parsed.hostname)) {
      return new Response(JSON.stringify({ error: 'URL must be from instagram.com' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Try Instagram oEmbed (no access token needed for basic oEmbed)
    const oembedUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}&maxwidth=658&omitscript=true`

    const resp = await fetch(oembedUrl, {
      headers: { 'User-Agent': 'TLC-TV/1.0' },
    })

    if (resp.ok) {
      const contentType = resp.headers.get('content-type') || ''
      const raw = await resp.text()

      if (contentType.includes('application/json')) {
        try {
          const data = JSON.parse(raw)
          return new Response(JSON.stringify({
            html: data.html || fallbackEmbed(url),
            thumbnail_url: data.thumbnail_url || null,
            title: data.title || null,
            author_name: data.author_name || null,
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        } catch {
          // Instagram sometimes answers 200 with a non-JSON body; fall through to local embed.
        }
      }
    }

    // Fallback: extract shortcode and return basic embed URL
    const embedHtml = fallbackEmbed(url)
    if (embedHtml) {
      return new Response(JSON.stringify({
        html: embedHtml,
        thumbnail_url: null,
        title: null,
        author_name: null,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Could not process Instagram URL' }), {
      status: 422,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
