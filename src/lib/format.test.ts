import { describe, expect, it } from 'vitest';
import { formatSectorPath, getGenderFromName, getInitials, stripGenderSuffix } from './format';

describe('getInitials', () => {
  it('takes first + last initials of a typical resident name', () => {
    expect(getInitials('M. DURAND Gaston (H)')).toBe('DG');
    expect(getInitials('Mme THOMAS Madeleine (F)')).toBe('TM');
  });

  it('handles single-word names', () => {
    expect(getInitials('Cher')).toBe('C');
  });

  it('strips civility prefixes (M., Mme, Dr)', () => {
    expect(getInitials('Dr ABBARASCON Yvon')).toBe('AY');
    expect(getInitials('Mme. CASTAFIORE Bianca')).toBe('CB');
  });

  it('returns "?" for empty input', () => {
    expect(getInitials('')).toBe('?');
  });
});

describe('getGenderFromName', () => {
  it('returns M for "(H)" suffix', () => {
    expect(getGenderFromName('M. DURAND Gaston (H)')).toBe('M');
  });

  it('returns F for "(F)" suffix', () => {
    expect(getGenderFromName('Mme THOMAS Madeleine (F)')).toBe('F');
  });

  it('returns null when no marker is present', () => {
    expect(getGenderFromName('M. DURAND Gaston')).toBeNull();
    expect(getGenderFromName('')).toBeNull();
  });
});

describe('stripGenderSuffix', () => {
  it('removes the trailing gender marker', () => {
    expect(stripGenderSuffix('M. DURAND Gaston (H)')).toBe('M. DURAND Gaston');
    expect(stripGenderSuffix('Mme THOMAS Madeleine (F)')).toBe('Mme THOMAS Madeleine');
  });

  it('leaves names without a marker untouched', () => {
    expect(stripGenderSuffix('M. DURAND Gaston')).toBe('M. DURAND Gaston');
  });
});

describe('formatSectorPath', () => {
  it('replaces ">" separators with "→"', () => {
    expect(formatSectorPath('RDC > Les iris')).toBe('RDC → Les iris');
    expect(formatSectorPath('1er étage > Les lilas')).toBe('1er étage → Les lilas');
  });

  it('handles already-formatted paths idempotently', () => {
    expect(formatSectorPath('RDC')).toBe('RDC');
  });
});
