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
  }
];

export const getSkillsByDifficulty = (difficulty: Skill['difficulty']) => 
  skills.filter(skill => skill.difficulty === difficulty);

export const getSkillsByTier = (tier: Skill['tier']) => 
  skills.filter(skill => skill.tier === tier);

export const getFreeSkills = () => skills.filter(skill => skill.tier === 'free');
export const getBasicSkills = () => skills.filter(skill => skill.tier === 'basic' || skill.tier === 'free');
export const getAllSkills = () => skills;
