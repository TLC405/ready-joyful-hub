import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, ChevronDown, Zap, ArrowUp, Circle, Minimize2, ArrowDown, Footprints, Hand, Triangle, GripVertical, TrendingUp, Flower2 } from 'lucide-react';
import { tracks } from '@/lib/tracks';
import { getExerciseById } from '@/lib/exercises';
import type { Exercise, TrackId } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ExerciseDetailModal } from '@/components/shared/ExerciseDetailModal';

const trackIcons: Record<string, React.ElementType> = {
  Zap, ArrowUp, Circle, Minimize2, ArrowDown, Footprints, Hand, Triangle, Grip: GripVertical, TrendingUp, Flower2,
};

const difficultyOrder: Record<string, number> = {
  easy: 0, beginner: 1, intermediate: 2, advanced: 3, master: 4,
};

const difficultyBadge: Record<string, string> = {
  easy: 'difficulty-easy',
  beginner: 'difficulty-beginner',
  intermediate: 'difficulty-intermediate',
  advanced: 'difficulty-advanced',
  master: 'difficulty-master',
};

interface TreeNode {
  exercise: Exercise;
  children: string[]; // exerciseIds that depend on this
  parents: string[];  // exerciseIds this depends on
  depth: number;
  column: number;
}

function buildTree(trackId: string) {
  const track = tracks.find(t => t.id === trackId);
  if (!track) return { levels: [] as TreeNode[][], nodes: new Map<string, TreeNode>() };

  const nodeMap: Record<string, TreeNode> = {};
  
  // Create nodes
  for (const node of track.nodes) {
    const exercise = getExerciseById(node.exerciseId);
    if (!exercise) continue;
    nodeMap[node.exerciseId] = {
      exercise,
      children: [],
      parents: node.prereqs,
      depth: 0,
      column: 0,
    });
  }

  // Build children links
  for (const node of track.nodes) {
    for (const prereq of node.prereqs) {
      const parent = nodeMap.get(prereq);
      if (parent) {
        parent.children.push(node.exerciseId);
      }
    }
  }

  // Compute depths (BFS from roots)
  const roots = Array.from(nodeMap.values()).filter(n => n.parents.length === 0 || n.parents.every(p => !nodeMap.has(p)));
  const queue = [...roots];
  for (const r of roots) r.depth = 0;

  const visited = new Set<string>();
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current.exercise.id)) continue;
    visited.add(current.exercise.id);
    
    for (const childId of current.children) {
      const child = nodeMap.get(childId);
      if (child) {
        child.depth = Math.max(child.depth, current.depth + 1);
        queue.push(child);
      }
    }
  }

  // Group by depth into levels
  const maxDepth = Math.max(0, ...Array.from(nodeMap.values()).map(n => n.depth));
  const levels: TreeNode[][] = [];
  for (let d = 0; d <= maxDepth; d++) {
    const level = Array.from(nodeMap.values())
      .filter(n => n.depth === d)
      .sort((a, b) => difficultyOrder[a.exercise.difficulty] - difficultyOrder[b.exercise.difficulty]);
    level.forEach((n, i) => n.column = i);
    levels.push(level);
  }

  return { levels, nodes: nodeMap };
}

