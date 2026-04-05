import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, Flame, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { exercises } from '@/lib/exercises';
import { tracks } from '@/lib/tracks';

function getWorkoutData() {
  try {
    const templates = JSON.parse(localStorage.getItem('tlc-templates') || '[]');
    const logs = JSON.parse(localStorage.getItem('tlc-workout-logs') || '[]');
    return { templates, logs };
  } catch { return { templates: [], logs: [] }; }
}

function getStreak(): number {
  try {
    const logs = JSON.parse(localStorage.getItem('tlc-workout-logs') || '[]');
    if (!logs.length) return 0;
    let streak = 0;
    const today = new Date();
    for (let d = 0; d < 365; d++) {
      const check = new Date(today);
      check.setDate(check.getDate() - d);
      const dateStr = check.toISOString().split('T')[0];
      if (logs.some((l: any) => l.date?.startsWith(dateStr))) streak++;
      else break;
    }
    return streak;
  } catch { return 0; }
}

const weeklyData = [
  { day: 'Mon', volume: 45 },
  { day: 'Tue', volume: 30 },
  { day: 'Wed', volume: 50 },
  { day: 'Thu', volume: 0 },
  { day: 'Fri', volume: 35 },
  { day: 'Sat', volume: 55 },
  { day: 'Sun', volume: 25 },
];

const categoryData = (() => {
  const cats = ['push', 'pull', 'core', 'legs', 'mobility', 'skills', 'ballet'];
  return cats.map(c => ({
    category: c.charAt(0).toUpperCase() + c.slice(1),
    count: exercises.filter(e => e.category === c).length,
  }));
})();

const muscleData = [
  { name: 'Push', value: 30 },
  { name: 'Pull', value: 25 },
  { name: 'Core', value: 20 },
  { name: 'Legs', value: 15 },
  { name: 'Mobility', value: 10 },
];

const COLORS = [
  'hsl(var(--thunder-orange))',
  'hsl(var(--thunder-blue))',
  'hsl(var(--primary))',
  'hsl(0, 0%, 50%)',
  'hsl(35, 60%, 40%)',
];

// Streak heatmap - last 7 weeks
function StreakHeatmap() {
  const days = [];
  const today = new Date();
  for (let i = 48; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const intensity = Math.random(); // Mock data
    days.push({ date: d, intensity });
  }

  return (
    <div className="grid grid-cols-7 gap-[3px]">
      {days.map((d, i) => (
        <div
          key={i}
          className="h-4 w-4 border border-foreground/5"
          style={{
            background: d.intensity > 0.7
              ? 'hsl(var(--thunder-orange))'
              : d.intensity > 0.4
                ? 'hsl(var(--thunder-orange) / 0.5)'
                : d.intensity > 0.1
                  ? 'hsl(var(--thunder-orange) / 0.2)'
                  : 'hsl(var(--foreground) / 0.05)',
          }}
          title={d.date.toLocaleDateString()}
        />
      ))}
    </div>
  );
}

export function AnalyticsCanvas() {
  const streak = getStreak();
  const { templates } = getWorkoutData();

  return (
    <div className="hide-scrollbar h-full overflow-y-auto p-4 space-y-4 notebook-ruled">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h3 className="text-editorial-sm text-foreground text-embossed">TRAINING <span className="thunder-text">ANALYTICS</span></h3>
        <p className="text-xs text-muted-foreground text-journal-sm">Performance overview</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
        {[
          { label: 'STREAK', value: `${streak || 0}`, icon: Flame, color: 'text-thunder-orange' },
          { label: 'SESSIONS', value: '9', icon: Calendar, color: 'text-thunder-blue' },
          { label: 'VOLUME', value: '240m', icon: TrendingUp, color: 'text-thunder-orange' },
          { label: 'EXERCISES', value: `${exercises.length}`, icon: Target, color: 'text-thunder-blue' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card p-3 text-center skeuo-card skeuo-grain">
              <Icon className={`mx-auto mb-1 h-4 w-4 ${stat.color}`} />
              <div className="font-chalk text-xl text-journal-lg">{stat.value}</div>
              <div className="text-label text-[9px] text-muted-foreground text-journal-sm">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Streak heatmap */}
      <div className="border border-foreground/10 bg-card p-4 skeuo-thunder-card skeuo-grain">
        <h4 className="mb-3 text-label text-sm text-foreground text-embossed text-journal">ACTIVITY HEATMAP</h4>
        <StreakHeatmap />
        <div className="mt-2 flex items-center gap-2 text-[9px] text-muted-foreground">
          <span>Less</span>
          {[0.05, 0.2, 0.5, 1].map((o, i) => (
            <div key={i} className="h-3 w-3 border border-foreground/5" style={{ background: `hsl(var(--thunder-orange) / ${o})` }} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Volume chart */}
      <div className="border border-foreground/10 bg-card p-4 skeuo-card surface-inset">
        <h4 className="mb-3 text-label text-sm text-foreground text-embossed text-journal">WEEKLY VOLUME</h4>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--thunder-orange))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--thunder-orange))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(0, 0%, 50%, 0.1)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(0, 0%, 40%)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(0, 0%, 40%)' }} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 0, fontSize: 11 }} />
            <Area type="monotone" dataKey="volume" stroke="hsl(var(--thunder-orange))" fill="url(#volumeGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Skills radar */}
      <div className="border border-foreground/10 bg-card p-4 skeuo-thunder-card skeuo-grain">
        <h4 className="mb-3 text-label text-sm text-foreground text-embossed text-journal">SKILLS RADAR</h4>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={categoryData}>
            <PolarGrid stroke="hsl(var(--foreground) / 0.1)" />
            <PolarAngleAxis dataKey="category" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
            <Radar name="Exercises" dataKey="count" stroke="hsl(var(--thunder-orange))" fill="hsl(var(--thunder-orange))" fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Muscle coverage */}
      <div className="border border-foreground/10 bg-card p-4 skeuo-card skeuo-grain">
        <h4 className="mb-3 text-label text-sm text-foreground text-embossed text-journal">MUSCLE COVERAGE</h4>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie data={muscleData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={2}>
                {muscleData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-1.5">
            {muscleData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-sm text-journal">
                <div className="h-2.5 w-2.5" style={{ background: COLORS[i] }} />
                <span className="flex-1 text-muted-foreground">{d.name}</span>
                <span className="font-chalk text-xs">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent templates */}
      {templates.length > 0 && (
        <div className="border border-foreground/10 bg-card p-4 skeuo-card">
          <h4 className="mb-3 text-label text-sm text-foreground text-embossed text-journal">RECENT WORKOUTS</h4>
          <div className="space-y-2">
            {templates.slice(-5).reverse().map((t: any) => (
              <div key={t.id} className="flex items-center justify-between border border-foreground/5 bg-surface-0 px-3 py-2 skeuo-card">
                <span className="font-chalk text-sm text-foreground text-journal">{t.name}</span>
                <span className="text-[10px] text-muted-foreground">{t.blocks?.length || 0} exercises</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
