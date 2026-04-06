import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, MessageSquare } from 'lucide-react';
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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 skeuo-leather">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center thunder-inset">
            <MessageSquare className="h-4 w-4 text-thunder-orange" />
          </div>
          <div>
            <h3 className="text-label text-sm text-primary-foreground text-journal">TLC <span className="text-thunder-orange">COACH</span></h3>
            <span className="text-[10px] text-primary-foreground/60">
              {isTyping ? 'thinking...' : 'AI-Powered Training Partner'}
            </span>
          </div>
        </div>
        <button onClick={onClear} className="border border-primary-foreground/20 p-2 text-primary-foreground/60 transition-colors hover:text-thunder-orange hover:border-thunder-orange/40 btn-raised" title="Clear chat">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="hide-scrollbar notebook-ruled notebook-margin flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={i === messages.length - 1 ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <ChatMessageBubble message={msg} onQuickReply={onQuickReply} onCanvasAction={onCanvasAction} />
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-2 border border-foreground/12 bg-card px-4 py-3 skeuo-card skeuo-grain">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-thunder-orange animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-thunder-orange animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-thunder-orange animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-[10px] text-muted-foreground text-journal-sm">Coach is thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick replies */}
      {lastMessage?.role === 'coach' && lastMessage.quickReplies && !isTyping && (
        <div className="px-3 pb-1 flex gap-1.5 overflow-x-auto hide-scrollbar">
          {lastMessage.quickReplies.map((qr, i) => (
            <button
              key={i}
              onClick={() => onQuickReply?.(qr.message)}
              className="shrink-0 px-3 py-1.5 text-[11px] border border-thunder-orange/30 text-thunder-orange bg-thunder-orange/5 hover:bg-thunder-orange/15 transition-colors skeuo-card whitespace-nowrap active:scale-95"
            >
              {qr.label}
            </button>
          ))}
        </div>
      )}

      <ChatInput onSend={onSend} />
    </div>
  );
}
