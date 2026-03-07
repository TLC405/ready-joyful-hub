import { useCallback } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Drawer } from 'vaul';
import { ChatPanel } from './ChatPanel';
import { CanvasRouter } from './Canvas/CanvasRouter';
import { useCanvasState } from './hooks/useCanvasState';
import { useChatHistory } from './hooks/useChatHistory';
import { useIsMobile } from '@/hooks/use-mobile';
import { exercises } from '@/lib/exercises';
import { Maximize2 } from 'lucide-react';
import type { CanvasMode, VideoCanvasData, ExerciseCanvasData, TemplateCanvasData, DocumentCanvasData } from './types';
import { useState } from 'react';

// URL detection
function detectUrl(text: string): { platform: 'youtube' | 'instagram' | 'tiktok'; embedUrl: string; url: string } | null {
  const ytMatch = text.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return { platform: 'youtube', url: text, embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}` };
  const igMatch = text.match(/instagram\.com\/(p|reel)\/([a-zA-Z0-9_-]+)/);
  if (igMatch) return { platform: 'instagram', url: text, embedUrl: `https://www.instagram.com/${igMatch[1]}/${igMatch[2]}/embed` };
  if (text.match(/tiktok\.com/)) return { platform: 'tiktok', url: text, embedUrl: text };
  return null;
}

// Fuzzy exercise match
function findExercise(text: string) {
  const lower = text.toLowerCase();
  return exercises.find(e => lower.includes(e.name.toLowerCase())) || 
    exercises.find(e => e.name.toLowerCase().split(' ').some(w => w.length > 3 && lower.includes(w)));
}

// Smart response generation
function generateResponse(text: string, setCanvas: (mode: CanvasMode, data: any) => void) {
  const lower = text.toLowerCase();

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
      content: `I've loaded your ${urlData.platform} video and analyzed the form. Check the canvas for detailed timestamp breakdowns.\n\nOverall score: 7/10 — solid foundation with a couple of corrections needed. The elbow flare at 0:08 is the main thing to fix.`,
      type: 'video-card' as const,
      canvasAction: { mode: 'video' as CanvasMode, data: videoData },
    };
  }

  // Exercise detection
  const exercise = findExercise(text);
  if (exercise) {
    const exData: ExerciseCanvasData = { exerciseId: exercise.id, exerciseName: exercise.name };
    setCanvas('exercise', exData);
    return {
      content: `Here's the full breakdown for **${exercise.name}** — I've loaded it on the canvas with cues, fail signs, and programming parameters.\n\nDifficulty: ${exercise.difficulty}\nCategory: ${exercise.category}\n\n${exercise.shortPurpose}`,
      type: 'exercise-card' as const,
      canvasAction: { mode: 'exercise' as CanvasMode, data: exData },
    };
  }

  // Template/program request
  if (lower.match(/build|create|make|template|program|routine|workout/)) {
    const category = lower.includes('push') ? 'push' : lower.includes('pull') ? 'pull' : lower.includes('leg') ? 'legs' : lower.includes('core') ? 'core' : 'push';
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
      content: `I've built a ${category} day template with ${matchingExercises.length} exercises from the database. It's loaded on the canvas — you can drag to reorder, edit sets/reps, and save it.\n\nExercises: ${matchingExercises.map(e => e.name).join(', ')}`,
      type: 'template-preview' as const,
      canvasAction: { mode: 'template' as CanvasMode, data: templateData },
    };
  }

  // Stats request
  if (lower.match(/stats|progress|analytics|data|chart/)) {
    setCanvas('analytics', { type: 'overview' });
    return {
      content: "Your training analytics are loaded on the canvas. This week you've logged 9 sessions with 240 minutes of volume. Your push-to-pull ratio is balanced. Keep it up!",
      type: 'chart' as const,
      canvasAction: { mode: 'analytics' as CanvasMode, data: { type: 'overview' } },
    };
  }

  // Document request
  if (lower.match(/write|document|plan|guide|article/)) {
    const docData: DocumentCanvasData = {
      title: 'Training Program',
      content: `Week 1-2: Foundation Phase\n- Focus on hollow body, plank, and basic pushing/pulling\n- 3 sessions per week, 45 minutes each\n- Goal: Build consistent training habit\n\nWeek 3-4: Skill Introduction\n- Add frog stand and headstand practice\n- Increase to 4 sessions per week\n- Begin tracking hold times\n\nWeek 5-6: Progressive Overload\n- Extend hold times by 5s per week\n- Add L-sit attempts\n- Deload on week 6 if needed`,
    };
    setCanvas('document', docData);
    return {
      content: "I've drafted a 6-week program on the canvas. You can edit it directly — add sections, modify the progression, or ask me to adjust anything.",
      type: 'text' as const,
      canvasAction: { mode: 'document' as CanvasMode, data: docData },
    };
  }

  // General responses
  const generalResponses = [
    "That's a great question. For calisthenics progression, the key is patience with perfect form over rushing to the next variation. What specific skill are you working toward?",
    "I'd recommend focusing on your weakest link first. Paste a video of your current form and I'll give you specific corrections, or tell me which exercise you want to explore.",
    "Remember: consistency beats intensity. Three solid 45-minute sessions beat one marathon workout. Want me to build you a template?",
    "Good thinking. Try pasting a YouTube link of your form, asking about a specific exercise, or saying 'build me a push day' to see what I can do.",
  ];

  return {
    content: generalResponses[Math.floor(Math.random() * generalResponses.length)],
    type: 'text' as const,
  };
}

export function CoachCareStudio() {
  const { canvasState, setCanvas, resetCanvas } = useCanvasState();
  const { messages, addMessage, clearHistory } = useChatHistory();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSend = useCallback((text: string) => {
    addMessage({ role: 'user', content: text, type: 'text' });

    // Generate response with small delay for feel
    setTimeout(() => {
      const response = generateResponse(text, setCanvas);
      addMessage({ role: 'coach', ...response });
    }, 600);
  }, [addMessage, setCanvas]);

  const handleCanvasAction = useCallback((action: string) => {
    const actionMessages: Record<string, string> = {
      video: "I'd like to analyze a video — paste a YouTube, Instagram, or TikTok URL",
      document: "Write me a training program",
      template: "Build me a workout template",
      exercise: "Show me an exercise — try 'planche lean' or 'l-sit'",
      analytics: "Show my training stats",
      social: "Let me browse some social media content for inspiration",
    };
    const msg = actionMessages[action] || "Let's get started";
    handleSend(msg);
  }, [handleSend]);

  if (isMobile) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col">
        <ChatPanel messages={messages} onSend={handleSend} onClear={clearHistory} />
        {canvasState.mode !== 'idle' && (
          <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
            <Drawer.Trigger asChild>
              <button className="btn-raised fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <Maximize2 className="h-5 w-5" />
              </button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 z-50 bg-black/50" />
              <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-[85vh] flex-col rounded-t-2xl bg-background">
                <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-border" />
                <CanvasRouter canvasState={canvasState} onAction={handleCanvasAction} />
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        )}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-2rem)] p-2">
      <ResizablePanelGroup direction="horizontal" className="surface-raised h-full overflow-hidden rounded-2xl">
        <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
          <ChatPanel messages={messages} onSend={handleSend} onClear={clearHistory} />
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-border" />
        <ResizablePanel defaultSize={65}>
          <CanvasRouter canvasState={canvasState} onAction={handleCanvasAction} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
