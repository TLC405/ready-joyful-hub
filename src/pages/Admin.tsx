import { useEffect, useState } from 'react';
import { AdminOnly } from '@/components/auth/AdminOnly';
import { supabase } from '@/integrations/supabase/client';
import {
  Shield, Users, Activity, Download, Github, Database, Bell, Dumbbell, Sparkles, ExternalLink,
} from 'lucide-react';
import { Navigation } from '@/components/layout/Navigation';
import { useNavigate } from 'react-router-dom';
import { exercises } from '@/lib/exercises';

function AdminDashboard() {
  const navigate = useNavigate();
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

  const statCards = [
    { icon: Users, label: 'USERS', value: stats.loading ? '—' : stats.users.toLocaleString() },
    { icon: Activity, label: 'WORKOUT ENTRIES', value: stats.loading ? '—' : stats.logs.toLocaleString() },
    { icon: Dumbbell, label: 'SKILLS IN LIBRARY', value: exercises.length.toLocaleString() },
  ];

  const tools = [
    {
      icon: Download,
      title: 'Download full code',
      desc: 'Export the complete source (React + TypeScript + Tailwind) as a ZIP, ready for web, iOS and Android via Capacitor.',
      action: 'Get the code',
      onClick: () => window.dispatchEvent(new CustomEvent('lovable:open-github')),
      note: 'Connect GitHub once, then export or clone anytime.',
    },
    {
      icon: Github,
      title: 'GitHub sync',
      desc: 'Two-way sync between this project and your own repository. Every change lands as a commit.',
      action: 'Open GitHub settings',
      onClick: () => window.dispatchEvent(new CustomEvent('lovable:open-github')),
    },
    {
      icon: Database,
      title: 'Backend & data',
      desc: 'Tables, auth users, storage and edge functions for logs, roles and the coach.',
      action: 'View backend',
      onClick: () => window.dispatchEvent(new CustomEvent('lovable:open-backend')),
    },
    {
      icon: Bell,
      title: 'Notifications',
      desc: 'Compose announcements, streak nudges and promotions for your athletes.',
      action: 'Open command center',
      onClick: () => navigate('/?section=admin-panel'),
    },
    {
      icon: Sparkles,
      title: 'Coach studio',
      desc: 'Tune the TLC COACH personality, prompts and streaming behavior.',
      action: 'Open studio',
      onClick: () => navigate('/?section=coach'),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center border-2 border-thunder-orange bg-thunder-orange/10">
          <Shield className="h-5 w-5 text-thunder-orange" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-chalk text-3xl text-foreground leading-none">ADMIN</h1>
          <p className="text-xs text-muted-foreground mt-1">TLC command deck — only you can see this.</p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
        {statCards.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-card p-5">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
              <Icon className="h-4 w-4 text-thunder-orange" /> {label}
            </div>
            <div className="font-chalk text-4xl mt-2 text-foreground">{value}</div>
          </div>
        ))}
      </div>

      {/* Tools */}
      <section aria-label="Admin tools">
        <h2 className="font-chalk text-lg text-foreground mb-3 tracking-wide">TOOLS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map(({ icon: Icon, title, desc, action, onClick, note }) => (
            <div key={title} className="border border-foreground/10 rounded-lg bg-card p-5 flex flex-col gap-2 hover:border-thunder-orange/40 transition-colors">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-thunder-orange" aria-hidden="true" />
                <h3 className="font-chalk text-base text-foreground">{title}</h3>
              </div>
              <p className="text-sm text-muted-foreground flex-1">{desc}</p>
              {note && <p className="text-[11px] text-muted-foreground/70">{note}</p>}
              <button
                onClick={onClick}
                className="mt-1 inline-flex items-center gap-2 self-start rounded-full bg-thunder-orange px-4 py-2 text-xs font-medium text-white hover:bg-thunder-orange/90 transition-colors"
              >
                {action} <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>
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
