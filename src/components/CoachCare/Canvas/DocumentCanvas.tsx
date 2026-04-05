import { useState } from 'react';
import { FileText, Copy } from 'lucide-react';
import { DocumentCanvasData } from '../types';
import { cn } from '@/lib/utils';

interface DocumentCanvasProps {
  data: DocumentCanvasData;
}

export function DocumentCanvas({ data }: DocumentCanvasProps) {
  const [title, setTitle] = useState(data.title);
  const [content, setContent] = useState(data.content);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  const handleCopy = () => {
    navigator.clipboard.writeText(`# ${title}\n\n${content}`);
  };

  return (
    <div className="flex h-full flex-col p-4">
      {/* Toolbar — leather strip */}
      <div className="mb-3 flex items-center gap-2 skeuo-leather px-3 py-2 rounded-sm">
        <div className="flex h-8 w-8 items-center justify-center surface-inset">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 bg-transparent px-3 py-1.5 font-chalk text-primary-foreground focus:outline-none text-journal"
        />
        <div className="flex border border-primary-foreground/20">
          <button
            onClick={() => setMode('edit')}
            className={cn("px-3 py-1 text-label text-[10px] transition-all", mode === 'edit' ? "skeuo-pressed bg-primary-foreground/20 text-primary-foreground" : "text-primary-foreground/60")}
          >
            EDIT
          </button>
          <button
            onClick={() => setMode('preview')}
            className={cn("px-3 py-1 text-label text-[10px] transition-all", mode === 'preview' ? "skeuo-pressed bg-primary-foreground/20 text-primary-foreground" : "text-primary-foreground/60")}
          >
            PREVIEW
          </button>
        </div>
        <button onClick={handleCopy} className="border border-primary-foreground/20 p-2 text-primary-foreground/60 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground" title="Copy">
          <Copy className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {mode === 'edit' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="notebook-ruled notebook-margin h-full w-full resize-none border border-foreground/10 bg-surface-0 p-4 text-sm text-foreground focus:outline-none text-journal"
            placeholder="Start writing your program..."
          />
        ) : (
          <div className="h-full overflow-y-auto border border-foreground/10 bg-card p-4 notebook-ruled notebook-margin skeuo-grain">
            <div className="prose prose-sm max-w-none">
              <h1 className="font-chalk text-xl text-foreground text-embossed">{title}</h1>
              {content.split('\n').map((line, i) => (
                <p key={i} className="text-sm text-foreground text-journal">{line || '\u00A0'}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
