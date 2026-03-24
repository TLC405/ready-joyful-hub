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
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-success" />;
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-primary" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <div className="flex h-10 w-10 items-center justify-center border-2 border-primary bg-primary text-primary-foreground"><Crown className="h-5 w-5" /></div>;
  if (rank === 2) return <div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-foreground text-card"><Medal className="h-5 w-5" /></div>;
  if (rank === 3) return <div className="flex h-10 w-10 items-center justify-center border-2 border-foreground/50 bg-surface-0"><Medal className="h-5 w-5 text-foreground" /></div>;
  return <div className="flex h-10 w-10 items-center justify-center border border-foreground/10 bg-card"><span className="font-chalk text-lg">{rank}</span></div>;
};

export function Leaderboard() {
  return (
    <section className="relative px-4 py-8 lg:px-8">
      {/* Section Header */}
      <div className="editorial-divider-thick mb-6 pt-2">
        <h2 className="text-editorial-sm text-foreground">
          <span className="text-primary">GLOBAL</span> LEADERBOARD
        </h2>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          Compete with athletes worldwide and climb the ranks
        </p>
      </div>

      {/* Stats Bar */}
      <div className="mb-6 flex flex-wrap items-center border-y border-foreground/10">
        <div className="flex items-center gap-2 px-4 py-3">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-label text-xs text-muted-foreground">12,847 ATHLETES</span>
        </div>
        <div className="h-6 w-px bg-foreground/10" />
        <div className="flex items-center gap-2 px-4 py-3">
          <Trophy className="h-4 w-4 text-primary" />
          <span className="text-label text-xs text-muted-foreground">YOUR RANK: #142</span>
        </div>
        <div className="h-6 w-px bg-foreground/10" />
        <div className="flex items-center gap-2 px-4 py-3">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="text-label text-xs text-success">+15 THIS WEEK</span>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="mb-6 grid grid-cols-1 gap-px bg-foreground/10 border border-foreground/10 sm:grid-cols-3">
        {leaderboardData.slice(0, 3).map((entry, idx) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + idx * 0.1 }}
            className={cn(
              "bg-card p-6 text-center",
              entry.rank === 1 && "sm:order-2",
              entry.rank === 2 && "sm:order-1",
              entry.rank === 3 && "sm:order-3"
            )}
          >
            {/* Crown for #1 */}
            {entry.rank === 1 && (
              <div className="mb-2 flex justify-center">
                <Crown className="h-6 w-6 text-primary" />
              </div>
            )}

            <div className="mb-4">
              <div className={cn(
                "mx-auto flex h-16 w-16 items-center justify-center border-2 text-2xl font-bold",
                entry.rank === 1 
                  ? "border-primary bg-primary text-primary-foreground" 
                  : entry.rank === 2 
                    ? "border-foreground bg-foreground text-card" 
                    : "border-foreground/40 bg-surface-0 text-foreground"
              )}>
                <span className="font-chalk">{entry.avatar}</span>
              </div>
            </div>

            <h3 className="mb-1 font-chalk text-lg">{entry.name}</h3>
            {entry.isPremium && (
              <span className="mb-2 inline-flex items-center gap-1 border border-primary/30 px-2 py-0.5 text-label text-[10px] text-primary">
                <Crown className="h-3 w-3" /> PRO
              </span>
            )}

            <div className="mt-4 grid grid-cols-3 gap-px bg-foreground/5">
              <div className="bg-card p-2">
                <Flame className="mx-auto mb-1 h-4 w-4 text-primary" />
                <span className="block font-chalk text-lg">{entry.streak}</span>
                <span className="text-label text-[9px] text-muted-foreground">STREAK</span>
              </div>
              <div className="bg-card p-2">
                <span className="block font-chalk text-lg">{entry.workouts}</span>
                <span className="text-label text-[9px] text-muted-foreground">WORKOUTS</span>
              </div>
              <div className="bg-card p-2">
                <span className="block font-chalk text-lg">{entry.skills}</span>
                <span className="text-label text-[9px] text-muted-foreground">SKILLS</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <div className="border border-foreground/10 bg-card">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 border-b-2 border-foreground px-6 py-3 bg-card">
          <div className="col-span-1 text-label text-xs text-muted-foreground">RANK</div>
          <div className="col-span-5 text-label text-xs text-muted-foreground">ATHLETE</div>
          <div className="col-span-2 text-label text-xs text-muted-foreground">STREAK</div>
          <div className="col-span-2 text-label text-xs text-muted-foreground">WORKOUTS</div>
          <div className="col-span-1 text-label text-xs text-muted-foreground">SKILLS</div>
          <div className="col-span-1 text-label text-xs text-muted-foreground">TREND</div>
        </div>

        {/* Table Body */}
        {leaderboardData.slice(3).map((entry, idx) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + idx * 0.05 }}
            className={cn(
              "grid grid-cols-12 items-center gap-4 border-b border-foreground/5 px-6 py-3 transition-colors hover:bg-surface-0",
              entry.isCurrentUser && "border-l-2 border-l-primary bg-primary/5"
            )}
          >
            <div className="col-span-1">
              <RankBadge rank={entry.rank} />
            </div>
            <div className="col-span-5 flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center border font-chalk text-lg",
                entry.isCurrentUser ? "border-primary bg-primary text-primary-foreground" : "border-foreground/10 bg-surface-0"
              )}>
                {entry.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-chalk">{entry.name}</span>
                  {entry.isPremium && <Crown className="h-3 w-3 text-primary" />}
                </div>
                {entry.isCurrentUser && (
                  <span className="text-label text-[10px] text-primary">THAT'S YOU</span>
                )}
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" />
              <span className="font-chalk">{entry.streak}</span>
            </div>
            <div className="col-span-2 font-chalk">{entry.workouts}</div>
            <div className="col-span-1 font-chalk">{entry.skills}/14</div>
            <div className="col-span-1">
              <TrendIcon trend={entry.trend} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
