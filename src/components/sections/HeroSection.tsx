import { exercises } from '@/lib/exercises';
import { exerciseThumbnail } from '@/lib/video-thumbnail';
import { useMemo } from 'react';
import { Play, ArrowUpRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WorkoutCalendar } from '@/components/workout/WorkoutCalendar';
import { useAdmin } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
interface HeroSectionProps { onCategoryClick?: (category: string) => void; onNavigate?: (section: string) => void; }
export function HeroSection({ onNavigate }: HeroSectionProps) {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const featured = useMemo(() => exercises.map(ex => ({ ex, thumb: exerciseThumbnail(ex) })).filter((t): t is { ex: (typeof exercises)[number]; thumb: string } => Boolean(t.thumb)).slice(0, 8), []);
  return <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-10">
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-border/15 pb-6">
      <div className="min-w-0"><p className="mb-2 text-xs font-semibold text-thunder-blue">TLC CALISTHENICS · EST. 2026</p><h1 className="font-chalk text-3xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">Superhuman<span className="text-thunder-orange">.</span></h1><p className="mt-2 text-sm text-muted-foreground">Training for the hybrid athlete.</p></div>
      <div className="flex gap-2"><Button variant="outline" onClick={() => onNavigate?.('coach')}>TLC Coach<ArrowUpRight /></Button>{isAdmin && <Button variant="ghost" size="icon" onClick={() => navigate('/admin')} aria-label="Admin dashboard" title="Admin" className="text-thunder-orange"><Shield /></Button>}</div>
    </header>
    <section aria-label="Training journal" className="mb-10"><WorkoutCalendar /></section>
    <section aria-label="Featured skills">
      <div className="mb-5 flex items-center justify-between gap-3"><div><p className="mb-1 text-xs font-semibold text-thunder-blue">THE MOVEMENT LIBRARY</p><h2 className="font-chalk text-2xl">Build your next skill.</h2></div><Button variant="ghost" size="icon" onClick={() => onNavigate?.('library')} aria-label="View all skills" title="View all skills"><ArrowUpRight /></Button></div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4">
        {featured.map(({ ex, thumb }) => <Button key={ex.id} variant="ghost" onClick={() => navigate(`/video/${ex.id}`)} className="group h-auto min-w-0 flex-col items-stretch gap-0 overflow-hidden whitespace-normal rounded-lg p-0 text-left hover:bg-transparent" aria-label={`Open ${ex.name}`}>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/10 bg-media"><img src={thumb} alt={ex.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /><span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-media/80 text-media-foreground"><Play fill="currentColor" className="!h-3 !w-3" /></span></div>
          <div className="w-full pt-3"><p className="mb-1 text-[11px] capitalize text-thunder-blue">{ex.category} · {ex.difficulty}</p><h3 className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">{ex.name}</h3></div>
        </Button>)}
      </div>
    </section>
  </div>;
}
