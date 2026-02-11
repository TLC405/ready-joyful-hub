// ==================== STACKED — Progression Engine ====================
import type { Track, TrackNode, UnlockState } from './types';
import { tracks } from './tracks';

// ===== Types =====

export interface ExerciseLog {
  exerciseId: string;
  date: string; // ISO string
  sets: number;
  reps?: number;
  holdSec?: number;
  qualityScore: number; // 1-5
  painScore: number; // 0-10
  notes?: string;
}

export interface TryModeRecord {
  setsUsedToday: number;
  lastSessionDate: string;
  qualityFailCount: number;
  painFlagCount: number;
}

export interface SoftLock {
  until: string; // ISO string
  reason: string;
}

export interface ProgressionState {
  unlockedExercises: Record<string, UnlockState>;
  exerciseLogs: ExerciseLog[];
  tryModeState: Record<string, TryModeRecord>;
  softLocks: Record<string, SoftLock>;
}

export interface GuardrailResult {
  allowed: boolean;
  reason?: string;
  action?: 'regress' | 'soft_lock';
}

// ===== Init =====

export function initProgressionState(): ProgressionState {
  const unlocked: Record<string, UnlockState> = {};

  for (const track of tracks) {
    for (const node of track.nodes) {
      if (node.prereqs.length === 0) {
        unlocked[node.exerciseId] = 'unlocked';
      } else if (!unlocked[node.exerciseId]) {
        // Second node gets preview, rest locked
        const firstPrereqIsRoot = node.prereqs.every(p =>
          track.nodes.find(n => n.exerciseId === p)?.prereqs.length === 0
        );
        unlocked[node.exerciseId] = firstPrereqIsRoot ? 'preview' : 'locked';
      }
    }
  }

  return {
    unlockedExercises: unlocked,
    exerciseLogs: [],
    tryModeState: {},
    softLocks: {},
  };
}

// ===== State Queries =====

export function getExerciseState(state: ProgressionState, exerciseId: string): UnlockState {
  // Check soft lock first
  const lock = state.softLocks[exerciseId];
  if (lock && new Date(lock.until) > new Date()) {
    return 'locked';
  }
  return state.unlockedExercises[exerciseId] || 'locked';
}

export function canAttemptExercise(state: ProgressionState, exerciseId: string): boolean {
  const es = getExerciseState(state, exerciseId);
  if (es === 'locked' || es === 'preview') return false;
  if (es === 'try_mode') {
    const tryState = state.tryModeState[exerciseId];
    if (tryState) {
      const today = new Date().toDateString();
      const lastDay = new Date(tryState.lastSessionDate).toDateString();
      if (today === lastDay && tryState.setsUsedToday >= 2) return false;
    }
  }
  return true;
}

export function getSoftLock(state: ProgressionState, exerciseId: string): SoftLock | null {
  const lock = state.softLocks[exerciseId];
  if (lock && new Date(lock.until) > new Date()) return lock;
  return null;
}

// ===== Try Mode Guardrails =====

export function checkTryModeGuardrails(
  state: ProgressionState,
  exerciseId: string,
  log: ExerciseLog
): GuardrailResult {
  const es = state.unlockedExercises[exerciseId];
  if (es !== 'try_mode') return { allowed: true };

  const tryState = state.tryModeState[exerciseId];
  const today = new Date().toDateString();

  // Check set cap
  if (tryState) {
    const lastDay = new Date(tryState.lastSessionDate).toDateString();
    const usedToday = today === lastDay ? tryState.setsUsedToday : 0;
    if (usedToday >= 2) {
      return { allowed: false, reason: 'Try Mode limit reached (2 sets/session). Come back tomorrow.' };
    }
  }

  // Check hold/rep limits
  if (log.holdSec && log.holdSec > 15) {
    return { allowed: false, reason: 'Try Mode caps holds at 15 seconds.' };
  }
  if (log.reps && log.reps > 3) {
    return { allowed: false, reason: 'Try Mode caps reps at 3 per set.' };
  }

  // Check quality
  const qualityFails = (tryState?.qualityFailCount || 0) + (log.qualityScore < 3 ? 1 : 0);
  if (qualityFails >= 2) {
    return {
      allowed: false,
      reason: 'Quality failed twice. Auto-regressing with 72-hour cooldown.',
      action: 'soft_lock',
    };
  }

  // Check pain
  if (log.painScore > 3) {
    return {
      allowed: false,
      reason: `Pain score ${log.painScore}/10 detected. Auto-regressing with 72-hour cooldown.`,
      action: 'soft_lock',
    };
  }

  return { allowed: true };
}

