import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Trash2 } from 'lucide-react';
import { ChatMessage as ChatMessageType, CanvasActionHandler } from './types';
import { ChatMessageBubble } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface ChatPanelProps {
  messages: ChatMessageType[];
  onSend: (text: string) => void;
  onClear: () => void;
  isTyping?: boolean;
  onQuickReply?: (message: string) => void;
  onCanvasAction?: CanvasActionHandler;
}

export function ChatPanel({ messages, onSend, onClear, isTyping, onQuickReply, onCanvasAction }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Bot className="h-4 w-4" /></div>
          <div>
            <h3 className="font-chalk text-base text-foreground">TLC AI</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{isTyping ? 'Thinking…' : 'Training guide + app navigator'}</span>
          </div>
        </div>
        <button onClick={onClear} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="Clear TLC AI chat" aria-label="Clear TLC AI chat"><Trash2 className="h-4 w-4" /></button>
      </header>

      <div ref={scrollRef} className="hide-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <motion.div key={msg.id} initial={index === messages.length - 1 ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.7 }}>
            <ChatMessageBubble message={msg} onQuickReply={onQuickReply} onCanvasAction={onCanvasAction} />
          </motion.div>
        ))}

        <AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-start">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
                <div className="flex gap-1"><span className="h-2 w-2 animate-bounce rounded-full bg-primary" /><span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: '150ms' }} /><span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: '300ms' }} /></div>
                <span className="text-xs text-muted-foreground">TLC AI is thinking…</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {lastMessage?.role === 'coach' && lastMessage.quickReplies && !isTyping && (
        <div className="flex gap-2 overflow-x-auto px-3 pb-2 hide-scrollbar">
          {lastMessage.quickReplies.map((reply, index) => (
            <button key={index} onClick={() => onQuickReply?.(reply.message)} className="shrink-0 rounded-full border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition-transform active:scale-95">{reply.label}</button>
          ))}
        </div>
      )}

      <ChatInput onSend={onSend} />
    </div>
  );
}
