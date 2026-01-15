import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  CheckCircle, 
  ChevronRight, 
  Crown,
  Target,
  Lightbulb,
  Play,
  X
} from 'lucide-react';
import { skills, Skill } from '@/lib/skills-data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

const difficultyColors = {
  beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function SkillsLibrary() {
  const [filter, setFilter] = useState<DifficultyFilter>('all');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [userTier] = useState<'free' | 'basic' | 'pro'>('free');

  const filteredSkills = filter === 'all' 
    ? skills 
    : skills.filter(s => s.difficulty === filter);

  const isLocked = (skill: Skill) => {
    if (userTier === 'pro') return false;
    if (userTier === 'basic') return skill.tier === 'pro';
    return skill.tier !== 'free';
  };

  const filters: { id: DifficultyFilter; label: string }[] = [
    { id: 'all', label: 'ALL SKILLS' },
    { id: 'beginner', label: 'BEGINNER' },
    { id: 'intermediate', label: 'INTERMEDIATE' },
    { id: 'advanced', label: 'ADVANCED' },
  ];

  return (
    <section className="relative min-h-screen px-4 py-20 lg:px-8">
      {/* Section Header */}
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h2 className="font-chalk text-5xl sm:text-6xl lg:text-7xl">
              <span className="text-gradient">SKILL</span> LIBRARY
            </h2>
            <p className="mt-2 max-w-lg text-muted-foreground">
              Master 14 calisthenics skills from foundational moves to gravity-defying feats
            </p>
          </div>
          
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-md px-4 py-2 font-chalk text-sm transition-all",
                  filter === f.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Skills Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill, index) => {
            const locked = isLocked(skill);
            
            return (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: locked ? 1 : 1.02, y: locked ? 0 : -4 }}
                onClick={() => !locked && setSelectedSkill(skill)}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-xl border-2 bg-card p-6 transition-all duration-300",
                  locked 
                    ? "border-border opacity-60" 
                    : "border-border hover:border-primary"
                )}
              >
                {/* Lock Overlay */}
                {locked && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
                    <Lock className="h-8 w-8 text-muted-foreground" />
                    <span className="font-chalk text-sm text-muted-foreground">
                      {skill.tier === 'pro' ? 'PRO TIER' : 'BASIC TIER'}
                    </span>
                  </div>
                )}

                {/* Difficulty Badge */}
                <div className={cn(
                  "mb-4 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
                  difficultyColors[skill.difficulty]
                )}>
                  <span className="font-chalk">{skill.difficulty.toUpperCase()}</span>
                </div>

                {/* Tier Badge */}
                {skill.tier !== 'free' && (
                  <div className="absolute right-4 top-4">
                    <Crown className={cn(
                      "h-5 w-5",
                      skill.tier === 'pro' ? "text-primary" : "text-blue-400"
                    )} />
                  </div>
                )}

                {/* Skill Icon Placeholder */}
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-muted">
                  <span className="font-chalk text-3xl text-primary">
                    {skill.name.charAt(0)}
                  </span>
                </div>

                {/* Skill Info */}
                <h3 className="mb-2 font-chalk text-2xl">{skill.name}</h3>
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {skill.description}
                </p>

                {/* Muscle Groups */}
                <div className="flex flex-wrap gap-1">
                  {skill.muscleGroups.slice(0, 3).map((muscle) => (
                    <span
                      key={muscle}
                      className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>

                {/* Hover Arrow */}
                {!locked && (
                  <div className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100">
                    <ChevronRight className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur-xl"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border-2 border-border bg-card p-6 lg:p-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedSkill(null)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary transition-colors hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="mb-8">
                <div className={cn(
                  "mb-3 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
                  difficultyColors[selectedSkill.difficulty]
                )}>
                  <span className="font-chalk">{selectedSkill.difficulty.toUpperCase()}</span>
                </div>
                <h2 className="font-chalk text-4xl lg:text-5xl">{selectedSkill.name}</h2>
                <p className="mt-2 text-muted-foreground">{selectedSkill.description}</p>
              </div>

              {/* Instructions */}
              <div className="mb-8">
                <h3 className="mb-4 flex items-center gap-2 font-chalk text-xl text-primary">
                  <Play className="h-5 w-5" />
                  STEP-BY-STEP INSTRUCTIONS
                </h3>
                <ol className="space-y-3">
                  {selectedSkill.instructions.map((instruction, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4 rounded-lg bg-secondary/50 p-4"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-chalk text-primary-foreground">
                        {idx + 1}
                      </span>
                      <span className="text-foreground">{instruction}</span>
                    </motion.li>
                  ))}
                </ol>
              </div>

              {/* Progression Targets */}
              <div className="mb-8">
                <h3 className="mb-4 flex items-center gap-2 font-chalk text-xl text-primary">
                  <Target className="h-5 w-5" />
                  PROGRESSION TARGETS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSkill.progressionTargets.map((target, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border-2 px-4 py-2 transition-colors",
                        idx === 0 
                          ? "border-primary bg-primary/10" 
                          : "border-border bg-secondary/50"
                      )}
                    >
                      {idx === 0 && <CheckCircle className="h-4 w-4 text-primary" />}
                      <span className="font-chalk text-sm">{target}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="mb-8">
                <h3 className="mb-4 flex items-center gap-2 font-chalk text-xl text-primary">
                  <Lightbulb className="h-5 w-5" />
                  PRO TIPS
                </h3>
                <div className="space-y-2">
                  {selectedSkill.tips.map((tip, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4"
                    >
                      <span className="text-lg">💡</span>
                      <span className="text-muted-foreground">{tip}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button className="w-full bg-primary py-6 font-chalk text-xl text-primary-foreground hover:bg-primary/90">
                START PRACTICING
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
