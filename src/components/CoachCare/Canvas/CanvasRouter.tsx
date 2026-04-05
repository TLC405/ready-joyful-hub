import { CanvasState } from '../types';
import { IdleCanvas } from './IdleCanvas';
import { VideoCanvas } from './VideoCanvas';
import { ExerciseCanvas } from './ExerciseCanvas';
import { TemplateCanvas } from './TemplateCanvas';
import { DocumentCanvas } from './DocumentCanvas';
import { AnalyticsCanvas } from './AnalyticsCanvas';
import { SocialCanvas } from './SocialCanvas';

interface CanvasRouterProps {
  canvasState: CanvasState;
  onAction: (action: string) => void;
  onWatchVideo?: (result: any) => void;
}

export function CanvasRouter({ canvasState, onAction, onWatchVideo }: CanvasRouterProps) {
  switch (canvasState.mode) {
    case 'video':
      return <VideoCanvas data={canvasState.data as any} />;
    case 'exercise':
      return <ExerciseCanvas data={canvasState.data as any} />;
    case 'template':
      return <TemplateCanvas data={canvasState.data as any} />;
    case 'document':
      return <DocumentCanvas data={canvasState.data as any} />;
    case 'analytics':
      return <AnalyticsCanvas />;
    case 'social':
      return <SocialCanvas data={canvasState.data as any} onWatchVideo={onWatchVideo} />;
    default:
      return <IdleCanvas onAction={onAction} />;
  }
}
