import { describe, expect, it } from 'vitest';
import { getResidentAvatarUrl } from './avatar';
import type { Resident } from './types';

function makeResident(overrides: Partial<Resident>): Resident {
  return {
    id: '1',
    prefixedId: 'Resident_101_a5vry8p',
    nomComplet: 'M. DURAND Gaston (H)',
    nomNaissance: 'né BONNET',
    age: 75,
    ageTexte: '75 ans',
    dateNaissance: '10/07/1950',
    ins: '505882578295',
    secteurSousSecteur: {
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
    ...overrides,
  };
}

describe('getResidentAvatarUrl', () => {
  it('uses the male pool for "(H)"-marked names', () => {
    const url = getResidentAvatarUrl(makeResident({ id: '1', nomComplet: 'M. DURAND Gaston (H)' }));
    expect(url).toMatch(/^\/avatars\/male[1-5]\.png$/);
  });

  it('uses the female pool for "(F)"-marked names', () => {
    const url = getResidentAvatarUrl(
      makeResident({ id: '1', nomComplet: 'Mme THOMAS Madeleine (F)' }),
    );
    expect(url).toMatch(/^\/avatars\/female[1-5]\.png$/);
  });

  it('falls back to the male pool when gender is unknown', () => {
    const url = getResidentAvatarUrl(makeResident({ id: '1', nomComplet: 'Anonyme' }));
    expect(url).toMatch(/^\/avatars\/male[1-5]\.png$/);
  });

  it('is deterministic — same id always returns the same url', () => {
    const r = makeResident({ id: '7' });
    expect(getResidentAvatarUrl(r)).toBe(getResidentAvatarUrl(r));
  });

  it('distributes ids across the 5-photo pool', () => {
    const urls = new Set<string>();
    for (let i = 1; i <= 5; i += 1) {
      urls.add(getResidentAvatarUrl(makeResident({ id: String(i) })));
    }
    expect(urls.size).toBe(5);
  });
});
