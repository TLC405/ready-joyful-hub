import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Exercise } from '@/lib/types';
import { getExerciseById } from '@/lib/exercises';
import { cn } from '@/lib/utils';
import { TLCVideoPlayer } from './TLCVideoPlayer';
import bruceLeeIcon from '@/assets/bruce-lee-icon.png';
import jcvdIcon from '@/assets/jcvd-icon.png';

const difficultyBadge: Record<string, string> = {
  easy: 'difficulty-easy',
  beginner: 'difficulty-beginner',
  intermediate: 'difficulty-intermediate',
  advanced: 'difficulty-advanced',
  master: 'difficulty-master',
};

const creatorIcons: Record<string, { icon: string; label: string; color: string }> = {
  'Bruce Lee': { icon: bruceLeeIcon, label: 'BRUCE LEE ORIGINAL', color: 'thunder-text' },
  'Jean-Claude Van Damme': { icon: jcvdIcon, label: 'JCVD SIGNATURE MOVE', color: 'thunder-text' },
};

interface ExerciseDetailModalProps {
  exercise: Exercise;
  onClose: () => void;
}

export function ExerciseDetailModal({ exercise: initialExercise, onClose }: ExerciseDetailModalProps) {
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(initialExercise);

  const regressExercises = exercise.regressTo.map(id => getExerciseById(id)).filter(Boolean) as Exercise[];
  const progressExercises = exercise.progressTo.map(id => getExerciseById(id)).filter(Boolean) as Exercise[];
  const creatorInfo = exercise.creator ? creatorIcons[exercise.creator] : null;
  const hasVideo = exercise.videoUrl || exercise.videoSources?.length || exercise.instagramUrl;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-foreground/60"
      onClick={onClose}
    >
      <motion.div
        key={exercise.id}
        initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }}
        transition={{ duration: 0.25, ease: 'easeOut' as const }}
        onClick={e => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto bg-card border border-foreground/15 sm:border-2 p-5 sm:p-6 lg:p-8 skeuo-grain skeuo-thunder-card notebook-ruled"
      >
        {/* Drag indicator on mobile */}
        <div className="mx-auto mb-3 h-0.5 w-10 thunder-gradient sm:hidden" />

        <button onClick={onClose} className="absolute right-3 top-3 border border-foreground/10 p-2 text-muted-foreground hover:text-thunder-orange-foreground hover:thunder-gradient transition-colors z-10 btn-raised">
          ✕
        </button>

        {/* Creator Legend Badge */}
        {creatorInfo && (
          <div className="mb-4 flex items-center gap-3 border-2 border-thunder-orange/30 p-3 skeuo-thunder-card thunder-gradient-subtle">
            <div className="surface-inset p-1">
              <img src={creatorInfo.icon} alt={exercise.creator} className="h-12 w-12 object-contain" loading="lazy" width={48} height={48} />
            </div>
            <div>
              <div className={cn("text-label text-xs font-bold text-journal", creatorInfo.color)}>
                {creatorInfo.label}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 text-journal-sm">
                This exercise was made famous by {exercise.creator}
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          {exercise.videoUrl ? (
            <TLCVideoPlayer videoUrl={exercise.videoUrl} thumbnailUrl={exercise.thumbnailUrl} title={exercise.name} className="aspect-[4/3] sm:aspect-auto" />
          ) : exercise.image ? (
            <div className="overflow-hidden aspect-[4/3] sm:aspect-auto border border-foreground/10 skeuo-bezel p-[4px]">
              <img src={exercise.image} alt={exercise.name} className="h-full w-full object-cover" />
            </div>
          ) : null}
          
          <div className="min-w-0">
            <span className={cn("mb-2 inline-block border px-3 py-0.5 text-label text-xs skeuo-metal", difficultyBadge[exercise.difficulty])}>
              {exercise.difficulty.toUpperCase()}
            </span>
            <h2 className="font-chalk text-xl sm:text-2xl text-embossed text-journal-lg">{exercise.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground text-journal">{exercise.description}</p>

            {hasVideo && (
              <button
                onClick={() => { onClose(); navigate(`/video/${exercise.id}`); }}
                className="mt-3 flex items-center gap-2 px-4 py-2 text-label text-[10px] tracking-widest btn-thunder text-journal"
              >
                <div className="thunder-led" />
                WATCH ON TLC TV
              </button>
            )}

            <div className="mt-4 border border-foreground/10 p-3 sm:p-4 skeuo-thunder-card">
              <h4 className="mb-2 text-label text-sm text-thunder-orange text-embossed text-journal">DO THIS</h4>
              <div className="space-y-1 text-sm text-journal">
                <p><span className="text-muted-foreground">Sets:</span> {exercise.doThis.setsRange}</p>
                {exercise.doThis.repsRange && <p><span className="text-muted-foreground">Reps:</span> {exercise.doThis.repsRange}</p>}
                {exercise.doThis.timeSecRange && <p><span className="text-muted-foreground">Hold:</span> {exercise.doThis.timeSecRange}</p>}
                <p><span className="text-muted-foreground">Rest:</span> {exercise.doThis.restSecRange}</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-label text-sm text-thunder-orange text-embossed text-journal">CUES</h4>
              <ul className="space-y-1">
                {exercise.cueStack.map((cue, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-journal"><span className="mt-1.5 h-1 w-1 shrink-0 bg-thunder-orange" />{cue}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-label text-sm text-thunder-blue text-embossed text-journal">FAIL SIGNS</h4>
              <ul className="space-y-1">
                {exercise.failSigns.map((fs, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground text-journal"><span className="mt-1.5 h-1 w-1 shrink-0 bg-thunder-blue" />{fs}</li>
                ))}
              </ul>
            </div>

            {exercise.creator && (
              <div className="mt-3 skeuo-stitch pt-3">
                <p className="text-xs text-muted-foreground text-journal-sm">
                  Credit: <span className="text-foreground font-medium">{exercise.creator}</span>
                </p>
                {exercise.instagramUrl && (
                  <a href={exercise.instagramUrl} target="_blank" rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-thunder-orange hover:underline text-journal-sm">
                    Watch on Instagram →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {exercise.coachNotes && (
          <div className="mt-5 grid gap-px bg-foreground/10 grid-cols-1 sm:grid-cols-2">
            {[
              { label: 'MECHANIC', text: exercise.coachNotes.mechanic, color: 'text-thunder-orange' },
              { label: 'BRUTALITY', text: exercise.coachNotes.brutality, color: 'text-thunder-blue' },
              { label: 'WATCH OUT', text: exercise.coachNotes.watchOut, color: 'text-thunder-orange' },
              { label: 'RECOVERY', text: exercise.coachNotes.recoveryVector, color: 'text-thunder-blue' },
            ].map(note => (
              <div key={note.label} className="bg-card p-3 sm:p-4 skeuo-card">
                <h4 className={cn("mb-1 text-label text-xs text-embossed text-journal-sm", note.color)}>{note.label}</h4>
                <p className="text-sm text-foreground text-journal">{note.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Progression Chain */}
        {(regressExercises.length > 0 || progressExercises.length > 0) && (
          <div className="mt-5 skeuo-stitch pt-4">
            <h4 className="mb-3 text-label text-sm text-foreground text-embossed text-journal">PROGRESSION CHAIN</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              {regressExercises.length > 0 && (
                <div className="flex-1">
                  <div className="mb-2 text-label text-[10px] text-thunder-blue text-journal-sm">← EASIER (REGRESS TO)</div>
                  <div className="space-y-1">
                    {regressExercises.map(ex => (
                      <button key={ex.id} onClick={() => setExercise(ex)}
                        className="flex w-full items-center gap-2 border border-foreground/10 bg-card px-3 py-2 text-left text-sm transition-colors hover:border-thunder-blue/50 btn-raised">
                        {ex.image && <img src={ex.image} alt={ex.name} className="h-8 w-8 object-cover border border-foreground/10 shrink-0" />}
                        <div className="min-w-0 flex-1">
                          <div className="font-chalk text-xs truncate text-journal">{ex.name}</div>
                          <span className={cn("text-label text-[9px]", difficultyBadge[ex.difficulty])}>{ex.difficulty.toUpperCase()}</span>
                        </div>
                        <span className="text-[10px] text-thunder-blue">←</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {progressExercises.length > 0 && (
                <div className="flex-1">
                  <div className="mb-2 text-label text-[10px] text-thunder-orange text-journal-sm">HARDER (PROGRESS TO) →</div>
                  <div className="space-y-1">
                    {progressExercises.map(ex => (
                      <button key={ex.id} onClick={() => setExercise(ex)}
                        className="flex w-full items-center gap-2 border border-foreground/10 bg-card px-3 py-2 text-left text-sm transition-colors hover:border-thunder-orange/50 btn-raised">
                        {ex.image && <img src={ex.image} alt={ex.name} className="h-8 w-8 object-cover border border-foreground/10 shrink-0" />}
                        <div className="min-w-0 flex-1">
                          <div className="font-chalk text-xs truncate text-journal">{ex.name}</div>
                          <span className={cn("text-label text-[9px]", difficultyBadge[ex.difficulty])}>{ex.difficulty.toUpperCase()}</span>
                        </div>
                        <span className="text-[10px] text-thunder-orange">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {exercise.tracks.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {exercise.tracks.map(t => (
              <span key={t} className="border border-thunder-blue/20 px-2 py-0.5 text-label text-[10px] text-muted-foreground skeuo-metal text-journal-sm">{t}</span>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
