import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const weeklyData = [
  { day: 'Mon', sessions: 2, volume: 45 },
  { day: 'Tue', sessions: 1, volume: 30 },
  { day: 'Wed', sessions: 2, volume: 50 },
  { day: 'Thu', sessions: 0, volume: 0 },
  { day: 'Fri', sessions: 1, volume: 35 },
  { day: 'Sat', sessions: 2, volume: 55 },
  { day: 'Sun', sessions: 1, volume: 25 },
];

const muscleData = [
  { name: 'Push', value: 30 },
  { name: 'Pull', value: 25 },
  { name: 'Core', value: 20 },
  { name: 'Legs', value: 15 },
  { name: 'Mobility', value: 10 },
];

const COLORS = [
  'hsl(220, 70%, 55%)',
  'hsl(185, 55%, 45%)',
  'hsl(155, 60%, 50%)',
  'hsl(40, 80%, 55%)',
  'hsl(270, 55%, 60%)',
];

export function AnalyticsCanvas() {
  return (
    <div className="hide-scrollbar h-full overflow-y-auto p-4 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="font-chalk text-xl text-embossed">TRAINING ANALYTICS</h3>
        <p className="text-xs text-muted-foreground">Last 7 days overview</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'SESSIONS', value: '9', icon: BarChart3 },
          { label: 'VOLUME', value: '240m', icon: TrendingUp },
          { label: 'SKILLS', value: '3', icon: Target },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="surface-raised rounded-xl p-3 text-center">
              <Icon className="mx-auto mb-1 h-4 w-4 text-primary" />
              <div className="font-chalk text-xl">{stat.value}</div>
              <div className="text-label text-[9px] text-muted-foreground">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Volume chart */}
      <div className="surface-raised rounded-xl p-4">
        <h4 className="mb-3 font-chalk text-sm text-embossed">WEEKLY VOLUME</h4>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(220, 70%, 55%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(220, 70%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(225, 10%, 24%, 0.5)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 60%)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(220, 10%, 60%)' }} />
            <Tooltip contentStyle={{ background: 'hsl(225, 12%, 14%)', border: '1px solid hsl(225, 10%, 24%)', borderRadius: 8 }} />
            <Area type="monotone" dataKey="volume" stroke="hsl(220, 70%, 55%)" fill="url(#volumeGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Muscle coverage */}
      <div className="surface-raised rounded-xl p-4">
        <h4 className="mb-3 font-chalk text-sm text-embossed">MUSCLE COVERAGE</h4>
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
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />
                <span className="flex-1 text-muted-foreground">{d.name}</span>
                <span className="font-chalk text-xs">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
