import { motion } from 'framer-motion';
import { 
  Flame, 
  Trophy, 
  Target, 
  Calendar,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const activityData = [true, true, true, false, true, true, true]; // Current week

const monthData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  active: Math.random() > 0.3
}));

const achievements = [
  { id: 1, name: 'First Workout', icon: '🎯', unlocked: true },
  { id: 2, name: '7 Day Streak', icon: '🔥', unlocked: true },
  { id: 3, name: 'First Skill', icon: '⭐', unlocked: true },
  { id: 4, name: '30 Day Streak', icon: '🏆', unlocked: false },
  { id: 5, name: 'All Beginner', icon: '🥉', unlocked: false },
  { id: 6, name: 'Flagmaster', icon: '🚩', unlocked: false },
];

const skillProgress = [
  { name: 'Frog Stand', progress: 80, target: '30 sec', current: '24 sec' },
  { name: 'L-Sit', progress: 60, target: '15 sec', current: '9 sec' },
  { name: 'Headstand', progress: 40, target: '30 sec', current: '12 sec' },
];

export function ProgressDashboard() {
  const currentStreak = 7;
  const totalWorkouts = 34;
  const skillsUnlocked = 3;

  return (
    <section className="relative min-h-screen px-4 py-20 lg:px-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="font-chalk text-5xl sm:text-6xl lg:text-7xl">
          YOUR <span className="text-primary">PROGRESS</span>
        </h2>
        <p className="mt-2 max-w-lg text-muted-foreground">
          Track your journey from beginner to calisthenics master
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* Streak Card - Featured */}
        <div className="relative overflow-hidden rounded-xl border-2 border-primary bg-primary/5 p-6 sm:col-span-2 lg:col-span-1">
          <div className="relative">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <span className="font-chalk text-sm text-muted-foreground">CURRENT STREAK</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-chalk text-6xl text-foreground">{currentStreak}</span>
              <span className="font-chalk text-2xl text-muted-foreground">DAYS</span>
            </div>
            <p className="mt-2 text-sm text-primary">Longest streak active</p>
          </div>
        </div>

        {/* Total Workouts */}
        <div className="rounded-xl border-2 border-border bg-card p-6 transition-all hover:border-primary">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="font-chalk text-sm text-muted-foreground">TOTAL WORKOUTS</span>
          </div>
          <span className="font-chalk text-5xl text-foreground">{totalWorkouts}</span>
        </div>

        {/* Skills Unlocked */}
        <div className="rounded-xl border-2 border-border bg-card p-6 transition-all hover:border-primary">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <span className="font-chalk text-sm text-muted-foreground">SKILLS UNLOCKED</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-chalk text-5xl text-foreground">{skillsUnlocked}</span>
            <span className="font-chalk text-2xl text-muted-foreground">/14</span>
          </div>
        </div>

        {/* Global Rank */}
        <div className="rounded-xl border-2 border-border bg-card p-6 transition-all hover:border-primary">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <span className="font-chalk text-sm text-muted-foreground">GLOBAL RANK</span>
          </div>
          <span className="font-chalk text-5xl text-foreground">#142</span>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border-2 border-border bg-card p-6 lg:col-span-2"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-chalk text-xl">
              <Calendar className="h-5 w-5 text-primary" />
              ACTIVITY CALENDAR
            </h3>
            <span className="rounded-full bg-secondary px-3 py-1 font-chalk text-sm text-muted-foreground">
              JANUARY 2026
            </span>
          </div>

          {/* Week Strip */}
          <div className="mb-6">
            <p className="mb-3 text-sm text-muted-foreground">This Week</p>
            <div className="flex gap-2">
              {weekDays.map((day, idx) => (
                <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                  <span className="font-chalk text-xs text-muted-foreground">{day}</span>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 ${
                      activityData[idx]
                        ? 'border-primary bg-primary/20'
                        : 'border-border bg-secondary'
                    }`}
                  >
                    {activityData[idx] && (
                      <div className="h-3 w-3 rounded-full bg-primary" />
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Month Grid */}
          <div>
            <p className="mb-3 text-sm text-muted-foreground">Monthly Overview</p>
            <div className="grid grid-cols-7 gap-2">
              {monthData.map((day, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`aspect-square rounded-md ${
                    day.active 
                      ? 'bg-primary/40' 
                      : 'bg-secondary'
                  }`}
                  title={`Day ${day.day}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border-2 border-border bg-card p-6"
        >
          <h3 className="mb-6 flex items-center gap-2 font-chalk text-xl">
            <Award className="h-5 w-5 text-primary" />
            ACHIEVEMENTS
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((achievement, idx) => (
              <motion.div
                key={achievement.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 ${
                  achievement.unlocked
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary/50 opacity-50'
                }`}
              >
                <Award className="h-6 w-6 text-primary" />
                <span className="text-center font-chalk text-xs">{achievement.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skill Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border-2 border-border bg-card p-6 lg:col-span-3"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-chalk text-xl">
              <TrendingUp className="h-5 w-5 text-primary" />
              SKILL PROGRESSION
            </h3>
          </div>
          <div className="space-y-6">
            {skillProgress.map((skill, idx) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-chalk text-lg">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">{skill.current}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-muted-foreground">{skill.target}</span>
                  </div>
                </div>
                <div className="relative h-4 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6 + idx * 0.1 }}
                    className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
