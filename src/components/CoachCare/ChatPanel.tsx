import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, MessageSquare } from 'lucide-react';
import { ChatMessage as ChatMessageType } from './types';
import { ChatMessageBubble } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface ChatPanelProps {
  messages: ChatMessageType[];
  onSend: (text: string) => void;
  onClear: () => void;
}

export function ChatPanel({ messages, onSend, onClear }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-foreground/15 bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center border border-foreground/15">
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-label text-sm text-foreground">COACH CARE</h3>
            <span className="text-[10px] text-muted-foreground">AI Training Partner</span>
          </div>
        </div>
        <button onClick={onClear} className="border border-foreground/10 p-2 text-muted-foreground transition-colors hover:bg-foreground hover:text-card" title="Clear chat">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Messages — notebook ruled background */}
      <div ref={scrollRef} className="hide-scrollbar notebook-ruled notebook-margin flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={i === messages.length - 1 ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <ChatMessageBubble message={msg} />
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <ChatInput onSend={onSend} />
    </div>
  );
}
