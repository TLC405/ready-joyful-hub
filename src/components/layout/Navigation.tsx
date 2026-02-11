import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, 
  Flame, 
  User, 
  Settings, 
  Menu,
  X,
  Home,
  ChevronRight,
  GitBranch,
  Library
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
  { id: 'progress', label: 'PROGRESS', icon: Flame },
  { id: 'admin', label: 'ADMIN', icon: Settings },
];

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export function Navigation({ activeSection, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="surface-glass fixed left-0 top-0 z-50 hidden h-screen w-20 flex-col items-center border-r border-border py-8 lg:flex">
        <motion.div className="mb-12" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/30 bg-primary">
            <span className="font-chalk text-lg text-primary-foreground">STK</span>
          </div>
        </motion.div>

        <div className="flex flex-1 flex-col items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "group relative flex h-14 w-14 items-center justify-center rounded-lg transition-all duration-300",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="h-5 w-5" />
                <div className="surface-elevated pointer-events-none absolute left-full ml-3 flex items-center gap-2 rounded-md px-3 py-2 opacity-0 transition-opacity group-hover:opacity-100">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="surface-glass fixed inset-0 z-50 lg:hidden" style={{ background: 'hsla(var(--surface-0), 0.95)' }}>
            <div className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <span className="font-chalk text-xl text-primary-foreground">STK</span>
                  </div>
                  <span className="font-chalk text-2xl">STACKED</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2">
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
                      className={cn("flex items-center gap-4 rounded-lg p-4 transition-all", isActive ? "bg-primary text-primary-foreground" : "bg-surface-2 text-foreground hover:bg-surface-3")}>
                      <Icon className="h-6 w-6" />
                      <span className="font-chalk text-xl">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
