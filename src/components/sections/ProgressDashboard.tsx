import { useMemo } from 'react';
import { TrendingUp, Flame, Dumbbell, BarChart3 } from 'lucide-react';
import { exercises } from '@/lib/exercises';
import { useWorkoutLogs } from '@/hooks/use-workout-logs';
import { toDateKey } from '@/lib/workout-logs';
import { WorkoutCalendar } from '@/components/workout/WorkoutCalendar';

function RealHeatmap() {
  const { byDate } = useWorkoutLogs();
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date();
  const cells: { date: Date; count: number }[] = [];
  for (let w = 3; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      const count = (byDate.get(toDateKey(date)) || []).length;
      cells.push({ date, count });
    }
  }
  return (
    <div>
      <div className="flex gap-[3px] mb-1">
        {days.map((d, i) => (
          <span key={i} className="w-6 text-center text-[8px] text-muted-foreground" aria-hidden="true">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-[3px]" role="grid" aria-label="Last 4 weeks of training activity">
        {cells.map((c, i) => (
          <div
            key={i}
            className="h-6 w-6 border border-foreground/5 rounded-sm"
            style={{
              background: c.count >= 3
                ? 'hsl(var(--thunder-orange))'
                : c.count === 2
                  ? 'hsl(var(--thunder-orange) / 0.55)'
                  : c.count === 1
                    ? 'hsl(var(--thunder-orange) / 0.22)'
                    : 'hsl(var(--foreground) / 0.04)',
            }}
            title={`${c.date.toLocaleDateString()} — ${c.count} ${c.count === 1 ? 'entry' : 'entries'}`}
            role="gridcell"
            aria-label={`${c.date.toLocaleDateString()}: ${c.count} entries`}
          />
        ))}
      </div>
    </div>
  );
}

export function ProgressDashboard() {
  const { logs, streak } = useWorkoutLogs();

  const totalEntries = logs.length;
  const recent = useMemo(() => logs.slice(0, 8), [logs]);

  return (
    <section className="relative px-4 py-8 lg:px-8 max-w-6xl mx-auto">
      <div className="thunder-divider mb-4" />
      <div className="mb-6 pt-2">
        <h2 className="text-editorial-sm text-foreground text-embossed">YOUR <span className="thunder-text">PROGRESS</span></h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
          {[
            { icon: Flame, label: 'STREAK', value: `${streak}d`, color: 'text-thunder-orange' },
            { icon: Dumbbell, label: 'LOGGED', value: `${totalEntries}`, color: 'text-thunder-blue' },
            { icon: BarChart3, label: 'EXERCISES', value: `${exercises.length}`, color: 'text-thunder-orange' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-card p-4 text-center skeuo-thunder-card skeuo-grain">
              <Icon className={`mx-auto mb-2 h-5 w-5 ${color}`} aria-hidden="true" />
              <div className="font-chalk text-2xl text-foreground text-journal-lg">{value}</div>
              <span className="text-label text-[10px] text-muted-foreground text-journal-sm">{label}</span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="border border-foreground/10 bg-card p-5 skeuo-thunder-card skeuo-grain">
            <h3 className="font-chalk text-sm text-foreground mb-3 text-embossed text-journal">LAST 4 WEEKS</h3>
            <RealHeatmap />
          </div>

          <WorkoutCalendar />
        </div>

        {recent.length > 0 && (
          <div className="border border-foreground/10 bg-card p-5 skeuo-card">
            <h3 className="font-chalk text-sm text-foreground mb-3 text-embossed text-journal">RECENT ENTRIES</h3>
            <ul className="space-y-1.5">
              {recent.map(l => (
                <li key={l.id} className="flex items-center justify-between border border-foreground/5 bg-surface-0 px-3 py-2 notebook-entry text-sm">
                  <div className="min-w-0">
                    <span className="font-chalk text-foreground text-journal">{l.exercise_name}</span>
                    <span className="ml-2 text-[10px] text-muted-foreground">
                      {[
                        l.sets && l.reps ? `${l.sets}×${l.reps}` : l.sets ? `${l.sets}s` : l.reps ? `${l.reps}r` : null,
                        l.duration_seconds ? `${l.duration_seconds}s` : null,
                      ].filter(Boolean).join(' · ')}
                    </span>
                  </div>
                  <time className="text-[10px] text-muted-foreground" dateTime={l.logged_at}>
                    {new Date(l.logged_at).toLocaleDateString()}
                  </time>
                </li>
              ))}
            </ul>
          </div>
        )}

        {recent.length === 0 && (
          <div className="border border-foreground/10 bg-card p-8 text-center skeuo-thunder-card skeuo-grain">
            <TrendingUp className="mx-auto mb-4 h-10 w-10 text-thunder-orange/30" aria-hidden="true" />
            <h3 className="font-chalk text-lg text-foreground mb-2 text-embossed text-journal-lg">START LOGGING</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto text-journal">
              Tap any day on the calendar above to add your first entry. Your real training history will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
