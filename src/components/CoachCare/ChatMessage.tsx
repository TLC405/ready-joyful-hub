import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Dumbbell, FileText, BarChart3, ChevronRight, ThumbsUp, ThumbsDown, Play, Globe } from 'lucide-react';
import { ChatMessage, CanvasActionHandler } from './types';
import { cn } from '@/lib/utils';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onQuickReply?: (message: string) => void;
  onCanvasAction?: CanvasActionHandler;
}

const typeIcons: Record<string, React.ElementType> = {
  'video-card': Video,
  'exercise-card': Dumbbell,
  'template-preview': FileText,
  'chart': BarChart3,
  'social-search': Globe,
};

const typeLabels: Record<string, string> = {
  'video-card': 'VIDEO ANALYSIS',
  'exercise-card': 'EXERCISE',
  'template-preview': 'TEMPLATE',
  'chart': 'ANALYTICS',
  'social-search': 'SOCIAL SEARCH',
};

export function ChatMessageBubble({ message, onQuickReply, onCanvasAction }: ChatMessageBubbleProps) {
  const isCoach = message.role === 'coach';
  const Icon = typeIcons[message.type];
  const [reaction, setReaction] = useState<'up' | 'down' | null>(null);

  const handleReaction = (type: 'up' | 'down') => {
    const newReaction = reaction === type ? null : type;
    setReaction(newReaction);
    try {
      const reactions = JSON.parse(localStorage.getItem('tlc-coach-reactions') || '[]');
      reactions.push({ messageId: message.id, reaction: newReaction, timestamp: Date.now() });
      localStorage.setItem('tlc-coach-reactions', JSON.stringify(reactions.slice(-100)));
    } catch {}
  };

  const handleCanvasClick = () => {
    if (message.canvasAction && onCanvasAction) {
      onCanvasAction(message.canvasAction.mode, message.canvasAction.data);
    }
  };

  return (
    <div className={cn("flex", isCoach ? "justify-start" : "justify-end")}>
      <div className={cn(
        "max-w-[85%] px-4 py-3 text-sm leading-relaxed text-journal",
        isCoach
          ? "border border-foreground/12 bg-card text-foreground skeuo-card skeuo-grain"
          : "bg-primary text-primary-foreground skeuo-pressed",
      )}>
        {message.type !== 'text' && Icon && (
          <div className={cn(
            "mb-2 flex items-center gap-2 border-l-2 pl-2 text-label text-[10px] text-journal-sm",
            isCoach ? "border-thunder-orange text-thunder-orange" : "border-primary-foreground/40 text-primary-foreground/70"
          )}>
            <Icon className="h-3.5 w-3.5" />
            {typeLabels[message.type]}
          </div>
        )}

        {/* Exercise inline card */}
        {message.exerciseRef && isCoach && (
          <button onClick={handleCanvasClick}
            className="mb-2 w-full flex items-center gap-3 border border-foreground/10 bg-surface-0 p-2 skeuo-card hover:border-thunder-orange/40 transition-colors cursor-pointer text-left">
            <div className="flex h-10 w-10 items-center justify-center thunder-inset">
              <Dumbbell className="h-5 w-5 text-thunder-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-chalk text-sm text-foreground truncate">{message.exerciseRef.name}</p>
              <span className={cn("text-[9px] text-label px-1.5 py-0",
                message.exerciseRef.difficulty === 'beginner' && 'text-emerald-600',
                message.exerciseRef.difficulty === 'intermediate' && 'text-thunder-blue',
                message.exerciseRef.difficulty === 'advanced' && 'text-thunder-orange',
                message.exerciseRef.difficulty === 'master' && 'text-primary',
              )}>
                {message.exerciseRef.difficulty.toUpperCase()}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-thunder-orange/50" />
          </button>
        )}

        <p className="whitespace-pre-wrap">{message.content}</p>

        {message.canvasAction && (
          <motion.button
            whileHover={{ x: 3 }}
            onClick={handleCanvasClick}
            className={cn(
              "mt-2 flex items-center gap-1 text-label text-[10px] cursor-pointer hover:underline",
              isCoach ? "text-thunder-orange" : "text-primary-foreground/80"
            )}
          >
            OPEN ON CANVAS <ChevronRight className="h-3 w-3" />
          </motion.button>
        )}

        <div className="mt-1 flex items-center justify-between">
          <span className={cn(
            "text-[10px] text-journal-sm",
            isCoach ? "text-muted-foreground" : "text-primary-foreground/50"
          )}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          {isCoach && (
            <div className="flex gap-1">
              <button onClick={() => handleReaction('up')}
                className={cn("p-1 transition-colors", reaction === 'up' ? 'text-thunder-orange' : 'text-muted-foreground/40 hover:text-muted-foreground')}>
                <ThumbsUp className="h-3 w-3" />
              </button>
              <button onClick={() => handleReaction('down')}
                className={cn("p-1 transition-colors", reaction === 'down' ? 'text-primary' : 'text-muted-foreground/40 hover:text-muted-foreground')}>
                <ThumbsDown className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
