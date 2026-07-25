import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Bot, Check, ShieldAlert, Sparkles, X } from 'lucide-react';
import {
  applyTLCRecommendation,
  capabilityOptions,
  getTLCRecommendation,
  loadAthleteProfile,
  saveAthleteProfile,
  type AthleteProfile,
  type CapabilityBand,
  type SessionMinutes,
  type TrainingGoal,
} from '@/lib/athlete-profile';
import { cn } from '@/lib/utils';

type Draft = Omit<AthleteProfile, 'version' | 'completedAt'>;

interface Props {
  open: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
}

const goals: { id: TrainingGoal; label: string }[] = [
  { id: 'general', label: 'Build my foundation' }, { id: 'pull-up', label: 'First pull-up' },
  { id: 'handstand', label: 'Handstand' }, { id: 'l-sit', label: 'L-sit' },
  { id: 'pistol', label: 'Pistol squat' }, { id: 'front-lever', label: 'Front lever' },
  { id: 'planche', label: 'Planche' }, { id: 'rings', label: 'Rings / muscle-up' },
  { id: 'human-flag', label: 'Human flag' }, { id: 'mobility-splits', label: 'Mobility and splits' },
];
const equipment = [
  ['floor','Floor space'], ['wall','Wall'], ['chair','Chair / bench'], ['pull-up-bar','Pull-up bar'],
  ['rings','Rings'], ['parallettes','Parallettes'], ['resistance-band','Resistance band'], ['vertical-pole','Vertical pole / stall bars'],
] as const;
const painAreas = ['Wrists', 'Elbows', 'Shoulders', 'Back', 'Hips', 'Knees', 'Ankles / feet'];

function defaultDraft(): Draft {
  const saved = loadAthleteProfile();
  if (saved) {
    const { version: _version, completedAt: _completedAt, ...draft } = saved;
    return draft;
  }
  return {
    experience: 'new', pushUps: 'starting', rows: 'none', pullUps: 'none', squatControl: 'starting',
    hollowHold: 'starting', wallHandstand: 'none', mobility: 'starting', daysPerWeek: 3,
    sessionMinutes: 30, equipment: ['floor', 'wall', 'chair'], goals: ['general'], painAreas: [], coachingStyle: 'supportive',
  };
}

