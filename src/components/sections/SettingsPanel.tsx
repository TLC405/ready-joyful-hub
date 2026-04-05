import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, User, Palette, Dumbbell, Database, Download,
  Sun, Moon, Timer, Bell, BellOff, Trash2, FileDown,
  Code, Info, Search, Edit3, Save, X, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { exercises } from '@/lib/exercises';
import { tracks } from '@/lib/tracks';
import { AppBreadcrumb } from '@/components/shared/Breadcrumb';

type Tab = 'profile' | 'appearance' | 'training' | 'data' | 'devtools';

const tabConfig: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'PROFILE', icon: User },
  { id: 'appearance', label: 'THEME', icon: Palette },
  { id: 'training', label: 'TRAINING', icon: Dumbbell },
  { id: 'data', label: 'DATA', icon: Database },
  { id: 'devtools', label: 'DEV TOOLS', icon: Code },
];

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [displayName, setDisplayName] = useState('Athlete');
  const [bio, setBio] = useState('Working on my handstand game 🤸');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [restTimer, setRestTimer] = useState('90');
  const [notifications, setNotifications] = useState(true);
  const [defaultDifficulty, setDefaultDifficulty] = useState('all');
  const [devSearch, setDevSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleExportCSV = () => {
    const headers = ['id', 'name', 'category', 'difficulty', 'tracks', 'hasVideo'];
    const rows = exercises.map(e => [
      e.id, e.name, e.category, e.difficulty,
      e.tracks.join(';'),
      (e.videoUrl || e.videoSources?.length) ? 'yes' : 'no'
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tlc-exercises.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Clear all local data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const filteredExercises = useMemo(() => {
    if (!devSearch) return exercises;
    return exercises.filter(e => e.name.toLowerCase().includes(devSearch.toLowerCase()));
  }, [devSearch]);

  const stats = useMemo(() => ({
    total: exercises.length,
    withVideo: exercises.filter(e => e.videoUrl || e.videoSources?.length).length,
    trackCount: tracks.length,
    categories: new Set(exercises.map(e => e.category)).size,
  }), []);

  const breadcrumbItems = [
    { label: 'HOME' },
    { label: 'SETTINGS' },
    { label: tabConfig.find(t => t.id === activeTab)!.label },
  ];

  return (
    <section className="relative px-4 py-6 lg:px-8">
      <AppBreadcrumb items={breadcrumbItems} />

      <div className="thunder-divider mb-4" />
      <div className="mb-4 pt-2">
        <div className="flex items-center gap-3">
          <h2 className="text-editorial-sm text-foreground text-embossed">SETT<span className="thunder-text">INGS</span></h2>
        </div>
      </div>

      {/* Tab bar — leather strip with thunder accents */}
      <div className="mb-4 flex overflow-x-auto gap-0 skeuo-leather hide-scrollbar">
        {tabConfig.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 px-4 py-2.5 text-label text-[10px] tracking-widest transition-colors border-r last:border-r-0 border-primary-foreground/10",
                activeTab === tab.id
                  ? "skeuo-pressed thunder-gradient-subtle text-thunder-orange"
                  : "text-primary-foreground/60 hover:text-thunder-blue"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="border border-foreground/10 bg-card p-6 skeuo-thunder-card skeuo-grain notebook-ruled">
        {activeTab === 'profile' && (
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="mb-1 block text-label text-xs text-muted-foreground text-journal-sm">DISPLAY NAME</label>
              <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full surface-inset px-3 py-2 font-chalk text-sm text-foreground focus:border-primary focus:outline-none text-journal" />
            </div>
            <div>
              <label className="mb-1 block text-label text-xs text-muted-foreground text-journal-sm">BIO</label>
              <input value={bio} onChange={e => setBio(e.target.value)} className="w-full surface-inset px-3 py-2 font-chalk text-sm text-foreground focus:border-primary focus:outline-none text-journal" />
            </div>
            <div>
              <label className="mb-1 block text-label text-xs text-muted-foreground text-journal-sm">UNITS</label>
              <div className="flex">
                {(['metric', 'imperial'] as const).map(u => (
                  <button key={u} onClick={() => setUnits(u)}
                    className={cn("flex-1 border border-foreground/10 px-4 py-2 text-label text-sm transition-colors text-journal", units === u ? "skeuo-pressed bg-foreground text-card" : "bg-card text-muted-foreground hover:bg-surface-0 btn-raised")}>
                    {u.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="max-w-lg">
            <label className="mb-2 block text-label text-xs text-muted-foreground text-journal-sm">THEME</label>
            <button onClick={toggleTheme} className="flex w-full items-center gap-3 border border-foreground/10 px-4 py-3 text-foreground transition-colors btn-raised text-journal">
              {currentTheme === 'dark' ? <Sun className="h-5 w-5 text-primary" /> : <Moon className="h-5 w-5 text-primary" />}
              <span className="font-chalk text-sm">{currentTheme === 'dark' ? 'SWITCH TO LIGHT' : 'SWITCH TO DARK'}</span>
            </button>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="mb-1 block text-label text-xs text-muted-foreground text-journal-sm">DEFAULT REST TIMER (sec)</label>
              <input type="number" value={restTimer} onChange={e => setRestTimer(e.target.value)} className="w-full surface-inset px-3 py-2 font-chalk text-sm text-foreground focus:border-primary focus:outline-none text-journal" />
            </div>
            <div>
              <label className="mb-1 block text-label text-xs text-muted-foreground text-journal-sm">DEFAULT DIFFICULTY</label>
              <select value={defaultDifficulty} onChange={e => setDefaultDifficulty(e.target.value)}
                className="w-full surface-inset px-3 py-2 font-chalk text-sm text-foreground focus:outline-none text-journal">
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-label text-xs text-muted-foreground text-journal-sm">NOTIFICATIONS</label>
              <button onClick={() => setNotifications(!notifications)}
                className={cn("flex w-full items-center gap-3 border border-foreground/10 px-4 py-3 transition-colors btn-raised text-journal", notifications ? "text-primary" : "text-muted-foreground")}>
                {notifications ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                <span className="font-chalk text-sm">{notifications ? 'ENABLED' : 'DISABLED'}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-3 max-w-lg">
            <button onClick={handleExport} className="flex w-full items-center gap-3 border border-foreground/10 px-4 py-3 font-chalk text-sm text-foreground transition-colors btn-raised text-journal">
              <FileDown className="h-4 w-4 text-primary" /> EXPORT TRAINING DATA (JSON)
            </button>
            <button onClick={handleExportCSV} className="flex w-full items-center gap-3 border border-foreground/10 px-4 py-3 font-chalk text-sm text-foreground transition-colors btn-raised text-journal">
              <FileDown className="h-4 w-4 text-primary" /> EXPORT EXERCISE LIST (CSV)
            </button>
            <button onClick={handleClearData} className="flex w-full items-center gap-3 border border-primary/30 bg-primary/5 px-4 py-3 font-chalk text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground text-journal">
              <Trash2 className="h-4 w-4" /> CLEAR ALL LOCAL DATA
            </button>
          </div>
        )}

        {activeTab === 'devtools' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
              {[
                { label: 'EXERCISES', value: stats.total },
                { label: 'WITH VIDEO', value: stats.withVideo },
                { label: 'TRACKS', value: stats.trackCount },
                { label: 'CATEGORIES', value: stats.categories },
              ].map(s => (
                <div key={s.label} className="bg-card p-4 text-center skeuo-card">
                  <p className="font-chalk text-2xl text-foreground text-journal-lg">{s.value}</p>
                  <p className="text-label text-[9px] text-muted-foreground text-journal-sm">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Download */}
            <div>
              <button className="w-full px-6 py-3 font-chalk text-sm transition-opacity hover:opacity-90 btn-thunder text-journal">
                <Download className="mr-2 inline h-4 w-4" /> DOWNLOAD SOURCE ZIP
              </button>
            </div>

            {/* Exercise list */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <h3 className="font-chalk text-sm text-foreground text-embossed text-journal">EXERCISE DATABASE</h3>
                <span className="text-label text-[10px] text-muted-foreground text-journal-sm">{filteredExercises.length} results</span>
              </div>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={devSearch}
                  onChange={e => setDevSearch(e.target.value)}
                  placeholder="Filter exercises..."
                  className="w-full surface-inset py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none text-journal"
                />
              </div>
              <div className="border border-foreground/10 max-h-[400px] overflow-y-auto skeuo-card">
                <table className="w-full text-xs">
                  <thead className="sticky top-0">
                    <tr className="border-b-2 border-foreground skeuo-leather text-left">
                      <th className="px-3 py-2 text-label text-[9px] text-primary-foreground/90">NAME</th>
                      <th className="px-3 py-2 text-label text-[9px] text-primary-foreground/90 hidden sm:table-cell">CAT</th>
                      <th className="px-3 py-2 text-label text-[9px] text-primary-foreground/90 hidden sm:table-cell">DIFF</th>
                      <th className="px-3 py-2 text-label text-[9px] text-primary-foreground/90 hidden md:table-cell">VIDEO</th>
                      <th className="px-3 py-2 text-label text-[9px] w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExercises.slice(0, 50).map(ex => (
                      <tr key={ex.id} className="border-b border-foreground/5 bg-card hover:bg-surface-0 transition-colors notebook-entry">
                        <td className="px-3 py-2 font-chalk truncate max-w-[200px] text-journal">{ex.name}</td>
                        <td className="px-3 py-2 text-muted-foreground hidden sm:table-cell text-journal-sm">{ex.category}</td>
                        <td className="px-3 py-2 hidden sm:table-cell">
                          <span className={cn("border px-1.5 py-0 text-[8px] text-label skeuo-metal",
                            ex.difficulty === 'easy' && 'difficulty-easy',
                            ex.difficulty === 'beginner' && 'difficulty-beginner',
                            ex.difficulty === 'intermediate' && 'difficulty-intermediate',
                            ex.difficulty === 'advanced' && 'difficulty-advanced',
                            ex.difficulty === 'master' && 'difficulty-master',
                          )}>{ex.difficulty.toUpperCase()}</span>
                        </td>
                        <td className="px-3 py-2 hidden md:table-cell">
                          {(ex.videoUrl || ex.videoSources?.length) ? (
                            <span className="text-primary text-[9px]">✓</span>
                          ) : (
                            <span className="text-muted-foreground/30 text-[9px]">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <button className="text-muted-foreground hover:text-foreground">
                            <Edit3 className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* About */}
            <div className="skeuo-stitch pt-4">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground text-journal">
                <span className="font-chalk text-foreground text-embossed">TLC Calisthenics v1.0</span>
                <span>·</span>
                <span>React + Vite + Tailwind</span>
                <span>·</span>
                <span>Built with conviction by TLC</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
