import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const emailSchema = z.string().trim().email({ message: 'Enter a valid email' }).max(255);
const passwordSchema = z.string().min(8, { message: 'At least 8 characters' }).max(128);

export default function AuthPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('next') || '/';
  const { toast } = useToast();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailParse = emailSchema.safeParse(email);
    const passParse = passwordSchema.safeParse(password);
    if (!emailParse.success) return toast({ title: 'Invalid email', description: emailParse.error.issues[0].message, variant: 'destructive' });
    if (!passParse.success) return toast({ title: 'Invalid password', description: passParse.error.issues[0].message, variant: 'destructive' });

    setLoading(true);
    try {
      if (tab === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: emailParse.data,
          password: passParse.data,
          options: { emailRedirectTo: `${window.location.origin}${redirect}` },
        });
        if (error) throw error;
        toast({ title: 'Welcome to TLC', description: 'Account created. You are signed in.' });
        navigate(redirect, { replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailParse.data,
          password: passParse.data,
        });
        if (error) throw error;
        navigate(redirect, { replace: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      toast({ title: 'Sign in failed', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: `${window.location.origin}${redirect}`,
      });
      if (result.error) throw result.error;
      if (result.redirected) return; // browser navigates
      navigate(redirect, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      toast({ title: 'Sign in failed', description: msg, variant: 'destructive' });
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground">
      <div className="w-full max-w-sm border border-foreground/10 bg-card p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="font-chalk text-3xl text-foreground">TLC CALISTHENICS</h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Sign in to train</p>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'signin' | 'signup')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>

          <form onSubmit={handleEmailAuth} className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete={tab === 'signup' ? 'new-password' : 'current-password'} required value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} maxLength={128} />
              {tab === 'signup' && (
                <p className="text-[11px] text-muted-foreground">8+ chars. Common leaked passwords are blocked.</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {tab === 'signup' ? 'Create account' : 'Sign in'}
            </Button>
          </form>
        </Tabs>

        <div className="my-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          <div className="h-px flex-1 bg-foreground/10" />
          or
          <div className="h-px flex-1 bg-foreground/10" />
        </div>

        <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          By continuing you agree to our terms.{' '}
          <Link to="/" className="underline underline-offset-2 hover:text-foreground">Back home</Link>
        </p>
      </div>
    </main>
  );
}
