// Skill images - ES6 imports
import frogStandImg from '@/assets/skills/frog-stand.jpg';
import lSitImg from '@/assets/skills/l-sit.jpg';
import headstandImg from '@/assets/skills/headstand.jpg';
import pistolSquatImg from '@/assets/skills/pistol-squat.jpg';
import handstandImg from '@/assets/skills/handstand.jpg';
import skinTheCatImg from '@/assets/skills/skin-the-cat.jpg';
import pulloverImg from '@/assets/skills/pullover.jpg';
import tigerBendImg from '@/assets/skills/tiger-bend.jpg';
import clutchFlagImg from '@/assets/skills/clutch-flag.jpg';
import elbowLeverImg from '@/assets/skills/elbow-lever.jpg';
import needleImg from '@/assets/skills/needle.jpg';
import bentArmHandstandImg from '@/assets/skills/bent-arm-handstand.jpg';
import singleArmElbowLeverImg from '@/assets/skills/single-arm-elbow-lever.jpg';
import plancheLeanImg from '@/assets/skills/planche-lean.jpg';
import tuckPlancheImg from '@/assets/skills/tuck-planche.jpg';

// Movement briefing structure for premium protocol content
export interface Movement {
  name: string;
  mechanic: string;
  brutality: string;
  progression: string;
  volume: string;
  watch_out: string;
  movement_recovery: string;
}

export interface Skill {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tier: 'free' | 'basic' | 'pro';
  description: string;
  instructions: string[];
  progressionTargets: string[];
  tips: string[];
  muscleGroups: string[];
  image: string;
  // Premium protocol fields (optional for legacy skills)
  protocol_name?: string;
  objective?: string;
  category?: string;
  movements?: Movement[];
  intensity_markers?: string[];
  recovery_vector?: string[];
}