// ===== Logging =====

export function logExercise(state: ProgressionState, log: ExerciseLog): ProgressionState {
  const newState = { ...state };
  newState.exerciseLogs = [...state.exerciseLogs, log];

  // Update try mode state
  const es = state.unlockedExercises[log.exerciseId];
  if (es === 'try_mode') {
    const today = new Date().toDateString();
    const existing = state.tryModeState[log.exerciseId];
    const lastDay = existing ? new Date(existing.lastSessionDate).toDateString() : '';

    newState.tryModeState = {
      ...state.tryModeState,
      [log.exerciseId]: {
        setsUsedToday: today === lastDay ? (existing?.setsUsedToday || 0) + 1 : 1,
        lastSessionDate: new Date().toISOString(),
        qualityFailCount: (existing?.qualityFailCount || 0) + (log.qualityScore < 3 ? 1 : 0),
        painFlagCount: (existing?.painFlagCount || 0) + (log.painScore > 3 ? 1 : 0),
      },
    };
  }

  return newState;
}

export function applySoftLock(state: ProgressionState, exerciseId: string, reason: string): ProgressionState {
  const lockUntil = new Date();
  lockUntil.setHours(lockUntil.getHours() + 72);

  return {
    ...state,
    softLocks: {
      ...state.softLocks,
      [exerciseId]: { until: lockUntil.toISOString(), reason },
    },
    tryModeState: {
      ...state.tryModeState,
      [exerciseId]: {
        setsUsedToday: 0,
        lastSessionDate: new Date().toISOString(),
        qualityFailCount: 0,
        painFlagCount: 0,
      },
    },
  };
}

// ===== Graduation =====

function findNodeForExercise(exerciseId: string): { track: Track; node: TrackNode; nodeIndex: number } | null {
  for (const track of tracks) {
    const idx = track.nodes.findIndex(n => n.exerciseId === exerciseId);
    if (idx !== -1) return { track, node: track.nodes[idx], nodeIndex: idx };
  }
  return null;
}

export function checkGraduation(state: ProgressionState, exerciseId: string): boolean {
  const found = findNodeForExercise(exerciseId);
  if (!found || !found.node.unlockTest) return false;

  const { unlockTest } = found.node;
  const recentLogs = state.exerciseLogs.filter(l => l.exerciseId === exerciseId);

  switch (unlockTest.type) {
    case 'hold': {
      // Need 3 logs with holdSec >= target
      const passing = recentLogs.filter(l => l.holdSec && l.holdSec >= unlockTest.value);
      return passing.length >= 3;
    }
    case 'reps': {
      const passing = recentLogs.filter(l => l.reps && l.reps >= unlockTest.value);
      return passing.length >= 3;
    }
    case 'sets': {
      const passing = recentLogs.filter(l => l.sets >= unlockTest.value);
      return passing.length >= 3;
    }
    default:
      return false;
  }
}

export function graduateExercise(state: ProgressionState, exerciseId: string): { state: ProgressionState; newlyUnlocked: string[] } {
  const newlyUnlocked: string[] = [];
  const newUnlocked = { ...state.unlockedExercises };

  // Find all nodes that depend on this exercise
  for (const track of tracks) {
    for (const node of track.nodes) {
      if (node.prereqs.includes(exerciseId)) {
        const currentState = newUnlocked[node.exerciseId] || 'locked';
        if (currentState === 'locked' || currentState === 'preview') {
          // Check if ALL prereqs for this node are graduated
          const allPrereqsMet = node.prereqs.every(p => checkGraduation(state, p));
          if (allPrereqsMet) {
            newUnlocked[node.exerciseId] = 'try_mode';
            newlyUnlocked.push(node.exerciseId);
          } else if (currentState === 'locked') {
            newUnlocked[node.exerciseId] = 'preview';
          }
        }
      }
    }
  }

  return {
    state: { ...state, unlockedExercises: newUnlocked },
    newlyUnlocked,
  };
}