export function ProgressionMap() {
  const [activeTrack, setActiveTrack] = useState<string>('planche');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showTrackSelect, setShowTrackSelect] = useState(false);

  const currentTrack = tracks.find(t => t.id === activeTrack)!;
  const { levels, nodes } = useMemo(() => buildTree(activeTrack), [activeTrack]);
  const TrackIcon = trackIcons[currentTrack.icon] || Zap;

  return (
    <section className="relative px-4 py-8 lg:px-8">
      <div className="editorial-divider-thick mb-6 pt-2">
        <div className="flex items-baseline justify-between">
          <h2 className="text-editorial-sm text-foreground">PROGRESSION MAP</h2>
          <div className="relative">
            <button
              onClick={() => setShowTrackSelect(!showTrackSelect)}
              className="flex items-center gap-2 border border-foreground/10 bg-card px-3 py-2 text-sm font-chalk transition-colors hover:bg-surface-0"
            >
              <TrackIcon className="h-4 w-4 text-primary" />
              {currentTrack.name}
              <ChevronDown className={cn("h-3 w-3 transition-transform", showTrackSelect && "rotate-180")} />
            </button>
            <AnimatePresence>
              {showTrackSelect && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full z-30 mt-1 w-56 border border-foreground/10 bg-card"
                >
                  {tracks.map(track => {
                    const Icon = trackIcons[track.icon] || Zap;
                    return (
                      <button
                        key={track.id}
                        onClick={() => { setActiveTrack(track.id); setShowTrackSelect(false); }}
                        className={cn(
                          "flex w-full items-center gap-2 border-b border-foreground/5 px-3 py-2 text-left text-sm transition-colors hover:bg-surface-0",
                          activeTrack === track.id && "bg-foreground text-card"
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        <span className="font-chalk text-xs">{track.name}</span>
                        <span className="ml-auto text-label text-[10px] opacity-50">{track.nodes.length}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{currentTrack.description}</p>
      </div>

      {/* Visual Tree */}
      <div className="overflow-x-auto">
        <div className="min-w-[320px] space-y-0">
          {levels.map((level, levelIdx) => (
            <div key={levelIdx}>
              {/* Connector lines from previous level */}
              {levelIdx > 0 && (
                <div className="flex justify-center py-2">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground/40">
                    <div className="h-6 w-px bg-foreground/10" />
                  </div>
                </div>
              )}
              
              {/* Level label */}
              <div className="mb-2 flex items-center gap-2">
                <div className="h-px flex-1 bg-foreground/5" />
                <span className="text-label text-[9px] text-muted-foreground/50">
                  {levelIdx === 0 ? 'START' : levelIdx === levels.length - 1 ? 'GOAL' : `STAGE ${levelIdx}`}
                </span>
                <div className="h-px flex-1 bg-foreground/5" />
              </div>

              {/* Nodes in this level */}
              <div className="flex flex-wrap justify-center gap-2">
                {level.map((node) => {
                  const ex = node.exercise;
                  const hasChildren = node.children.length > 0;
                  const isTerminal = !hasChildren;

                  return (
                    <motion.button
                      key={ex.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: levelIdx * 0.05 }}
                      onClick={() => setSelectedExercise(ex)}
                      className={cn(
                        "group relative flex items-center gap-2 border bg-card px-3 py-2.5 text-left transition-colors hover:bg-surface-0",
                        isTerminal ? "border-primary/40" : "border-foreground/10",
                        "min-w-[140px] max-w-[220px]"
                      )}
                    >
                      {/* Difficulty dot */}
                      <div className={cn(
                        "h-2 w-2 shrink-0",
                        ex.difficulty === 'easy' && "bg-difficulty-easy",
                        ex.difficulty === 'beginner' && "bg-difficulty-beginner",
                        ex.difficulty === 'intermediate' && "bg-difficulty-intermediate",
                        ex.difficulty === 'advanced' && "bg-difficulty-advanced",
                        ex.difficulty === 'master' && "bg-difficulty-master",
                      )} />
                      
                      <div className="min-w-0 flex-1">
                        <div className="font-chalk text-xs truncate">{ex.name}</div>
                        <div className="flex items-center gap-1">
                          <span className={cn("text-label text-[8px]", difficultyBadge[ex.difficulty])}>
                            {ex.difficulty.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Terminal marker */}
                      {isTerminal && (
                        <div className="absolute -right-px -top-px bg-primary px-1.5 py-0.5 text-[8px] font-bold text-primary-foreground">
                          ★
                        </div>
                      )}

                      {/* Image thumbnail */}
                      {ex.image && (
                        <div className="hidden h-8 w-8 shrink-0 overflow-hidden border border-foreground/10 sm:block">
                          <img src={ex.image} alt="" className="h-full w-full object-cover" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Arrow indicators */}
              {levelIdx < levels.length - 1 && (
                <div className="flex justify-center py-1">
                  <svg className="h-4 w-4 text-foreground/15" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 12l-4-4h3V4h2v4h3z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-foreground/10 pt-4">
        <span className="text-label text-[10px] text-muted-foreground">DIFFICULTY:</span>
        {['easy', 'beginner', 'intermediate', 'advanced', 'master'].map(d => (
          <div key={d} className="flex items-center gap-1">
            <div className={cn(
              "h-2 w-2",
              d === 'easy' && "bg-difficulty-easy",
              d === 'beginner' && "bg-difficulty-beginner",
              d === 'intermediate' && "bg-difficulty-intermediate",
              d === 'advanced' && "bg-difficulty-advanced",
              d === 'master' && "bg-difficulty-master",
            )} />
            <span className="text-[10px] text-muted-foreground">{d.toUpperCase()}</span>
          </div>
        ))}
        <div className="flex items-center gap-1 ml-auto">
          <div className="bg-primary px-1 text-[8px] text-primary-foreground">★</div>
          <span className="text-[10px] text-muted-foreground">GOAL SKILL</span>
        </div>
      </div>

      <AnimatePresence>
        {selectedExercise && (
          <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