export const skills: Skill[] = [
  {
    id: 'frog-stand',
    name: 'Frog Stand',
    difficulty: 'beginner',
    tier: 'free',
    description: 'The foundational balance skill that builds wrist strength and body awareness for advanced hand balancing.',
    instructions: [
      'Place hands shoulder-width apart on the ground with fingers spread',
      'Bend your knees and rest them on the back of your triceps',
      'Lean forward slowly, shifting weight onto your hands',
      'Lift your feet off the ground one at a time',
      'Hold the position, focusing on balance and breathing'
    ],
    progressionTargets: ['10 sec hold', '20 sec hold', '30 sec hold', '45 sec hold', '60 sec hold'],
    tips: [
      'Keep your gaze slightly forward, not straight down',
      'Engage your core throughout the movement',
      'Start with a pillow in front for confidence'
    ],
    muscleGroups: ['Core', 'Shoulders', 'Wrists'],
    image: frogStandImg
  },
  {
    id: 'l-sit',
    name: 'L-Sit',
    difficulty: 'beginner',
    tier: 'free',
    description: 'A fundamental static hold that develops incredible core strength and hip flexor endurance.',
    instructions: [
      'Sit on the ground with legs extended straight',
      'Place hands beside your hips, fingers pointing forward',
      'Press down through your palms and lift your entire body off the ground',
      'Keep legs straight and parallel to the floor',
      'Hold with shoulders depressed and core engaged'
    ],
    progressionTargets: ['5 sec hold', '10 sec hold', '15 sec hold', '20 sec hold', '30 sec hold'],
    tips: [
      'Use parallettes or yoga blocks if floor is too difficult',
      'Point your toes to increase leg engagement',
      'Keep shoulders down and away from ears'
    ],
    muscleGroups: ['Core', 'Hip Flexors', 'Triceps'],
    image: lSitImg
  },
  {
    id: 'headstand',
    name: 'Headstand',
    difficulty: 'beginner',
    tier: 'free',
    description: 'The gateway inversion that builds shoulder stability and body awareness for more advanced inversions.',
    instructions: [
      'Place your forearms on the ground in a triangle shape',
      'Place the crown of your head on the ground between your hands',
      'Walk your feet toward your head until hips stack over shoulders',
      'Lift one leg at a time, keeping core tight',
      'Extend both legs straight up, maintaining balance'
    ],
    progressionTargets: ['10 sec hold', '20 sec hold', '30 sec hold', '45 sec hold', '60 sec hold'],
    tips: [
      'Practice against a wall initially',
      'Keep most of the weight in your forearms, not your head',
      'Engage your core to prevent arching'
    ],
    muscleGroups: ['Shoulders', 'Core', 'Neck'],
    image: headstandImg
  },
  {
    id: 'pistol-squat',
    name: 'Pistol Squat',
    difficulty: 'beginner',
    tier: 'free',
    description: 'The ultimate single-leg strength exercise that builds leg power, balance, and mobility.',
    instructions: [
      'Stand on one leg with the other leg extended forward',
      'Extend arms forward for counterbalance',
      'Lower slowly by bending the standing knee',
      'Go as low as possible while keeping heel on ground',
      'Push through the heel to return to standing'
    ],
    progressionTargets: ['3 reps each leg', '5 reps', '8 reps', '10 reps', '15 reps'],
    tips: [
      'Use a box or bench to reduce range of motion initially',
      'Hold a light weight for counterbalance',
      'Work on ankle mobility separately'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Core'],
    image: pistolSquatImg
  },
  {
    id: 'handstand',
    name: 'Handstand',
    difficulty: 'intermediate',
    tier: 'free',
    description: 'The king of bodyweight skills. A freestanding handstand demonstrates mastery of balance and body control.',
    instructions: [
      'Start in a standing position facing a wall',
      'Place hands shoulder-width apart, about 6 inches from wall',
      'Kick up one leg at a time until both feet touch the wall',
      'Practice balancing by taking feet slightly off the wall',
      'Work toward freestanding by controlling micro-adjustments'
    ],
    progressionTargets: ['30 sec wall hold', '45 sec', '60 sec', '15 sec freestanding', '30 sec freestanding'],
    tips: [
      'Focus on shoulder protraction - push the ground away',
      'Keep fingers spread and actively gripping the floor',
      'Practice falling safely by cartwheeling out'
    ],
    muscleGroups: ['Shoulders', 'Core', 'Wrists', 'Triceps'],
    image: handstandImg
  },
  {
    id: 'skin-the-cat',
    name: 'Skin The Cat',
    difficulty: 'intermediate',
    tier: 'free',
    description: 'A dynamic shoulder mobility exercise that builds the foundation for advanced ring work.',
    instructions: [
      'Hang from a bar or rings with straight arms',
      'Tuck your knees to your chest',
      'Roll backward, passing your legs through your arms',
      'Lower into a German hang position slowly',
      'Reverse the movement to return to the starting position'
    ],
    progressionTargets: ['3 reps', '5 reps', '8 reps', 'Straight leg version', 'Slow negative 5 sec'],
    tips: [
      'Start with bent legs to reduce intensity',
      'Go slowly and control the movement throughout',
      'Never force the stretch - build range over time'
    ],
    muscleGroups: ['Shoulders', 'Lats', 'Core'],
    image: skinTheCatImg
  },
  {
    id: 'pullover',
    name: 'Pullover',
    difficulty: 'intermediate',
    tier: 'free',
    description: 'A fundamental bar transition skill that combines pulling strength with hip flexibility.',
    instructions: [
      'Start hanging from a bar with overhand grip',
      'Pull up while simultaneously bringing knees to chest',
      'Continue rolling backward over the bar',
      'End in a support position on top of the bar',
      'Control the descent back to hanging'
    ],
    progressionTargets: ['1 rep', '3 reps', '5 reps', 'Slow controlled', 'Straight leg pullover'],
    tips: [
      'Start with an explosive pull to build momentum',
      'Keep your body close to the bar throughout',
      'Use a lower bar to practice the motion'
    ],
    muscleGroups: ['Back', 'Biceps', 'Core'],
    image: pulloverImg
  },
  {
    id: 'tiger-bend-pushup',
    name: 'Tiger Bend Push Up',
    difficulty: 'intermediate',
    tier: 'free',
    description: 'An advanced push-up variation that builds tricep strength for planche and handstand push-ups.',
    instructions: [
      'Start in a forearm plank position',
      'Place hands flat beside your elbows',
      'Press through your hands to extend to a straight arm plank',
      'Lower back to forearms with control',
      'Repeat the pressing motion'
    ],
    progressionTargets: ['3 reps', '5 reps', '8 reps', '10 reps', '15 reps'],
    tips: [
      'Keep your body in a straight line throughout',
      'Focus on tricep engagement during the press',
      'Start elevated if floor is too difficult'
    ],
    muscleGroups: ['Triceps', 'Shoulders', 'Core'],
    image: tigerBendImg
  },
  {
    id: 'pole-flag',
    name: 'Pole Flag',
    difficulty: 'advanced',
    tier: 'free',
    description: 'An impressive display of lateral core strength and shoulder stability.',
    instructions: [
      'Grip a vertical pole with both hands, one high and one low',
      'The low arm pushes, the high arm pulls',
      'Engage your obliques and lift your body horizontally',
      'Keep your body straight like a flag',
      'Hold the position with full body tension'
    ],
    progressionTargets: ['Tuck flag 5 sec', 'Straddle 5 sec', 'Full flag 3 sec', '5 sec hold', '10 sec hold'],
    tips: [
      'Grip strength is crucial - train it separately',
      'Start with a vertical body position and progress',
      'The bottom arm does most of the work'
    ],
    muscleGroups: ['Obliques', 'Shoulders', 'Lats', 'Grip'],
    image: clutchFlagImg // Using clutch flag image as fallback
  },
  {
    id: 'clutch-flag',
    name: 'Clutch Flag',
    difficulty: 'advanced',
    tier: 'free',
    description: 'A horizontal flag variation performed on a vertical bar with a unique grip.',
    instructions: [
      'Grip the bar with top hand in underhand position',
      'Bottom hand grips in overhand position',
      'Pull with top arm and push with bottom arm',
      'Lift legs horizontally while keeping body straight',
      'Maintain full body tension throughout the hold'
    ],
    progressionTargets: ['Tuck 5 sec', 'Single leg 5 sec', 'Straddle 5 sec', 'Full 3 sec', 'Full 5 sec'],
    tips: [
      'Master the pole flag first for similar muscle engagement',
      'Work on shoulder stability and lat strength',
      'Use chalk for better grip'
    ],
    muscleGroups: ['Obliques', 'Lats', 'Shoulders'],
    image: clutchFlagImg
  },
  {
    id: 'elbow-lever',
    name: 'Elbow Lever',
    difficulty: 'advanced',
    tier: 'free',
    description: 'A horizontal balance hold that creates the illusion of defying gravity.',
    instructions: [
      'Place hands on the ground shoulder-width apart',
      'Bend forward and place one elbow against your hip/oblique',
      'Lean forward, shifting weight onto your hands',
      'Lift your legs off the ground behind you',
      'Balance horizontally with body parallel to floor'
    ],
    progressionTargets: ['5 sec hold', '10 sec hold', '15 sec hold', '20 sec hold', '30 sec hold'],
    tips: [
      'Experiment with elbow placement on hip vs oblique',
      'Keep looking slightly forward, not down',
      'Spread fingers wide for better balance'
    ],
    muscleGroups: ['Core', 'Shoulders', 'Wrists'],
    image: elbowLeverImg
  },
  {
    id: 'needle',
    name: 'Needle',
    difficulty: 'advanced',
    tier: 'free',
    description: 'An extreme flexibility skill showcasing total hamstring and hip mobility.',
    instructions: [
      'Stand on one leg with arms by your sides',
      'Raise the back leg straight behind you',
      'Simultaneously lower your torso forward',
      'Reach for the standing ankle or floor',
      'Aim for a 180-degree split while standing'
    ],
    progressionTargets: ['90 degrees', '120 degrees', '150 degrees', '170 degrees', 'Full needle'],
    tips: [
      'Warm up thoroughly before attempting',
      'Work on hamstring flexibility separately',
      'Use a wall for balance support initially'
    ],
    muscleGroups: ['Hamstrings', 'Hip Flexors', 'Lower Back'],
    image: needleImg
  },
  {
    id: 'bent-arm-handstand',
    name: 'Bent Arm Handstand',
    difficulty: 'advanced',
    tier: 'free',
    description: 'A crocodile-style handstand that requires tremendous tricep and shoulder strength.',
    instructions: [
      'Start in a frog stand position',
      'Lower your head toward the ground by bending arms',
      'Slowly extend legs upward into a handstand',
      'Keep elbows bent at 90 degrees throughout',
      'Balance with head close to the ground'
    ],
    progressionTargets: ['3 sec hold', '5 sec hold', '8 sec hold', '10 sec hold', '15 sec hold'],
    tips: [
      'Master the regular handstand first',
      'Build tricep strength with tiger bends',
      'Use a wall for support while learning'
    ],
    muscleGroups: ['Triceps', 'Shoulders', 'Core'],
    image: bentArmHandstandImg
  },
  {
    id: 'single-arm-elbow-lever',
    name: 'Single Arm Elbow Lever',
    difficulty: 'advanced',
    tier: 'free',
    description: 'The ultimate elbow lever progression - balancing your entire body on one arm.',
    instructions: [
      'Start in a two-arm elbow lever position',
      'Shift weight to one arm',
      'Slowly lift the free arm off the ground',
      'Extend free arm forward or to the side',
      'Hold with full body tension'
    ],
    progressionTargets: ['2 sec hold', '3 sec hold', '5 sec hold', '8 sec hold', '10 sec hold'],
    tips: [
      'Perfect the two-arm version first',
      'Work on wrist conditioning separately',
      'Shift weight gradually before lifting hand'
    ],
    muscleGroups: ['Core', 'Shoulder', 'Wrist'],
    image: singleArmElbowLeverImg
  },

  // ==================== PLANCHE MASTERY ====================

  {
    id: 'planche-phase-1',
    name: 'Planche Mastery: Phase 1',
    difficulty: 'beginner',
    tier: 'free',
    description: 'Phase 1 is about earning the right to lean. You will build the tissue tolerance and scapular protraction that makes planche training feel possible instead of painful.',
    instructions: [
      'Master wrist prep before every session',
      'Build scapular protraction with push-up plus',
      'Develop pushing strength with incline variations',
      'Learn the planche lean entry skill'
    ],
    progressionTargets: ['Wrist prep 5 min', 'Scap push-up 15 reps', 'Planche lean 10s', 'Planche lean 20s', 'Planche lean 30s'],
    tips: [
      'Microdose holds across 3–4 days beats one heroic day',
      'If elbows feel spicy: reduce lean angle for 7 days',
      'Wrist hygiene daily (2–3 minutes)'
    ],
    muscleGroups: ['Shoulders', 'Wrists', 'Serratus', 'Core'],
    image: plancheLeanImg,
    protocol_name: 'PROTOCOL: PLANCHE LADDER (PHASE 1)',
    objective: 'BUILD WRIST TOLERANCE + PROTRACTION CONTROL + FORWARD LEAN OWNERSHIP.',
    category: 'Leverage',
    movements: [
      {
        name: 'WRIST PREP',
        mechanic: 'Wrist rocks (front/back + side/side) and circles. Keep pressure even through the palm—don\'t dump into the heel of the hand.',
        brutality: 'Passive wrists are brittle. We are restoring tissue tolerance. This is your planche insurance policy.',
        progression: 'Bodyweight → Longer range → Fingertip rocking (optional)',
        volume: '5–6 minutes total prep',
        watch_out: 'Sharp wrist pain = reduce range immediately.',
        movement_recovery: 'Finger flexor stretch + wrist CARs (slow).'
      },
      {
        name: 'SCAP PUSH-UP PLUS (PROTRACTION REPS)',
        mechanic: 'Straight arms. In plank, push the floor away until your upper back rounds slightly, then return to neutral without bending elbows.',
        brutality: 'This looks easy until your serratus taps out. If planche is a door, this is the key.',
        progression: 'Incline → Floor → Feet elevated',
        volume: '3–4 sets × 8–15 reps (45–60s rest)',
        watch_out: 'If elbows bend, you turned it into a push-up (wrong stimulus).',
        movement_recovery: 'Wall slides + light pec doorway stretch.'
      },
      {
        name: 'INCLINE PUSH-UP (QUALITY ENGINE)',
        mechanic: 'Hands shoulder-width, elbows ~45°. Body stays one line. Lower chest to target and press back up without losing ribs-down control.',
        brutality: 'Gravity exposes core leaks. If you can\'t hold alignment here, planche will collect interest later.',
        progression: 'Wall → Counter → Low box → Floor',
        volume: '4 sets × 6–12 reps (60–90s rest)',
        watch_out: 'Rib flare or hip sag = regress the incline.',
        movement_recovery: 'Wrist extension stretch + thoracic opener.'
      },
      {
        name: 'PLANCHE LEAN (ENTRY SKILL)',
        mechanic: 'Hands slightly behind shoulders. Lock elbows. Push the floor away (protract) and lean forward while staying hollow (ribs to hips).',
        brutality: 'You are fighting leverage. If you lose the lean, you lose the protocol. Small holds win.',
        progression: 'Small lean → Deeper lean → Longer holds',
        volume: '5 sets × 10–25s (60–90s rest)',
        watch_out: 'Bent elbows = instant fail. Reset, reduce lean.',
        movement_recovery: 'Forearm flush + gentle biceps tendon unload (easy stretch).'
      }
    ],
    intensity_markers: [
      'Protraction Integrity: if shoulder blades drift together, the set is over.',
      'Lockout Rule: elbows stay straight—no negotiation.',
      'Learning Rule: microdose holds across 3–4 days beats one heroic day.'
    ],
    recovery_vector: [
      'Wrist hygiene daily (2–3 minutes).',
      'Serratus wall slides after sessions.',
      'If elbows feel spicy: reduce lean angle for 7 days.'
    ]
  },

  {
    id: 'planche-phase-2',
    name: 'Planche Mastery: Phase 2',
    difficulty: 'intermediate',
    tier: 'free',
    description: 'Phase 2 is where planche becomes real. Your job is simple: keep elbows locked, keep protraction max, and never chase fatigue with sloppy leverage.',
    instructions: [
      'Master pseudo planche push-ups with forward lean',
      'Build straight-arm holds with planche planks',
      'Learn tuck planche entry and float',
      'Optional: rings straight-arm lean for shoulder health'
    ],
    progressionTargets: ['Pseudo PPPU 5 reps', 'Planche plank 20s', 'Tuck planche 5s', 'Tuck planche 10s', 'Tuck planche 15s'],
    tips: [
      'Film 1 set, then train. Don\'t audit every rep.',
      'Keep total planche isometrics under 90 seconds per session at first',
      'Exit control: you must be able to stop the hold on purpose'
    ],
    muscleGroups: ['Shoulders', 'Triceps', 'Core', 'Serratus'],
    image: tuckPlancheImg,
    protocol_name: 'PROTOCOL: PLANCHE LADDER (PHASE 2)',
    objective: 'TURN THE LEAN INTO A STRAIGHT-ARM HOLD. BUILD TENDON CAPACITY SAFELY.',
    category: 'Leverage',
    movements: [
      {
        name: 'PSEUDO PLANCHE PUSH-UP',
        mechanic: 'Hands slightly back. Lean forward before you descend. At the top: elbows lock + scap protraction + hollow stays tight.',
        brutality: 'This is a push-up that punishes dishonesty. Lose the lean and you\'ve changed the exercise.',
        progression: 'Knee pseudo (small lean) → Toe pseudo (shallow lean) → Deeper lean',
        volume: '4 sets × 5–10 reps (90s rest)',
        watch_out: 'Soft elbows at the top = stop the set and reset.',
        movement_recovery: 'Serratus release (ball) + wrist flexor stretch.'
      },
      {
        name: 'PLANCHE PLANK (STRAIGHT-ARM)',
        mechanic: 'Elbows locked. Push floor away. Hollow body. Hold the line like you\'re freezing a screenshot.',
        brutality: 'This is tendon work. It should feel intense without feeling sketchy. Respect the line.',
        progression: 'Knees → Toes (light) → Deeper lean angle',
        volume: '5 sets × 15–30s (60–90s rest)',
        watch_out: 'If elbows bend even 1 degree, you just left planche training.',
        movement_recovery: 'Cold water forearm dip (optional) + gentle biceps stretch.'
      },
      {
        name: 'TUCK PLANCHE (INTRO FLOAT)',
        mechanic: 'From a strong lean: tuck knees tight to chest, shoulders forward, elbows locked, protract hard. Small float, clean exit.',
        brutality: 'This is where your nervous system panics. Stay calm. Small holds are the correct dose.',
        progression: 'Toe taps (micro float) → Tuck holds → Tuck re-entries',
        volume: '8–10 sets × 5–12s (60–90s rest)',
        watch_out: 'Jumping into it = wrist tax. Float only.',
        movement_recovery: 'Forearm massage + scap wall slides.'
      },
      {
        name: 'RINGS STRAIGHT-ARM LEAN (OPTIONAL ASSIST)',
        mechanic: 'Rings low. Feet on floor for assistance. Lock elbows, turn rings slightly out, lean forward while protracting and staying hollow.',
        brutality: 'Rings expose weak stacking instantly. The goal is control, not heroics.',
        progression: 'More foot support → Less foot support → Longer holds',
        volume: '4–6 sets × 10–20s (60–90s rest)',
        watch_out: 'If rings drift into your arms or elbows soften, reduce lean.',
        movement_recovery: 'Biceps tendon unload stretch + light dead hang.'
      }
    ],
    intensity_markers: [
      'Straight-Arm Law: elbows locked = valid rep. Anything else is a different exercise.',
      'Exit Control: you must be able to stop the hold on purpose.',
      'Learning Rule: film 1 set, then train. Don\'t audit every rep.'
    ],
    recovery_vector: [
      'If wrists get sore: reduce lean angle for 1 week, keep frequency.',
      'If elbows get sore: swap 1 day for rings lean with more foot support.',
      'Keep total planche isometrics under 90 seconds per session at first.'
    ]
  }
];

export const getSkillsByDifficulty = (difficulty: Skill['difficulty']) => 
  skills.filter(skill => skill.difficulty === difficulty);

export const getSkillsByTier = (tier: Skill['tier']) => 
  skills.filter(skill => skill.tier === tier);

export const getFreeSkills = () => skills.filter(skill => skill.tier === 'free');
export const getBasicSkills = () => skills.filter(skill => skill.tier === 'basic' || skill.tier === 'free');
export const getAllSkills = () => skills;

// Planche progression phases for track display
export const PLANCHE_PROGRESSION_PHASES = [
  {
    phase: 1,
    name: 'Push-Up → Lean Foundations',
    description: 'Weeks 1–4: Build wrist tolerance, scapular protraction, and forward-lean control without tendon drama.',
    technical_cues: ['Hands slightly back', 'Push floor away', 'Ribs down', 'Lean forward on purpose'],
    common_errors: ['Soft elbows at top', 'Shoulders shrugging', 'Hips piked to fake it'],
    duration_target: 'Planche Lean: 3×20s clean'
  },
  {
    phase: 2,
    name: 'Straight-Arm Lock + Planche Plank',
    description: 'Weeks 5–8: Convert your lean into a straight-arm hold. This is where connective tissue earns its paycheck.',
    technical_cues: ['Elbows locked hard', 'Protract to a round upper back', 'Glutes on', 'Quiet neck'],
    common_errors: ['Bent elbows (instant fail)', 'Scap collapse', 'Leaning without hollow'],
    duration_target: 'Planche Plank: 5×20s'
  },
  {
    phase: 3,
    name: 'Tuck Planche + Rings Assist',
    description: 'Weeks 9–16: Start floating. Keep volume conservative. Quality over ego, always.',
    technical_cues: ['Knees tucked tight', 'Scap protraction stays max', 'Hands torque into floor', 'Small holds, many sets'],
    common_errors: ['Jumping into it', 'Losing protraction', 'Painful wrists/elbows ignored'],
    duration_target: 'Tuck Planche: 8×8–12s'
  },
  {
    phase: 4,
    name: 'Advanced Tuck → Straddle Prep',
    description: 'Months 4–12: You earn leverage by stacking compression + straight-arm strength. Straddle is not a vibe—it\'s a contract.',
    technical_cues: ['Hips higher, knees farther', 'Compression work stays weekly', 'Leans stay strong', 'Attempts stay controlled'],
    common_errors: ['Rushing to straddle', 'Ignoring compression', 'Grinding through elbow pain'],
    duration_target: 'Advanced Tuck: 6×10s clean'
  }
];
