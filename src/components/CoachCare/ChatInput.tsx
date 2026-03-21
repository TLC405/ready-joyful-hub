import { useState, KeyboardEvent } from 'react';
import { Send, Video, FileText, Dumbbell, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (text: string) => void;
}

const quickActions = [
  { icon: Video, label: 'Video URL', hint: 'Paste a YouTube/IG link' },
  { icon: FileText, label: 'New Doc', hint: 'Create a program' },
  { icon: Dumbbell, label: 'Exercise', hint: 'Explore exercises' },
  { icon: BarChart3, label: 'Stats', hint: 'View analytics' },
];

export function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-foreground/15 p-3">
      {/* Quick action buttons */}
      <div className="mb-2 flex gap-1">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => setValue(prev => prev + (prev ? ' ' : '') + action.hint)}
              className="flex items-center gap-1.5 border border-foreground/10 px-2 py-1 text-[10px] text-muted-foreground transition-colors hover:bg-foreground hover:text-card"
              title={action.hint}
            >
              <Icon className="h-3 w-3" />
              <span className="hidden sm:inline text-label">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input bar */}
      <div className="flex items-end gap-2 border border-foreground/10 bg-surface-0 px-3 py-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Coach Care anything..."
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          style={{ maxHeight: '120px' }}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim()}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center transition-all",
            value.trim() ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground"
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
