import { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, ClipboardCheck, Dumbbell, Route, Sparkles } from 'lucide-react';
import { ChatPanel } from '@/components/CoachCare/ChatPanel';
import { useChatHistory } from '@/components/CoachCare/hooks/useChatHistory';
import { streamCoachResponse } from '@/components/CoachCare/hooks/useCoachAI';
import { getTLCRecommendation, loadAthleteProfile } from '@/lib/athlete-profile';

interface Props {
  onNavigate: (section: string) => void;
  onOpenAssessment: () => void;
}

export function TLCAIStudio({ onNavigate, onOpenAssessment }: Props) {
  const { messages, addMessage, clearHistory } = useChatHistory();
  const [isTyping, setIsTyping] = useState(false);
  const mountedRef = useRef(true);
  const requestIdRef = useRef<string | null>(null);
  const profile = loadAthleteProfile();
  const recommendation = profile ? getTLCRecommendation(profile) : null;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      requestIdRef.current = null;
    };
  }, []);

  const handleSend = useCallback((text: string) => {
    const cleaned = text.trim();
    if (!cleaned || isTyping) return;

    addMessage({ role: 'user', content: cleaned, type: 'text' });
    setIsTyping(true);

    const recentMessages = messages.slice(-12).map(message => ({
      role: (message.role === 'coach' ? 'assistant' : 'user') as 'assistant' | 'user',
      content: message.content,
    }));
    recentMessages.push({ role: 'user', content: cleaned });

    const messageId = crypto.randomUUID();
    requestIdRef.current = messageId;
    addMessage({ role: 'coach', content: '…', type: 'text', id: messageId });

    let accumulated = '';
    streamCoachResponse({
      messages: recentMessages,
      personality: profile?.coachingStyle,
      onDelta: chunk => {
        if (!mountedRef.current || requestIdRef.current !== messageId) return;
        accumulated += chunk;
        addMessage({ role: 'coach', content: accumulated, type: 'text', id: messageId, replace: true });
      },
      onDone: () => {
        if (!mountedRef.current || requestIdRef.current !== messageId) return;
        requestIdRef.current = null;
        setIsTyping(false);
      },
      onError: () => {
        if (!mountedRef.current || requestIdRef.current !== messageId) return;
        if (!accumulated) addMessage({ role: 'coach', content: 'I could not connect right now. Your assessment and saved app state are still intact. Try again in a moment.', type: 'text', id: messageId, replace: true });
        requestIdRef.current = null;
        setIsTyping(false);
      },
    });
  }, [addMessage, isTyping, messages, profile?.coachingStyle]);

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-6xl flex-col px-4 py-5 lg:px-8">
      <div className="mb-4 rounded-2xl border border-primary/25 bg-primary/5 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary"><Sparkles className="h-3.5 w-3.5" /> TLC AI knows your route</div>
              <h1 className="mt-1 font-chalk text-xl text-foreground">{recommendation?.headline || 'Complete your assessment for personalized guidance'}</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{recommendation?.firstAction || 'I can still answer general questions, but your capability assessment lets me recommend the correct workout and progression path.'}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onNavigate('train')} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-semibold hover:bg-muted"><Dumbbell className="h-4 w-4 text-primary" /> Train</button>
            <button onClick={() => onNavigate('skills')} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-semibold hover:bg-muted"><Route className="h-4 w-4 text-primary" /> My path</button>
            <button onClick={onOpenAssessment} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground"><ClipboardCheck className="h-4 w-4" /> {profile ? 'Update assessment' : 'Start assessment'}</button>
          </div>
        </div>
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto hide-scrollbar">
        {[
          ['What should I train today?', 'Use my assessment and current app state. What is the single best thing for me to train today, and which app screen should I open?'],
          ['Explain my current path', 'Explain my current learning path, what step I am on, and the readiness check in simple language.'],
          ['Build a short session', 'Build a session that fits my saved equipment and available time. Use real exercises in CONTROL TLC.'],
          ['Help with a limitation', 'Use my saved limitation or pain flags and suggest safer training modifications without diagnosing me.'],
        ].map(([label, prompt]) => <button key={label} onClick={() => handleSend(prompt)} disabled={isTyping} className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold hover:border-primary/40 hover:bg-muted disabled:opacity-40">{label}</button>)}
      </div>

      <div className="min-h-[34rem] flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <ChatPanel messages={messages} onSend={handleSend} onClear={clearHistory} isTyping={isTyping} onQuickReply={handleSend} />
      </div>
    </section>
  );
}
