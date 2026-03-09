import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { TemplateCanvasData, TemplateBlock } from '../types';

interface TemplateCanvasProps {
  data: TemplateCanvasData;
}

export function TemplateCanvas({ data }: TemplateCanvasProps) {
  const [blocks, setBlocks] = useState<TemplateBlock[]>(data.template.blocks);
  const [name, setName] = useState(data.template.name);

  const addBlock = () => {
    setBlocks(prev => [...prev, {
      id: crypto.randomUUID(),
      exerciseId: '',
      exerciseName: 'New Exercise',
      sets: '3',
      reps: '8-12',
      rest: '60s',
      notes: '',
    }]);
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
    const saved = JSON.parse(localStorage.getItem('tlc-templates') || '[]');
    const idx = saved.findIndex((t: any) => t.id === template.id);
    if (idx >= 0) saved[idx] = template;
    else saved.push(template);
    localStorage.setItem('tlc-templates', JSON.stringify(saved));
  };

  return (
    <div className="hide-scrollbar flex h-full flex-col overflow-y-auto p-4">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="surface-inset flex-1 rounded-lg px-3 py-2 font-chalk text-lg text-foreground focus:outline-none"
        />
        <button onClick={saveTemplate} className="btn-raised flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground">
          <Save className="h-4 w-4" /> Save
        </button>
      </div>

      {/* Blocks */}
      <div className="flex-1 space-y-2">
        {blocks.map((block, i) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="surface-raised flex items-center gap-3 rounded-xl p-3"
          >
            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
            <span className="badge-coin flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-label text-xs">
              {i + 1}
            </span>
            <div className="grid min-w-0 flex-1 grid-cols-4 gap-2">
              <input
                value={block.exerciseName}
                onChange={(e) => updateBlock(block.id, 'exerciseName', e.target.value)}
                className="surface-inset col-span-2 rounded px-2 py-1 text-sm focus:outline-none"
                placeholder="Exercise"
              />
              <input
                value={block.sets}
                onChange={(e) => updateBlock(block.id, 'sets', e.target.value)}
                className="surface-inset rounded px-2 py-1 text-sm text-center focus:outline-none"
                placeholder="Sets"
              />
              <input
                value={block.reps}
                onChange={(e) => updateBlock(block.id, 'reps', e.target.value)}
                className="surface-inset rounded px-2 py-1 text-sm text-center focus:outline-none"
                placeholder="Reps"
              />
            </div>
            <button onClick={() => removeBlock(block.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Add block */}
      <button onClick={addBlock} className="btn-raised mt-3 flex w-full items-center justify-center gap-2 rounded-xl p-3 text-muted-foreground hover:text-foreground">
        <Plus className="h-4 w-4" />
        <span className="text-label text-xs">ADD EXERCISE</span>
      </button>
    </div>
  );
}
