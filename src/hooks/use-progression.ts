import { useState, useCallback, useEffect } from 'react';
import {
  ProgressionState,
  ExerciseLog,
  SoftLock,
  initProgressionState,
  getExerciseState,
  canAttemptExercise,
  getSoftLock,
  checkTryModeGuardrails,
  logExercise,
  applySoftLock,
  checkGraduation,
  graduateExercise,
} from '@/lib/progression-engine';
import type { UnlockState } from '@/lib/types';

const STORAGE_KEY = 'tlc-progression-state';

function loadState(): ProgressionState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return initProgressionState();
}

function saveState(state: ProgressionState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useProgression() {
  const [state, setState] = useState<ProgressionState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const getState = useCallback(
    (exerciseId: string): UnlockState => getExerciseState(state, exerciseId),
    [state]
  );

  const canAttempt = useCallback(
    (exerciseId: string): boolean => canAttemptExercise(state, exerciseId),
    [state]
  );

  const getLock = useCallback(
    (exerciseId: string): SoftLock | null => getSoftLock(state, exerciseId),
    [state]
  );

  const logSet = useCallback(
    (log: ExerciseLog): { success: boolean; message?: string; graduated?: string[] } => {
      // Check guardrails
      const guardrail = checkTryModeGuardrails(state, log.exerciseId, log);
      if (!guardrail.allowed) {
        if (guardrail.action === 'soft_lock') {
          setState(prev => applySoftLock(prev, log.exerciseId, guardrail.reason || 'Auto-regressed'));
        }
        return { success: false, message: guardrail.reason };
      }

      // Log the set
      let newState = logExercise(state, log);

      // Check graduation
      let graduated: string[] = [];
      if (checkGraduation(newState, log.exerciseId)) {
        const result = graduateExercise(newState, log.exerciseId);
        newState = result.state;
        graduated = result.newlyUnlocked;
      }

      setState(newState);
      return {
        success: true,
        message: graduated.length > 0 ? `New exercises unlocked!` : undefined,
        graduated: graduated.length > 0 ? graduated : undefined,
      };
    },
    [state]
  );

  const reset = useCallback(() => {
    const fresh = initProgressionState();
    setState(fresh);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { state, getState, canAttempt, getSoftLock: getLock, logSet, reset };
}
