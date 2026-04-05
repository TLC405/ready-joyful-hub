import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Play, ArrowRight } from 'lucide-react';
import { exercises } from '@/lib/exercises';
import { cn } from '@/lib/utils';

const difficultyBadge: Record<string, string> = {
  easy: 'difficulty-easy',
  beginner: 'difficulty-beginner',
  intermediate: 'difficulty-intermediate',
  advanced: 'difficulty-advanced',
  master: 'difficulty-master',
};

interface CommandSearchProps {
  open: boolean;
  onClose: () => void;
}

export function CommandSearch({ open, onClose }: CommandSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return exercises.slice(0, 8);
    return exercises
      .filter(e => e.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (id: string) => {
    navigate(`/video/${id}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex].id);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-lg border-2 border-foreground bg-card shadow-2xl skeuo-card skeuo-grain"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b-2 border-foreground px-4 py-3 surface-inset">
          <Search className="h-5 w-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search exercises... (Esc to close)"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-chalk text-journal"
          />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto notebook-ruled">
          {results.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground text-journal">No exercises found</div>
          ) : (
            results.map((ex, i) => (
              <button
                key={ex.id}
                onClick={() => handleSelect(ex.id)}
                className={cn(
                  "notebook-entry flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                  i === selectedIndex ? "bg-primary/10" : "hover:bg-surface-0"
                )}
              >
                <span className={cn("shrink-0 border px-1.5 py-0 text-label text-[8px] skeuo-metal", difficultyBadge[ex.difficulty])}>
                  {ex.difficulty.toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-chalk text-sm truncate text-foreground text-journal">{ex.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate text-journal-sm">{ex.category} · {ex.tracks.slice(0, 2).join(', ')}</p>
                </div>
                {(ex.videoUrl || ex.videoSources?.length) ? (
                  <Play className="h-3.5 w-3.5 text-primary shrink-0" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-foreground/10 px-4 py-2 skeuo-leather">
          <span className="text-[10px] text-primary-foreground/70">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-primary-foreground/70">
            <kbd className="skeuo-metal px-1.5 py-0.5 text-[9px]">↑↓</kbd>
            <span>navigate</span>
            <kbd className="skeuo-metal px-1.5 py-0.5 text-[9px]">↵</kbd>
            <span>select</span>
          </div>
        </div>
      </div>
    </div>
  );
}
