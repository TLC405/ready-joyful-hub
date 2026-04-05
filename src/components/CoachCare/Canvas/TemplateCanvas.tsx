import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, GripVertical, Save, Search, Clock, Copy, Link2 } from 'lucide-react';
import { TemplateCanvasData, TemplateBlock } from '../types';
import { exercises } from '@/lib/exercises';
import { cn } from '@/lib/utils';

interface TemplateCanvasProps {
  data: TemplateCanvasData;
}

function estimateDuration(blocks: TemplateBlock[]): string {
  let totalSec = 0;
  blocks.forEach(b => {
    const sets = parseInt(b.sets) || 3;
    const reps = parseInt(b.reps) || 10;
    const rest = parseInt(b.rest) || 60;
    totalSec += sets * (reps * 3 + rest); // rough: 3s per rep + rest
  });
  return `~${Math.round(totalSec / 60)} min`;
}

export function TemplateCanvas({ data }: TemplateCanvasProps) {
  const [blocks, setBlocks] = useState<TemplateBlock[]>(data.template.blocks);
  const [name, setName] = useState(data.template.name);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [saved, setSaved] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    return exercises.filter(e =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8);
  }, [searchQuery]);

  const duration = estimateDuration(blocks);

  const addBlock = (exerciseId?: string, exerciseName?: string) => {
    setBlocks(prev => [...prev, {
      id: crypto.randomUUID(),
      exerciseId: exerciseId || '',
      exerciseName: exerciseName || 'New Exercise',
      sets: '3',
      reps: '8-12',
      rest: '60s',
      notes: '',
    }]);
    setShowSearch(false);
    setSearchQuery('');
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const updateBlock = (id: string, field: keyof TemplateBlock, value: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const saveTemplate = () => {
    const template = {
      ...data.template,
      name,
      blocks,
      lastModified: new Date().toISOString(),
    };
    const savedTemplates = JSON.parse(localStorage.getItem('tlc-templates') || '[]');
    const idx = savedTemplates.findIndex((t: any) => t.id === template.id);
    if (idx >= 0) savedTemplates[idx] = template;
    else savedTemplates.push(template);
    localStorage.setItem('tlc-templates', JSON.stringify(savedTemplates));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const copyAsText = () => {
    const text = `${name}\n${'─'.repeat(30)}\n${blocks.map((b, i) =>
      `${i + 1}. ${b.exerciseName} — ${b.sets} × ${b.reps} (rest: ${b.rest})`
    ).join('\n')}\n\nEstimated duration: ${duration}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="hide-scrollbar flex h-full flex-col overflow-y-auto p-4 notebook-ruled">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 surface-inset px-3 py-2 font-chalk text-lg text-foreground focus:border-thunder-orange focus:outline-none text-journal-lg"
        />
        <div className="flex gap-1">
          <button onClick={copyAsText} className="flex items-center gap-1 border border-foreground/10 px-3 py-2 text-label text-[10px] text-muted-foreground hover:text-thunder-orange btn-raised" title="Copy as text">
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button onClick={saveTemplate}
            className={cn("flex items-center gap-2 px-4 py-2 text-label text-sm text-primary-foreground btn-raised text-journal transition-all active:scale-95",
              saved ? "bg-emerald-600" : "btn-thunder"
            )}>
            <Save className="h-4 w-4" /> {saved ? 'SAVED ✓' : 'SAVE'}
          </button>
        </div>
      </div>

      {/* Duration estimate */}
      <div className="mb-3 flex items-center gap-2 text-[11px] text-muted-foreground text-journal-sm">
        <Clock className="h-3.5 w-3.5" />
        <span>{blocks.length} exercises · {duration}</span>
      </div>

      {/* Blocks */}
      <div className="flex-1 space-y-0">
        {blocks.map((block, i) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="notebook-entry flex items-center gap-3"
          >
            <div className="surface-inset p-1">
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
            </div>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center skeuo-metal text-label text-xs">
              {i + 1}
            </span>
            {block.supersetGroup && (
              <div className="absolute left-14 w-0.5 h-full bg-thunder-orange/30" />
            )}
            <div className="grid min-w-0 flex-1 grid-cols-4 gap-2">
              <input
                value={block.exerciseName}
                onChange={(e) => updateBlock(block.id, 'exerciseName', e.target.value)}
                className="col-span-2 surface-inset px-2 py-1 text-sm focus:outline-none text-journal"
                placeholder="Exercise"
              />
              <input
                value={block.sets}
                onChange={(e) => updateBlock(block.id, 'sets', e.target.value)}
                className="surface-inset px-2 py-1 text-center text-sm focus:outline-none text-journal"
                placeholder="Sets"
              />
              <input
                value={block.reps}
                onChange={(e) => updateBlock(block.id, 'reps', e.target.value)}
                className="surface-inset px-2 py-1 text-center text-sm focus:outline-none text-journal"
                placeholder="Reps"
              />
            </div>
            <button onClick={() => removeBlock(block.id)} className="shrink-0 text-muted-foreground hover:text-primary active:scale-95">
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Exercise search for adding */}
      {showSearch && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          className="mt-2 border border-foreground/10 bg-card p-3 skeuo-thunder-card skeuo-grain">
          <div className="flex items-center gap-2 surface-inset px-2 py-1 mb-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search exercises..."
              className="flex-1 bg-transparent text-sm text-foreground focus:outline-none text-journal"
              autoFocus
            />
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {searchResults.map(ex => (
              <button key={ex.id} onClick={() => addBlock(ex.id, ex.name)}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-surface-0 transition-colors flex items-center justify-between text-journal">
                <span className="font-chalk">{ex.name}</span>
                <span className="text-[9px] text-muted-foreground">{ex.difficulty}</span>
              </button>
            ))}
            {searchQuery && searchResults.length === 0 && (
              <p className="text-[11px] text-muted-foreground px-3 py-2 text-journal-sm">No exercises found</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Add block */}
      <div className="mt-3 flex gap-2">
        <button onClick={() => setShowSearch(!showSearch)}
          className="flex flex-1 items-center justify-center gap-2 border border-foreground/10 p-3 text-muted-foreground transition-colors btn-raised text-journal hover:border-thunder-orange/30 active:scale-[0.98]">
          <Search className="h-4 w-4" />
          <span className="text-label text-xs">SEARCH & ADD</span>
        </button>
        <button onClick={() => addBlock()}
          className="flex flex-1 items-center justify-center gap-2 border border-foreground/10 p-3 text-muted-foreground transition-colors btn-raised text-journal hover:border-thunder-orange/30 active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          <span className="text-label text-xs">ADD BLANK</span>
        </button>
      </div>
    </div>
  );
}
