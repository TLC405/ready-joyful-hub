export type CanvasMode = 'idle' | 'video' | 'exercise' | 'template' | 'document' | 'analytics' | 'social';

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

export interface SocialSearchResult {
  id: string;
  title: string;
  thumbnail: string;
  platform: 'youtube' | 'instagram';
  url: string;
  embedUrl: string;
  channel?: string;
}

export interface SocialCanvasData {
  query: string;
  platform: 'all' | 'youtube' | 'instagram';
  results: SocialSearchResult[];
}

export interface CanvasState {
  mode: CanvasMode;
  data: VideoCanvasData | ExerciseCanvasData | TemplateCanvasData | DocumentCanvasData | AnalyticsCanvasData | SocialCanvasData | null;
}

export interface QuickReply {
  label: string;
  message: string;
}

export type MessageType = 'text' | 'video-card' | 'exercise-card' | 'template-preview' | 'chart' | 'social-search';

export interface ChatMessage {
  id: string;
  role: 'user' | 'coach';
  content: string;
  timestamp: string;
  type: MessageType;
  quickReplies?: QuickReply[];
  exerciseRef?: {
    id: string;
    name: string;
    difficulty: string;
    thumbnail?: string;
  };
  canvasAction?: {
    mode: CanvasMode;
    data: any;
  };
}

// Callback for canvas actions from chat
export type CanvasActionHandler = (mode: CanvasMode, data: any) => void;
