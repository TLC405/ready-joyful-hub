import { getExerciseById } from '@/lib/exercises';
import { learningPaths } from '@/lib/learning-paths';
import { ACTIVE_WORKOUT_KEY, LEARNING_PROGRESS_KEY } from '@/lib/athlete-profile';

export type TLCSection = 'home' | 'train' | 'skills' | 'library' | 'progress' | 'learn' | 'settings' | 'coach';

export type TLCAction =
  | { type: 'NAVIGATE'; section: TLCSection }
  | { type: 'OPEN_ASSESSMENT' }
  | { type: 'SELECT_WORKOUT'; workoutId: string }
  | { type: 'FOLLOW_PATH'; pathId: string }
  | { type: 'OPEN_PATH'; pathId: string }
  | { type: 'FILTER_LIBRARY'; query?: string; category?: string; equipment?: string[] }
  | { type: 'ADD_EXERCISE'; exerciseId: string }
  | { type: 'SWAP_EXERCISE'; fromExerciseId: string; toExerciseId: string }
  | { type: 'SET_SESSION_LENGTH'; minutes: 20 | 30 | 45 | 60 }
  | { type: 'START_REST_TIMER'; seconds: number }
  | { type: 'CREATE_CHANGE_REQUEST'; title: string; description: string; affectedFiles?: string[] };

export interface TLCActionContext {
  navigate: (section: TLCSection) => void;
  openAssessment: () => void;
  confirmAction?: (message: string) => boolean | Promise<boolean>;
}

export interface TLCActionResult {
  ok: boolean;
  message: string;
  requiresConfirmation?: boolean;
}

const sections = new Set<TLCSection>(['home', 'train', 'skills', 'library', 'progress', 'learn', 'settings', 'coach']);
const workouts = new Set(['foundation-a', 'foundation-b', 'push', 'pull', 'legs', 'skill']);
const pathIds = new Set(learningPaths.map(path => path.id));
const confirmationActions = new Set<TLCAction['type']>(['SELECT_WORKOUT', 'ADD_EXERCISE', 'SWAP_EXERCISE', 'SET_SESSION_LENGTH', 'CREATE_CHANGE_REQUEST']);

function isText(value: unknown, max = 500): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max;
}

export function validateTLCAction(action: unknown): TLCActionResult {
  if (!action || typeof action !== 'object') return { ok: false, message: 'Invalid TLC AI action.' };
  const candidate = action as Record<string, unknown>;
  if (!isText(candidate.type, 40)) return { ok: false, message: 'Action type is missing.' };

  switch (candidate.type) {
    case 'NAVIGATE':
      return typeof candidate.section === 'string' && sections.has(candidate.section as TLCSection)
        ? { ok: true, message: 'Navigation action is valid.' }
        : { ok: false, message: 'Unknown app section.' };
    case 'OPEN_ASSESSMENT':
      return { ok: true, message: 'Assessment action is valid.' };
    case 'SELECT_WORKOUT':
      return typeof candidate.workoutId === 'string' && workouts.has(candidate.workoutId)
        ? { ok: true, message: 'Workout action is valid.', requiresConfirmation: true }
        : { ok: false, message: 'Unknown workout.' };
    case 'FOLLOW_PATH':
    case 'OPEN_PATH':
      return typeof candidate.pathId === 'string' && pathIds.has(candidate.pathId)
        ? { ok: true, message: 'Learning-path action is valid.' }
        : { ok: false, message: 'Unknown learning path.' };
    case 'FILTER_LIBRARY':
      return (!candidate.query || typeof candidate.query === 'string') && (!candidate.category || typeof candidate.category === 'string') && (!candidate.equipment || Array.isArray(candidate.equipment))
        ? { ok: true, message: 'Library filter action is valid.' }
        : { ok: false, message: 'Invalid Library filter.' };
    case 'ADD_EXERCISE':
      return typeof candidate.exerciseId === 'string' && Boolean(getExerciseById(candidate.exerciseId))
        ? { ok: true, message: 'Exercise action is valid.', requiresConfirmation: true }
        : { ok: false, message: 'Unknown exercise.' };
    case 'SWAP_EXERCISE':
      return typeof candidate.fromExerciseId === 'string' && typeof candidate.toExerciseId === 'string' && Boolean(getExerciseById(candidate.fromExerciseId)) && Boolean(getExerciseById(candidate.toExerciseId))
        ? { ok: true, message: 'Exercise swap is valid.', requiresConfirmation: true }
        : { ok: false, message: 'Invalid exercise swap.' };
    case 'SET_SESSION_LENGTH':
      return [20, 30, 45, 60].includes(Number(candidate.minutes))
        ? { ok: true, message: 'Session-length action is valid.', requiresConfirmation: true }
        : { ok: false, message: 'Unsupported session length.' };
    case 'START_REST_TIMER':
      return Number.isInteger(candidate.seconds) && Number(candidate.seconds) >= 10 && Number(candidate.seconds) <= 600
        ? { ok: true, message: 'Rest timer action is valid.' }
        : { ok: false, message: 'Rest timer must be between 10 and 600 seconds.' };
    case 'CREATE_CHANGE_REQUEST':
      return isText(candidate.title, 120) && isText(candidate.description, 4000) && (!candidate.affectedFiles || Array.isArray(candidate.affectedFiles))
        ? { ok: true, message: 'Change request is valid.', requiresConfirmation: true }
        : { ok: false, message: 'Invalid developer change request.' };
    default:
      return { ok: false, message: 'TLC AI is not allowed to perform that action.' };
  }
}

