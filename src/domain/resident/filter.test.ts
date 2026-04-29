import { describe, expect, it } from 'vitest';
import { filterResidents, groupSectors, type ResidentFilters } from './filter';
import type { Resident } from './types';

const NO_FILTER: ResidentFilters = {
  search: '',
  subSectorId: null,
  selectedIds: new Set(),
};

function makeResident(over: Partial<Resident> & { id: string }): Resident {
  return {
    id: over.id,
    prefixedId: `Resident_${over.id}`,
    nomComplet: over.nomComplet ?? 'M. DURAND Gaston (H)',
    nomNaissance: over.nomNaissance ?? 'né BONNET',
    age: 75,
    ageTexte: '75 ans',
    dateNaissance: '10/07/1950',
    ins: over.ins ?? '505882578295',
    secteurSousSecteur: over.secteurSousSecteur ?? {
      idEtablissementSecteur: 405,
      prefixedIdEtablissementSecteur: '',
      libelleEtablissementSecteur: 'RDC',
      idEtablissementSousSecteur: 204,
      prefixedIdEtablissementSousSecteur: '',
      libelleEtablissementSousSecteur: 'Les iris',
      libelleComplet: 'RDC > Les iris',
    },
    chambre: {
      idEtablissementChambre: 10000,
      prefixedIdEtablissementChambre: '',
      libelleEtablissementChambre: '283',
    },
    situationAdministrative: {
      idSituationAdministrative: 1,
      prefixedIdSituationAdministrative: '',
      texte: 'Présent',
      couleur: '#00C851',
    },
    isFavorite: false,
  };
}

const SAMPLE: Resident[] = [
  makeResident({ id: '1', nomComplet: 'M. DURAND Gaston (H)', ins: '111111111111' }),
  makeResident({ id: '2', nomComplet: 'Mme THOMAS Madeleine (F)', ins: '222222222222' }),
  makeResident({
    id: '3',
    nomComplet: 'M. DELORME Nathan (H)',
    ins: '333333333333',
    secteurSousSecteur: {
      idEtablissementSecteur: 406,
      prefixedIdEtablissementSecteur: '',
      libelleEtablissementSecteur: '1er étage',
      idEtablissementSousSecteur: 206,
      prefixedIdEtablissementSousSecteur: '',
      libelleEtablissementSousSecteur: 'Les lilas',
      libelleComplet: '1er étage > Les lilas',
    },
  }),
];

describe('filterResidents', () => {
  it('returns the full list when no filter is active', () => {
    expect(filterResidents(SAMPLE, NO_FILTER)).toHaveLength(3);
  });

  it('returns an empty list when the input is empty', () => {
    expect(filterResidents([], NO_FILTER)).toHaveLength(0);
  });

  it('matches search against name (case-insensitive)', () => {
    const result = filterResidents(SAMPLE, { ...NO_FILTER, search: 'thomas' });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('2');
  });

  it('matches search against INS', () => {
    const result = filterResidents(SAMPLE, { ...NO_FILTER, search: '333333' });
    expect(result.map((r) => r.id)).toEqual(['3']);
  });

  it('matches search against birth name', () => {
    const result = filterResidents(SAMPLE, { ...NO_FILTER, search: 'BONNET' });
    expect(result).toHaveLength(3); // all sample residents share the demo birth name
  });

  it('filters by sub-sector id', () => {
    const result = filterResidents(SAMPLE, { ...NO_FILTER, subSectorId: 206 });
    expect(result.map((r) => r.id)).toEqual(['3']);
  });

  it('filters by selectedIds set', () => {
    const result = filterResidents(SAMPLE, {
      ...NO_FILTER,
      selectedIds: new Set(['1', '3']),
    });
    expect(result.map((r) => r.id)).toEqual(['1', '3']);
  });

  it('intersects (AND) all active filter dimensions', () => {
    // sub-sector picks resident 3, but selectedIds excludes him → empty
    const result = filterResidents(SAMPLE, {
      ...NO_FILTER,
      subSectorId: 206,
      selectedIds: new Set(['1']),
    });
    expect(result).toHaveLength(0);
  });

  it('treats empty selectedIds as no constraint', () => {
    const result = filterResidents(SAMPLE, { ...NO_FILTER, selectedIds: new Set() });
    expect(result).toHaveLength(3);
  });
});

describe('groupSectors', () => {
  it('groups sub-sectors under their parent sector', () => {
    const groups = groupSectors(SAMPLE);
    expect(groups).toHaveLength(2);
    const rdc = groups.find((g) => g.label === 'RDC');
    const etage = groups.find((g) => g.label === '1er étage');
    expect(rdc?.subSectors.map((s) => s.label)).toEqual(['Les iris']);
    expect(etage?.subSectors.map((s) => s.label)).toEqual(['Les lilas']);
  });

  it('deduplicates sub-sectors across multiple residents', () => {
    const r1 = makeResident({ id: '1' });
    const r2 = makeResident({ id: '2' });
    // both share the same sub-sector — should still produce only one entry
    const groups = groupSectors([r1, r2]);
    expect(groups[0]!.subSectors).toHaveLength(1);
  });

  it('sorts sub-sectors alphabetically', () => {
    const a = makeResident({
      id: 'a',
      secteurSousSecteur: {
        ...SAMPLE[0]!.secteurSousSecteur,
        idEtablissementSousSecteur: 1,
        libelleEtablissementSousSecteur: 'Zèbres',
      },
    });
    const b = makeResident({
      id: 'b',
      secteurSousSecteur: {
        ...SAMPLE[0]!.secteurSousSecteur,
        idEtablissementSousSecteur: 2,
        libelleEtablissementSousSecteur: 'Abeilles',
      },
    });
    const groups = groupSectors([a, b]);
    expect(groups[0]!.subSectors.map((s) => s.label)).toEqual(['Abeilles', 'Zèbres']);
  });

  it('returns an empty list for no residents', () => {
    expect(groupSectors([])).toEqual([]);
  });
});
