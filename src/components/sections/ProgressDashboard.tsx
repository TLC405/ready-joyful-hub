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
  { id: 4, name: '30 Day Streak', unlocked: false },
  { id: 5, name: 'All Beginner', unlocked: false },
  { id: 6, name: 'Flagmaster', unlocked: false },
];

const skillProgress = [
  { name: 'Frog Stand', progress: 80, target: '30 sec', current: '24 sec' },
  { name: 'L-Sit', progress: 60, target: '15 sec', current: '9 sec' },
  { name: 'Headstand', progress: 40, target: '30 sec', current: '12 sec' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, type: 'spring' as const, stiffness: 300, damping: 24 }
  })
};

export function ProgressDashboard() {
  return (
    <section className="relative px-4 py-8 lg:px-8">
      <motion.h2 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-4 font-chalk text-2xl sm:text-3xl"
      >
        YOUR <span className="text-primary">PROGRESS</span>
      </motion.h2>

      {/* Stats Row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'STREAK', value: '7', sub: 'days', icon: Zap },
          { label: 'WORKOUTS', value: '34', icon: Zap },
          { label: 'SKILLS', value: '3/14', icon: Target },
          { label: 'RANK', value: '#142', icon: Trophy },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={stat.label} 
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="surface-elevated rounded-lg p-4 transition-shadow hover:shadow-steel-glow"
            >
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-surface-2">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-label text-[10px] text-muted-foreground">{stat.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-chalk text-2xl text-foreground">{stat.value}</span>
                {stat.sub && <span className="text-xs text-muted-foreground">{stat.sub}</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Calendar + Achievements */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="surface-elevated rounded-lg p-4 lg:col-span-2"
        >
          <h3 className="mb-3 flex items-center gap-2 font-chalk text-base">
            <Calendar className="h-4 w-4 text-primary" /> ACTIVITY
            <span className="ml-auto rounded bg-surface-1 px-2 py-0.5 text-label text-[10px] text-muted-foreground">JAN 2026</span>
          </h3>
          <div className="mb-4 flex gap-1.5">
            {weekDays.map((day, idx) => (
              <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-label text-[10px] text-muted-foreground">{day}</span>
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, type: 'spring', stiffness: 500, damping: 20 }}
                  className={`flex h-8 w-8 items-center justify-center rounded border ${
                    activityData[idx] ? 'border-primary bg-primary/20' : 'border-border bg-surface-1'
                  }`}
                >
                  {activityData[idx] && <div className="h-2 w-2 rounded-full bg-primary" />}
                </motion.div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {monthData.map((day, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.01 }}
                className={`aspect-square rounded-sm transition-colors ${day.active ? 'bg-primary/40 hover:bg-primary/60' : 'bg-surface-1 hover:bg-surface-2'}`} 
              />
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.1 }}
          className="surface-elevated rounded-lg p-4"
        >
          <h3 className="mb-3 flex items-center gap-2 font-chalk text-base">
            <Award className="h-4 w-4 text-primary" /> ACHIEVEMENTS
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {achievements.map((a, i) => (
              <motion.div 
                key={a.id} 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 400 }}
                whileHover={a.unlocked ? { scale: 1.08, transition: { duration: 0.15 } } : {}}
                className={`flex flex-col items-center gap-1 rounded border p-2 text-center transition-shadow ${
                  a.unlocked ? 'surface-elevated border-primary hover:shadow-steel-glow' : 'border-border bg-surface-0 opacity-50'
                }`}
              >
                <Award className="h-4 w-4 text-primary" />
                <span className="text-label text-[9px]">{a.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Skill Progress */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="surface-elevated rounded-lg p-4"
      >
        <h3 className="mb-3 flex items-center gap-2 font-chalk text-base">
          <TrendingUp className="h-4 w-4 text-primary" /> SKILL PROGRESSION
        </h3>
        <div className="space-y-3">
          {skillProgress.map((skill) => (
            <div key={skill.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-chalk">{skill.name}</span>
                <span className="text-xs"><span className="text-primary">{skill.current}</span> <span className="text-muted-foreground">/ {skill.target}</span></span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-1">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
