import { motion } from 'framer-motion';
import { 
  CheckCircle, Target, Lightbulb, Play, X, AlertTriangle, Zap, RotateCcw, TrendingUp, Shield
} from 'lucide-react';
import { Skill } from '@/lib/skills-data';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SkillDetailModalProps {
  skill: Skill;
  onClose: () => void;
}

const difficultyStyles = {
  beginner: { badge: 'difficulty-beginner', label: 'BEGINNER' },
  intermediate: { badge: 'difficulty-intermediate', label: 'INTERMEDIATE' },
  advanced: { badge: 'difficulty-advanced', label: 'ADVANCED' },
};

export function SkillDetailModal({ skill, onClose }: SkillDetailModalProps) {
  const hasMovements = skill.movements && skill.movements.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto border border-foreground/15 bg-card p-6 lg:p-10"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center border border-foreground/10 text-muted-foreground transition-colors hover:bg-foreground hover:text-card"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative overflow-hidden border border-foreground/10">
            <img src={skill.image} alt={skill.name} className="h-full w-full object-cover" />
            <div className="image-overlay absolute inset-0" />
          </div>

          <div>
            <div className="mb-6">
              {skill.protocol_name && (
                <div className="mb-2 text-label text-[10px] text-primary/80">
                  {skill.protocol_name}
                </div>
              )}
              <div className={cn(
                "mb-3 inline-flex items-center gap-1 border px-3 py-1 text-label text-[10px]",
                difficultyStyles[skill.difficulty].badge
              )}>
                {difficultyStyles[skill.difficulty].label}
              </div>
              <h2 className="font-chalk text-3xl lg:text-4xl">{skill.name}</h2>
              {skill.objective && (
                <p className="mt-2 text-label text-sm text-primary">{skill.objective}</p>
              )}
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{skill.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 flex items-center gap-2 font-chalk text-sm text-primary">
                <Target className="h-4 w-4" />
                PROGRESSION TARGETS
              </h3>
              <div className="flex flex-wrap gap-1">
                {skill.progressionTargets.map((target, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-center gap-2 border px-3 py-1.5 text-label text-[10px]",
                      idx === 0 
                        ? "border-primary/30 text-primary" 
                        : "border-foreground/10 text-muted-foreground"
                    )}
                  >
                    {idx === 0 && <CheckCircle className="h-3 w-3" />}
                    {target}
                  </div>
                ))}
              </div>
            </div>

            {skill.intensity_markers && skill.intensity_markers.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 flex items-center gap-2 font-chalk text-sm text-primary">
                  <Shield className="h-4 w-4" />
                  INTENSITY MARKERS
                </h3>
                <div className="space-y-2">
                  {skill.intensity_markers.map((marker, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{marker}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {hasMovements ? (
          <div className="mt-8">
            <h3 className="mb-4 flex items-center gap-2 font-chalk text-sm text-primary">
              <Play className="h-4 w-4" />
              MOVEMENT BRIEFINGS
            </h3>
            <div className="space-y-4">
              {skill.movements!.map((movement, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="border border-foreground/10"
                >
                  <div className="flex items-center gap-3 border-b border-foreground/10 bg-surface-0 px-4 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-primary bg-primary font-chalk text-sm text-primary-foreground">
                      {idx + 1}
                    </span>
                    <h4 className="font-chalk text-sm">{movement.name}</h4>
                  </div>

                  <div className="p-4">
                    <Tabs defaultValue="mechanic" className="w-full">
                      <TabsList className="mb-3 grid w-full grid-cols-3 border border-foreground/10 bg-surface-0 lg:grid-cols-6">
                        <TabsTrigger value="mechanic" className="text-label text-[10px]">MECHANIC</TabsTrigger>
                        <TabsTrigger value="brutality" className="text-label text-[10px]">BRUTALITY</TabsTrigger>
                        <TabsTrigger value="progression" className="text-label text-[10px]">PROGRESSION</TabsTrigger>
                        <TabsTrigger value="volume" className="text-label text-[10px]">VOLUME</TabsTrigger>
                        <TabsTrigger value="watchout" className="text-label text-[10px]">WATCH OUT</TabsTrigger>
                        <TabsTrigger value="recovery" className="text-label text-[10px]">RECOVERY</TabsTrigger>
                      </TabsList>

                      <TabsContent value="mechanic" className="mt-0">
                        <div className="border border-foreground/10 bg-surface-0 p-4">
                          <p className="text-sm leading-relaxed text-foreground">{movement.mechanic}</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="brutality" className="mt-0">
                        <div className="border border-primary/20 bg-card p-4">
                          <div className="flex items-start gap-3">
                            <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <p className="text-sm leading-relaxed text-foreground">{movement.brutality}</p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="progression" className="mt-0">
                        <div className="border border-foreground/10 bg-surface-0 p-4">
                          <div className="flex items-start gap-3">
                            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <p className="text-sm leading-relaxed text-foreground">{movement.progression}</p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="volume" className="mt-0">
                        <div className="border border-foreground/10 bg-surface-0 p-4">
                          <p className="font-chalk text-sm text-foreground">{movement.volume}</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="watchout" className="mt-0">
                        <div className="border border-primary/20 bg-card p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <p className="text-sm leading-relaxed text-foreground">{movement.watch_out}</p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="recovery" className="mt-0">
                        <div className="border border-foreground/10 bg-surface-0 p-4">
                          <div className="flex items-start gap-3">
                            <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <p className="text-sm leading-relaxed text-foreground">{movement.movement_recovery}</p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <h3 className="mb-4 flex items-center gap-2 font-chalk text-sm text-primary">
              <Play className="h-4 w-4" />
              STEP-BY-STEP INSTRUCTIONS
            </h3>
            <ol className="grid gap-px bg-foreground/10 border border-foreground/10 sm:grid-cols-2">
              {skill.instructions.map((instruction, idx) => (
                <li key={idx} className="flex gap-3 bg-card p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-primary bg-primary font-chalk text-xs text-primary-foreground">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-foreground">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {skill.recovery_vector && skill.recovery_vector.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-3 flex items-center gap-2 font-chalk text-sm text-primary">
              <RotateCcw className="h-4 w-4" />
              RECOVERY VECTOR
            </h3>
            <div className="grid gap-px bg-foreground/10 border border-foreground/10 sm:grid-cols-3">
              {skill.recovery_vector.map((tip, idx) => (
                <div key={idx} className="bg-card p-4">
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!skill.recovery_vector && skill.tips && skill.tips.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-3 flex items-center gap-2 font-chalk text-sm text-primary">
              <Lightbulb className="h-4 w-4" />
              PRO TIPS
            </h3>
            <div className="grid gap-px bg-foreground/10 border border-foreground/10 sm:grid-cols-3">
              {skill.tips.map((tip, idx) => (
                <div key={idx} className="bg-card p-4">
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <button className="w-full bg-primary py-4 font-chalk text-sm text-primary-foreground transition-opacity hover:opacity-90">
            START PRACTICING
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
