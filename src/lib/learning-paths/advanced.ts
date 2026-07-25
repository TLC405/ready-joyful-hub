import type { LearningPath, LearningStep } from './types';

const s = (id: string, title: string, purpose: string, prescription: string, check: string, exerciseId?: string, alternatives?: string[]): LearningStep => ({
  id, title, purpose, prescription, exerciseId, alternatives, kind: alternatives ? 'test' : title.includes('Full') || title.includes('Muscle-Up') ? 'skill' : 'practice',
  cues: ['Keep the hardest valid shape', 'Stop when technique changes', 'Repeat quality across separate sessions'],
  checks: [{ id: `${id}-check`, label: check }],
});

export const advancedLearningPaths: LearningPath[] = [
  {
    id: 'front-lever', name: 'Front Lever', shortName: 'Front Lever', group: 'skills', level: 'Advanced',
    description: 'Build straight-arm pulling and progressively harder lever shapes. One-leg, half-lay, and straddle are alternative bridge routes.',
    equipment: ['Pull-up bar or rings'], frequency: '2–3 sessions with recovery',
    steps: [
      s('fl-active', 'Active Hollow Hang', 'Connect shoulder control to a hollow shape.', '4 × 10–20 sec', 'Three clean 20-second active holds', 'dead-hang'),
      s('fl-tuck', 'Tuck Front Lever', 'Learn the lever with compact leverage.', '5–8 × 5–10 sec', 'Three clean 8-second holds'),
      s('fl-advanced', 'Advanced Tuck Front Lever', 'Open the hip angle while preserving line.', '5–7 × 5–10 sec', 'Three clean 8-second holds'),
      s('fl-bridge', 'Choose a Bridge Shape', 'Use the shape that best fits current control and proportions.', '4–6 × 3–8 sec', 'Three clean 5-second holds in one bridge shape', undefined, ['One-leg front lever', 'Half-lay front lever', 'Straddle front lever']),
      s('fl-full', 'Full Front Lever', 'Extend to a full straight-body lever.', '6–10 short attempts', 'Repeat clean holds across three sessions', 'front-lever'),
    ],
  },
  {
    id: 'planche', name: 'Planche', shortName: 'Planche', group: 'skills', level: 'Advanced',
    description: 'Develop wrist tolerance, straight-arm support, protraction, lean control, and progressively harder leverage.',
    equipment: ['Floor or parallettes'], frequency: '2–4 brief exposures each week',
    steps: [
      s('pl-wrist', 'Wrist and Straight-Arm Preparation', 'Prepare gradual hand, elbow, and shoulder loading.', '3–5 min', 'Comfortable supported lean without sharp pain'),
      s('pl-lean', 'Planche Lean', 'Own forward shoulder travel with straight arms.', '4–6 × 8–20 sec', 'Three clean 20-second holds', 'planche-lean'),
      s('pl-tuck', 'Tuck Planche', 'Float with compact leverage and a controlled exit.', '6–10 × 3–8 sec', 'Three clean 6-second holds', 'tuck-planche'),
      s('pl-advanced', 'Advanced Tuck Planche', 'Open the hips while preserving support.', '5–8 × 3–8 sec', 'Three clean 5-second holds', 'advanced-tuck-planche'),
      s('pl-bridge', 'Choose a Bridge Shape', 'Increase leverage through one-leg or straddle work.', '5–8 short attempts', 'Three controlled bridge-shape holds', undefined, ['One-leg planche', 'Straddle planche']),
      s('pl-full', 'Full Planche', 'Extend the body with a controlled straight-arm line.', '6–10 short attempts', 'Repeat controlled holds across sessions', 'full-planche'),
    ],
  },
  {
    id: 'rings', name: 'Rings Foundations to Muscle-Up', shortName: 'Rings', group: 'skills', level: 'Skill',
    description: 'Develop pulling, support, dip, grip, and transition capacity together before ring muscle-ups.',
    equipment: ['Rings'], frequency: '2–3 sessions each week',
    steps: [
      s('rings-row', 'Ring Row', 'Learn scalable pulling and ring control.', '3–4 × 8–12 reps', 'Three sets of 10 controlled rows', 'ring-row'),
      s('rings-support', 'Ring Support', 'Build stable straight-arm support.', '5 × 10–20 sec', 'Three stable 15-second holds', 'ring-support-hold'),
      s('rings-dip', 'Assisted to Strict Ring Dip', 'Build controlled pressing strength.', '4 × 3–8 reps', 'Five controlled strict reps or repeatable assisted volume', 'ring-dip'),
      s('rings-grip', 'High Pull and False Grip', 'Develop pull height and transition grip.', '4–6 quality sets', '15-second false-grip support plus repeatable high pulls', 'false-grip-hold'),
      s('rings-transition', 'Low-Ring Transition', 'Learn the turnover with foot assistance.', '4 × 3–5 reps', 'Five smooth low-ring transitions'),
      s('rings-muscle-up', 'Ring Muscle-Up', 'Combine pull, transition, and dip.', '4–6 × 1–3 assisted or strict reps', 'Repeat controlled repetitions across sessions', 'muscle-up'),
    ],
  },
  {
    id: 'pistol', name: 'Single-Leg Strength to Pistol', shortName: 'Pistol Squat', group: 'strength', level: 'Foundation',
    description: 'Build squat control, unilateral strength, foot and ankle capacity, balance, and gradually deeper single-leg squats.',
    equipment: ['Floor', 'Chair or stable support'], frequency: '2–3 sessions each week',
    steps: [
      s('pistol-squat-base', 'Controlled Squat', 'Establish repeatable two-leg mechanics.', '3 × 10–15 reps', '15 smooth reps', 'bodyweight-squat'),
      s('pistol-split', 'Split Squat', 'Build unilateral strength with both feet supported.', '3 × 6–10/side', 'Three sets of 8 controlled reps per side', 'bulgarian-split-squat'),
      s('pistol-foot', 'Foot, Calf, and Balance', 'Improve ankle control and single-leg stability.', '3 × 12–20 plus balance holds', '15 controlled calf raises and 20-second balance per side', 'calf-raise'),
      s('pistol-assisted', 'Assisted or Box Pistol', 'Practice depth with adjustable support.', '4 × 3–6/side', 'Five controlled reps per side at one level'),
      s('pistol-full', 'Full Pistol Squat', 'Perform a controlled single-leg squat through usable range.', '4 × 2–6/side', 'Three controlled reps per side', 'pistol-squat'),
    ],
  },
  {
    id: 'human-flag', name: 'Human Flag', shortName: 'Human Flag', group: 'skills', level: 'Advanced',
    description: 'Build lateral trunk strength and the vertical push-pull shoulder pattern before progressively longer flag shapes.',
    equipment: ['Stable vertical pole or stall bars'], frequency: '2 sessions each week',
    steps: [
      s('flag-side', 'Side-Plank Foundation', 'Build lateral trunk endurance.', '3 × 20–40 sec/side', '30-second clean side plank per side'),
      s('flag-vertical', 'Vertical Push-Pull Support', 'Learn top-arm pull and bottom-arm push with feet down.', '4 × 10–20 sec/side', '15-second controlled support per side'),
      s('flag-tuck', 'Tuck Flag', 'Lift into a compact flag shape.', '5–8 × 3–8 sec', 'Three clean 5-second holds per side'),
      s('flag-bridge', 'One-Leg or Straddle Flag', 'Lengthen leverage gradually.', '5–8 short attempts', 'Three controlled holds per side', undefined, ['One-leg flag', 'Straddle flag']),
      s('flag-full', 'Full Human Flag', 'Hold a straight horizontal line.', '6–10 short attempts', 'Repeat controlled full-shape holds', 'human-flag'),
    ],
  },
  {
    id: 'mobility-splits', name: 'Mobility and Splits', shortName: 'Mobility', group: 'mobility', level: 'Foundation',
    description: 'Train useful range for ankles, hips, hamstrings, adductors, shoulders, front splits, and middle splits without pretending every pose unlocks the next.',
    equipment: ['Floor', 'Wall', 'Blocks optional'], frequency: '3–6 short sessions each week',
    steps: [
      s('mobility-check', 'Baseline Range Check', 'Record comfortable range and side-to-side differences.', '5-minute guided check', 'Record ankles, pike, straddle, shoulders, and hip extension'),
      s('mobility-active', 'Active Mobility', 'Build strength inside usable range.', '2–4 controlled sets', 'Complete the active flow twice weekly for two weeks', 'cossack-squat'),
      s('mobility-pike', 'Pike and Hamstrings', 'Improve hip hinge and active leg lift.', '8–12 lifts plus 30–60 sec holds', 'Record improved control or range over three sessions', 'seated-pike-lift'),
      s('mobility-middle', 'Straddle and Middle Split', 'Build adductor strength and gradual straddle range.', '2–3 rounds', 'Complete six quality sessions before retesting', 'pancake-stretch'),
      s('mobility-front', 'Front Split Practice', 'Combine front-leg hamstring and back-leg hip-extension work.', '2–3 rounds per side', 'Retest after six sessions and record range'),
    ],
  },
];
