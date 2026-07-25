import type { LearningPath, LearningStep } from './types';

const step = (
  id: string,
  title: string,
  purpose: string,
  prescription: string,
  check: string,
  exerciseId?: string,
  cues: string[] = [],
  alternatives?: string[],
): LearningStep => ({
  id,
  title,
  purpose,
  prescription,
  exerciseId,
  kind: title.toLowerCase().includes('test') ? 'test' : 'practice',
  cues,
  checks: [{ id: `${id}-check`, label: check }],
  alternatives,
});

export const coreLearningPaths: LearningPath[] = [
  {
    id: 'start-here', name: 'Start Here: Bodyweight Foundations', shortName: 'Start Here', group: 'start', level: 'Start here',
    description: 'Learn bracing, squatting, pushing, pulling, support, and balance before choosing an advanced skill.',
    equipment: ['Floor', 'Wall', 'Low bar or rings optional'], frequency: '2–3 short sessions each week',
    steps: [
      step('foundation-brace', 'Brace and Breathe', 'Control the ribs and pelvis while breathing.', '3 × 15–30 sec', 'Hold a clean tucked hollow for 20 seconds while breathing', 'hollow-body-hold', ['Keep the lower back gently connected', 'Use a tucked shape when needed']),
      step('foundation-squat', 'Squat Pattern', 'Build comfortable hip, knee, ankle, and foot control.', '3 × 8–15 reps', 'Complete 10 smooth reps with the whole foot connected', 'bodyweight-squat', ['Use a depth you control', 'Knees follow the toes'], ['Chair squat', 'Supported squat']),
      step('foundation-push', 'Push Pattern', 'Find a push-up height that preserves full-body control.', '3 × 5–12 reps', 'Complete 8 clean reps at one repeatable level', 'push-up', ['Move chest and hips together', 'Control the lowering'], ['Wall push-up', 'Incline push-up', 'Knee push-up']),
      step('foundation-pull', 'Pull Pattern', 'Build shoulder control and horizontal pulling strength.', '3 × 6–12 reps', 'Complete 10 controlled rows with a brief top pause', 'australian-row', ['Adjust body angle to succeed', 'Keep the body organized'], ['Upright ring row', 'Bent-knee row']),
      step('foundation-support', 'Support and Shoulders', 'Prepare for dips, rings, handstands, and straight-arm skills.', '3 × 20–40 sec', 'Maintain active shoulders for 30 seconds', 'plank', ['Push the floor away', 'Use an incline when needed']),
      step('foundation-balance', 'Balance and Single-Leg Control', 'Prepare the feet, ankles, and hips for unilateral skills.', '2–3 × 20–30 sec/side', 'Balance for 20 seconds per side with support nearby', 'tree-pose', ['Keep the standing foot active', 'Use fingertip support']),
    ],
  },
  {
    id: 'handstand', name: 'Handstand From Scratch', shortName: 'Handstand', group: 'skills', level: 'Skill',
    description: 'Learn wrist preparation, body line, wall confidence, balance corrections, safe exits, and freestanding practice.',
    equipment: ['Floor', 'Wall'], frequency: '3–5 brief practices each week',
    steps: [
      step('hs-wrists', 'Wrist Preparation', 'Prepare the hands and wrists for gradual loading.', '2–4 min', 'Support a gentle lean comfortably', undefined, ['Spread the fingers', 'Increase pressure gradually']),
      step('hs-shape', 'Hollow and Shoulder Line', 'Learn the stacked shape before inversion.', '3 × 20–30 sec', 'Hold a clean hollow variation for 30 seconds', 'hollow-body-hold', ['Control the ribs', 'Reach the arms long']),
      step('hs-pike', 'Pike or Box Handstand', 'Load the shoulders with the feet supported.', '4 × 20–30 sec', 'Hold a stable pike position for 30 seconds', 'pike-push-up', ['Push tall through the shoulders', 'Use a stable box']),
      step('hs-wall', 'Wall-Facing Handstand', 'Build an active line with the wall as feedback.', '4 × 20–45 sec', 'Complete three clean 30-second holds and a safe exit', 'chest-to-wall-handstand', ['Push tall', 'Use only a distance you can exit safely']),
      step('hs-balance', 'Heel Pulls and Toe Pulls', 'Learn fingertip and heel-of-hand corrections.', '4–6 × 3–5 attempts', 'Complete five controlled wall separations', 'wall-pull-aways', ['Make small corrections', 'Return to the wall under control']),
      step('hs-free', 'Freestanding Handstand', 'Practice repeatable entries and short clean balances.', '8–12 quality attempts', 'Record three separate balances of at least 5 seconds', 'freestanding-handstand', ['End before fatigue changes the line', 'Practice exits as often as entries']),
    ],
  },
  {
    id: 'pull-up', name: 'First Pull-Up', shortName: 'Pull-Up', group: 'strength', level: 'Foundation',
    description: 'Build grip, rows, assisted repetitions, controlled negatives, and then strict pull-ups.',
    equipment: ['Pull-up bar', 'Low bar or rings', 'Band optional'], frequency: '2–3 sessions each week',
    steps: [
      step('pull-hang', 'Comfortable Hang', 'Build grip tolerance and controlled overhead support.', '3 × 15–30 sec', 'Hold for 30 comfortable seconds', 'dead-hang', ['Step down before grip fails', 'Do not force painful range']),
      step('pull-row', 'Body Row', 'Build repeatable horizontal pulling strength.', '3–4 × 6–12 reps', 'Complete three sets of 10 clean rows', 'australian-row', ['Pause at the top', 'Control the return']),
      step('pull-assisted', 'Assisted Pull-Up', 'Practice the pull-up path with manageable assistance.', '4 × 4–8 reps', 'Complete three sets of 6 controlled assisted reps', 'chin-up', ['Use enough assistance for full control', 'Avoid kicking']),
      step('pull-negative', 'Controlled Negative', 'Build strength through the lowering phase.', '3–5 × 1–3 reps', 'Complete three 5-second lowers', undefined, ['Start safely from a box', 'Lower through a controlled range']),
      step('pull-strict', 'Strict Pull-Up', 'Perform clean repetitions without momentum.', '5 × 1–5 reps', 'Repeat three clean reps in three sessions', 'pull-up', ['Keep the ribs organized', 'Finish without craning the neck']),
    ],
  },
  {
    id: 'l-sit', name: 'L-Sit and Compression', shortName: 'L-Sit', group: 'strength', level: 'Foundation',
    description: 'Build active support and hip compression from assisted presses to a full L-sit.',
    equipment: ['Floor', 'Parallettes or blocks optional'], frequency: '3 brief sessions each week',
    steps: [
      step('ls-support', 'Supported Press-Down', 'Learn to push tall through the shoulders.', '4 × 10–20 sec', 'Hold an active support for 20 seconds', undefined, ['Use blocks or parallettes', 'Feet may remain down']),
      step('ls-compression', 'Seated Compression', 'Build active hip flexion.', '3–4 × 6–12 reps', 'Complete 10 controlled pike lifts', 'seated-pike-lift', ['Sit tall', 'Use one leg at a time when needed']),
      step('ls-tuck', 'Tuck Sit', 'Combine support and compression in a compact shape.', '5 × 8–15 sec', 'Complete three 12-second holds', 'tuck-sit', ['Push tall', 'Use toe taps for help']),
      step('ls-one-leg', 'One-Leg L-Sit', 'Extend one leg while preserving support height.', '4 × 5–10 sec/side', 'Hold 8 seconds per side', undefined, ['Alternate sides', 'Keep the bent knee high']),
      step('ls-full', 'Full L-Sit', 'Extend both legs with an active support.', '5–8 × 5–15 sec', 'Complete three clean 10-second holds', 'l-sit', ['Use parallettes when clearance limits you', 'Accumulate quality time']),
    ],
  },
];
