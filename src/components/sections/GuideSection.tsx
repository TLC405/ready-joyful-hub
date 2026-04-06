import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Library, MessageSquare, BarChart3, Settings, Search, 
  Keyboard, ChevronDown, Zap, Play, Dumbbell, Globe, FileText,
  Smartphone, Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuideEntry {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  steps: { emoji: string; text: string }[];
  proTip?: string;
}

const guideEntries: GuideEntry[] = [
  {
    id: 'getting-started',
    icon: Zap,
    title: 'GETTING STARTED',
    subtitle: 'Your first 60 seconds in the app',
    steps: [
      { emoji: '1️⃣', text: 'Use the sidebar (desktop) or bottom bar (mobile) to navigate between sections: Home, Library, Coach, Progress, and Settings.' },
      { emoji: '2️⃣', text: 'Start on the Home page — tap a category card (Calisthenics, Yoga, Ballet, Mobility) to jump straight to filtered exercises.' },
      { emoji: '3️⃣', text: 'Press ⌘K (or Ctrl+K) anytime to open the quick search overlay and find any exercise instantly.' },
      { emoji: '4️⃣', text: 'Swipe left/right on mobile to move between sections. The dot indicators at the bottom show your position.' },
    ],
    proTip: 'The app remembers your theme preference (light/dark) and last section. Toggle the theme with the sun/moon icon in the sidebar.',
  },
  {
    id: 'library',
    icon: Library,
    title: 'LIBRARY & MAP',
    subtitle: 'Browse, discover, and track progressions',
    steps: [
      { emoji: '📚', text: 'BROWSE tab — Search and filter 60+ exercises by category (push, pull, core, legs, skills, yoga, ballet, mobility). Click any exercise card for full details, cues, and common mistakes.' },
      { emoji: '🗺️', text: 'MAP tab — Visual progression chains show how exercises connect. Follow the arrows from beginner to master. Each node shows difficulty and your completion status.' },
      { emoji: '📺', text: 'TLC TV tab — Video library with thumbnails. Filter by category, search by name. Click to watch tutorials with embedded YouTube playback.' },
      { emoji: '🔗', text: 'Every exercise links to its regressions (easier) and progressions (harder). Navigate the chain to find your perfect level.' },
    ],
    proTip: 'In the MAP tab, look for the completion percentage on each track header — it shows how far you\'ve progressed in that skill tree.',
  },
  {
    id: 'coach',
    icon: MessageSquare,
    title: 'TLC COACH (AI)',
    subtitle: 'Your personal AI training partner',
    steps: [
      { emoji: '💬', text: 'Type naturally — ask about any exercise, request a workout template, or get training advice. The AI understands calisthenics, yoga, ballet, and gymnastics.' },
      { emoji: '🎥', text: 'Paste a YouTube or Instagram URL to get instant form analysis with timestamp breakdowns, corrections, and scoring.' },
      { emoji: '🔍', text: 'Say "find videos of [exercise]" to search social media for tutorial content. Results play in-app on the canvas.' },
      { emoji: '📋', text: 'Say "build me a push day" or "create a workout" to auto-generate a template with sets, reps, and rest periods. Edit directly on the canvas.' },
      { emoji: '📊', text: 'Say "show my stats" to see training analytics, streak data, and workout history on the canvas.' },
      { emoji: '⬆️', text: 'After viewing an exercise, say "harder" or "easier" to navigate its progression chain without leaving the chat.' },
    ],
    proTip: 'The Coach remembers your conversation context. After asking about planche, just say "harder" to see the next progression automatically.',
  },
  {
    id: 'progress',
    icon: BarChart3,
    title: 'PROGRESS DASHBOARD',
    subtitle: 'Track streaks, heatmaps, and skill levels',
    steps: [
      { emoji: '🔥', text: 'Your training streak shows consecutive days of logged workouts. Don\'t break the chain!' },
      { emoji: '📅', text: 'The heatmap calendar visualizes your training frequency over time. Darker squares = more sessions.' },
      { emoji: '📈', text: 'Skill level bars show your self-assessed proficiency across different exercise categories.' },
      { emoji: '🏋️', text: 'Recent workouts section shows your last saved templates and completed sessions.' },
    ],
  },
  {
    id: 'settings',
    icon: Settings,
    title: 'SETTINGS & PREFERENCES',
    subtitle: 'Customize your training experience',
    steps: [
      { emoji: '🎨', text: 'Toggle between light and dark themes. The notebook-ruled aesthetic adapts to both modes.' },
      { emoji: '🤖', text: 'Set your Coach personality preference (motivating, analytical, casual) to change how the AI responds.' },
      { emoji: '💾', text: 'Export your workout data and templates for backup. Import them back anytime.' },
      { emoji: '⚙️', text: 'Configure training preferences: experience level, available equipment, session duration goals.' },
    ],
  },
  {
    id: 'shortcuts',
    icon: Keyboard,
    title: 'KEYBOARD SHORTCUTS',
    subtitle: 'Power user navigation',
    steps: [
      { emoji: '⌘K', text: 'Open quick search — find any exercise, navigate to any section.' },
      { emoji: '1-5', text: 'Number keys jump to sections: 1=Home, 2=Library, 3=Coach, 4=Progress, 5=Settings.' },
      { emoji: '←→', text: 'Arrow keys navigate between sections (same as swiping on mobile).' },
      { emoji: 'T', text: 'Toggle light/dark theme.' },
    ],
    proTip: 'Quick search (⌘K) is the fastest way to get anywhere. Start typing an exercise name and hit Enter.',
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'MOBILE TIPS',
    subtitle: 'Optimized for touch and small screens',
    steps: [
      { emoji: '👆', text: 'Swipe left/right on the main content area to move between Home, Library, Coach, Progress, and Settings.' },
      { emoji: '📱', text: 'The Coach canvas opens as a bottom drawer on mobile — drag up to expand, drag down to minimize.' },
      { emoji: '🔍', text: 'Tap the MORE button in the bottom bar to access Settings and the theme toggle.' },
      { emoji: '📐', text: 'Exercise cards use progressive disclosure — tap to reveal details, purpose, and progression chain.' },
    ],
  },
];

