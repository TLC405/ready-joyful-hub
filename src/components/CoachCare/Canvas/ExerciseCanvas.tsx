import { motion } from 'framer-motion';
import { Dumbbell, Target, AlertTriangle, Play, ChevronLeft, ChevronRight, Plus, Video } from 'lucide-react';
import { ExerciseCanvasData, CanvasActionHandler } from '../types';
import { getExerciseById } from '@/lib/exercises';
import { cn } from '@/lib/utils';

const difficultyBadge: Record<string, string> = {
  easy: 'difficulty-easy',
  beginner: 'difficulty-beginner',
  intermediate: 'difficulty-intermediate',
  advanced: 'difficulty-advanced',
  master: 'difficulty-master',
};

interface ExerciseCanvasProps {
  data: ExerciseCanvasData;
  onNavigate?: CanvasActionHandler;
}

function getYtId(url?: string) {
  const m = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

export function ExerciseCanvas({ data, onNavigate }: ExerciseCanvasProps) {
  const exercise = getExerciseById(data.exerciseId);
  if (!exercise) {
    return (
      <div className="flex h-full items-center justify-center skeuo-grain">
        <div className="text-center skeuo-thunder-card p-8">
          <Dumbbell className="mx-auto h-10 w-10 text-thunder-orange/30 mb-3" />
          <p className="text-muted-foreground font-chalk text-journal">Exercise not found</p>
        </div>
      </div>
    );
  }

  const ytId = getYtId(exercise.videoUrl);
  const thumbnail = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null;
  const regressions = exercise.regressTo?.map(id => getExerciseById(id)).filter(Boolean) || [];
  const progressions = exercise.progressTo?.map(id => getExerciseById(id)).filter(Boolean) || [];

  const handlePlayVideo = () => {
    if (!exercise.videoUrl || !ytId) return;
    onNavigate?.('video', {
      platform: 'youtube',
      url: exercise.videoUrl,
      embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1`,
      analysis: {
        overallScore: 8,
        timestamps: [
          { time: '0:00', note: 'Starting position demo', type: 'form' as const },
          { time: '0:10', note: 'Key alignment cue', type: 'cue' as const },
        ],
        corrections: exercise.cueStack.slice(0, 3),
      },
    });
  };

  const handleProgressionClick = (ex: any) => {
    onNavigate?.('exercise', { exerciseId: ex.id, exerciseName: ex.name });
  };

  const handleAddToWorkout = () => {
    const templates = JSON.parse(localStorage.getItem('tlc-templates') || '[]');
    const block = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: exercise.doThis.setsRange.split('–')[0],
      reps: exercise.doThis.repsRange || exercise.doThis.timeSecRange || '8-12',
      rest: exercise.doThis.restSecRange.split('–')[0] || '60s',
      notes: '',
    };
    if (templates.length > 0) {
      templates[templates.length - 1].blocks.push(block);
    } else {
      templates.push({
        id: crypto.randomUUID(),
        name: 'Quick Workout',
        description: 'Auto-created',
        blocks: [block],
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      });
    }
    localStorage.setItem('tlc-templates', JSON.stringify(templates));
  };

  return (
    <div className="hide-scrollbar h-full overflow-y-auto p-4 notebook-ruled">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        {/* Video thumbnail — CLICKABLE to play */}
        {thumbnail && (
          <button onClick={handlePlayVideo} className="relative w-full overflow-hidden border border-foreground/10 skeuo-bezel p-[4px] group cursor-pointer">
            <img src={thumbnail} alt={exercise.name} className="h-48 w-full object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/10 group-hover:bg-foreground/30 transition-colors">
              <div className="flex h-14 w-14 items-center justify-center bg-thunder-orange/90 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                <Play className="h-6 w-6 text-primary-foreground ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-foreground/80 px-2 py-1">
              <Video className="h-3 w-3 text-thunder-orange" />
              <span className="text-[9px] text-label text-primary-foreground">WATCH IN-APP</span>
            </div>
          </button>
        )}

        {/* Header */}
        <div className="border border-foreground/10 bg-card p-4 skeuo-thunder-card skeuo-grain">
          <div className="flex items-center justify-between mb-2">
            <span className={cn("inline-block border px-2.5 py-0.5 text-label text-[10px]", difficultyBadge[exercise.difficulty])}>
              {exercise.difficulty.toUpperCase()}
            </span>
            <button onClick={handleAddToWorkout}
              className="flex items-center gap-1.5 px-3 py-1 text-[10px] text-label border border-thunder-orange/30 text-thunder-orange hover:bg-thunder-orange/10 transition-colors active:scale-95">
              <Plus className="h-3 w-3" /> ADD TO WORKOUT
            </button>
          </div>
          <h3 className="font-chalk text-2xl text-foreground text-journal-lg">{exercise.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground text-journal">{exercise.description}</p>
        </div>

        {/* Progression chain — CLICKABLE */}
        {(regressions.length > 0 || progressions.length > 0) && (
          <div className="border border-foreground/10 bg-surface-0 p-4 skeuo-card">
            <h4 className="mb-3 text-label text-xs text-thunder-orange text-journal-sm">PROGRESSION CHAIN</h4>
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              {regressions.map(r => (
                <button key={r!.id} onClick={() => handleProgressionClick(r)}
                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 border border-foreground/10 bg-card text-[11px] skeuo-card hover:border-thunder-blue/40 hover:text-thunder-blue transition-colors cursor-pointer">
                  <ChevronLeft className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground text-journal-sm">{r!.name}</span>
                </button>
              ))}
              <div className="shrink-0 px-4 py-2 border-2 border-thunder-orange bg-thunder-orange/10 text-[11px] font-chalk text-thunder-orange skeuo-pressed">
                {exercise.name}
              </div>
              {progressions.map(p => (
                <button key={p!.id} onClick={() => handleProgressionClick(p)}
                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 border border-foreground/10 bg-card text-[11px] skeuo-card hover:border-thunder-orange/40 hover:text-thunder-orange transition-colors cursor-pointer">
                  <span className="text-muted-foreground text-journal-sm">{p!.name}</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Do This */}
        <div className="border border-foreground/10 bg-surface-0 p-4 skeuo-card skeuo-grain">
          <h4 className="mb-2 flex items-center gap-2 text-label text-xs text-thunder-orange">
            <Target className="h-4 w-4" /> DO THIS
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-journal">
            <div className="surface-inset px-3 py-2"><span className="text-muted-foreground text-[10px] text-label block">Sets</span> <span className="font-chalk">{exercise.doThis.setsRange}</span></div>
            {exercise.doThis.repsRange && <div className="surface-inset px-3 py-2"><span className="text-muted-foreground text-[10px] text-label block">Reps</span> <span className="font-chalk">{exercise.doThis.repsRange}</span></div>}
            {exercise.doThis.timeSecRange && <div className="surface-inset px-3 py-2"><span className="text-muted-foreground text-[10px] text-label block">Hold</span> <span className="font-chalk">{exercise.doThis.timeSecRange}</span></div>}
            <div className="surface-inset px-3 py-2"><span className="text-muted-foreground text-[10px] text-label block">Rest</span> <span className="font-chalk">{exercise.doThis.restSecRange}</span></div>
          </div>
        </div>

        {/* Cues */}
        <div className="border border-foreground/10 bg-card p-4 skeuo-thunder-card">
          <h4 className="mb-2 text-label text-xs text-thunder-orange text-journal-sm">COACHING CUES</h4>
          <ul className="space-y-1.5">
            {exercise.cueStack.map((cue, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-journal">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-thunder-orange" />
                {cue}
              </li>
            ))}
          </ul>
        </div>

        {/* Fail Signs */}
        <div className="border border-foreground/15 bg-card p-4 skeuo-card skeuo-grain">
          <h4 className="mb-2 flex items-center gap-2 text-label text-xs text-foreground text-journal-sm">
            <AlertTriangle className="h-4 w-4 text-primary" /> FAIL SIGNS
          </h4>
          <ul className="space-y-1.5">
            {exercise.failSigns.map((fs, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground text-journal">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-foreground/40" />
                {fs}
              </li>
            ))}
          </ul>
        </div>

        {/* Muscles */}
        <div className="flex flex-wrap gap-1.5">
          {exercise.muscles.map((m) => (
            <span key={m} className="border border-foreground/10 bg-card px-2 py-1 text-label text-[10px] skeuo-card text-journal-sm">{m}</span>
          ))}
        </div>

        {/* Creator */}
        {exercise.creator && (
          <div className="border border-foreground/10 bg-surface-0 p-4 skeuo-card">
            <p className="text-xs text-muted-foreground text-journal-sm">
              Credit: <span className="font-medium text-foreground">{exercise.creator}</span>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
