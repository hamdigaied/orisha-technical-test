export interface SecteurSousSecteur {
  idEtablissementSecteur: number;
  prefixedIdEtablissementSecteur: string;
  libelleEtablissementSecteur: string;
  idEtablissementSousSecteur: number;
  prefixedIdEtablissementSousSecteur: string;
  libelleEtablissementSousSecteur: string;
  libelleComplet: string;
}

export interface Chambre {
  idEtablissementChambre: number;
  prefixedIdEtablissementChambre: string;
  libelleEtablissementChambre: string;
}

export interface SituationAdministrative {
  idSituationAdministrative: number;
  prefixedIdSituationAdministrative: string;
  texte: string;
  couleur: string;
}

export interface AttendingPhysician {
  fullName: string;
  shortName: string;
  phone: string;
}

export interface Resident {
  id: string;
  prefixedId: string;
  nomComplet: string;
  nomNaissance: string;
  age: number;
  ageTexte: string;
  dateNaissance: string;
  ins: string;
  secteurSousSecteur: SecteurSousSecteur;
  chambre: Chambre;
  situationAdministrative: SituationAdministrative;
  isFavorite: boolean;
  /** Optional — `data.json` does not currently expose the attending physician. */
  attendingPhysician?: AttendingPhysician;
}

/** Hierarchy used by the sidebar: a Sector groups its sub-sectors. */
export interface SectorGroup {
  id: number;
  label: string;
  subSectors: { id: number; label: string }[];
}

export type ViewMode = 'list' | 'grid';
