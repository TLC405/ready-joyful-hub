import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, 
  Trophy, 
  Flame, 
  User, 
  Settings, 
  Crown,
  Menu,
  X,
  Home,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  premium?: boolean;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'HOME', icon: Home },
  { id: 'skills', label: 'SKILLS', icon: Dumbbell },
  { id: 'progress', label: 'PROGRESS', icon: Flame },
  { id: 'leaderboard', label: 'LEADERBOARD', icon: Trophy },
  { id: 'profile', label: 'PROFILE', icon: User, premium: true },
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
      <nav className="fixed left-0 top-0 z-50 hidden h-screen w-20 flex-col items-center border-r border-border bg-card/95 py-8 backdrop-blur-xl lg:flex">
        {/* Logo */}
        <motion.div 
          className="mb-12"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <span className="font-chalk text-2xl text-primary-foreground">TLC</span>
          </div>
        </motion.div>

        {/* Nav Items */}
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
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="h-5 w-5" />
                
                {/* Premium Badge */}
                {item.premium && (
                  <Crown className="absolute -right-1 -top-1 h-3 w-3 text-primary" />
                )}
                
                {/* Tooltip */}
                <div className="pointer-events-none absolute left-full ml-3 flex items-center gap-2 rounded-md bg-popover px-3 py-2 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  <span className="whitespace-nowrap font-chalk text-sm">{item.label}</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -right-[1px] h-8 w-1 rounded-l-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Streak Counter */}
        <motion.div 
          className="mt-auto flex flex-col items-center gap-1"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
            <Flame className="h-6 w-6 text-white" />
          </div>
          <span className="font-chalk text-lg text-primary">7</span>
        </motion.div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-around py-3">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-chalk text-[10px]">{item.label}</span>
              </button>
            );
          })}
          
          {/* More Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-1 text-muted-foreground"
          >
            <Menu className="h-5 w-5" />
            <span className="font-chalk text-[10px]">MORE</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <span className="font-chalk text-xl text-primary-foreground">TLC</span>
                  </div>
                  <span className="font-chalk text-2xl">CALISTHENICS</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 flex flex-1 flex-col gap-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-4 rounded-lg p-4 transition-all",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="font-chalk text-xl">{item.label}</span>
                      {item.premium && (
                        <Crown className="ml-auto h-5 w-5 text-primary" />
                      )}
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