async function confirmIfNeeded(action: TLCAction, context: TLCActionContext): Promise<boolean> {
  if (!confirmationActions.has(action.type)) return true;
  if (!context.confirmAction) return false;
  return Boolean(await context.confirmAction(`Allow TLC AI to ${action.type.toLowerCase().replaceAll('_', ' ')}?`));
}

function followPath(pathId: string) {
  const existing = JSON.parse(localStorage.getItem(LEARNING_PROGRESS_KEY) || '{}');
  localStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify({
    selectedPathIds: Array.from(new Set([...(existing.selectedPathIds || []), pathId])),
    completedStepIds: existing.completedStepIds || [],
    completedCheckIds: existing.completedCheckIds || [],
    lastPathId: pathId,
  }));
  window.dispatchEvent(new CustomEvent('tlc-learning-progress-updated', { detail: { pathId } }));
}

export async function executeTLCAction(action: TLCAction, context: TLCActionContext): Promise<TLCActionResult> {
  const validation = validateTLCAction(action);
  if (!validation.ok) return validation;
  if (!(await confirmIfNeeded(action, context))) return { ok: false, message: 'Action was not confirmed.' };

  switch (action.type) {
    case 'NAVIGATE':
      context.navigate(action.section);
      break;
    case 'OPEN_ASSESSMENT':
      context.openAssessment();
      break;
    case 'SELECT_WORKOUT':
      localStorage.setItem(ACTIVE_WORKOUT_KEY, action.workoutId);
      window.dispatchEvent(new CustomEvent('tlc-workout-selected', { detail: action }));
      context.navigate('train');
      break;
    case 'FOLLOW_PATH':
      followPath(action.pathId);
      break;
    case 'OPEN_PATH':
      followPath(action.pathId);
      context.navigate('skills');
      break;
    case 'FILTER_LIBRARY':
      window.dispatchEvent(new CustomEvent('tlc-library-filter', { detail: action }));
      context.navigate('library');
      break;
    case 'ADD_EXERCISE':
    case 'SWAP_EXERCISE':
      window.dispatchEvent(new CustomEvent('tlc-workout-edit', { detail: action }));
      context.navigate('train');
      break;
    case 'SET_SESSION_LENGTH':
      localStorage.setItem('tlc-session-minutes-v1', String(action.minutes));
      window.dispatchEvent(new CustomEvent('tlc-session-length-updated', { detail: action }));
      break;
    case 'START_REST_TIMER':
      localStorage.setItem('tlc-rest-timer-v1', JSON.stringify({ seconds: action.seconds, startedAt: new Date().toISOString() }));
      window.dispatchEvent(new CustomEvent('tlc-rest-timer-started', { detail: action }));
      break;
    case 'CREATE_CHANGE_REQUEST':
      localStorage.setItem('tlc-change-request-v1', JSON.stringify({ ...action, createdAt: new Date().toISOString() }));
      window.dispatchEvent(new CustomEvent('tlc-change-request-created', { detail: action }));
      break;
  }

  window.dispatchEvent(new CustomEvent('tlc-ai-action-complete', { detail: action }));
  return { ok: true, message: 'TLC AI action completed.' };
}
