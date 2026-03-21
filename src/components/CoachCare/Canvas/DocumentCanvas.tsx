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
      {/* Toolbar */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center border border-foreground/10">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border border-foreground/10 bg-surface-0 px-3 py-1.5 font-chalk text-foreground focus:outline-none"
        />
        <div className="flex border border-foreground/10">
          <button
            onClick={() => setMode('edit')}
            className={cn("px-3 py-1 text-label text-[10px] transition-all", mode === 'edit' ? "bg-foreground text-card" : "text-muted-foreground")}
          >
            EDIT
          </button>
          <button
            onClick={() => setMode('preview')}
            className={cn("px-3 py-1 text-label text-[10px] transition-all", mode === 'preview' ? "bg-foreground text-card" : "text-muted-foreground")}
          >
            PREVIEW
          </button>
        </div>
        <button onClick={handleCopy} className="border border-foreground/10 p-2 text-muted-foreground transition-colors hover:bg-foreground hover:text-card" title="Copy">
          <Copy className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {mode === 'edit' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="notebook-ruled h-full w-full resize-none border border-foreground/10 bg-surface-0 p-4 text-sm text-foreground focus:outline-none"
            placeholder="Start writing your program..."
          />
        ) : (
          <div className="h-full overflow-y-auto border border-foreground/10 bg-card p-4">
            <div className="prose prose-sm max-w-none">
              <h1 className="font-chalk text-xl text-foreground">{title}</h1>
              {content.split('\n').map((line, i) => (
                <p key={i} className="text-sm text-foreground">{line || '\u00A0'}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
