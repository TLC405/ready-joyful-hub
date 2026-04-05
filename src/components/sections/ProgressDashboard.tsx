import { useMemo } from 'react';
import { 
  Target, Calendar, TrendingUp, Flame, Dumbbell, BarChart3
} from 'lucide-react';
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

// Heatmap for last 4 weeks
function WeeklyHeatmap() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date();
  const cells = [];
  for (let w = 3; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      const intensity = Math.random(); // Mock until real data
      cells.push({ date, intensity, dayLabel: days[d] });
    }
  }

  return (
    <div>
      <div className="flex gap-[3px] mb-1">
        {days.map((d, i) => (
          <span key={i} className="w-6 text-center text-[8px] text-muted-foreground">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-[3px]">
        {cells.map((c, i) => (
          <div
            key={i}
            className="h-6 w-6 border border-foreground/5"
            style={{
              background: c.intensity > 0.7
                ? 'hsl(var(--thunder-orange))'
                : c.intensity > 0.4
                  ? 'hsl(var(--thunder-orange) / 0.4)'
                  : c.intensity > 0.1
                    ? 'hsl(var(--thunder-orange) / 0.15)'
                    : 'hsl(var(--foreground) / 0.03)',
            }}
            title={c.date.toLocaleDateString()}
          />
        ))}
      </div>
    </div>
  );
}

export function ProgressDashboard() {
  const streak = getStreak();
  const { templates } = getWorkoutData();

  const trackProgress = useMemo(() => {
    return tracks.slice(0, 6).map(track => {
      const total = track.nodes.length;
      const completed = Math.floor(Math.random() * total * 0.6); // Mock
      return { name: track.name, total, completed, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
    });
  }, []);

  return (
    <section className="relative px-4 py-8 lg:px-8">
      <div className="thunder-divider mb-4" />
      <div className="mb-6 pt-2">
        <h2 className="text-editorial-sm text-foreground text-embossed">YOUR <span className="thunder-text">PROGRESS</span></h2>
      </div>

      <div className="space-y-4">
        {/* Top stats */}
        <div className="grid grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
          {[
            { icon: Flame, label: 'STREAK', value: `${streak}d`, color: 'text-thunder-orange' },
            { icon: Dumbbell, label: 'WORKOUTS', value: `${templates.length}`, color: 'text-thunder-blue' },
            { icon: BarChart3, label: 'EXERCISES', value: `${exercises.length}`, color: 'text-thunder-orange' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-card p-4 text-center skeuo-thunder-card skeuo-grain">
              <Icon className={`mx-auto mb-2 h-5 w-5 ${color}`} />
              <div className="font-chalk text-2xl text-foreground text-journal-lg">{value}</div>
              <span className="text-label text-[10px] text-muted-foreground text-journal-sm">{label}</span>
            </div>
          ))}
        </div>

        {/* Weekly heatmap */}
        <div className="border border-foreground/10 bg-card p-5 skeuo-thunder-card skeuo-grain">
          <h3 className="font-chalk text-sm text-foreground mb-3 text-embossed text-journal">WEEKLY ACTIVITY</h3>
          <WeeklyHeatmap />
        </div>

        {/* Track progress bars */}
        <div className="border border-foreground/10 bg-card p-5 skeuo-card skeuo-grain">
          <h3 className="font-chalk text-sm text-foreground mb-3 text-embossed text-journal">SKILL TRACKS</h3>
          <div className="space-y-3">
            {trackProgress.map(tp => (
              <div key={tp.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-foreground font-chalk text-journal-sm">{tp.name}</span>
                  <span className="text-[10px] text-muted-foreground">{tp.completed}/{tp.total}</span>
                </div>
                <div className="h-2 bg-foreground/5 border border-foreground/5">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${tp.pct}%`,
                      background: 'linear-gradient(90deg, hsl(var(--thunder-blue)), hsl(var(--thunder-orange)))',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent workouts */}
        {templates.length > 0 && (
          <div className="border border-foreground/10 bg-card p-5 skeuo-card">
            <h3 className="font-chalk text-sm text-foreground mb-3 text-embossed text-journal">RECENT WORKOUTS</h3>
            <div className="space-y-2">
              {templates.slice(-3).reverse().map((t: any) => (
                <div key={t.id} className="flex items-center justify-between border border-foreground/5 bg-surface-0 px-3 py-2 skeuo-card notebook-entry">
                  <div>
                    <span className="font-chalk text-sm text-foreground text-journal">{t.name}</span>
                    <span className="ml-2 text-[9px] text-muted-foreground">{t.blocks?.length || 0} exercises</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground">{new Date(t.lastModified || t.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state for new users */}
        {templates.length === 0 && streak === 0 && (
          <div className="border border-foreground/10 bg-card p-8 text-center skeuo-thunder-card skeuo-grain">
            <TrendingUp className="mx-auto mb-4 h-10 w-10 text-thunder-orange/30" />
            <h3 className="font-chalk text-lg text-foreground mb-2 text-embossed text-journal-lg">START LOGGING WORKOUTS</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto text-journal">
              Your real training data will appear here once you begin. Ask the Coach to build you a template to get started.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
