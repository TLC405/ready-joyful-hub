import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Dumbbell, Home, Library, LogIn, LogOut, Menu, MessageSquare, Moon, Route, Search, Settings, Shield, Sun, TrendingUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface NavItem { id: string; label: string; icon: React.ElementType }

const primaryItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'train', label: 'Train', icon: Dumbbell },
  { id: 'skills', label: 'Skills', icon: Route },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
];

const secondaryItems: NavItem[] = [
  { id: 'coach', label: 'Coach TLC', icon: MessageSquare },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  return { theme, toggle: () => setTheme(value => value === 'dark' ? 'light' : 'dark') };
}

export function Navigation({ activeSection, onNavigate, onOpenSearch }: { activeSection: string; onNavigate: (section: string) => void; onOpenSearch?: () => void }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { isAuthenticated } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const ThemeIcon = theme === 'dark' ? Sun : Moon;

  const handleAuth = async () => {
    if (isAuthenticated) await supabase.auth.signOut();
    else navigate('/auth');
  };

  const go = (id: string) => {
    onNavigate(id);
    setMoreOpen(false);
  };

  return (
    <>
      <nav className="fixed inset-y-0 left-0 z-50 hidden w-20 flex-col items-center border-r border-border bg-card py-5 shadow-sm lg:flex" aria-label="Primary navigation">
        <button onClick={() => go('home')} className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-foreground text-background shadow-sm" aria-label="CONTROL TLC home">
          <span className="font-chalk text-sm">TLC</span>
        </button>

        <div className="flex flex-1 flex-col gap-1">
          {primaryItems.map(item => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button key={item.id} onClick={() => go(item.id)} className={cn('group relative flex h-14 w-14 items-center justify-center rounded-xl transition-colors', active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground')} aria-label={item.label} aria-current={active ? 'page' : undefined}>
                <Icon className="h-5 w-5" />
                <span className="pointer-events-none absolute left-full ml-3 rounded-lg border border-border bg-popover px-3 py-2 text-xs font-semibold text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-1">
          {onOpenSearch && <button onClick={onOpenSearch} className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Search"><Search className="h-5 w-5" /></button>}
          <button onClick={() => setMoreOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="More"><Menu className="h-5 w-5" /></button>
        </div>
      </nav>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] shadow-lg lg:hidden" aria-label="Primary navigation">
        <div className="grid h-[4.75rem] grid-cols-5 px-1">
          {primaryItems.map(item => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button key={item.id} onClick={() => go(item.id)} className={cn('relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold', active ? 'text-primary' : 'text-muted-foreground')} aria-current={active ? 'page' : undefined}>
                {active && <motion.span layoutId="mobile-active-tab" className="absolute inset-x-2 top-1 h-0.5 rounded-full bg-primary" />}
                <Icon className="h-5 w-5" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
        <button onClick={() => setMoreOpen(true)} className="absolute -top-12 right-3 flex h-10 items-center gap-2 rounded-full border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-md"><Menu className="h-4 w-4" /> More</button>
      </nav>

      <AnimatePresence>
        {moreOpen && (
          <motion.div className="fixed inset-0 z-[60] bg-foreground/30 p-3 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMoreOpen(false)}>
            <motion.div className="ml-auto flex h-full w-full max-w-sm flex-col rounded-2xl border border-border bg-card p-5 shadow-lg" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 30, opacity: 0 }} transition={{ duration: 0.14 }} onClick={event => event.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">CONTROL TLC</div><h2 className="mt-1 font-chalk text-xl">More</h2></div>
                <button onClick={() => setMoreOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-lg border border-border" aria-label="Close menu"><X className="h-5 w-5" /></button>
              </div>

              <div className="mt-6 space-y-2">
                {secondaryItems.map(item => {
                  const Icon = item.icon;
                  const active = activeSection === item.id;
                  return <button key={item.id} onClick={() => go(item.id)} className={cn('flex min-h-14 w-full items-center gap-3 rounded-xl border p-3 text-left', active ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted')}><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted"><Icon className="h-5 w-5" /></span><span className="font-semibold">{item.label}</span></button>;
                })}
                {isAdmin && <button onClick={() => { navigate('/admin'); setMoreOpen(false); }} className="flex min-h-14 w-full items-center gap-3 rounded-xl border border-border p-3 text-left hover:bg-muted"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted"><Shield className="h-5 w-5" /></span><span className="font-semibold">Admin</span></button>}
              </div>

              <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                <button onClick={toggle} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted"><ThemeIcon className="h-4 w-4" /> {theme === 'dark' ? 'Light' : 'Dark'}</button>
                <button onClick={handleAuth} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted">{isAuthenticated ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}{isAuthenticated ? 'Sign out' : 'Sign in'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