function Choice({ selected, children, onClick }: { selected: boolean; children: ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={cn('flex min-h-12 items-center justify-between rounded-xl border px-4 text-left text-sm font-semibold transition-colors', selected ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground')}>{children}{selected && <Check className="h-4 w-4 text-primary" />}</button>;
}

function Capacity({ label, value, onChange }: { label: string; value: CapabilityBand; onChange: (value: CapabilityBand) => void }) {
  return <label className="rounded-xl border border-border bg-card p-3"><span className="text-sm font-semibold text-foreground">{label}</span><select value={value} onChange={event => onChange(event.target.value as CapabilityBand)} className="mt-2 min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring">{capabilityOptions.map(option => <option key={option.value} value={option.value}>{option.label} — {option.hint}</option>)}</select></label>;
}

export function TLCAIAssessmentFlow({ open, onClose, onNavigate }: Props) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(defaultDraft);
  const [savedProfile, setSavedProfile] = useState<AthleteProfile | null>(null);
  const recommendation = useMemo(() => savedProfile ? getTLCRecommendation(savedProfile) : null, [savedProfile]);

  useEffect(() => {
    if (!open) return;
    const existing = loadAthleteProfile();
    setDraft(defaultDraft());
    setSavedProfile(null);
    setStep(existing ? 1 : 0);
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const toggle = (values: string[], value: string) => values.includes(value) ? values.filter(item => item !== value) : [...values, value];
  const finish = () => {
    const profile: AthleteProfile = { version: 1, completedAt: new Date().toISOString(), ...draft };
    saveAthleteProfile(profile);
    applyTLCRecommendation(profile);
    setSavedProfile(profile);
    setStep(5);
  };
  const go = (section: string) => { onNavigate(section); onClose(); };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-foreground/55 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="TLC AI capability assessment">
      <div className="max-h-[94dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-border bg-background shadow-lg sm:rounded-3xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></div><div><div className="font-chalk text-base">TLC AI</div><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Capability assessment</div></div></div>
          <button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-xl border border-border hover:bg-muted" aria-label="Close assessment"><X className="h-5 w-5" /></button>
        </header>

        <div className="px-4 py-5 sm:px-6 sm:py-7">
          {step < 5 && <div className="mb-6 flex gap-1.5" aria-label={`Step ${step + 1} of 5`}>{[0,1,2,3,4].map(index => <div key={index} className={cn('h-1.5 flex-1 rounded-full', index <= step ? 'bg-primary' : 'bg-muted')} />)}</div>}

          {step === 0 && <section><div className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">Meet your in-app guide</div><h2 className="mt-2 font-chalk text-3xl sm:text-4xl">Let TLC AI find your real starting point.</h2><p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">This is not pass/fail. Your answers choose a usable workout and learning path without forcing advanced skills before their foundations.</p><div className="mt-5 grid gap-3 sm:grid-cols-3">{['About 2 minutes','No fake level score','Change answers anytime'].map(text => <div key={text} className="rounded-xl border border-border bg-card p-4 text-sm font-semibold shadow-sm">{text}</div>)}</div></section>}

          {step === 1 && <section><h2 className="font-chalk text-2xl">What describes you and your goals?</h2><h3 className="mt-5 text-sm font-semibold">Current experience</h3><div className="mt-2 grid gap-2 sm:grid-cols-4">{(['new','beginner','intermediate','advanced'] as const).map(level => <Choice key={level} selected={draft.experience === level} onClick={() => setDraft(prev => ({ ...prev, experience: level }))}>{level[0].toUpperCase() + level.slice(1)}</Choice>)}</div><h3 className="mt-6 text-sm font-semibold">Choose up to three goals</h3><div className="mt-2 grid gap-2 sm:grid-cols-2">{goals.map(goal => <Choice key={goal.id} selected={draft.goals.includes(goal.id)} onClick={() => setDraft(prev => ({ ...prev, goals: prev.goals.includes(goal.id) ? prev.goals.filter(item => item !== goal.id) : prev.goals.length < 3 ? [...prev.goals, goal.id] : prev.goals }))}>{goal.label}</Choice>)}</div></section>}

          {step === 2 && <section><h2 className="font-chalk text-2xl">What can you do with clean form today?</h2><p className="mt-2 text-sm text-muted-foreground">Choose the closest honest answer. “Not yet” is useful data.</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><Capacity label="Push-ups at your best usable height" value={draft.pushUps} onChange={value => setDraft(prev => ({ ...prev, pushUps: value }))} /><Capacity label="Body rows or ring rows" value={draft.rows} onChange={value => setDraft(prev => ({ ...prev, rows: value }))} /><Capacity label="Strict pull-ups" value={draft.pullUps} onChange={value => setDraft(prev => ({ ...prev, pullUps: value }))} /><Capacity label="Controlled squat" value={draft.squatControl} onChange={value => setDraft(prev => ({ ...prev, squatControl: value }))} /><Capacity label="Hollow-body or tucked-core hold" value={draft.hollowHold} onChange={value => setDraft(prev => ({ ...prev, hollowHold: value }))} /><Capacity label="Wall handstand" value={draft.wallHandstand} onChange={value => setDraft(prev => ({ ...prev, wallHandstand: value }))} /><Capacity label="General mobility" value={draft.mobility} onChange={value => setDraft(prev => ({ ...prev, mobility: value }))} /></div></section>}

          {step === 3 && <section><h2 className="font-chalk text-2xl">What can your real week support?</h2><div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="rounded-xl border border-border bg-card p-4"><span className="text-sm font-semibold">Training days each week</span><input type="range" min="2" max="6" value={draft.daysPerWeek} onChange={event => setDraft(prev => ({ ...prev, daysPerWeek: Number(event.target.value) }))} className="mt-4 w-full" /><div className="mt-2 font-mono text-xl tabular-nums">{draft.daysPerWeek} days</div></label><div className="rounded-xl border border-border bg-card p-4"><div className="text-sm font-semibold">Minutes per session</div><div className="mt-3 grid grid-cols-4 gap-2">{([20,30,45,60] as SessionMinutes[]).map(minutes => <button key={minutes} onClick={() => setDraft(prev => ({ ...prev, sessionMinutes: minutes }))} className={cn('min-h-11 rounded-lg border font-mono text-sm', draft.sessionMinutes === minutes ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background')}>{minutes}</button>)}</div></div></div><h3 className="mt-6 font-chalk text-lg">Equipment available most weeks</h3><div className="mt-3 grid gap-2 sm:grid-cols-2">{equipment.map(([id,label]) => <Choice key={id} selected={draft.equipment.includes(id)} onClick={() => setDraft(prev => ({ ...prev, equipment: toggle(prev.equipment, id) }))}>{label}</Choice>)}</div></section>}

          {step === 4 && <section><h2 className="font-chalk text-2xl">Anything TLC AI should protect or adapt?</h2><div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-muted-foreground"><div className="flex gap-2 font-semibold text-foreground"><ShieldAlert className="h-4 w-4 text-amber-600" /> This does not diagnose injuries.</div><p className="mt-1">It changes suggestions and flags when persistent or worsening symptoms need qualified care.</p></div><div className="mt-4 grid gap-2 sm:grid-cols-2">{painAreas.map(area => <Choice key={area} selected={draft.painAreas.includes(area)} onClick={() => setDraft(prev => ({ ...prev, painAreas: toggle(prev.painAreas, area) }))}>{area}</Choice>)}</div><h3 className="mt-6 font-chalk text-lg">How should TLC AI coach you?</h3><div className="mt-3 grid gap-2 sm:grid-cols-3">{(['supportive','direct','technical'] as const).map(style => <Choice key={style} selected={draft.coachingStyle === style} onClick={() => setDraft(prev => ({ ...prev, coachingStyle: style }))}>{style[0].toUpperCase() + style.slice(1)}</Choice>)}</div></section>}

          {step === 5 && recommendation && <section><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Sparkles className="h-6 w-6" /></div><div className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">TLC AI recommendation</div><h2 className="mt-2 font-chalk text-3xl">{recommendation.headline}</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{recommendation.reason}</p><div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Your first move</div><p className="mt-2 font-semibold">{recommendation.firstAction}</p><div className="mt-4 flex flex-wrap gap-2">{recommendation.pathIds.map(id => <span key={id} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{id.replaceAll('-', ' ')}</span>)}</div></div>{recommendation.caution && <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-muted-foreground">{recommendation.caution}</div>}<div className="mt-5 grid gap-2 sm:grid-cols-2"><button onClick={() => go('train')} className="min-h-12 rounded-xl bg-primary px-4 font-semibold text-primary-foreground shadow-sm">Start recommended workout</button><button onClick={() => go('skills')} className="min-h-12 rounded-xl border border-border bg-card px-4 font-semibold">Open my learning path</button></div></section>}
        </div>

        {step < 5 && <footer className="sticky bottom-0 flex items-center justify-between border-t border-border bg-background/95 px-4 py-3 backdrop-blur sm:px-6"><button onClick={() => step === 0 ? onClose() : setStep(value => value - 1)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold hover:bg-muted">{step > 0 && <ArrowLeft className="h-4 w-4" />}{step === 0 ? 'Not now' : 'Back'}</button><button onClick={() => step === 4 ? finish() : setStep(value => value + 1)} disabled={step === 1 && draft.goals.length === 0} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm disabled:cursor-not-allowed disabled:opacity-40">{step === 4 ? 'Build my route' : 'Continue'}<ArrowRight className="h-4 w-4" /></button></footer>}
      </div>
    </div>
  );
}
