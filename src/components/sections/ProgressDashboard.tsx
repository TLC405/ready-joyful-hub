import { motion } from 'framer-motion';
import { 
  Trophy, Target, Calendar, TrendingUp, Award, Zap
} from 'lucide-react';

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const activityData = [true, true, true, false, true, true, true];
const monthData = Array.from({ length: 30 }, (_, i) => ({ day: i + 1, active: Math.random() > 0.3 }));

const achievements = [
  { id: 1, name: 'First Workout', unlocked: true },
  { id: 2, name: '7 Day Streak', unlocked: true },
  { id: 3, name: 'First Skill', unlocked: true },
  { id: 4, name: '30 Day Streak', unlocked: true },
  { id: 5, name: 'All Beginner', unlocked: true },
  { id: 6, name: 'Flagmaster', unlocked: true },
];

const skillProgress = [
  { name: 'Frog Stand', progress: 80, target: '30 sec', current: '24 sec' },
  { name: 'L-Sit', progress: 60, target: '15 sec', current: '9 sec' },
  { name: 'Headstand', progress: 40, target: '30 sec', current: '12 sec' },
];

export function ProgressDashboard() {
  return (
    <section className="relative px-4 py-8 lg:px-8">
      <div className="editorial-divider-thick mb-6 pt-2">
        <h2 className="text-editorial-sm text-foreground">YOUR PROGRESS</h2>
      </div>

      {/* Stats Row */}
      <div className="mb-6 flex border-y border-foreground/10">
        {[
          { label: 'STREAK', value: '7', sub: 'days' },
          { label: 'WORKOUTS', value: '34' },
          { label: 'SKILLS', value: '14/14' },
          { label: 'RANK', value: '#142' },
        ].map((stat, i) => (
          <div key={stat.label} className={`flex-1 py-4 text-center ${i > 0 ? 'border-l border-foreground/10' : ''}`}>
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-chalk text-2xl text-foreground">{stat.value}</span>
              {stat.sub && <span className="text-xs text-muted-foreground">{stat.sub}</span>}
            </div>
            <span className="text-label text-[10px] text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar + Achievements */}
      <div className="mb-6 grid grid-cols-1 gap-px bg-foreground/10 border border-foreground/10 lg:grid-cols-3">
        <div className="bg-card p-4 lg:col-span-2">
          <h3 className="mb-3 flex items-center gap-2 font-chalk text-sm">
            <Calendar className="h-4 w-4 text-primary" /> ACTIVITY
            <span className="ml-auto text-label text-[10px] text-muted-foreground">JAN 2026</span>
          </h3>
          <div className="mb-4 flex gap-1.5">
            {weekDays.map((day, idx) => (
              <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-label text-[10px] text-muted-foreground">{day}</span>
                <div className={`flex h-8 w-8 items-center justify-center border ${
                  activityData[idx] ? 'border-primary bg-primary/10' : 'border-foreground/5'
                }`}>
                  {activityData[idx] && <div className="h-2 w-2 bg-primary" />}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px">
            {monthData.map((day, idx) => (
              <div 
                key={idx} 
                className={`aspect-square transition-colors ${day.active ? 'bg-primary/30 hover:bg-primary/50' : 'bg-surface-0 hover:bg-surface-2'}`} 
              />
            ))}
          </div>
        </div>

        <div className="bg-card p-4">
          <h3 className="mb-3 flex items-center gap-2 font-chalk text-sm">
            <Award className="h-4 w-4 text-primary" /> ACHIEVEMENTS
          </h3>
          <div className="grid grid-cols-2 gap-px bg-foreground/5">
            {achievements.map((a) => (
              <div 
                key={a.id} 
                className={`flex flex-col items-center gap-1 bg-card p-3 text-center ${
                  !a.unlocked ? 'opacity-30' : ''
                }`}
              >
                <Award className="h-4 w-4 text-primary" />
                <span className="text-label text-[9px]">{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Progress */}
      <div className="border border-foreground/10 bg-card p-4">
        <h3 className="mb-3 flex items-center gap-2 font-chalk text-sm">
          <TrendingUp className="h-4 w-4 text-primary" /> SKILL PROGRESSION
        </h3>
        <div className="space-y-3">
          {skillProgress.map((skill) => (
            <div key={skill.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-chalk">{skill.name}</span>
                <span className="text-xs"><span className="text-primary">{skill.current}</span> <span className="text-muted-foreground">/ {skill.target}</span></span>
              </div>
              <div className="h-2 border border-foreground/10 bg-surface-0">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
