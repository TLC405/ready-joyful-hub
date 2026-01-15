import { motion } from 'framer-motion';
import { Trophy, Medal, Flame, TrendingUp, TrendingDown, Minus, Crown, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  streak: number;
  workouts: number;
  skills: number;
  trend: 'up' | 'down' | 'same';
  isPremium: boolean;
  isCurrentUser?: boolean;
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: 'SteelCore_Mike', avatar: 'M', streak: 156, workouts: 412, skills: 14, trend: 'same', isPremium: true },
  { rank: 2, name: 'FlexQueen_Ana', avatar: 'A', streak: 134, workouts: 389, skills: 13, trend: 'up', isPremium: true },
  { rank: 3, name: 'IronWill_Jake', avatar: 'J', streak: 98, workouts: 301, skills: 12, trend: 'down', isPremium: true },
  { rank: 4, name: 'BeastMode_Sam', avatar: 'S', streak: 87, workouts: 278, skills: 11, trend: 'up', isPremium: true },
  { rank: 5, name: 'CorePower_Lisa', avatar: 'L', streak: 76, workouts: 245, skills: 10, trend: 'same', isPremium: false },
  { rank: 6, name: 'GymRat_Chris', avatar: 'C', streak: 65, workouts: 212, skills: 9, trend: 'up', isPremium: true },
  { rank: 7, name: 'StrengthGuru_Dan', avatar: 'D', streak: 54, workouts: 189, skills: 8, trend: 'down', isPremium: false },
  { rank: 8, name: 'FitLife_Emma', avatar: 'E', streak: 43, workouts: 156, skills: 7, trend: 'up', isPremium: false },
  { rank: 142, name: 'You', avatar: 'Y', streak: 7, workouts: 34, skills: 3, trend: 'up', isPremium: false, isCurrentUser: true },
];

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'same' }) => {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-600"><Crown className="h-5 w-5 text-white" /></div>;
  if (rank === 2) return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-500"><Medal className="h-5 w-5 text-white" /></div>;
  if (rank === 3) return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-800"><Medal className="h-5 w-5 text-white" /></div>;
  return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary"><span className="font-chalk text-lg">{rank}</span></div>;
};

export function Leaderboard() {
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
          <span className="text-gradient">GLOBAL</span> LEADERBOARD
        </h2>
        <p className="mt-2 max-w-lg text-muted-foreground">
          Compete with athletes worldwide and climb the ranks
        </p>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mb-8 flex flex-wrap items-center gap-4 rounded-xl border-2 border-border bg-card p-4"
      >
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span className="font-chalk text-sm text-muted-foreground">12,847 ATHLETES</span>
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <span className="font-chalk text-sm text-muted-foreground">YOUR RANK: #142</span>
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <span className="font-chalk text-sm text-green-500">+15 THIS WEEK</span>
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {leaderboardData.slice(0, 3).map((entry, idx) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            className={cn(
              "relative overflow-hidden rounded-xl border-2 p-6 text-center",
              entry.rank === 1 
                ? "border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-amber-600/10 sm:order-2 sm:-mt-4" 
                : entry.rank === 2 
                  ? "border-gray-400/50 bg-gradient-to-br from-gray-400/10 to-gray-500/10 sm:order-1" 
                  : "border-amber-700/50 bg-gradient-to-br from-amber-700/10 to-amber-800/10 sm:order-3"
            )}
          >
            {/* Crown for #1 */}
            {entry.rank === 1 && (
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute left-1/2 top-2 -translate-x-1/2"
              >
                <Crown className="h-8 w-8 text-yellow-500" />
              </motion.div>
            )}

            <div className="mb-4 mt-6">
              <div className={cn(
                "mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold",
                entry.rank === 1 
                  ? "bg-gradient-to-br from-yellow-400 to-amber-600" 
                  : entry.rank === 2 
                    ? "bg-gradient-to-br from-gray-300 to-gray-500" 
                    : "bg-gradient-to-br from-amber-600 to-amber-800"
              )}>
                <span className="font-chalk text-white">{entry.avatar}</span>
              </div>
            </div>

            <h3 className="mb-1 font-chalk text-xl">{entry.name}</h3>
            {entry.isPremium && (
              <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                <Crown className="h-3 w-3" /> PRO
              </span>
            )}

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-secondary/50 p-2">
                <Flame className="mx-auto mb-1 h-4 w-4 text-orange-500" />
                <span className="block font-chalk text-lg">{entry.streak}</span>
                <span className="text-xs text-muted-foreground">STREAK</span>
              </div>
              <div className="rounded-lg bg-secondary/50 p-2">
                <span className="block font-chalk text-lg">{entry.workouts}</span>
                <span className="text-xs text-muted-foreground">WORKOUTS</span>
              </div>
              <div className="rounded-lg bg-secondary/50 p-2">
                <span className="block font-chalk text-lg">{entry.skills}</span>
                <span className="text-xs text-muted-foreground">SKILLS</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Full Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border-2 border-border bg-card"
      >
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 border-b border-border bg-secondary/30 px-6 py-4">
          <div className="col-span-1 font-chalk text-sm text-muted-foreground">RANK</div>
          <div className="col-span-5 font-chalk text-sm text-muted-foreground">ATHLETE</div>
          <div className="col-span-2 font-chalk text-sm text-muted-foreground">STREAK</div>
          <div className="col-span-2 font-chalk text-sm text-muted-foreground">WORKOUTS</div>
          <div className="col-span-1 font-chalk text-sm text-muted-foreground">SKILLS</div>
          <div className="col-span-1 font-chalk text-sm text-muted-foreground">TREND</div>
        </div>

        {/* Table Body */}
        {leaderboardData.slice(3).map((entry, idx) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 + idx * 0.05 }}
            className={cn(
              "grid grid-cols-12 items-center gap-4 border-b border-border px-6 py-4 transition-colors hover:bg-secondary/20",
              entry.isCurrentUser && "border-l-4 border-l-primary bg-primary/5"
            )}
          >
            <div className="col-span-1">
              <RankBadge rank={entry.rank} />
            </div>
            <div className="col-span-5 flex items-center gap-3">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full font-chalk text-lg",
                entry.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-secondary"
              )}>
                {entry.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-chalk text-lg">{entry.name}</span>
                  {entry.isPremium && <Crown className="h-4 w-4 text-primary" />}
                </div>
                {entry.isCurrentUser && (
                  <span className="text-xs text-primary">That's you!</span>
                )}
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-chalk">{entry.streak}</span>
            </div>
            <div className="col-span-2 font-chalk">{entry.workouts}</div>
            <div className="col-span-1 font-chalk">{entry.skills}/14</div>
            <div className="col-span-1">
              <TrendIcon trend={entry.trend} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
