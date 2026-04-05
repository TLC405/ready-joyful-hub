import { useState, KeyboardEvent, useRef } from 'react';
import { Send, Video, FileText, Dumbbell, BarChart3, Globe, Mic, MicOff, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (text: string) => void;
}

const quickActions = [
  { icon: Video, label: 'Video', hint: 'Paste a YouTube/IG link' },
  { icon: FileText, label: 'Program', hint: 'Write me a training program' },
  { icon: Dumbbell, label: 'Exercise', hint: 'Show me planche lean' },
  { icon: BarChart3, label: 'Stats', hint: 'Show my training stats' },
  { icon: Globe, label: 'Search', hint: 'Find videos of handstand' },
];

export function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

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

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      onSend("Voice input isn't supported in this browser.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setValue(prev => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <div className="border-t border-foreground/15 p-3 skeuo-grain">
      {/* Quick action buttons */}
      <div className="mb-2 flex gap-1 overflow-x-auto hide-scrollbar">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => onSend(action.hint)}
              className="flex shrink-0 items-center gap-1.5 px-2 py-1 text-[10px] text-muted-foreground transition-colors skeuo-card bg-card border border-foreground/10 hover:border-thunder-orange/40 hover:text-thunder-orange active:scale-95"
              title={action.hint}
            >
              <Icon className="h-3 w-3" />
              <span className="text-label text-journal-sm">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input bar */}
      <div className="flex items-end gap-2 thunder-inset px-3 py-2">
        {/* Voice button */}
        <button
          onClick={toggleVoice}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center transition-all",
            isListening ? "text-thunder-orange animate-pulse" : "text-muted-foreground hover:text-foreground"
          )}
          title="Voice input"
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : "Ask Coach Care anything..."}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none text-journal"
          style={{ maxHeight: '120px' }}
        />

        <button
          onClick={handleSend}
          disabled={!value.trim()}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center transition-all active:scale-95",
            value.trim() ? "btn-thunder" : "bg-surface-2 text-muted-foreground"
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
