/** Returns initials from a full name like "M. DURAND Gaston (H)". */
export function getInitials(fullName: string): string {
  const cleaned = fullName
    .replace(/^(M\.|Mme\.?|Mlle\.?|Dr\.?)\s+/i, '')
    .replace(/\s*\([HF]\)\s*$/, '');
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}

/** Returns "M" or "F" if the name is suffixed with "(H)" / "(F)", else null. */
export function getGenderFromName(fullName: string): 'M' | 'F' | null {
  const m = fullName.match(/\(([HF])\)\s*$/);
  if (!m) return null;
  return m[1] === 'H' ? 'M' : 'F';
}

/** Strips the trailing gender marker for display: "M. DURAND Gaston (H)" → "M. DURAND Gaston". */
export function stripGenderSuffix(fullName: string): string {
  return fullName.replace(/\s*\([HF]\)\s*$/, '');
}

/** "RDC > Les iris" → "RDC → Les iris" to match the design. */
export function formatSectorPath(libelleComplet: string): string {
  return libelleComplet.replace(/\s*>\s*/g, ' → ');
}
