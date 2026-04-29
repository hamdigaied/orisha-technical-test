/**
 * Returns a tinted (mostly white) version of a hex color suitable for a badge
 * background. Uses CSS color-mix at runtime — falls back to a manual mix only
 * if needed (color-mix has 95%+ browser support since 2023).
 */
export function tintBackground(hex: string, opacity = 0.15): string {
  return `color-mix(in srgb, ${hex} ${opacity * 100}%, white)`;
}
