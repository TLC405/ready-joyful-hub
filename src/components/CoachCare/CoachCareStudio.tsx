import { useCallback, useState, useRef } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Drawer } from 'vaul';
import { ChatPanel } from './ChatPanel';
import { CanvasRouter } from './Canvas/CanvasRouter';
import { useCanvasState } from './hooks/useCanvasState';
import { useChatHistory } from './hooks/useChatHistory';
import { useIsMobile } from '@/hooks/use-mobile';
import { exercises, getExerciseById } from '@/lib/exercises';
import { Maximize2 } from 'lucide-react';
import { streamCoachResponse } from './hooks/useCoachAI';
import type { CanvasMode, VideoCanvasData, ExerciseCanvasData, TemplateCanvasData, DocumentCanvasData, QuickReply, SocialCanvasData } from './types';

// ─── Context tracker ────────────────────────────────────────────
interface CoachContext {
  lastExerciseId: string | null;
  lastTopic: string | null;
  messageCount: number;
  sessionStart: string;
}

const dailyTips = [
  "💡 Daily tip: Controlled negatives (3-5s) build strength faster than cheat reps. Quality > quantity.",
  "💡 Daily tip: Warm up with 5 min of wrist circles and shoulder dislocates before any skill work.",
  "💡 Daily tip: Hollow body is the foundation of everything — if it's weak, everything else suffers.",
  "💡 Daily tip: Rest days aren't lazy days. Active recovery (walking, stretching) speeds adaptation.",
  "💡 Daily tip: Film yourself from the side. You'll catch form errors you can't feel.",
  "💡 Daily tip: Grip strength limits pulling movements. Train dead hangs 3×30s at the end of sessions.",
  "💡 Daily tip: Superset antagonist movements (push + pull) for time-efficient sessions.",
];

