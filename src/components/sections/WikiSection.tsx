import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WikiEntry {
  title: string;
  content: string;
  keyExercises?: string[];
  proTips?: string[];
}

interface WikiCategory {
  id: string;
  emoji: string;
  label: string;
  description: string;
  entries: WikiEntry[];
}

const wikiData: WikiCategory[] = [
  {
    id: 'calisthenics',
    emoji: '💪',
    label: 'CALISTHENICS',
    description: 'The art of using your bodyweight as resistance to build extraordinary strength, control, and aesthetics.',
    entries: [
      {
        title: 'Progressive Overload Principles',
        content: 'Progressive overload is the foundation of all strength training. In calisthenics, you progress by: (1) increasing reps, (2) increasing hold time, (3) moving to a harder variation, (4) adding external load, or (5) decreasing rest periods. Unlike weight training where you add plates, calisthenics progression is about mastering leverage and body positioning.\n\nThe key is to master each variation with perfect form before advancing. A sloppy muscle-up teaches bad habits — a clean one builds the foundation for iron cross work. Aim for 3×8-12 reps with clean form before progressing.',
        keyExercises: ['Push-ups → Diamond → Pseudo Planche', 'Pull-ups → Archer → One-Arm', 'Dips → Ring Dips → Weighted'],
        proTips: ['Track your max reps weekly to quantify progress', 'Video yourself from the side — you\'ll catch form breakdowns you can\'t feel'],
      },
      {
        title: 'Skill Tiers: Beginner to Elite',
        content: '**Beginner (0-6 months):** Push-ups, pull-ups, dips, rows, hollow body holds, plank, L-sit attempts. Focus on building tendon strength and motor patterns.\n\n**Intermediate (6-18 months):** Muscle-ups, handstand holds (wall), pistol squats, L-sit, skin-the-cat, front lever tuck. Start dedicated skill sessions.\n\n**Advanced (18-36 months):** Free handstand, straddle planche lean, front lever, back lever, 360 pulls. Requires structured programming with deloads.\n\n**Elite (3+ years):** Full planche, iron cross, manna, Victorian cross, one-arm pull-up, hefesto. These skills require years of tendon adaptation — rushing leads to injury.',
        keyExercises: ['Hollow Body → L-sit → V-sit → Manna', 'Tuck Planche → Straddle → Full Planche', 'Tuck Front Lever → Half → Full'],
      },
      {
        title: 'Push/Pull/Legs Split for Calisthenics',
        content: 'The classic PPL split works beautifully for calisthenics. Each session lasts 45-60 minutes with 3-5 exercises.\n\n**Push Day:** Handstand practice (10 min), pseudo planche push-ups 4×8, dips 3×12, pike push-ups 3×10, planche lean holds 5×10s.\n\n**Pull Day:** Front lever work (10 min), pull-ups 4×8, rows 3×12, skin-the-cat 3×5, bicep curls (rings) 3×12.\n\n**Legs Day:** Pistol squat progressions 4×6 each, Nordic curls 3×8, calf raises 4×15, jump squats 3×10, single-leg glute bridges 3×12.\n\nRest 90-120 seconds between sets for strength work, 60s for accessories.',
        proTips: ['Superset push/pull movements on time-crunched days', 'Always start with skill work when fresh', 'Deload every 4th week: reduce volume by 40%'],
      },
      {
        title: 'Static Holds vs Dynamic Movements',
        content: 'Static holds (isometrics) and dynamic movements serve different purposes and both are essential.\n\n**Static holds** build joint-angle-specific strength, tendon resilience, and the mind-muscle connection needed for advanced skills. Examples: planche hold, front lever, L-sit, handstand.\n\n**Dynamic movements** build strength across the full range of motion, develop power, and build muscle mass more effectively. Examples: muscle-ups, dips, pull-ups, push-ups.\n\n**The optimal approach:** Start each session with static skill work (when CNS is fresh), then move to dynamic strength work, finish with accessories. Aim for 5-10s holds building to 15-30s before progressing.',
      },
      {
        title: 'Common Injuries & Prevention',
        content: 'Calisthenics puts unique demands on wrists, shoulders, and elbows. Prevention is always better than rehabilitation.\n\n**Wrist Pain:** The most common issue. Fix: daily wrist CARs (Controlled Articular Rotations), wrist push-ups, and rice bucket exercises. Always warm up wrists before handstand/planche work.\n\n**Shoulder Impingement:** Usually from too much pushing without enough pulling. Fix: 2:1 pull-to-push ratio, band pull-aparts, face pulls, and external rotation work.\n\n**Elbow Tendinitis (Golfer\'s/Tennis):** From gripping and straight-arm work. Fix: eccentric wrist curls, reduce volume by 50%, ice after training.\n\n**Rule of thumb:** If pain is sharp or persists beyond 48 hours, see a physiotherapist. Modify, don\'t stop — train around injuries.',
        proTips: ['Warm up with 5 min of wrist circles, shoulder dislocates, and band pull-aparts', 'Never skip the eccentric phase — it builds tendon resilience'],
      },
    ],
  },
  {
    id: 'ballet',
    emoji: '🩰',
    label: 'BALLET',
    description: 'Classical technique refined over centuries — builds extraordinary balance, flexibility, and body control that transfers to all movement disciplines.',
    entries: [
      {
        title: 'The Five Positions',
        content: 'Ballet\'s foundation rests on five foot positions, each paired with corresponding arm positions (port de bras).\n\n**First Position:** Heels together, toes turned out ~90° (or as far as your hips allow naturally). Arms rounded in front of the body at navel height.\n\n**Second Position:** Feet separated shoulder-width, turned out. Arms extended to the sides, slightly below shoulder height with soft elbows.\n\n**Third Position:** One foot in front, heel against the arch of the back foot. One arm in first position, the other in second.\n\n**Fourth Position:** Feet parallel but separated front-to-back, turned out. One arm overhead, the other in second position.\n\n**Fifth Position:** Feet together, completely crossed with the front heel touching the back toe. Both arms overhead, rounded.',
        keyExercises: ['Relevé in each position', 'Plié in each position', 'Port de bras through all positions'],
        proTips: ['Turnout comes from the HIP, not the knee or ankle — forcing turnout at the foot causes injury', 'A 45° natural turnout is better than a forced 90°'],
      },
      {
        title: 'Barre Work Fundamentals',
        content: 'The barre is where every ballet class begins. It\'s not a crutch — it\'s a tool to isolate and refine movement patterns.\n\n**Pliés:** Bending exercises in all positions. Demi-plié (half) and grand plié (full). Trains ankle/knee/hip alignment and builds quad/glute strength. 8 reps per position.\n\n**Tendus:** Sliding the foot along the floor to a pointed position and back. Builds foot articulation and teaches the feeling of "reaching" through the leg. 8 front, side, back.\n\n**Dégagés:** Like tendus but the foot lifts slightly off the floor. Builds speed and sharpness. Same pattern as tendus.\n\n**Rond de jambe:** Circular movement of the working leg on the floor or in the air. Opens the hip and teaches circular coordination.\n\n**Relevé:** Rising onto the balls of the feet (demi-pointe). The ultimate calf/ankle strengthener. Hold 8 counts.',
        proTips: ['Use the barre lightly — fingertips only. If you\'re gripping, you\'re not balanced', 'Keep both hips level and square to the barre'],
      },
      {
        title: 'Ballet for Athletes',
        content: 'Ballet conditioning has been adopted by NFL players, UFC fighters, and Olympic gymnasts for good reason.\n\n**Balance:** Single-leg work in ballet (arabesque, développé, attitude) builds proprioception that transfers to every sport.\n\n**Flexibility:** Active flexibility through controlled movements (unlike passive stretching) builds usable range of motion.\n\n**Body Control:** The slow, precise nature of ballet teaches muscular control at every point in a range of motion — essential for calisthenics skills.\n\n**Ankle/Foot Strength:** Relevé work builds bulletproof ankles, reducing injury risk in any sport.\n\n**Core Integration:** Ballet\'s emphasis on "pulling up" through the center builds deep core stability without crunches.\n\nRecommended: Add 20 minutes of barre work as a warm-up 2× per week.',
        keyExercises: ['Relevé series (all positions)', 'Grand plié series', 'Arabesque holds', 'Développé (front/side/back)'],
      },
      {
        title: 'Arabesque & Extensions',
        content: 'The arabesque is ballet\'s most iconic pose and one of its most demanding. Standing on one leg with the other extended behind, torso lifted.\n\n**First Arabesque:** Supporting leg straight, working leg extended behind at 45-90°. Same-side arm forward, opposite arm to the side.\n\n**Building to it:** Start with arabesque penchée (leaning forward as the leg lifts) at the barre. Focus on hip alignment — both hip bones face forward. The back should not arch excessively.\n\n**For calisthenics athletes:** Arabesque teaches posterior chain activation and hip extension that directly transfers to back lever and skin-the-cat positions.\n\n**Common mistake:** Lifting the leg by arching the lower back instead of using the glutes. Fix: engage the core, think of the standing hip "scooping" under.',
      },
    ],
  },
  {
    id: 'yoga',
    emoji: '🧘',
    label: 'YOGA',
    description: 'Ancient practice uniting breath, movement, and meditation — essential for flexibility, recovery, and mental focus.',
    entries: [
      {
        title: 'Sun Salutation (Surya Namaskar)',
        content: 'The Sun Salutation is yoga\'s most fundamental flow — a complete warm-up and standalone practice.\n\n**Sequence A (12 breaths):**\n1. Mountain Pose (Tadasana) — Stand tall, palms together\n2. Upward Salute (Urdhva Hastasana) — Reach overhead\n3. Standing Forward Fold (Uttanasana) — Hinge at hips\n4. Half Lift (Ardha Uttanasana) — Flat back, hands on shins\n5. Plank — Step or jump back\n6. Chaturanga — Low push-up (elbows tight)\n7. Upward Dog (Urdhva Mukha) — Chest through arms\n8. Downward Dog (Adho Mukha) — Inverted V, hold 5 breaths\n9-12. Step forward, reverse the sequence back to Mountain\n\nPerform 3-5 rounds as a warm-up. Each movement syncs with one breath (inhale or exhale).',
        keyExercises: ['Chaturanga (builds push-up strength)', 'Downward Dog (shoulder/hamstring flexibility)', 'Upward Dog (spine extension)'],
        proTips: ['Breathe through the NOSE only — mouth breathing signals you\'re pushing too hard', 'Chaturanga is a push-up, not a flop — control the descent'],
      },
      {
        title: 'Warrior Series (Virabhadrasana)',
        content: 'The Warrior poses build leg strength, hip flexibility, and mental focus. They\'re named after a fierce warrior from Hindu mythology.\n\n**Warrior I:** Front knee bent 90°, back leg straight, hips square forward, arms overhead. Builds: quad strength, hip flexor stretch, shoulder mobility.\n\n**Warrior II:** Front knee bent 90°, back leg straight, hips open to the side, arms extended. Builds: lateral hip strength, inner thigh flexibility, shoulder endurance.\n\n**Warrior III:** Standing on one leg, torso and back leg parallel to the floor, arms forward. Builds: balance, hamstring strength, core stability.\n\nHold each for 5-10 breaths per side. These poses complement calisthenics by opening the hips and building isometric leg strength.',
        proTips: ['In Warrior I, the back foot should be at 45°, not 90°', 'Warrior III is essentially a single-leg deadlift — use it as a balance diagnostic'],
      },
      {
        title: 'Inversions & Arm Balances',
        content: 'Yoga\'s inversions overlap significantly with calisthenics skill work.\n\n**Headstand (Sirsasana):** Supported on forearms and crown of head. Builds: shoulder stability, core engagement, spatial awareness. Hold 1-3 minutes.\n\n**Crow Pose (Bakasana):** Hands on floor, knees on back of upper arms, feet lifted. Essentially a tuck planche with arm support. Builds: wrist strength, core compression, balance.\n\n**Forearm Stand (Pincha Mayurasana):** Similar to handstand but on forearms. Great progression toward freestanding handstand.\n\n**Shoulder Stand (Sarvangasana):** Supported on shoulders and upper arms. Gentle inversion for recovery and neck flexibility.\n\nFor calisthenics athletes: Crow → Headstand → Forearm Stand → Handstand is a natural progression path.',
        keyExercises: ['Crow Pose → Side Crow → Flying Crow', 'Headstand → Forearm Stand → Handstand', 'Shoulder Stand (recovery)'],
      },
      {
        title: 'Flexibility vs Mobility',
        content: 'These terms are often confused but represent fundamentally different qualities.\n\n**Flexibility** is passive range of motion — how far a joint moves when an external force is applied (like gravity in a forward fold). Measured by stretching.\n\n**Mobility** is active range of motion — how far you can move a joint using your own muscular control. Measured by lifting.\n\nFor calisthenics: **mobility matters more.** You need active control at end-range positions (think: straddle in a front lever, pike in a press handstand).\n\n**Training approach:** Use yoga-style stretching (flexibility) to increase range, then "own" that range with active exercises (CARs, PAILs/RAILs, loaded stretching). The goal: close the gap between passive and active range.',
        proTips: ['Stretch after training when muscles are warm, not before', 'Hold stretches 60-120 seconds for connective tissue adaptation'],
      },
      {
        title: 'Pranayama (Breathing)',
        content: 'Breathwork is yoga\'s secret weapon for recovery, focus, and parasympathetic activation.\n\n**Ujjayi Breath:** "Ocean breath." Slight throat constriction creating an audible whoosh. Use during all yoga flows. Builds: focus, internal heat, rhythmic movement.\n\n**Box Breathing (4-4-4-4):** Inhale 4 counts, hold 4, exhale 4, hold 4. Navy SEALs use this for stress management. Use between sets or before competition.\n\n**Nadi Shodhana (Alternate Nostril):** Breathe through one nostril at a time. Balances the nervous system. 5 minutes before sleep dramatically improves recovery.\n\n**Wim Hof Method:** 30 rapid breaths, exhale and hold. Builds CO2 tolerance and mental toughness. Use cautiously — never in water or driving.\n\nFor athletes: 5-10 minutes of pranayama post-training accelerates recovery more than passive rest.',
      },
    ],
  },
  {
    id: 'gymnastics',
    emoji: '🤸',
    label: 'GYMNASTICS',
    description: 'The foundation of all bodyweight strength — rings, floor, and apparatus skills that define human physical potential.',
    entries: [
      {
        title: 'Rings Fundamentals',
        content: 'Gymnastic rings are the ultimate upper body tool because they\'re inherently unstable, forcing stabilizer muscles to work harder.\n\n**Support Hold:** The first skill. Rings turned out (RTO), arms straight, body vertical. Build to 30s before progressing. This alone builds more shoulder stability than months of bench pressing.\n\n**Ring Dips:** Harder than parallel bar dips because of instability. Keep rings close to body, elbows in. 3×8 before adding RTO.\n\n**Ring Rows:** Adjust body angle from standing (easy) to horizontal (hard). The pulling equivalent of push-ups.\n\n**L-sit on Rings:** Exponentially harder than parallettes due to instability. Build ring support → tuck L-sit → full L-sit.\n\n**False Grip:** The key to muscle-ups. Wrist sits on top of the ring, not hanging below it. Painful at first — persistence wins.',
        keyExercises: ['Support Hold → RTO Support', 'Ring Dips → RTO Dips → Weighted', 'Ring Muscle-up → Slow Muscle-up'],
        proTips: ['Hang your rings at a height where your feet clear the floor in a support hold', 'Chalk your wrists for false grip work — it reduces slipping dramatically'],
      },
      {
        title: 'Floor Skills Progression',
        content: 'Gymnastics floor work builds power, spatial awareness, and full-body coordination.\n\n**Forward Roll → Backward Roll:** The foundation. Teaches tucking, rolling, and spatial awareness. Master these completely before inverting.\n\n**Handstand → Handstand Forward Roll:** The bridge between static and dynamic skills. Kick up, hold 3s, tuck and roll out.\n\n**Cartwheel → Round-off:** Lateral rotation skills. Cartwheel is an open-hand, one-at-a-time movement. Round-off is a snapping, two-foot landing. Essential for tumbling.\n\n**Bridge → Bridge Kickover:** Builds spinal flexibility and push strength. Start against a wall, progress to floor.\n\n**Back Walkover → Back Handspring:** The gateway to advanced tumbling. Requires significant shoulder flexibility and explosive push from the floor.',
        proTips: ['Practice on grass or mats — not hardwood floors', 'Spot yourself using a wall or incline before going freestanding'],
      },
      {
        title: 'Iron Cross Progression',
        content: 'The Iron Cross is gymnastics\' most iconic strength element — arms extended to the sides in a support hold on rings. It requires extraordinary straight-arm pressing strength.\n\n**The progression (expect 3-5 years):**\n\n1. **Ring Support Hold** — 60s with rings turned out\n2. **Wide Ring Push-ups** — Rings set wide, controlled descent and push\n3. **Ring Flyes** — Slowly lower to a wide position with bent arms, push back\n4. **Cross Pulls** — Using a band or pulley, practice the cross position with assistance\n5. **Eccentric Cross** — Lower into the cross position over 5-10 seconds with control\n6. **Iron Cross Holds** — Start with 2-3 seconds, build to 10+\n\n**Requirements before attempting:** 15+ strict ring dips, 60s RTO support, 10+ ring flyes with controlled eccentric. Attempting too early risks bicep tendon injury.',
        keyExercises: ['RTO Support → Wide Flyes → Cross Pulls → Iron Cross'],
        proTips: ['The iron cross is primarily a bicep tendon exercise — condition slowly', 'Training the cross 2× per week is plenty — tendons recover slowly'],
      },
      {
        title: 'Strength Standards',
        content: 'Where does your bodyweight strength stack up? Here are benchmarks across skill levels.\n\n**Beginner (6 months):**\n• 10 strict pull-ups, 20 push-ups, 20s L-sit, 30s plank, 10s headstand\n\n**Intermediate (1-2 years):**\n• 1 strict muscle-up, 5 pistol squats, 30s L-sit, 10s handstand (wall), 5 ring dips\n\n**Advanced (2-4 years):**\n• 5 strict muscle-ups, 15s freestanding handstand, 10s front lever (tuck), 10s back lever, 5s tuck planche\n\n**Elite (4+ years):**\n• 30s freestanding handstand, full front lever hold, full back lever, straddle planche, iron cross hold, one-arm pull-up\n\n**Superhuman (rare):**\n• Full planche, manna, Victorian cross, maltese, one-arm handstand, hefesto\n\nThese are approximate — genetics, body composition, and training history all play a role.',
      },
    ],
  },
  {
    id: 'mobility',
    emoji: '🔄',
    label: 'MOBILITY',
    description: 'The ability to move your joints through their full range with control — the bridge between flexibility and strength.',
    entries: [
      {
        title: 'Joint-by-Joint Approach',
        content: 'The body alternates between joints that need mobility and joints that need stability:\n\n• **Ankle** → Needs MOBILITY (dorsiflexion for squats)\n• **Knee** → Needs STABILITY (prevent valgus collapse)\n• **Hip** → Needs MOBILITY (all planes of movement)\n• **Lumbar Spine** → Needs STABILITY (protect the lower back)\n• **Thoracic Spine** → Needs MOBILITY (rotation, extension)\n• **Scapula** → Needs STABILITY (shoulder health)\n• **Shoulder** → Needs MOBILITY (overhead, behind-back)\n• **Wrist** → Needs MOBILITY (handstand, planche)\n\nWhen a mobile joint becomes stiff, the stable joint above or below compensates — leading to injury. Example: tight hips → lower back pain.',
        proTips: ['Test each joint\'s range monthly and focus training on the weakest links', 'Morning mobility routines (10 min) have the highest compliance rate'],
      },
      {
        title: 'CARs (Controlled Articular Rotations)',
        content: 'CARs are the single most important mobility exercise. They maintain and expand joint range of motion by taking each joint through its fullest possible circle.\n\n**How to perform:** Slowly rotate a joint through the biggest circle possible, using maximum tension (irradiation) throughout. Each rotation should take 30-60 seconds.\n\n**Daily CARs routine (10 minutes):**\n1. Neck CARs — 3 each direction\n2. Shoulder CARs — 3 each arm\n3. Scapular CARs — 3 each side\n4. Wrist CARs — 3 each hand\n5. Hip CARs — 3 each leg\n6. Ankle CARs — 3 each foot\n\nDo this every morning. It\'s the highest-return mobility investment you can make. After 30 days of daily CARs, you\'ll feel fundamentally different.',
        keyExercises: ['Morning CARs routine (full body)', 'Pre-workout CARs (target area)', 'Post-workout CARs (active recovery)'],
      },
      {
        title: 'End-Range Training (PAILs/RAILs)',
        content: 'PAILs (Progressive Angular Isometric Loading) and RAILs (Regressive Angular Isometric Loading) are the gold standard for building usable flexibility.\n\n**Protocol:**\n1. Assume a stretch position (e.g., pigeon pose for hip)\n2. Hold passively for 2 minutes to desensitize the stretch reflex\n3. **PAILs:** Push INTO the stretch surface (isometric contraction of the stretching muscle) for 10-20 seconds at increasing intensity\n4. **RAILs:** Pull DEEPER into the stretch (isometric contraction of the opposing muscle) for 10-20 seconds\n5. You\'ll find you can go deeper than before\n6. Hold the new range passively for 30 seconds\n\nThis teaches the nervous system that the new range is safe and controllable. 2-3 rounds per position, 2× per week.',
        proTips: ['The PAILs contraction should ramp from 30% to 100% effort over the 20 seconds', 'If you can\'t contract in the new range, you\'re going too deep too fast'],
      },
    ],
  },
  {
    id: 'nutrition',
    emoji: '🥗',
    label: 'NUTRITION',
    description: 'Fueling the bodyweight athlete — protein, timing, and hydration for optimal performance and recovery.',
    entries: [
      {
        title: 'Protein for Bodyweight Athletes',
        content: 'Calisthenics athletes need protein for muscle repair and tendon health. The research is clear: **1.6-2.2g per kg of bodyweight per day** is optimal for strength and hypertrophy.\n\n**For a 75kg athlete: 120-165g protein daily.**\n\n**Timing matters less than total intake**, but distributing protein across 3-5 meals optimizes muscle protein synthesis. The "anabolic window" is really a 24-hour process, not a 30-minute panic.\n\n**Best sources:** Eggs (6g each), chicken breast (31g per 100g), Greek yogurt (10g per 100g), lentils (9g per 100g), whey protein (25g per scoop).\n\nIf you\'re not gaining strength, you\'re probably not eating enough protein. Track for one week to find out.',
        proTips: ['Eat 30-40g protein within 2 hours post-training', 'Casein protein before bed supports overnight recovery'],
      },
      {
        title: 'Hydration & Electrolytes',
        content: 'Dehydration of just 2% bodyweight reduces strength by 10-20%. Most athletes are chronically under-hydrated.\n\n**Daily target:** 35-40ml per kg of bodyweight + 500ml per hour of training. For a 75kg athlete: ~3L daily baseline.\n\n**Electrolytes:** Sodium, potassium, and magnesium are lost in sweat. Add a pinch of salt to water during long sessions. Post-training: coconut water or an electrolyte tablet.\n\n**Signs of dehydration:** Dark urine, headache, decreased grip strength, poor concentration. If you feel thirsty, you\'re already 1-2% dehydrated.\n\n**Coffee counts** toward hydration despite the myth. But limit caffeine to before 2pm for sleep quality.',
      },
    ],
  },
  {
    id: 'recovery',
    emoji: '😴',
    label: 'RECOVERY',
    description: 'You don\'t get stronger during training — you get stronger during recovery. Optimize it.',
    entries: [
      {
        title: 'Deload Weeks',
        content: 'Training breaks you down. Recovery builds you up. Every 3-5 weeks, take a deload week.\n\n**What to do:** Reduce training volume by 40-50% while maintaining intensity (weight/difficulty). So if you normally do 4×8 muscle-ups, do 2×8 during deload.\n\n**Why it works:** Accumulated fatigue masks fitness. After a deload, fatigue dissipates and your true fitness level is revealed — you often hit PRs the week after a deload.\n\n**Signs you need a deload:** Persistent joint soreness, decreased motivation, stalled progress for 2+ weeks, poor sleep despite adequate duration, increased resting heart rate.\n\nSchedule deloads proactively — don\'t wait until you\'re burned out.',
        proTips: ['Deload weeks are perfect for extra mobility work and skill practice', 'Don\'t skip the gym during deload — just reduce volume'],
      },
      {
        title: 'Sleep Optimization',
        content: 'Sleep is the single most powerful recovery tool. Growth hormone peaks during deep sleep. Aim for 7-9 hours.\n\n**Sleep hygiene protocol:**\n• Same bedtime/wake time daily (±30 min) — even weekends\n• Room temperature: 18-20°C (65-68°F)\n• Complete darkness — blackout curtains or sleep mask\n• No screens 60 min before bed (or use blue light glasses)\n• No caffeine after 2pm\n• Magnesium glycinate (200-400mg) 30 min before bed\n\n**Napping:** A 20-minute nap between 1-3pm boosts recovery without affecting nighttime sleep. Longer naps (90 min) can help after very hard training days.\n\nIf you\'re sleeping less than 7 hours, improving sleep will do more for your progress than any supplement or technique.',
        proTips: ['Track sleep with a wearable — you can\'t improve what you don\'t measure', 'Sunlight exposure within 30 min of waking regulates your circadian rhythm'],
      },
      {
        title: 'Active Recovery Protocols',
        content: 'Rest days don\'t mean "do nothing" days. Active recovery accelerates adaptation.\n\n**Light Movement (30-45 min):** Walking, easy cycling, swimming. Keep heart rate below 120bpm. Increases blood flow to muscles without creating additional stress.\n\n**Mobility Work:** Full CARs routine, yoga flow, foam rolling. Target areas that feel tight or restricted from recent training.\n\n**Cold Exposure:** 2-5 minutes in cold water (10-15°C). Reduces inflammation and enhances parasympathetic recovery. Best after very hard sessions, NOT after hypertrophy-focused training (inflammation is part of the growth signal).\n\n**Contrast Showers:** Alternate 30s hot / 30s cold for 5-7 cycles. Drives blood flow and reduces DOMS.\n\n**Sauna:** 15-20 minutes at 80-100°C. Increases growth hormone, improves cardiovascular health. 2-3× per week.',
      },
    ],
  },
];

