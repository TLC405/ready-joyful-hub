import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, ArrowUp, Circle, Minimize2, ArrowDown, Footprints, Hand, Triangle, GripVertical, TrendingUp, Flower2 } from 'lucide-react';
import { tracks } from '@/lib/tracks';
import { getExerciseById } from '@/lib/exercises';
import type { Exercise } from '@/lib/types';
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

interface MapNode {
  exercise: Exercise;
  children: string[];
  parents: string[];
  depth: number;
}

function buildTree(trackId: string): MapNode[][] {
  const track = tracks.find(t => t.id === trackId);
  if (!track) return [];

  const nodeMap: Record<string, MapNode> = {};

  for (const node of track.nodes) {
    const exercise = getExerciseById(node.exerciseId);
    if (!exercise) continue;
    nodeMap[node.exerciseId] = {
      exercise,
      children: [],
      parents: node.prereqs.filter(p => track.nodes.some(n => n.exerciseId === p)),
      depth: 0,
    };
  }

  // Build children
  for (const node of track.nodes) {
    for (const prereq of node.prereqs) {
      if (nodeMap[prereq]) {
        nodeMap[prereq].children.push(node.exerciseId);
      }
    }
  }

  // BFS depths
  const roots = Object.values(nodeMap).filter(n => n.parents.length === 0);
  const queue = [...roots];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    const id = current.exercise.id;
    if (visited.has(id)) continue;
    visited.add(id);
    for (const childId of current.children) {
      const child = nodeMap[childId];
      if (child) {
        child.depth = Math.max(child.depth, current.depth + 1);
        queue.push(child);
      }
    }
  }

  // Group by depth
  const maxDepth = Math.max(0, ...Object.values(nodeMap).map(n => n.depth));
  const levels: MapNode[][] = [];
  for (let d = 0; d <= maxDepth; d++) {
    levels.push(
      Object.values(nodeMap)
        .filter(n => n.depth === d)
        .sort((a, b) => difficultyOrder[a.exercise.difficulty] - difficultyOrder[b.exercise.difficulty])
    );
  }
  return levels;
}

export function ProgressionMap() {
  const [activeTrack, setActiveTrack] = useState('planche');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showTrackSelect, setShowTrackSelect] = useState(false);

  const currentTrack = tracks.find(t => t.id === activeTrack)!;
  const levels = useMemo(() => buildTree(activeTrack), [activeTrack]);
  const TrackIcon = trackIcons[currentTrack.icon] || Zap;

  return (
    <section className="relative px-4 py-8 lg:px-8">
      <div className="editorial-divider-thick mb-6 pt-2">
        <div className="flex items-baseline justify-between gap-4">
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
                  className="absolute right-0 top-full z-30 mt-1 w-56 border border-foreground/10 bg-card shadow-lg"
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
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[300px] space-y-0">
          {levels.map((level, levelIdx) => (
            <div key={levelIdx}>
              {/* Connector */}
              {levelIdx > 0 && (
                <div className="flex justify-center py-1">
                  <svg className="h-5 w-5 text-foreground/15" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 16l-5-5h4V4h2v7h4z" />
                  </svg>
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

              {/* Nodes */}
              <div className="flex flex-wrap justify-center gap-2">
                {level.map((node) => {
                  const ex = node.exercise;
                  const isTerminal = node.children.length === 0;

                  return (
                    <motion.button
                      key={ex.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: levelIdx * 0.06, duration: 0.3 }}
                      onClick={() => setSelectedExercise(ex)}
                      className={cn(
                        "group relative flex items-center gap-2 border bg-card px-3 py-2.5 text-left transition-all hover:bg-surface-0",
                        isTerminal ? "border-primary/50 border-2" : "border-foreground/10",
                        "min-w-[140px] max-w-[220px]"
                      )}
                    >
                      <div className={cn(
                        "h-2.5 w-2.5 shrink-0",
                        ex.difficulty === 'easy' && "bg-difficulty-easy",
                        ex.difficulty === 'beginner' && "bg-difficulty-beginner",
                        ex.difficulty === 'intermediate' && "bg-difficulty-intermediate",
                        ex.difficulty === 'advanced' && "bg-difficulty-advanced",
                        ex.difficulty === 'master' && "bg-difficulty-master",
                      )} />

                      <div className="min-w-0 flex-1">
                        <div className="font-chalk text-xs truncate">{ex.name}</div>
                        <span className={cn("text-label text-[8px]", difficultyBadge[ex.difficulty])}>
                          {ex.difficulty.toUpperCase()}
                        </span>
                      </div>

                      {isTerminal && (
                        <div className="absolute -right-px -top-px bg-primary px-1.5 py-0.5 text-[8px] font-bold text-primary-foreground">
                          ★
                        </div>
                      )}

                      {ex.image && (
                        <div className="hidden h-8 w-8 shrink-0 overflow-hidden border border-foreground/10 sm:block">
                          <img src={ex.image} alt="" className="h-full w-full object-cover" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-foreground/10 pt-4">
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