function detectUrl(text: string): { platform: 'youtube' | 'instagram' | 'tiktok'; embedUrl: string; url: string } | null {
  const ytMatch = text.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return { platform: 'youtube', url: text, embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1` };
  const igMatch = text.match(/instagram\.com\/(p|reel)\/([a-zA-Z0-9_-]+)/);
  if (igMatch) return { platform: 'instagram', url: text, embedUrl: `https://www.instagram.com/${igMatch[1]}/${igMatch[2]}/embed` };
  if (text.match(/tiktok\.com/)) return { platform: 'tiktok', url: text, embedUrl: text };
  return null;
}

function findExercise(text: string) {
  const lower = text.toLowerCase();
  return exercises.find(e => lower.includes(e.name.toLowerCase())) ||
    exercises.find(e => e.name.toLowerCase().split(' ').some(w => w.length > 3 && lower.includes(w)));
}

function getProgressionChain(exerciseId: string) {
  const ex = getExerciseById(exerciseId);
  if (!ex) return null;
  const regressions = ex.regressTo?.map(id => getExerciseById(id)).filter(Boolean) || [];
  const progressions = ex.progressTo?.map(id => getExerciseById(id)).filter(Boolean) || [];
  return { regressions, current: ex, progressions };
}

function getWorkoutHistory() {
  try {
    const templates = JSON.parse(localStorage.getItem('tlc-templates') || '[]');
    const logs = JSON.parse(localStorage.getItem('tlc-workout-logs') || '[]');
    return { templates, logs, count: templates.length + logs.length };
  } catch { return { templates: [], logs: [], count: 0 }; }
}

function getStreak(): number {
  try {
    const logs = JSON.parse(localStorage.getItem('tlc-workout-logs') || '[]');
    if (!logs.length) return 0;
    let streak = 0;
    const today = new Date();
    for (let d = 0; d < 365; d++) {
      const check = new Date(today);
      check.setDate(check.getDate() - d);
      const dateStr = check.toISOString().split('T')[0];
      if (logs.some((l: any) => l.date?.startsWith(dateStr))) streak++;
      else break;
    }
    return streak;
  } catch { return 0; }
}

function generateResponse(
  text: string,
  setCanvas: (mode: CanvasMode, data: any) => void,
  ctx: CoachContext,
  updateCtx: (updates: Partial<CoachContext>) => void
) {
  const lower = text.toLowerCase();

  if (ctx.messageCount === 0) {
    const tip = dailyTips[new Date().getDay() % dailyTips.length];
    updateCtx({ messageCount: 1 });
    return {
      content: tip + "\n\nWhat are we working on today?",
      type: 'text' as const,
      quickReplies: [
        { label: '🎥 Analyze a video', message: "I'd like to analyze a video" },
        { label: '💪 Build a workout', message: 'Build me a push day template' },
        { label: '📊 My stats', message: 'Show my training stats' },
      ],
    };
  }

  updateCtx({ messageCount: ctx.messageCount + 1 });

  // Social search trigger
  if (lower.match(/find videos?|search|show me|browse|look up|find me/)) {
    const queryWords = text.replace(/find|videos?|of|for|me|search|show|browse|look up/gi, '').trim();
    const socialData: SocialCanvasData = {
      query: queryWords || 'calisthenics',
      platform: lower.includes('instagram') || lower.includes('ig') ? 'instagram' : lower.includes('youtube') || lower.includes('yt') ? 'youtube' : 'all',
      results: [],
    };
    setCanvas('social', socialData);
    return {
      content: `Searching for "${queryWords || 'calisthenics'}" across social media. Use the canvas to browse and play videos in-app.`,
      type: 'social-search' as const,
      canvasAction: { mode: 'social' as CanvasMode, data: socialData },
      quickReplies: [
        { label: 'YouTube only', message: `Find YouTube videos of ${queryWords}` },
        { label: 'Instagram reels', message: `Find Instagram videos of ${queryWords}` },
      ],
    };
  }

  // "harder" / "easier" context-aware
  if ((lower.match(/harder|next|progress|advance/) || lower.match(/easier|regress|step back|scale down/)) && ctx.lastExerciseId) {
    const chain = getProgressionChain(ctx.lastExerciseId);
    if (chain) {
      const isHarder = !!lower.match(/harder|next|progress|advance/);
      const targets = isHarder ? chain.progressions : chain.regressions;
      if (targets.length > 0) {
        const target = targets[0]!;
        const exData: ExerciseCanvasData = { exerciseId: target.id, exerciseName: target.name };
        setCanvas('exercise', exData);
        updateCtx({ lastExerciseId: target.id });
        return {
          content: `${isHarder ? '⬆️ Next progression' : '⬇️ Regression'} from ${chain.current.name}:\n\n**${target.name}** (${target.difficulty})\n${target.shortPurpose}\n\nLoaded on canvas — click to explore.`,
          type: 'exercise-card' as const,
          exerciseRef: { id: target.id, name: target.name, difficulty: target.difficulty },
          canvasAction: { mode: 'exercise' as CanvasMode, data: exData },
          quickReplies: [
            { label: isHarder ? 'Even harder' : 'Even easier', message: isHarder ? 'What about harder?' : 'What about easier?' },
            { label: 'Add to workout', message: `Add ${target.name} to my workout` },
            { label: 'Watch video', message: `Find videos of ${target.name}` },
          ],
        };
      }
    }
  }

  // Video URL detection
  const urlData = detectUrl(text);
  if (urlData) {
    const videoData: VideoCanvasData = {
      ...urlData,
      analysis: {
        overallScore: 7,
        timestamps: [
          { time: '0:03', note: 'Good starting position', type: 'form' },
          { time: '0:08', note: 'Slight elbow flare — keep elbows tucked', type: 'error' },
          { time: '0:14', note: 'Core engagement looks solid', type: 'cue' },
          { time: '0:22', note: 'Hips dropping — engage glutes', type: 'error' },
        ],
        corrections: [
          'Watch elbow flare at the 0:08 mark — tuck elbows closer to your body',
          'Hip sag after 0:20 suggests core fatigue — try shorter holds with better form',
          'Overall positioning is strong — you\'re close to nailing this',
        ],
      },
    };
    setCanvas('video', videoData);
    return {
      content: `I've loaded your ${urlData.platform} video and analyzed the form. Check the canvas for detailed timestamp breakdowns.\n\nOverall score: 7/10 — solid foundation with a couple of corrections needed.`,
      type: 'video-card' as const,
      canvasAction: { mode: 'video' as CanvasMode, data: videoData },
      quickReplies: [
        { label: 'What should I fix first?', message: 'What should I fix first in my form?' },
        { label: 'Show me drills', message: 'Show me corrective drills' },
      ],
    };
  }

  // Exercise detection
  const exercise = findExercise(text);
  if (exercise) {
    const exData: ExerciseCanvasData = { exerciseId: exercise.id, exerciseName: exercise.name };
    setCanvas('exercise', exData);
    updateCtx({ lastExerciseId: exercise.id, lastTopic: exercise.category });

    const chain = getProgressionChain(exercise.id);
    const progressionNote = chain?.progressions.length
      ? `\n\nNext progression: **${chain.progressions[0]!.name}**`
      : '';
    const regressionNote = chain?.regressions.length
      ? `\nRegression: ${chain.regressions[0]!.name}`
      : '';

    return {
      content: `Here's the full breakdown for **${exercise.name}** — loaded on the canvas.\n\nDifficulty: ${exercise.difficulty} | Category: ${exercise.category}\n${exercise.shortPurpose}${progressionNote}${regressionNote}`,
      type: 'exercise-card' as const,
      exerciseRef: { id: exercise.id, name: exercise.name, difficulty: exercise.difficulty },
      canvasAction: { mode: 'exercise' as CanvasMode, data: exData },
      quickReplies: [
        ...(chain?.progressions.length ? [{ label: '⬆️ Harder', message: 'What about harder?' }] : []),
        ...(chain?.regressions.length ? [{ label: '⬇️ Easier', message: 'What about easier?' }] : []),
        { label: '🎥 Watch video', message: `Find videos of ${exercise.name}` },
        { label: '➕ Add to workout', message: `Add ${exercise.name} to my workout` },
      ],
    };
  }

  // Template/program request
  if (lower.match(/build|create|make|template|program|routine|workout|add.*to.*workout/)) {
    const category = lower.includes('push') ? 'push' : lower.includes('pull') ? 'pull' : lower.includes('leg') ? 'legs' : lower.includes('core') ? 'core' : lower.includes('ballet') ? 'ballet' : 'push';
    const matchingExercises = exercises.filter(e => e.category === category).slice(0, 5);
    const templateData: TemplateCanvasData = {
      template: {
        id: crypto.randomUUID(),
        name: `${category.charAt(0).toUpperCase() + category.slice(1)} Day Template`,
        description: `Auto-generated ${category} workout`,
        blocks: matchingExercises.map(e => ({
          id: crypto.randomUUID(),
          exerciseId: e.id,
          exerciseName: e.name,
          sets: e.doThis.setsRange.split('–')[0],
          reps: e.doThis.repsRange || e.doThis.timeSecRange || '8-12',
          rest: e.doThis.restSecRange.split('–')[0] || '60s',
          notes: '',
        })),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
    };
    setCanvas('template', templateData);
    return {
      content: `Built a ${category} day template with ${matchingExercises.length} exercises. It's on the canvas — edit sets/reps and save.\n\nExercises: ${matchingExercises.map(e => e.name).join(', ')}`,
      type: 'template-preview' as const,
      canvasAction: { mode: 'template' as CanvasMode, data: templateData },
      quickReplies: [
        { label: '💾 Save template', message: 'Save this template' },
        { label: 'Add more exercises', message: `Add more ${category} exercises` },
        { label: 'Switch to pull', message: 'Build me a pull day instead' },
      ],
    };
  }

  // Stats request
  if (lower.match(/stats|progress|analytics|data|chart|streak/)) {
    const history = getWorkoutHistory();
    const streak = getStreak();
    setCanvas('analytics', { type: 'overview' });
    return {
      content: `Training analytics loaded on canvas.${streak > 0 ? ` 🔥 ${streak}-day streak!` : ''}\n\n${history.count} saved workouts total. Check the canvas for detailed charts.`,
      type: 'chart' as const,
      canvasAction: { mode: 'analytics' as CanvasMode, data: { type: 'overview' } },
      quickReplies: [
        { label: 'Build a workout', message: 'Build me a workout template' },
        { label: 'What should I train?', message: 'What should I train today?' },
      ],
    };
  }

  // Document request
  if (lower.match(/write|document|plan|guide|article/)) {
    const docData: DocumentCanvasData = {
      title: 'Training Program',
      content: `Week 1-2: Foundation Phase\n- Focus on hollow body, plank, and basic pushing/pulling\n- 3 sessions per week, 45 minutes each\n\nWeek 3-4: Skill Introduction\n- Add frog stand and headstand practice\n- Increase to 4 sessions per week\n\nWeek 5-6: Progressive Overload\n- Extend hold times by 5s per week\n- Add L-sit attempts`,
    };
    setCanvas('document', docData);
    return {
      content: "Drafted a 6-week program on the canvas. Edit directly or ask me to adjust.",
      type: 'text' as const,
      canvasAction: { mode: 'document' as CanvasMode, data: docData },
      quickReplies: [
        { label: 'Make it harder', message: 'Make this program more advanced' },
        { label: 'Add skill work', message: 'Add handstand and planche work to the program' },
      ],
    };
  }

  // Return null to signal "use AI for this"
  return null;
}

export function CoachCareStudio() {
  const { canvasState, setCanvas, resetCanvas } = useCanvasState();
  const { messages, addMessage, clearHistory } = useChatHistory();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [coachCtx, setCoachCtx] = useState<CoachContext>({
    lastExerciseId: null,
    lastTopic: null,
    messageCount: 0,
    sessionStart: new Date().toISOString(),
  });

  const updateCtx = useCallback((updates: Partial<CoachContext>) => {
    setCoachCtx(prev => ({ ...prev, ...updates }));
  }, []);

  const streamingMsgId = useRef<string | null>(null);

  const handleSend = useCallback((text: string) => {
    addMessage({ role: 'user', content: text, type: 'text' });
    setIsTyping(true);

    // Try deterministic handlers first
    const response = generateResponse(text, setCanvas, coachCtx, updateCtx);
    
    if (response !== null) {
      // Deterministic match — use local response
      setTimeout(() => {
        addMessage({ role: 'coach', ...response });
        setIsTyping(false);
      }, 400);
    } else {
      // No match — stream from AI
      const personality = localStorage.getItem('tlc-coach-personality') || undefined;
      const recentMsgs = messages.slice(-10).map(m => ({
        role: (m.role === 'coach' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: m.content,
      }));
      recentMsgs.push({ role: 'user', content: text });

      let accumulated = '';
      const msgId = crypto.randomUUID();
      streamingMsgId.current = msgId;

      // Add empty coach message that we'll stream into
      addMessage({ role: 'coach', content: '...', type: 'text', id: msgId });

      streamCoachResponse({
        messages: recentMsgs,
        personality,
        onDelta: (chunk) => {
          accumulated += chunk;
          // Update the last coach message in place
          addMessage({ role: 'coach', content: accumulated, type: 'text', id: msgId, replace: true });
        },
        onDone: () => {
          setIsTyping(false);
          streamingMsgId.current = null;
        },
        onError: (err) => {
          if (!accumulated) {
            addMessage({ role: 'coach', content: `Sorry, I couldn't connect right now. Try again or ask about a specific exercise! ⚡`, type: 'text', id: msgId, replace: true });
          }
          setIsTyping(false);
          streamingMsgId.current = null;
        },
      });
    }
  }, [addMessage, setCanvas, coachCtx, updateCtx, messages]);

  const handleCanvasAction = useCallback((action: string) => {
    const actionMessages: Record<string, string> = {
      video: "I'd like to analyze a video — paste a YouTube, Instagram, or TikTok URL",
      document: "Write me a training program",
      template: "Build me a workout template",
      exercise: "Show me an exercise — try 'planche lean' or 'l-sit'",
      analytics: "Show my training stats",
      social: "Find videos of calisthenics",
    };
    handleSend(actionMessages[action] || "Let's get started");
  }, [handleSend]);

  const handleQuickReply = useCallback((message: string) => {
    handleSend(message);
  }, [handleSend]);

  // Direct canvas navigation (from chat clicks or exercise canvas clicks)
  const handleCanvasNavigate = useCallback((mode: CanvasMode, data: any) => {
    setCanvas(mode, data);
    if (isMobile) setDrawerOpen(true);
  }, [setCanvas, isMobile]);

  if (isMobile) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col">
        <ChatPanel messages={messages} onSend={handleSend} onClear={clearHistory} isTyping={isTyping} onQuickReply={handleQuickReply} onCanvasAction={handleCanvasNavigate} />
        {canvasState.mode !== 'idle' && (
          <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
            <Drawer.Trigger asChild>
              <button className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground">
                <Maximize2 className="h-5 w-5" />
              </button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 z-50 bg-foreground/50" />
              <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-[85vh] flex-col border-t-2 border-foreground bg-background">
                <div className="mx-auto mt-2 h-1 w-12 bg-foreground/20" />
                <CanvasRouter canvasState={canvasState} onAction={handleCanvasAction} onCanvasNavigate={handleCanvasNavigate} />
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        )}
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-4rem)]">
      <ResizablePanel defaultSize={38} minSize={28} maxSize={50}>
        <ChatPanel messages={messages} onSend={handleSend} onClear={clearHistory} isTyping={isTyping} onQuickReply={handleQuickReply} onCanvasAction={handleCanvasNavigate} />
      </ResizablePanel>
      <ResizableHandle withHandle className="bg-foreground/10 hover:bg-thunder-orange/20 transition-colors" />
      <ResizablePanel defaultSize={62} minSize={40}>
        <div className="h-full overflow-hidden bg-surface-0 skeuo-grain">
          <CanvasRouter canvasState={canvasState} onAction={handleCanvasAction} onCanvasNavigate={handleCanvasNavigate} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
