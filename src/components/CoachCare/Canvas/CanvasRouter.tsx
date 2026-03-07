import { CanvasState } from '../types';
import { IdleCanvas } from './IdleCanvas';
import { VideoCanvas } from './VideoCanvas';
import { ExerciseCanvas } from './ExerciseCanvas';
import { TemplateCanvas } from './TemplateCanvas';
import { DocumentCanvas } from './DocumentCanvas';
import { AnalyticsCanvas } from './AnalyticsCanvas';

interface CanvasRouterProps {
  canvasState: CanvasState;
  onAction: (action: string) => void;
}

export function CanvasRouter({ canvasState, onAction }: CanvasRouterProps) {
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
    default:
      return <IdleCanvas onAction={onAction} />;
  }
}
