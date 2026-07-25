import { useEffect, useMemo, useState } from 'react';
import { Bot, ChevronRight, ClipboardCheck, Dumbbell, Library, MessageSquare, Route, Settings2, Sparkles, X } from 'lucide-react';
import { applyTLCRecommendation, getTLCRecommendation, loadAthleteProfile, type AthleteProfile } from '@/lib/athlete-profile';

interface Props {
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenAssessment: () => void;
}

export function TLCAIGuide({ activeSection, onNavigate, onOpenAssessment }: Props) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<AthleteProfile | null>(() => loadAthleteProfile());

  useEffect(() => {
    const refresh = () => setProfile(loadAthleteProfile());
    window.addEventListener('tlc-profile-updated', refresh as EventListener);
    return () => window.removeEventListener('tlc-profile-updated', refresh as EventListener);
  }, []);

  const recommendation = useMemo(() => profile ? getTLCRecommendation(profile) : null, [profile]);
  const contextLine = activeSection === 'train'
    ? 'I can adjust your starting workout or explain the next movement.'
    : activeSection === 'skills'
      ? 'I can point to the correct current step and explain its readiness check.'
      : activeSection === 'library'
        ? 'I can help you find an exercise that fits your equipment and current ability.'
        : activeSection === 'progress'
          ? 'I can help interpret your training pattern without inventing performance data.'
          : 'I can decide the smallest useful next action from your assessment and progress.';

  const act = (section: string) => {
    if (profile) applyTLCRecommendation(profile);
    onNavigate(section);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(value => !value)}
        className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-4 z-50 flex min-h-12 items-center gap-2 rounded-full border border-border bg-foreground px-4 text-sm font-semibold text-background shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring lg:bottom-5"
        aria-expanded={open}
        aria-label="Open TLC AI guide"
      >
        <Bot className="h-5 w-5" /><span>TLC AI</span>
        {profile && <span className="h-2 w-2 rounded-full bg-success" aria-label="Assessment complete" />}
      </button>

      {open && (
        <aside className="fixed bottom-[calc(9.5rem+env(safe-area-inset-bottom))] right-4 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-border bg-background shadow-lg lg:bottom-20" aria-label="TLC AI guide panel">
          <header className="flex items-start justify-between border-b border-border bg-card p-4">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></div>
              <div><div className="font-chalk text-base text-foreground">TLC AI</div><p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{contextLine}</p></div>
            </div>
            <button onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted" aria-label="Close TLC AI"><X className="h-4 w-4" /></button>
          </header>

          <div className="p-4">
            {!profile ? (
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary"><Sparkles className="h-3.5 w-3.5" /> I need a starting point</div>
                <h3 className="mt-2 font-chalk text-xl text-foreground">Let me learn what you can do.</h3>
                <p className="mt-2 text-sm text-muted-foreground">Answer a short capability assessment and I will configure your workout and learning paths.</p>
                <button onClick={() => { onOpenAssessment(); setOpen(false); }} className="mt-4 flex min-h-11 w-full items-center justify-between rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"><span className="inline-flex items-center gap-2"><ClipboardCheck className="h-4 w-4" /> Start assessment</span><ChevronRight className="h-4 w-4" /></button>
              </div>
            ) : (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">My recommendation</div>
                <h3 className="mt-1 font-chalk text-xl text-foreground">{recommendation?.headline}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{recommendation?.firstAction}</p>
                <div className="mt-4 space-y-2">
                  <button onClick={() => act('train')} className="flex min-h-11 w-full items-center justify-between rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-muted"><span className="inline-flex items-center gap-2"><Dumbbell className="h-4 w-4 text-primary" /> Start my workout</span><ChevronRight className="h-4 w-4" /></button>
                  <button onClick={() => act('skills')} className="flex min-h-11 w-full items-center justify-between rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-muted"><span className="inline-flex items-center gap-2"><Route className="h-4 w-4 text-primary" /> Open my current path</span><ChevronRight className="h-4 w-4" /></button>
                  <button onClick={() => act('library')} className="flex min-h-11 w-full items-center justify-between rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-muted"><span className="inline-flex items-center gap-2"><Library className="h-4 w-4 text-primary" /> Find an exercise</span><ChevronRight className="h-4 w-4" /></button>
                  <button onClick={() => act('coach')} className="flex min-h-11 w-full items-center justify-between rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-muted"><span className="inline-flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> Ask TLC AI a question</span><ChevronRight className="h-4 w-4" /></button>
                </div>
                <button onClick={() => { onOpenAssessment(); setOpen(false); }} className="mt-3 inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"><Settings2 className="h-4 w-4" /> Update my assessment</button>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
}
