import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, User, Palette, Dumbbell, Database, Download, Github,
  Smartphone, Code, Info, Sun, Moon, Timer, Bell, BellOff, Trash2, FileDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

const cardDelay = (i: number) => ({ delay: i * 0.06, type: 'spring' as const, stiffness: 300, damping: 24 });

export function SettingsPanel() {
  const [displayName, setDisplayName] = useState('Athlete');
  const [bio, setBio] = useState('Working on my handstand game 🤸');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [restTimer, setRestTimer] = useState('90');
  const [notifications, setNotifications] = useState(true);
  const [defaultDifficulty, setDefaultDifficulty] = useState('all');

  const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  const toggleTheme = () => {
    const root = document.documentElement;
    if (currentTheme === 'light') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleExport = () => {
    const data = {
      displayName, bio, units, restTimer, notifications, defaultDifficulty,
      exportedAt: new Date().toISOString(),
      app: 'TLC Calisthenics v1.0',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tlc-calisthenics-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Clear all local data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <section className="relative px-4 py-8 lg:px-8">
      <div className="editorial-divider-thick mb-6 pt-2">
        <div className="flex items-center gap-3">
          <h2 className="text-editorial-sm text-foreground">SETTINGS</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px bg-foreground/10 border border-foreground/10 lg:grid-cols-2">
        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={cardDelay(0)} className="bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 font-chalk text-sm">
            <User className="h-4 w-4 text-primary" /> PROFILE
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-label text-xs text-muted-foreground">DISPLAY NAME</label>
              <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full border border-foreground/10 bg-surface-0 px-3 py-2 font-chalk text-sm text-foreground focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-label text-xs text-muted-foreground">BIO</label>
              <input value={bio} onChange={e => setBio(e.target.value)} className="w-full border border-foreground/10 bg-surface-0 px-3 py-2 font-chalk text-sm text-foreground focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-label text-xs text-muted-foreground">UNITS</label>
              <div className="flex">
                {(['metric', 'imperial'] as const).map(u => (
                  <button key={u} onClick={() => setUnits(u)}
                    className={cn("flex-1 border border-foreground/10 px-4 py-2 text-label text-sm transition-colors", units === u ? "bg-foreground text-card" : "bg-card text-muted-foreground hover:bg-surface-0")}>
                    {u.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={cardDelay(1)} className="bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 font-chalk text-sm">
            <Palette className="h-4 w-4 text-primary" /> APPEARANCE
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-label text-xs text-muted-foreground">THEME</label>
              <button onClick={toggleTheme} className="flex w-full items-center gap-3 border border-foreground/10 px-4 py-3 text-foreground transition-colors hover:bg-surface-0">
                {currentTheme === 'dark' ? <Sun className="h-5 w-5 text-primary" /> : <Moon className="h-5 w-5 text-primary" />}
                <span className="font-chalk text-sm">{currentTheme === 'dark' ? 'SWITCH TO LIGHT' : 'SWITCH TO DARK'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Training Preferences */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={cardDelay(2)} className="bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 font-chalk text-sm">
            <Dumbbell className="h-4 w-4 text-primary" /> TRAINING
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-label text-xs text-muted-foreground">DEFAULT REST TIMER (sec)</label>
              <input type="number" value={restTimer} onChange={e => setRestTimer(e.target.value)} className="w-full border border-foreground/10 bg-surface-0 px-3 py-2 font-chalk text-sm text-foreground focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-label text-xs text-muted-foreground">DEFAULT DIFFICULTY</label>
              <select value={defaultDifficulty} onChange={e => setDefaultDifficulty(e.target.value)}
                className="w-full border border-foreground/10 bg-card px-3 py-2 font-chalk text-sm text-foreground focus:outline-none">
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-label text-xs text-muted-foreground">NOTIFICATIONS</label>
              <button onClick={() => setNotifications(!notifications)}
                className={cn("flex w-full items-center gap-3 border border-foreground/10 px-4 py-3 transition-colors hover:bg-surface-0", notifications ? "text-primary" : "text-muted-foreground")}>
                {notifications ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                <span className="font-chalk text-sm">{notifications ? 'ENABLED' : 'DISABLED'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={cardDelay(3)} className="bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 font-chalk text-sm">
            <Database className="h-4 w-4 text-primary" /> DATA
          </h3>
          <div className="space-y-2">
            <button onClick={handleExport} className="flex w-full items-center gap-3 border border-foreground/10 px-4 py-3 font-chalk text-sm text-foreground transition-colors hover:bg-surface-0">
              <FileDown className="h-4 w-4 text-primary" /> EXPORT TRAINING DATA
            </button>
            <button onClick={handleClearData} className="flex w-full items-center gap-3 border border-primary/30 bg-primary/5 px-4 py-3 font-chalk text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
              <Trash2 className="h-4 w-4" /> CLEAR ALL LOCAL DATA
            </button>
          </div>
        </motion.div>

        {/* App Download — full width */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={cardDelay(4)} className="bg-card p-6 lg:col-span-2">
          <h3 className="mb-4 flex items-center gap-2 font-chalk text-sm">
            <Download className="h-4 w-4 text-primary" /> APP DOWNLOAD
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Download the complete TLC Calisthenics source code. Build for web, iOS, and Android.
          </p>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <button className="flex-1 bg-primary px-6 py-3 font-chalk text-sm text-primary-foreground transition-opacity hover:opacity-90">
              <Download className="mr-2 inline h-4 w-4" /> DOWNLOAD ZIP
            </button>
            <button className="flex-1 border-2 border-foreground px-6 py-3 font-chalk text-sm text-foreground transition-colors hover:bg-foreground hover:text-card">
              <Github className="mr-2 inline h-4 w-4" /> VIEW ON GITHUB
            </button>
          </div>
          <div className="grid grid-cols-2 gap-px bg-foreground/5 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: '⚛️', label: 'React + TypeScript' },
              { icon: '🎨', label: 'Tailwind + Animations' },
              { icon: '📱', label: 'Capacitor Mobile' },
              { icon: '🔐', label: 'Auth Ready' },
              { icon: '💳', label: 'Stripe Ready' },
              { icon: '🔔', label: 'Push Notifications' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 bg-card p-3">
                <span className="text-base">{item.icon}</span>
                <span className="text-label text-[10px]">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* About */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={cardDelay(5)} className="bg-card p-6 lg:col-span-2">
          <h3 className="mb-2 flex items-center gap-2 font-chalk text-sm">
            <Info className="h-4 w-4 text-primary" /> ABOUT
          </h3>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="font-chalk text-foreground">TLC Calisthenics v1.0</span>
            <span>·</span>
            <span>React + Vite + Tailwind</span>
            <span>·</span>
            <span>Built with conviction by TLC</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
