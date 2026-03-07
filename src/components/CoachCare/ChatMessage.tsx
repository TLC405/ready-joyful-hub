import { motion } from 'framer-motion';
import { Video, Dumbbell, FileText, BarChart3, ChevronRight } from 'lucide-react';
import { ChatMessage } from './types';
import { cn } from '@/lib/utils';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

const typeIcons: Record<string, React.ElementType> = {
  'video-card': Video,
  'exercise-card': Dumbbell,
  'template-preview': FileText,
  'chart': BarChart3,
};

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isCoach = message.role === 'coach';
  const Icon = typeIcons[message.type];

  return (
    <div className={cn("flex", isCoach ? "justify-start" : "justify-end")}>
      <div className={cn(
        "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
        isCoach 
          ? "surface-raised text-foreground" 
          : "bg-primary text-primary-foreground",
        isCoach && "rounded-tl-sm",
        !isCoach && "rounded-tr-sm"
      )}>
        {message.type !== 'text' && Icon && (
          <div className={cn(
            "mb-2 flex items-center gap-2 text-label text-[10px]",
            isCoach ? "text-primary" : "text-primary-foreground/70"
          )}>
            <Icon className="h-3.5 w-3.5" />
            {message.type === 'video-card' && 'VIDEO ANALYSIS'}
            {message.type === 'exercise-card' && 'EXERCISE'}
            {message.type === 'template-preview' && 'TEMPLATE'}
            {message.type === 'chart' && 'ANALYTICS'}
          </div>
        )}

        <p className="whitespace-pre-wrap">{message.content}</p>

        {message.canvasAction && (
          <motion.button 
            whileHover={{ x: 3 }}
            className={cn(
              "mt-2 flex items-center gap-1 text-label text-[10px]",
              isCoach ? "text-primary" : "text-primary-foreground/80"
            )}
          >
            Open on Canvas <ChevronRight className="h-3 w-3" />
          </motion.button>
        )}

        <div className={cn(
          "mt-1 text-[10px]",
          isCoach ? "text-muted-foreground" : "text-primary-foreground/50"
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
