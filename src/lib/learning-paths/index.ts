import { coreLearningPaths } from './core';
import { advancedLearningPaths } from './advanced';

export type { LearningPath, LearningPathGroup, LearningStep, ReadinessCheck } from './types';

export const learningPaths = [...coreLearningPaths, ...advancedLearningPaths];

export const getLearningPath = (id: string) => learningPaths.find(path => path.id === id);
export const getLearningPathsByGroup = (group: string) => learningPaths.filter(path => path.group === group);
