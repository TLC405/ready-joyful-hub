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

const typeLabels: Record<string, string> = {
  'video-card': 'VIDEO ANALYSIS',
  'exercise-card': 'EXERCISE',
  'template-preview': 'TEMPLATE',
  'chart': 'ANALYTICS',
};

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isCoach = message.role === 'coach';
  const Icon = typeIcons[message.type];

  return (
    <div className={cn("flex", isCoach ? "justify-start" : "justify-end")}>
      <div className={cn(
        "max-w-[85%] px-4 py-3 text-sm leading-relaxed",
        isCoach
          ? "border border-foreground/12 bg-card text-foreground"
          : "bg-primary text-primary-foreground",
      )}>
        {message.type !== 'text' && Icon && (
          <div className={cn(
            "mb-2 flex items-center gap-2 border-l-2 pl-2 text-label text-[10px]",
            isCoach ? "border-primary text-primary" : "border-primary-foreground/40 text-primary-foreground/70"
          )}>
            <Icon className="h-3.5 w-3.5" />
            {typeLabels[message.type]}
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
            OPEN ON CANVAS <ChevronRight className="h-3 w-3" />
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