export function GuideSection() {
  const [openId, setOpenId] = useState<string | null>('getting-started');

  return (
    <section className="relative px-4 pt-2 pb-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="text-label text-[10px] text-muted-foreground/50 tracking-[0.2em] mb-2">TLC CALISTHENICS</div>
        <h2 className="text-editorial-sm text-foreground text-embossed">
          FIELD <span className="thunder-text">GUIDE</span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground/70 text-journal max-w-md mx-auto">
          Everything you need to know to master this app and your training.
        </p>
        <div className="mx-auto mt-3 w-16 thunder-divider" />
      </div>

      {/* Guide entries */}
      <div className="max-w-2xl mx-auto space-y-1">
        {guideEntries.map((entry, idx) => {
          const Icon = entry.icon;
          const isOpen = openId === entry.id;
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : entry.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 text-left transition-all skeuo-card skeuo-grain",
                  isOpen ? "border-thunder-orange/40 bg-thunder-orange/5" : "hover:border-foreground/20"
                )}
              >
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center", isOpen ? "thunder-inset" : "surface-inset")}>
                  <Icon className={cn("h-5 w-5", isOpen ? "text-thunder-orange" : "text-muted-foreground")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-label text-xs tracking-wider text-journal">{entry.title}</div>
                  <div className="text-[10px] text-muted-foreground/60 text-journal-sm">{entry.subtitle}</div>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground/40 transition-transform", isOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-2 space-y-3 notebook-ruled notebook-margin">
                      {entry.steps.map((step, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <span className="text-sm shrink-0 mt-0.5">{step.emoji}</span>
                          <p className="text-sm text-foreground/80 text-journal leading-relaxed">{step.text}</p>
                        </div>
                      ))}
                      {entry.proTip && (
                        <div className="mt-3 p-3 skeuo-thunder-card skeuo-grain">
                          <p className="text-[11px] text-thunder-orange/90 text-journal">
                            <span className="text-label tracking-wider">⚡ PRO TIP:</span> {entry.proTip}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="inline-block px-4 py-2 skeuo-metal">
          <span className="text-[9px] text-muted-foreground/50 tracking-[0.15em]">TLC FIELD GUIDE · V1.0</span>
        </div>
      </div>
    </section>
  );
}
