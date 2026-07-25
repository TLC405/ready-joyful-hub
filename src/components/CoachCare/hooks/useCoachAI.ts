import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { athleteProfileSummary, loadAthleteProfile } from '@/lib/athlete-profile';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coach-chat`;

type Msg = { role: 'user' | 'assistant'; content: string };

export async function streamCoachResponse({
  messages,
  personality,
  athleteProfile,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  personality?: string;
  athleteProfile?: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  try {
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;
    if (!accessToken) {
      toast.error('Sign in to use TLC AI chat');
      onError('Authentication required');
      return;
    }

    const resp = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messages,
        personality,
        athleteProfile: athleteProfile || athleteProfileSummary(loadAthleteProfile()),
      }),
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({ error: 'Unknown error' }));
      const errMsg = errData.error || `Error ${resp.status}`;
      if (resp.status === 401) toast.error('Your session expired — sign in again');
      else if (resp.status === 429) toast.error('TLC AI is busy — slow down a bit');
      else if (resp.status === 402) toast.error('AI credits depleted');
      else toast.error('TLC AI error');
      onError(errMsg);
      return;
    }

    if (!resp.body) { onError('No stream body'); return; }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let nlIdx: number;
      while ((nlIdx = buffer.indexOf('\n')) !== -1) {
        let line = buffer.slice(0, nlIdx);
        buffer = buffer.slice(nlIdx + 1);
        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (line.startsWith(':') || line.trim() === '') continue;
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') { onDone(); return; }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          buffer = line + '\n' + buffer;
          break;
        }
      }
    }

    if (buffer.trim()) {
      for (let raw of buffer.split('\n')) {
        if (!raw) continue;
        if (raw.endsWith('\r')) raw = raw.slice(0, -1);
        if (!raw.startsWith('data: ')) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === '[DONE]') continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { /* ignore malformed final chunk */ }
      }
    }

    onDone();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Network error';
    toast.error('Failed to reach TLC AI');
    onError(msg);
  }
}
