export type LearningPathGroup = 'start' | 'skills' | 'strength' | 'mobility';
export type LearningStepKind = 'learn' | 'practice' | 'test' | 'skill';

export interface ReadinessCheck {
  id: string;
  label: string;
}

export interface LearningStep {
  id: string;
  title: string;
  purpose: string;
  kind: LearningStepKind;
  exerciseId?: string;
  prescription: string;
  cues: string[];
  checks: ReadinessCheck[];
  alternatives?: string[];
  safety?: string;
}

export interface LearningPath {
  id: string;
  name: string;
  shortName: string;
  group: LearningPathGroup;
  level: 'Start here' | 'Foundation' | 'Skill' | 'Advanced';
  description: string;
  equipment: string[];
  frequency: string;
  steps: LearningStep[];
}
