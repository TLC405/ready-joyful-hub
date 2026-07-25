import { useCallback, useEffect, useMemo, useState } from 'react';
import { learningPaths } from '@/lib/learning-paths';

const STORAGE_KEY = 'tlc-learning-progress-v2';

export interface LearningProgressState {
  selectedPathIds: string[];
  completedStepIds: string[];
  completedCheckIds: string[];
  lastPathId?: string;
}

const initialState: LearningProgressState = {
  selectedPathIds: ['start-here'],
  completedStepIds: [],
  completedCheckIds: [],
  lastPathId: 'start-here',
};

function loadState(): LearningProgressState {
  if (typeof window === 'undefined') return initialState;
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return parsed ? { ...initialState, ...parsed } : initialState;
  } catch {
    return initialState;
  }
}

export function useLearningProgress() {
  const [state, setState] = useState<LearningProgressState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const togglePath = useCallback((pathId: string) => {
    setState(prev => ({
      ...prev,
      lastPathId: pathId,
      selectedPathIds: prev.selectedPathIds.includes(pathId)
        ? prev.selectedPathIds.filter(id => id !== pathId)
        : [...prev.selectedPathIds, pathId],
    }));
  }, []);

  const setLastPath = useCallback((pathId: string) => {
    setState(prev => ({ ...prev, lastPathId: pathId }));
  }, []);

  const toggleCheck = useCallback((checkId: string) => {
    setState(prev => ({
      ...prev,
      completedCheckIds: prev.completedCheckIds.includes(checkId)
        ? prev.completedCheckIds.filter(id => id !== checkId)
        : [...prev.completedCheckIds, checkId],
    }));
  }, []);

  const markStepComplete = useCallback((stepId: string, complete = true) => {
    setState(prev => ({
      ...prev,
      completedStepIds: complete
        ? Array.from(new Set([...prev.completedStepIds, stepId]))
        : prev.completedStepIds.filter(id => id !== stepId),
    }));
  }, []);

  const pathProgress = useCallback((pathId: string) => {
    const path = learningPaths.find(item => item.id === pathId);
    if (!path) return { complete: 0, total: 0, percent: 0, currentIndex: 0 };
    const complete = path.steps.filter(step => state.completedStepIds.includes(step.id)).length;
    const currentIndex = Math.min(path.steps.findIndex(step => !state.completedStepIds.includes(step.id)), path.steps.length - 1);
    return {
      complete,
      total: path.steps.length,
      percent: Math.round((complete / path.steps.length) * 100),
      currentIndex: currentIndex < 0 ? path.steps.length - 1 : currentIndex,
    };
  }, [state.completedStepIds]);

  const activePaths = useMemo(() => learningPaths.filter(path => state.selectedPathIds.includes(path.id)), [state.selectedPathIds]);

  return { state, activePaths, togglePath, setLastPath, toggleCheck, markStepComplete, pathProgress };
}
