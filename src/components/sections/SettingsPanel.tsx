import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, User, Palette, Dumbbell, Database, Download, Github,
  Smartphone, Code, Info, Sun, Moon, Timer, Bell, BellOff, Trash2, FileDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const accentColors = [
  { name: 'Gold', hsl: '45 93% 53%' },
  { name: 'Cyan', hsl: '190 90% 50%' },
  { name: 'Rose', hsl: '350 80% 55%' },
  { name: 'Lime', hsl: '120 60% 50%' },
  { name: 'Violet', hsl: '270 70% 60%' },
  { name: 'Orange', hsl: '25 95% 55%' },
];

const cardDelay = (i: number) => ({ delay: i * 0.08, type: 'spring' as const, stiffness: 300, damping: 24 });

export function SettingsPanel() {
  const [displayName, setDisplayName] = useState('Athlete');
  const [bio, setBio] = useState('Working on my handstand game 🤸');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [restTimer, setRestTimer] = useState('90');
  const [notifications, setNotifications] = useState(true);
  const [defaultDifficulty, setDefaultDifficulty] = useState('all');

  const currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';

  const toggleTheme = () => {
    const root = document.documentElement;
    if (currentTheme === 'dark') {
      root.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
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

  const handleDownloadApp = () => {
    alert('Download feature would package the full source code as a ZIP file.');
  };

  return (
    <section className="relative px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="badge-coin inline-flex items-center gap-1.5 rounded-full px-3 py-1">
          <Settings className="h-3 w-3 text-primary" />
          <span className="text-label text-[10px] text-primary">CONFIG</span>
        </div>
        <h2 className="font-chalk text-2xl text-embossed sm:text-3xl">
          <span className="text-primary">SETTINGS</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={cardDelay(0)} className="surface-raised rounded-xl p-6">
          <h3 className="mb-5 flex items-center gap-2 font-chalk text-xl text-embossed">
            <User className="h-5 w-5 text-primary" /> PROFILE
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-label text-sm text-muted-foreground">DISPLAY NAME</label>
              <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="surface-inset border-0 font-chalk focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-label text-sm text-muted-foreground">BIO</label>
              <Input value={bio} onChange={e => setBio(e.target.value)} className="surface-inset border-0 font-chalk focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-label text-sm text-muted-foreground">UNITS</label>
              <div className="flex gap-2">
                {(['metric', 'imperial'] as const).map(u => (
                  <button key={u} onClick={() => setUnits(u)}
                    className={cn("flex-1 rounded-lg px-4 py-2 text-label text-sm transition-all", units === u ? "surface-inset text-primary" : "btn-raised text-muted-foreground")}>
                    {u.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={cardDelay(1)} className="surface-raised rounded-xl p-6">
          <h3 className="mb-5 flex items-center gap-2 font-chalk text-xl text-embossed">
            <Palette className="h-5 w-5 text-primary" /> APPEARANCE
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-label text-sm text-muted-foreground">THEME</label>
              <button onClick={toggleTheme} className="btn-raised flex w-full items-center gap-3 rounded-lg px-4 py-3 text-foreground transition-all">
                {currentTheme === 'dark' ? <Sun className="h-5 w-5 text-primary" /> : <Moon className="h-5 w-5 text-primary" />}
                <span className="font-chalk">{currentTheme === 'dark' ? 'SWITCH TO LIGHT' : 'SWITCH TO DARK'}</span>
              </button>
            </div>
            <div>
              <label className="mb-2 block text-label text-sm text-muted-foreground">ACCENT COLOR</label>
              <div className="grid grid-cols-3 gap-2">
                {accentColors.map(c => (
                  <button key={c.name} className="surface-inset flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:scale-[1.02]">
                    <div className="h-4 w-4 rounded-full" style={{ background: `hsl(${c.hsl})` }} />
                    <span className="text-label text-xs">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Training Preferences */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={cardDelay(2)} className="surface-raised rounded-xl p-6">
          <h3 className="mb-5 flex items-center gap-2 font-chalk text-xl text-embossed">
            <Dumbbell className="h-5 w-5 text-primary" /> TRAINING
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-label text-sm text-muted-foreground">DEFAULT REST TIMER (sec)</label>
              <Input type="number" value={restTimer} onChange={e => setRestTimer(e.target.value)} className="surface-inset border-0 font-chalk focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-label text-sm text-muted-foreground">DEFAULT DIFFICULTY</label>
              <select value={defaultDifficulty} onChange={e => setDefaultDifficulty(e.target.value)}
                className="surface-inset w-full rounded-lg px-4 py-3 font-chalk text-foreground focus:outline-none">
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-label text-sm text-muted-foreground">NOTIFICATIONS</label>
              <button onClick={() => setNotifications(!notifications)}
                className={cn("btn-raised flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all", notifications ? "text-primary" : "text-muted-foreground")}>
                {notifications ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                <span className="font-chalk">{notifications ? 'ENABLED' : 'DISABLED'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={cardDelay(3)} className="surface-raised rounded-xl p-6">
          <h3 className="mb-5 flex items-center gap-2 font-chalk text-xl text-embossed">
            <Database className="h-5 w-5 text-primary" /> DATA
          </h3>
          <div className="space-y-3">
            <Button onClick={handleExport} className="btn-raised w-full justify-start gap-3 bg-transparent py-5 font-chalk text-foreground hover:bg-primary/10">
              <FileDown className="h-5 w-5 text-primary" /> EXPORT TRAINING DATA (JSON)
            </Button>
            <Button onClick={handleClearData} variant="destructive" className="w-full justify-start gap-3 py-5 font-chalk">
              <Trash2 className="h-5 w-5" /> CLEAR ALL LOCAL DATA
            </Button>
          </div>
        </motion.div>

        {/* App Download */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={cardDelay(4)} className="surface-raised rounded-xl p-6 lg:col-span-2">
          <h3 className="mb-5 flex items-center gap-2 font-chalk text-xl text-embossed">
            <Download className="h-5 w-5 text-primary" /> APP DOWNLOAD
          </h3>
          <p className="mb-5 text-sm text-muted-foreground">
            Download the complete TLC Calisthenics source code. Build for web, iOS, and Android using Capacitor.
          </p>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleDownloadApp} className="btn-raised flex-1 gap-2 bg-primary py-5 font-chalk text-lg text-primary-foreground hover:bg-primary/90">
              <Download className="h-5 w-5" /> DOWNLOAD ZIP
            </Button>
            <Button variant="outline" className="flex-1 gap-2 border-2 border-border py-5 font-chalk text-lg hover:border-primary hover:text-primary">
              <Github className="h-5 w-5" /> VIEW ON GITHUB
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: '⚛️', label: 'React + TypeScript' },
              { icon: '🎨', label: 'Tailwind + Animations' },
              { icon: '📱', label: 'Capacitor Mobile' },
              { icon: '🔐', label: 'Auth Ready' },
              { icon: '💳', label: 'Stripe Ready' },
              { icon: '🔔', label: 'Push Notifications' },
            ].map(item => (
              <div key={item.label} className="surface-inset flex items-center gap-2 rounded-lg p-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-label text-[10px]">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="badge-coin flex items-center gap-2 rounded-full px-3 py-1">
              <Smartphone className="h-3 w-3 text-primary" />
              <span className="text-label text-[10px] text-primary">CAPACITOR READY</span>
            </div>
            <span className="text-xs text-muted-foreground">Build for iOS • Android • Web</span>
          </div>
        </motion.div>

        {/* About */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={cardDelay(5)} className="surface-raised rounded-xl p-6 lg:col-span-2">
          <h3 className="mb-3 flex items-center gap-2 font-chalk text-xl text-embossed">
            <Info className="h-5 w-5 text-primary" /> ABOUT
          </h3>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="font-chalk text-foreground">TLC Calisthenics v1.0</span>
            <span>•</span>
            <span>React + Vite + Tailwind</span>
            <span>•</span>
            <span>Built with ❤️ by TLC</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
