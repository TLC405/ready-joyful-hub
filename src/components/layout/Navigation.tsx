import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Settings,
  Menu,
  X,
  Home,
  Library,
  Sun,
  Moon,
  MessageSquare,
  Search,
  BookOpen,
  LogIn,
  LogOut,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'HOME', icon: Home },
  { id: 'library', label: 'LIBRARY', icon: Library },
  { id: 'coach', label: 'COACH', icon: MessageSquare },
  { id: 'progress', label: 'PROGRESS', icon: Flame },
  { id: 'guide', label: 'GUIDE', icon: BookOpen },
  { id: 'settings', label: 'SETTINGS', icon: Settings },
];

function useTheme() {
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'dark' | 'light') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'dark') {
      root.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setThemeState(t => t === 'dark' ? 'light' : 'dark');
  return { theme, toggle };
}

export function Navigation({ activeSection, onNavigate, onOpenSearch }: { activeSection: string; onNavigate: (section: string) => void; onOpenSearch?: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { isAuthenticated } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const ThemeIcon = theme === 'dark' ? Sun : Moon;
  const handleAuthClick = async () => {
    if (isAuthenticated) {
      await supabase.auth.signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="fixed left-0 top-0 z-50 hidden h-screen w-20 flex-col items-center border-r border-foreground/10 bg-card py-8 lg:flex skeuo-grain">
        {/* Logo with thunder gradient border */}
        <div className="mb-12">
          <div className="flex h-12 w-12 items-center justify-center border-2 skeuo-card thunder-border">
            <span className="font-chalk text-lg thunder-text text-journal">TLC</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "group relative flex h-14 w-14 items-center justify-center transition-all",
                  isActive 
                    ? "text-thunder-orange skeuo-pressed" 
                    : "text-muted-foreground hover:text-thunder-blue"
                )}
              >
                <Icon className="h-5 w-5" />
                <div className="pointer-events-none absolute left-full ml-3 flex items-center gap-2 border border-foreground/10 bg-card px-3 py-2 opacity-0 transition-opacity group-hover:opacity-100 skeuo-thunder-card">
                  <span className="whitespace-nowrap text-label text-xs text-embossed">{item.label}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="activeIndicator" className="absolute -right-[1px] h-8 w-0.5 thunder-gradient" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Search button */}
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="mb-2 flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-thunder-blue btn-raised"
            title="Search (⌘K)"
          >
            <Search className="h-5 w-5" />
          </button>
        )}

        {/* TLC Footer */}
        <div className="mb-2 text-center">
          <span className="text-[8px] text-muted-foreground/40 tracking-widest">© 2026 TLC</span>
        </div>

        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            className="mb-1 flex h-12 w-12 items-center justify-center text-thunder-orange transition-colors hover:text-thunder-blue btn-raised"
            title="Admin"
            aria-label="Admin dashboard"
          >
            <Shield className="h-5 w-5" />
          </button>
        )}

        <button
          onClick={handleAuthClick}
          className="mb-1 flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-thunder-blue btn-raised"
          title={isAuthenticated ? 'Sign out' : 'Sign in'}
          aria-label={isAuthenticated ? 'Sign out' : 'Sign in'}
        >
          {isAuthenticated ? <LogOut className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
        </button>

        <button
          onClick={toggle}
          className="mt-0 flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-thunder-orange btn-raised"
        >
          <ThemeIcon className="h-5 w-5" />
        </button>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 skeuo-leather skeuo-stitch lg:hidden">
        <div className="flex items-center justify-around py-3">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)}
                className={cn("flex flex-col items-center gap-1 px-3 py-1 transition-colors", isActive ? "text-thunder-orange" : "text-primary-foreground/50")}>
                <Icon className="h-5 w-5" />
                <span className="text-label text-[10px] text-journal-sm">{item.label}</span>
                {isActive && <div className="h-0.5 w-4 thunder-gradient" />}
              </button>
            );
          })}
          <button onClick={() => setMobileMenuOpen(true)} className="flex flex-col items-center gap-1 px-3 py-1 text-primary-foreground/50">
            <Menu className="h-5 w-5" />
            <span className="text-label text-[10px]">MORE</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-card notebook-ruled notebook-margin lg:hidden">
            <div className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border-2 skeuo-card thunder-border">
                    <span className="font-chalk text-lg thunder-text">TLC</span>
                  </div>
                  <span className="font-chalk text-2xl thunder-text text-journal-lg">TLC CALISTHENICS</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="flex h-10 w-10 items-center justify-center border border-foreground/10 btn-raised">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* Thunder divider */}
              <div className="mt-4 thunder-divider" />
              <div className="mt-4 flex flex-1 flex-col gap-1">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <motion.button key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                      onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                      className={cn("notebook-entry flex items-center gap-4 p-4 text-left transition-all", isActive ? "text-thunder-orange" : "text-foreground hover:text-thunder-blue")}>
                      <Icon className="h-5 w-5" />
                      <span className="font-chalk text-xl text-journal">{item.label}</span>
                      {isActive && <div className="ml-auto thunder-led" />}
                    </motion.button>
                  );
                })}
              </div>
              {isAdmin && (
                <button
                  onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                  className="mt-4 flex items-center gap-4 skeuo-stitch p-4 text-thunder-orange btn-raised"
                >
                  <Shield className="h-5 w-5" />
                  <span className="font-chalk text-xl text-journal">ADMIN</span>
                </button>
              )}
              <button
                onClick={() => { handleAuthClick(); setMobileMenuOpen(false); }}
                className="mt-2 flex items-center gap-4 skeuo-stitch p-4 text-foreground btn-raised"
              >
                {isAuthenticated ? <LogOut className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                <span className="font-chalk text-xl text-journal">{isAuthenticated ? 'SIGN OUT' : 'SIGN IN'}</span>
              </button>
              <button
                onClick={toggle}
                className="mt-2 flex items-center gap-4 skeuo-stitch p-4 text-foreground btn-raised"
              >
                <ThemeIcon className="h-5 w-5" />
                <span className="font-chalk text-xl text-journal">{theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
