// ==================== STACKED — Core Types ====================

export type Category = 'push' | 'pull' | 'legs' | 'core' | 'mobility' | 'skills';
export type Difficulty = 'easy' | 'beginner' | 'intermediate' | 'advanced' | 'master';
export type TrackId = 'planche' | 'handstand' | 'rings' | 'compression' | 'pull-strength' | 'legs' | 'flag' | 'general';
export type Equipment = 'floor' | 'wall' | 'pull-up bar' | 'rings' | 'chair' | 'towel' | 'resistance band' | 'parallettes';
export type UnlockState = 'locked' | 'preview' | 'try_mode' | 'unlocked' | 'coach_override';

// Movement briefing (premium protocol content)
export interface Movement {
  name: string;
  mechanic: string;
  brutality: string;
  progression: string;
  volume: string;
  watch_out: string;
  movement_recovery: string;
}

// Full exercise card
export interface Exercise {
  id: string;
  name: string;
  category: Category;
  difficulty: Difficulty;
  muscles: string[];
  equipment: Equipment[];
  tracks: TrackId[];
  shortPurpose: string;
  description: string;
  image?: string;

  // Do This
  doThis: {
    setsRange: string;
    repsRange?: string;
    timeSecRange?: string;
    restSecRange: string;
  };

  // Coaching
  cueStack: string[];       // max 3
  failSigns: string[];      // max 3
  regressTo: string[];      // exercise IDs
  progressTo: string[];     // exercise IDs

  // Media
  videoUrl?: string;
  thumbnailUrl?: string;
  needsUpload?: boolean;

  // Premium coach notes (optional)
  coachNotes?: {
    mechanic: string;
    brutality: string;
    watchOut: string;
    recoveryVector: string;
  };

  // Protocol fields (for phase-based skills)
  protocol_name?: string;
  objective?: string;
  movements?: Movement[];
  intensity_markers?: string[];
  recovery_vector?: string[];
}

// Track node in the ladder
export interface TrackNode {
  exerciseId: string;
  prereqs: string[];        // exercise IDs
  unlockTest?: {
    type: 'hold' | 'reps' | 'sets';
    value: number;
    unit: string;
  };
}

// Track definition
export interface Track {
  id: TrackId;
  name: string;
  description: string;
  icon: string; // lucide icon name
  nodes: TrackNode[];
}

// Session template
export interface SessionBlock {
  phase: 'primer' | 'skill' | 'build' | 'finish';
  label: string;
  durationMin: string;
  exercises: string[]; // exercise IDs
}

export interface SessionTemplate {
  id: string;
  name: string;
  dayLabel: string;
  description: string;
  blocks: SessionBlock[];
}
