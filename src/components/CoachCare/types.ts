export type CanvasMode = 'idle' | 'video' | 'exercise' | 'template' | 'document' | 'analytics';

export interface VideoCanvasData {
  platform: 'youtube' | 'instagram' | 'tiktok';
  url: string;
  embedUrl: string;
  analysis?: {
    timestamps: { time: string; note: string; type: 'form' | 'cue' | 'error' }[];
    overallScore: number;
    corrections: string[];
  };
}

export interface ExerciseCanvasData {
  exerciseId: string;
  exerciseName: string;
}

export interface TemplateBlock {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: string;
  reps: string;
  rest: string;
  notes: string;
  supersetGroup?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  blocks: TemplateBlock[];
  createdAt: string;
  lastModified: string;
}

export interface TemplateCanvasData {
  template: WorkoutTemplate;
}

export interface DocumentCanvasData {
  title: string;
  content: string;
}

export interface AnalyticsCanvasData {
  type: 'overview';
}

export interface CanvasState {
  mode: CanvasMode;
  data: VideoCanvasData | ExerciseCanvasData | TemplateCanvasData | DocumentCanvasData | AnalyticsCanvasData | null;
}

export type MessageType = 'text' | 'video-card' | 'exercise-card' | 'template-preview' | 'chart';

export interface ChatMessage {
  id: string;
  role: 'user' | 'coach';
  content: string;
  timestamp: string;
  type: MessageType;
  canvasAction?: {
    mode: CanvasMode;
    data: any;
  };
}
