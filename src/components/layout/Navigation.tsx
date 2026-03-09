import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Settings, 
  Menu,
  X,
  Home,
  ChevronRight,
  GitBranch,
  Library,
  Sun,
  Moon,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'HOME', icon: Home },
  { id: 'library', label: 'LIBRARY', icon: Library },
  { id: 'tracks', label: 'TRACKS', icon: GitBranch },
  { id: 'coach', label: 'COACH', icon: MessageSquare },
  { id: 'progress', label: 'PROGRESS', icon: Flame },
  { id: 'settings', label: 'SETTINGS', icon: Settings },
];

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

function useTheme() {
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'light') {
      root.classList.add('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setThemeState(t => t === 'dark' ? 'light' : 'dark');
  return { theme, toggle };
}

export function Navigation({ activeSection, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const ThemeIcon = theme === 'dark' ? Sun : Moon;

  return (
    <>
      {/* Desktop Navigation — brushed metal sidebar */}
      <nav className="texture-brushed surface-raised fixed left-0 top-0 z-50 hidden h-screen w-20 flex-col items-center border-r border-border py-8 lg:flex">
        <motion.div className="relative z-10 mb-12" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <div className="badge-coin flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <span className="font-chalk text-lg text-primary-foreground">STK</span>
          </div>
        </motion.div>

        <div className="relative z-10 flex flex-1 flex-col items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "group relative flex h-14 w-14 items-center justify-center rounded-lg transition-all duration-300",
                  isActive 
                    ? "surface-inset text-primary" 
                    : "btn-raised text-muted-foreground hover:text-foreground"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="h-5 w-5" />
                <div className="surface-raised pointer-events-none absolute left-full ml-3 flex items-center gap-2 rounded-md px-3 py-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="whitespace-nowrap text-label">{item.label}</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </div>
                {isActive && (
                  <motion.div layoutId="activeIndicator" className="absolute -right-[1px] h-8 w-1 rounded-l-full bg-primary" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Theme Toggle */}
        <motion.button
          onClick={toggle}
          className="btn-raised relative z-10 mt-4 flex h-12 w-12 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ThemeIcon className="h-5 w-5" />
        </motion.button>
      </nav>

      {/* Mobile Navigation */}
      <nav className="surface-glass fixed bottom-0 left-0 right-0 z-50 border-t border-border lg:hidden">
        <div className="flex items-center justify-around py-3">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)}
                className={cn("flex flex-col items-center gap-1 px-3 py-1 transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
                <Icon className="h-5 w-5" />
                <span className="text-label text-[10px]">{item.label}</span>
              </button>
            );
          })}
          <button onClick={() => setMobileMenuOpen(true)} className="flex flex-col items-center gap-1 px-3 py-1 text-muted-foreground">
            <Menu className="h-5 w-5" />
            <span className="text-label text-[10px]">MORE</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 lg:hidden" style={{ background: 'hsla(var(--surface-0), 0.98)' }}>
            <div className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="badge-coin flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <span className="font-chalk text-xl text-primary-foreground">STK</span>
                  </div>
                  <span className="font-chalk text-2xl text-embossed">STACKED</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="btn-raised flex h-10 w-10 items-center justify-center rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-8 flex flex-1 flex-col gap-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <motion.button key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                      onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                      className={cn("flex items-center gap-4 rounded-lg p-4 transition-all", isActive ? "surface-inset text-primary" : "surface-raised text-foreground")}>
                      <Icon className="h-6 w-6" />
                      <span className="font-chalk text-xl">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
              <button
                onClick={toggle}
                className="surface-raised mt-4 flex items-center gap-4 rounded-lg p-4 text-foreground"
              >
                <ThemeIcon className="h-6 w-6" />
                <span className="font-chalk text-xl">{theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