export function WikiSection() {
  const [openCategory, setOpenCategory] = useState<string | null>('calisthenics');
  const [openEntry, setOpenEntry] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredCategories = wikiData.map(cat => ({
    ...cat,
    entries: cat.entries.filter(e =>
      !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.content.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.entries.length > 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h3 className="text-editorial-sm text-foreground text-embossed">
          TLC <span className="thunder-text">WIKI</span>
        </h3>
        <p className="mt-1 text-[11px] text-muted-foreground/60 text-journal-sm">
          The complete knowledge base for bodyweight mastery
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search the wiki..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full surface-inset py-2.5 pl-10 pr-4 text-sm focus:border-thunder-orange focus:outline-none text-journal"
        />
      </div>

      {/* Categories */}
      <div className="space-y-1">
        {filteredCategories.map(cat => {
          const isOpen = openCategory === cat.id;
          return (
            <div key={cat.id}>
              <button
                onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 text-left transition-all skeuo-card skeuo-grain",
                  isOpen ? "border-thunder-orange/40 bg-thunder-orange/5" : "hover:border-foreground/20"
                )}
              >
                <span className="text-xl">{cat.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-label text-xs tracking-wider text-journal">{cat.label}</div>
                  <div className="text-[10px] text-muted-foreground/50 text-journal-sm truncate">{cat.description}</div>
                </div>
                <span className="text-[9px] text-muted-foreground/40">{cat.entries.length}</span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground/40 transition-transform shrink-0", isOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="py-1 pl-4 space-y-1">
                      {cat.entries.map(entry => {
                        const entryKey = `${cat.id}-${entry.title}`;
                        const isEntryOpen = openEntry === entryKey;
                        return (
                          <div key={entry.title}>
                            <button
                              onClick={() => setOpenEntry(isEntryOpen ? null : entryKey)}
                              className={cn(
                                "w-full flex items-center gap-2 p-2.5 text-left transition-all",
                                isEntryOpen ? "text-thunder-orange" : "text-foreground/80 hover:text-foreground"
                              )}
                            >
                              <Zap className={cn("h-3 w-3 shrink-0", isEntryOpen ? "text-thunder-orange" : "text-muted-foreground/30")} />
                              <span className="text-sm text-journal flex-1">{entry.title}</span>
                              <ChevronDown className={cn("h-3 w-3 text-muted-foreground/30 transition-transform shrink-0", isEntryOpen && "rotate-180")} />
                            </button>

                            <AnimatePresence>
                              {isEntryOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.15 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-4 notebook-ruled notebook-margin space-y-3">
                                    {entry.content.split('\n\n').map((para, i) => (
                                      <p key={i} className="text-sm text-foreground/80 text-journal leading-relaxed whitespace-pre-line">
                                        {para.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                                          part.startsWith('**') && part.endsWith('**')
                                            ? <strong key={j} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>
                                            : <span key={j}>{part}</span>
                                        )}
                                      </p>
                                    ))}

                                    {entry.keyExercises && (
                                      <div className="p-3 skeuo-thunder-card skeuo-grain">
                                        <div className="text-label text-[9px] tracking-wider text-thunder-orange/80 mb-1.5">KEY EXERCISES</div>
                                        {entry.keyExercises.map((ex, i) => (
                                          <div key={i} className="text-[11px] text-foreground/70 text-journal py-0.5">• {ex}</div>
                                        ))}
                                      </div>
                                    )}

                                    {entry.proTips && (
                                      <div className="p-3 surface-inset">
                                        <div className="text-label text-[9px] tracking-wider text-muted-foreground/60 mb-1.5">⚡ PRO TIPS</div>
                                        {entry.proTips.map((tip, i) => (
                                          <div key={i} className="text-[11px] text-foreground/70 text-journal py-0.5">• {tip}</div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center pt-4">
        <span className="text-[9px] text-muted-foreground/30 tracking-[0.15em]">TLC KNOWLEDGE BASE · {wikiData.reduce((a, c) => a + c.entries.length, 0)} ARTICLES</span>
      </div>
    </div>
  );
}
