/**
 * Resolves a resident's avatar URL from the static pool in /public/avatars.
 *
 * The pool has 5 photos per gender (male1..5, female1..5). Mapping is
 * deterministic — same resident id always maps to the same photo — so
 * re-renders never flicker between images.
 *
 * Gender is read from the trailing "(H)"/"(F)" marker on `nomComplet`.
 * If absent, we fall back to the male pool. If the photo fails to load,
 * UiAvatar's @error handler falls back to initials.
 */
import { getGenderFromName } from '@/lib/format';
import type { Resident } from './types';

const POOL_SIZE = 5;

export function getResidentAvatarUrl(resident: Resident): string {
  const gender = getGenderFromName(resident.nomComplet);
  const pool = gender === 'F' ? 'female' : 'male';
  const numericId = Number.parseInt(resident.id, 10);
  const index = ((Number.isFinite(numericId) ? numericId : 0) % POOL_SIZE) + 1;
  return `/avatars/${pool}${index}.png`;
}
