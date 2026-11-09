import { useState, useEffect } from 'react';
import { Home, Library, Sun, Moon, MessageSquare, Search, BookOpen, LogIn, LogOut, Shield, Menu, CalendarDays, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'coach', label: 'Coach', icon: MessageSquare },
  { id: 'progress', label: 'Journal', icon: CalendarDays },
  { id: 'guide', label: 'Guide', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];
function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); localStorage.setItem('theme', theme); }, [theme]);
  return { theme, toggle: () => setTheme(t => t === 'dark' ? 'light' : 'dark') };
}
export function Navigation({ activeSection, onNavigate, onOpenSearch }: { activeSection: string; onNavigate: (section: string) => void; onOpenSearch?: () => void }) {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { isAuthenticated } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const ThemeIcon = theme === 'dark' ? Sun : Moon;
  const authLabel = isAuthenticated ? 'Sign out' : 'Sign in';
  const authAction = async () => { if (isAuthenticated) await supabase.auth.signOut(); else navigate('/auth'); setOpen(false); };
  const go = (id: string) => { onNavigate(id); setOpen(false); };
  return <>
    <nav aria-label="Main navigation" className="fixed left-0 top-0 z-40 hidden h-dvh w-20 flex-col items-center border-r border-border/15 bg-card py-5 lg:flex">
      <Button variant="ghost" size="icon" onClick={() => go('home')} className="mb-7 font-chalk text-lg text-thunder-orange" aria-label="TLC home">TLC</Button>
      <div className="flex flex-1 flex-col gap-2">
        {navItems.map(({ id, label, icon: Icon }) => <Button key={id} size="icon" variant="ghost" title={label} aria-label={label} aria-current={activeSection === id ? 'page' : undefined} onClick={() => go(id)} className={cn('relative h-12 w-12', activeSection === id ? 'bg-thunder-orange/10 text-thunder-orange' : 'text-muted-foreground')}><Icon />{activeSection === id && <span className="absolute -right-4 h-6 w-1 bg-thunder-orange" />}</Button>)}
      </div>
      {onOpenSearch && <Button size="icon" variant="ghost" onClick={onOpenSearch} aria-label="Search" title="Search"><Search /></Button>}
      {isAdmin && <Button size="icon" variant="ghost" onClick={() => navigate('/admin')} aria-label="Admin dashboard" title="Admin" className="text-thunder-orange"><Shield /></Button>}
      <Button size="icon" variant="ghost" onClick={authAction} aria-label={authLabel} title={authLabel}>{isAuthenticated ? <LogOut /> : <LogIn />}</Button>
      <Button size="icon" variant="ghost" onClick={toggle} aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'} title="Change appearance"><ThemeIcon /></Button>
    </nav>
    <header className="safe-top fixed inset-x-0 top-0 z-40 border-b border-border/10 bg-background/95 backdrop-blur-md lg:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        <Button variant="ghost" onClick={() => go('home')} className="h-auto gap-3 p-0 hover:bg-transparent"><span className="font-chalk text-2xl text-thunder-orange">TLC<span className="text-thunder-blue">.</span></span><span className="border-l border-border/15 pl-3 text-xs font-semibold text-foreground">SUPERHUMAN</span></Button>
        <div className="flex gap-1">{onOpenSearch && <Button size="icon" variant="ghost" onClick={onOpenSearch} aria-label="Search"><Search /></Button>}<Button size="icon" variant="ghost" onClick={toggle} aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}><ThemeIcon /></Button></div>
      </div>
    </header>
    <nav aria-label="Phone navigation" className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border/15 bg-card/95 backdrop-blur-md lg:hidden">
      <div className="grid h-[72px] grid-cols-5 px-1">
        {navItems.slice(0, 4).map(({ id, label, icon: Icon }) => <Button key={id} variant="ghost" onClick={() => go(id)} aria-current={activeSection === id ? 'page' : undefined} className={cn('h-full flex-col gap-1 rounded-none px-0 text-[11px] hover:bg-muted', activeSection === id ? 'text-thunder-orange' : 'text-muted-foreground')}><Icon className="!h-5 !w-5" /><span>{label}</span></Button>)}
        <Button variant="ghost" onClick={() => setOpen(true)} aria-label="More options" className="h-full flex-col gap-1 rounded-none px-0 text-[11px] text-muted-foreground"><Menu className="!h-5 !w-5" />More</Button>
      </div>
    </nav>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="safe-bottom max-h-[90dvh] overflow-y-auto rounded-t-lg p-5">
        <SheetHeader className="text-left"><SheetTitle className="font-chalk text-2xl">TLC Superhuman</SheetTitle><SheetDescription>Training for the hybrid athlete</SheetDescription></SheetHeader>
        <div className="mt-5 grid grid-cols-2 gap-2">{navItems.map(({ id, label, icon: Icon }) => <Button key={id} variant="ghost" className="h-14 justify-start border border-border/10" onClick={() => go(id)}><Icon />{label}</Button>)}</div>
        <div className="mt-4 space-y-1 border-t border-border/10 pt-3">
          {isAdmin && <Button variant="ghost" className="w-full justify-start text-thunder-orange" onClick={() => { setOpen(false); navigate('/admin'); }}><Shield />Admin dashboard</Button>}
          <Button variant="ghost" className="w-full justify-start" onClick={toggle}><ThemeIcon />{theme === 'dark' ? 'Light mode' : 'Dark mode'}</Button>
          <Button variant="ghost" className="w-full justify-start" onClick={authAction}>{isAuthenticated ? <LogOut /> : <LogIn />}{authLabel}</Button>
        </div>
      </SheetContent>
    </Sheet>
  </>;
}
