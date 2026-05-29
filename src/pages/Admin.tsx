import { useEffect, useState } from 'react';
import { AdminOnly } from '@/components/auth/AdminOnly';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Users, Activity } from 'lucide-react';
import { Navigation } from '@/components/layout/Navigation';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [stats, setStats] = useState<{ users: number; logs: number; loading: boolean }>({ users: 0, logs: 0, loading: true });

  useEffect(() => {
    (async () => {
      const [{ count: roleCount }, { count: logCount }] = await Promise.all([
        supabase.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
        supabase.from('workout_logs').select('*', { count: 'exact', head: true }),
      ]);
      setStats({ users: roleCount || 0, logs: logCount || 0, loading: false });
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-thunder-orange" aria-hidden="true" />
        <h1 className="font-chalk text-3xl text-foreground">ADMIN</h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-foreground/10 rounded-lg p-5 bg-card">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
            <Users className="h-4 w-4" /> Users
          </div>
          <div className="font-chalk text-4xl mt-2 text-foreground">{stats.loading ? '—' : stats.users}</div>
        </div>
        <div className="border border-foreground/10 rounded-lg p-5 bg-card">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
            <Activity className="h-4 w-4" /> Workout entries
          </div>
          <div className="font-chalk text-4xl mt-2 text-foreground">{stats.loading ? '—' : stats.logs}</div>
        </div>
      </div>

      <div className="border border-foreground/10 rounded-lg p-5 bg-card text-sm text-muted-foreground">
        <p>You're signed in as the sole admin. More tools (user search, role management, content review) will land here.</p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen text-foreground">
      <Navigation activeSection="admin" onNavigate={(s) => navigate(`/?section=${s}`)} />
      <main className="lg:ml-20 pt-4">
        <AdminOnly><AdminDashboard /></AdminOnly>
      </main>
    </div>
  );
}
