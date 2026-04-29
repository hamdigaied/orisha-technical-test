/**
 * Pure resident-filtering and sector-grouping logic.
 *
 * Extracted from useResidents so it's trivially unit-testable: no Vue refs,
 * no module state, no side effects. The composable wires these into reactive
 * computations.
 */
import type { Resident, SectorGroup } from './types';

export interface ResidentFilters {
  search: string;
  subSectorId: number | null;
  selectedIds: Set<string>;
}

/**
 * Returns the residents that match all active filter dimensions.
 *
 *  - `search`        : free-text, matches against name + birth-name + INS
 *  - `subSectorId`   : null = no constraint; otherwise residents must be in it
 *  - `selectedIds`   : empty set = no constraint; otherwise residents must be
 *                      in the set
 *
 * Filters are intersected (AND), never OR-ed.
 */
export function filterResidents(residents: Resident[], filters: ResidentFilters): Resident[] {
  const q = filters.search.trim().toLowerCase();
  const idFilterActive = filters.selectedIds.size > 0;
  return residents.filter((r) => {
    if (idFilterActive && !filters.selectedIds.has(r.id)) return false;
    if (
      filters.subSectorId !== null &&
      r.secteurSousSecteur.idEtablissementSousSecteur !== filters.subSectorId
    ) {
      return false;
    }
    if (q.length > 0) {
      const hay = `${r.nomComplet} ${r.nomNaissance} ${r.ins}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/**
 * Groups residents into a sector → sub-sectors hierarchy used by the sidebar.
 * Each sub-sector list is sorted alphabetically.
 */
export function groupSectors(residents: Resident[]): SectorGroup[] {
  const map = new Map<number, SectorGroup>();
  for (const r of residents) {
    const { secteurSousSecteur: s } = r;
    let group = map.get(s.idEtablissementSecteur);
    if (!group) {
      group = {
        id: s.idEtablissementSecteur,
        label: s.libelleEtablissementSecteur,
        subSectors: [],
      };
      map.set(s.idEtablissementSecteur, group);
    }
    if (!group.subSectors.some((sub) => sub.id === s.idEtablissementSousSecteur)) {
      group.subSectors.push({
        id: s.idEtablissementSousSecteur,
        label: s.libelleEtablissementSousSecteur,
      });
    }
  }
  return Array.from(map.values()).map((g) => ({
    ...g,
    subSectors: g.subSectors.sort((a, b) => a.label.localeCompare(b.label)),
  }));
}
