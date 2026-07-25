import { BeginnerSkillHub } from './BeginnerSkillHub';

/**
 * Compatibility wrapper for older imports.
 * The former graph mixed unrelated movement families and presented rigid prerequisites
 * as universal truth. CONTROL TLC now uses the beginner-first guided path experience.
 */
export function ProgressionMap({ embedded = false }: { embedded?: boolean }) {
  return <BeginnerSkillHub embedded={embedded} />;
}
