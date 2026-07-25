import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck } from 'lucide-react';

type OAuthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthNamespace }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get('authorization_id') ?? '';
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError('Missing authorization_id in the request URL.');
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = '/auth?next=' + encodeURIComponent(next);
        return;
      }
      const { data, error: detailsError } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (detailsError) {
        setError(detailsError.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error: decideError } = approve
      ? await oauth().approveAuthorization(authorizationId)
      : await oauth().denyAuthorization(authorizationId);
    if (decideError) {
      setBusy(false);
      setError(decideError.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError('No redirect returned by the authorization server.');
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? 'this app';

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md border-2 border-foreground bg-surface-1 p-6 shadow-[6px_6px_0_hsl(var(--foreground))]">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          TLC · Agent access
        </p>
        <h1 className="mt-2 font-serif text-2xl font-bold leading-tight">
          {error ? 'Authorization problem' : details ? `Connect ${clientName}` : 'Checking request…'}
        </h1>

        {error && (
          <>
            <p className="mt-3 text-sm text-destructive">{error}</p>
            <Button className="mt-5 w-full" variant="outline" onClick={() => window.location.assign('/')}>
              Back to app
            </Button>
          </>
        )}

        {!error && !details && (
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading authorization request…
          </p>
        )}

        {!error && details && (
          <>
            <p className="mt-3 text-sm text-muted-foreground">
              <strong className="text-foreground">{clientName}</strong> is asking to use SUPERHUMAN as
              you. It will be able to read and write your training logs through the app's agent tools.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-thunder-blue" />
                Read your workout logs and training summary
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-thunder-orange" />
                Create and delete workout log entries
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Button disabled={busy} className="flex-1" onClick={() => decide(true)}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve'}
              </Button>
              <Button disabled={busy} variant="outline" className="flex-1" onClick={() => decide(false)}>
                Deny
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
