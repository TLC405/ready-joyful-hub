export type ExperienceLevel = 'new' | 'beginner' | 'intermediate' | 'advanced';
export type CapabilityBand = 'none' | 'starting' | 'developing' | 'strong';
export type SessionMinutes = 20 | 30 | 45 | 60;
export type TrainingGoal = 'general' | 'pull-up' | 'handstand' | 'l-sit' | 'pistol' | 'front-lever' | 'planche' | 'rings' | 'human-flag' | 'mobility-splits';

export interface AthleteProfile {
  version: 1;
  completedAt: string;
  name?: string;
  experience: ExperienceLevel;
  pushUps: CapabilityBand;
  rows: CapabilityBand;
  pullUps: CapabilityBand;
  squatControl: CapabilityBand;
  hollowHold: CapabilityBand;
  wallHandstand: CapabilityBand;
  mobility: CapabilityBand;
  daysPerWeek: number;
  sessionMinutes: SessionMinutes;
  equipment: string[];
  goals: TrainingGoal[];
  painAreas: string[];
  coachingStyle: 'supportive' | 'direct' | 'technical';
}

export interface TLCRecommendation {
  pathIds: string[];
  workoutId: string;
  headline: string;
  reason: string;
  firstAction: string;
  caution?: string;
}

export const ATHLETE_PROFILE_KEY = 'tlc-athlete-profile-v1';
export const LEARNING_PROGRESS_KEY = 'tlc-learning-progress-v2';
export const ACTIVE_WORKOUT_KEY = 'tlc-active-workout-v2';

export const capabilityOptions: { value: CapabilityBand; label: string; hint: string }[] = [
  { value: 'none', label: 'Not yet', hint: 'I cannot do a clean rep or hold yet.' },
  { value: 'starting', label: 'Starting', hint: 'A few assisted reps or a short hold.' },
  { value: 'developing', label: 'Developing', hint: 'Several clean reps or a repeatable hold.' },
  { value: 'strong', label: 'Strong', hint: 'Comfortable volume with consistent form.' },
];

export function loadAthleteProfile(): AthleteProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(ATHLETE_PROFILE_KEY) || 'null') as AthleteProfile | null;
  } catch {
    return null;
  }
}

export function saveAthleteProfile(profile: AthleteProfile) {
  localStorage.setItem(ATHLETE_PROFILE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new CustomEvent('tlc-profile-updated', { detail: profile }));
}

export function getTLCRecommendation(profile: AthleteProfile): TLCRecommendation {
  const goals = profile.goals.length ? profile.goals : ['general'];
  const pathIds: string[] = [];

  if (profile.pushUps === 'none' || profile.rows === 'none' || profile.squatControl === 'none' || profile.hollowHold === 'none') {
    pathIds.push('start-here');
  }

  for (const goal of goals) {
    if (goal === 'general') pathIds.push('start-here');
    if (goal === 'pull-up') pathIds.push('pull-up');
    if (goal === 'handstand') pathIds.push('handstand');
    if (goal === 'l-sit') pathIds.push('l-sit');
    if (goal === 'pistol') pathIds.push('pistol');
    if (goal === 'front-lever') pathIds.push(profile.pullUps === 'strong' ? 'front-lever' : 'pull-up');
    if (goal === 'planche') pathIds.push(profile.pushUps === 'strong' && profile.hollowHold !== 'none' ? 'planche' : 'start-here');
    if (goal === 'rings') pathIds.push(profile.rows === 'none' ? 'start-here' : 'rings');
    if (goal === 'human-flag') pathIds.push(profile.pullUps === 'strong' ? 'human-flag' : 'start-here');
    if (goal === 'mobility-splits') pathIds.push('mobility-splits');
  }

  const uniquePaths = Array.from(new Set(pathIds)).slice(0, 3);
  const hasBar = profile.equipment.includes('pull-up-bar') || profile.equipment.includes('rings');
  const workoutId = uniquePaths.includes('pull-up') || uniquePaths.includes('front-lever') || uniquePaths.includes('rings')
    ? (hasBar ? 'pull' : 'foundation-a')
    : uniquePaths.includes('pistol')
      ? 'legs'
      : uniquePaths.includes('handstand') || uniquePaths.includes('planche') || uniquePaths.includes('l-sit') || uniquePaths.includes('mobility-splits')
        ? 'skill'
        : profile.rows === 'none'
          ? 'foundation-a'
          : 'foundation-b';

  const foundationFirst = uniquePaths[0] === 'start-here';
  const caution = profile.painAreas.length
    ? `You marked ${profile.painAreas.join(', ')}. TLC AI should keep those areas out of sharp pain and suggest professional evaluation when symptoms persist, worsen, or affect daily activity.`
    : undefined;

  return {
    pathIds: uniquePaths.length ? uniquePaths : ['start-here'],
    workoutId,
    headline: foundationFirst ? 'Build your base first' : 'Your best starting route is ready',
    reason: foundationFirst
      ? 'Your answers show that a short foundation block will make every later skill safer and easier to understand.'
      : 'TLC AI matched your current capacity, equipment, schedule, and selected goals to the smallest useful next step.',
    firstAction: foundationFirst ? 'Complete Foundation A and open the Start Here path.' : 'Open your first recommended path and complete its current-step readiness check.',
    caution,
  };
}

export function applyTLCRecommendation(profile: AthleteProfile) {
  const recommendation = getTLCRecommendation(profile);
  localStorage.setItem(ACTIVE_WORKOUT_KEY, recommendation.workoutId);
  try {
    const existing = JSON.parse(localStorage.getItem(LEARNING_PROGRESS_KEY) || '{}');
    localStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify({
      selectedPathIds: Array.from(new Set([...(existing.selectedPathIds || []), ...recommendation.pathIds])),
      completedStepIds: existing.completedStepIds || [],
      completedCheckIds: existing.completedCheckIds || [],
      lastPathId: recommendation.pathIds[0],
    }));
  } catch {
    localStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify({ selectedPathIds: recommendation.pathIds, completedStepIds: [], completedCheckIds: [], lastPathId: recommendation.pathIds[0] }));
  }
  window.dispatchEvent(new CustomEvent('tlc-recommendation-applied', { detail: recommendation }));
  return recommendation;
}

export function athleteProfileSummary(profile: AthleteProfile | null): string {
  if (!profile) return 'No onboarding assessment has been completed.';
  return [
    `Experience: ${profile.experience}`,
    `Capabilities — push-ups: ${profile.pushUps}; rows: ${profile.rows}; pull-ups: ${profile.pullUps}; squat: ${profile.squatControl}; hollow hold: ${profile.hollowHold}; wall handstand: ${profile.wallHandstand}; mobility: ${profile.mobility}`,
    `Schedule: ${profile.daysPerWeek} days/week, ${profile.sessionMinutes} minutes/session`,
    `Equipment: ${profile.equipment.join(', ') || 'floor only'}`,
    `Goals: ${profile.goals.join(', ') || 'general fitness'}`,
    `Pain or limitations: ${profile.painAreas.join(', ') || 'none reported'}`,
    `Preferred coaching style: ${profile.coachingStyle}`,
  ].join('\n');
}
