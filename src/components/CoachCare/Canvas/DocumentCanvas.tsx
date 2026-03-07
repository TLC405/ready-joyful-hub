import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Copy, Download } from 'lucide-react';
import { DocumentCanvasData } from '../types';

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
        <div className="surface-inset flex h-8 w-8 items-center justify-center rounded-lg">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="surface-inset flex-1 rounded-lg px-3 py-1.5 font-chalk text-foreground focus:outline-none"
        />
        <div className="surface-raised flex rounded-lg p-0.5">
          <button
            onClick={() => setMode('edit')}
            className={`rounded-md px-3 py-1 text-label text-[10px] transition-all ${mode === 'edit' ? 'surface-inset text-primary' : 'text-muted-foreground'}`}
          >
            EDIT
          </button>
          <button
            onClick={() => setMode('preview')}
            className={`rounded-md px-3 py-1 text-label text-[10px] transition-all ${mode === 'preview' ? 'surface-inset text-primary' : 'text-muted-foreground'}`}
          >
            PREVIEW
          </button>
        </div>
        <button onClick={handleCopy} className="btn-raised rounded-lg p-2 text-muted-foreground hover:text-foreground" title="Copy">
          <Copy className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden rounded-xl">
        {mode === 'edit' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="surface-inset h-full w-full resize-none rounded-xl p-4 text-sm text-foreground focus:outline-none"
            placeholder="Start writing your program..."
          />
        ) : (
          <div className="surface-raised h-full overflow-y-auto rounded-xl p-4">
            <div className="prose prose-sm prose-invert max-w-none">
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
