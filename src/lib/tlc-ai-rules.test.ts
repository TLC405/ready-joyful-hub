import { describe, expect, it } from 'vitest';
import { getTLCRecommendation, type AthleteProfile } from '@/lib/athlete-profile';
import { validateTLCAction } from '@/lib/tlc-actions';

function profile(overrides: Partial<AthleteProfile> = {}): AthleteProfile {
  return {
    version: 1,
    completedAt: '2026-07-25T00:00:00.000Z',
    experience: 'beginner',
    pushUps: 'developing',
    rows: 'developing',
    pullUps: 'none',
    squatControl: 'developing',
    hollowHold: 'developing',
    wallHandstand: 'none',
    mobility: 'developing',
    daysPerWeek: 3,
    sessionMinutes: 30,
    equipment: ['floor', 'wall', 'chair'],
    goals: ['general'],
    painAreas: [],
    coachingStyle: 'supportive',
    ...overrides,
  };
}

describe('TLC AI recommendation rules', () => {
  it('starts incomplete foundations in Start Here', () => {
    const result = getTLCRecommendation(profile({ pushUps: 'none', rows: 'none' }));
    expect(result.pathIds[0]).toBe('start-here');
    expect(result.workoutId).toBe('foundation-a');
  });

  it('allows front lever when pulling capacity and equipment support it', () => {
    const result = getTLCRecommendation(profile({
      goals: ['front-lever'],
      pullUps: 'strong',
      equipment: ['floor', 'pull-up-bar'],
    }));
    expect(result.pathIds).toContain('front-lever');
    expect(result.workoutId).toBe('pull');
  });

  it('does not prescribe bar skills without bar or rings', () => {
    const result = getTLCRecommendation(profile({ goals: ['front-lever'], pullUps: 'strong' }));
    expect(result.pathIds[0]).toBe('start-here');
    expect(result.caution).toContain('pull-up bar or rings');
  });

  it('requires rings for the rings pathway', () => {
    const withoutRings = getTLCRecommendation(profile({ goals: ['rings'] }));
    const withRings = getTLCRecommendation(profile({ goals: ['rings'], equipment: ['floor', 'rings'] }));
    expect(withoutRings.pathIds[0]).toBe('start-here');
    expect(withRings.pathIds).toContain('rings');
  });

  it('requires vertical equipment and pulling capacity for human flag', () => {
    const result = getTLCRecommendation(profile({
      goals: ['human-flag'],
      pullUps: 'strong',
      equipment: ['floor', 'vertical-pole'],
    }));
    expect(result.pathIds).toContain('human-flag');
  });
});

describe('TLC AI action validation', () => {
  it('accepts allowlisted navigation', () => {
    expect(validateTLCAction({ type: 'NAVIGATE', section: 'train' }).ok).toBe(true);
  });

  it('rejects unknown navigation and workouts', () => {
    expect(validateTLCAction({ type: 'NAVIGATE', section: 'billing' }).ok).toBe(false);
    expect(validateTLCAction({ type: 'SELECT_WORKOUT', workoutId: 'imaginary' }).ok).toBe(false);
  });

  it('marks workout changes as confirmation-required', () => {
    const result = validateTLCAction({ type: 'SELECT_WORKOUT', workoutId: 'pull' });
    expect(result.ok).toBe(true);
    expect(result.requiresConfirmation).toBe(true);
  });

  it('validates exercise and path IDs against app data', () => {
    expect(validateTLCAction({ type: 'ADD_EXERCISE', exerciseId: 'push-up' }).ok).toBe(true);
    expect(validateTLCAction({ type: 'ADD_EXERCISE', exerciseId: 'made-up-skill' }).ok).toBe(false);
    expect(validateTLCAction({ type: 'OPEN_PATH', pathId: 'handstand' }).ok).toBe(true);
    expect(validateTLCAction({ type: 'OPEN_PATH', pathId: 'made-up-path' }).ok).toBe(false);
  });

  it('keeps rest timers inside a safe product range', () => {
    expect(validateTLCAction({ type: 'START_REST_TIMER', seconds: 90 }).ok).toBe(true);
    expect(validateTLCAction({ type: 'START_REST_TIMER', seconds: 2 }).ok).toBe(false);
    expect(validateTLCAction({ type: 'START_REST_TIMER', seconds: 900 }).ok).toBe(false);
  });

  it('accepts explicit developer change requests but requires confirmation', () => {
    const result = validateTLCAction({ type: 'CREATE_CHANGE_REQUEST', title: 'Add rest timer', description: 'Add a background-safe rest timer to Train.' });
    expect(result.ok).toBe(true);
    expect(result.requiresConfirmation).toBe(true);
  });
});
