/**
 * Resident store, expressed as a composable.
 *
 * State is module-scoped (defined outside the composable function) so every
 * caller shares the same source of truth. We don't use Pinia: the store is
 * small, the API surface is read-only + a few setters, and the indirection
 * would dilute the architecture rather than clarify it.
 *
 * If the dataset grows or async fetching arrives, swap the inside of this
 * file for a Pinia store — the public composable signature can stay stable.
 *
 * The pure filtering / grouping logic lives in `./filter.ts` and is unit
 * tested in isolation; this file only wires it into reactive state.
 */
import { computed, ref, type Ref } from 'vue';
import { loadResidents } from './data';
import { filterResidents, groupSectors } from './filter';
import type { Resident, ViewMode } from './types';

const residents: Ref<Resident[]> = ref(loadResidents());

const search = ref('');
const selectedSubSectorId = ref<number | null>(null);
/**
 * Optional ID-based filter set by the column-header filter popover.
 * Empty set = filter inactive (no constraint). Otherwise residents must be in
 * the set. Intersected with the other filters, not OR-ed.
 */
const selectedResidentIds = ref<Set<string>>(new Set());
const viewMode = ref<ViewMode>('list');

const filtered = computed<Resident[]>(() =>
  filterResidents(residents.value, {
    search: search.value,
    subSectorId: selectedSubSectorId.value,
    selectedIds: selectedResidentIds.value,
  }),
);

const sectors = computed(() => groupSectors(residents.value));

const isFiltering = computed(
  () =>
    search.value.trim().length > 0 ||
    selectedSubSectorId.value !== null ||
    selectedResidentIds.value.size > 0,
);

function selectSubSector(id: number | null): void {
  selectedSubSectorId.value = id;
}

function setSearch(value: string): void {
  search.value = value;
}

function setViewMode(mode: ViewMode): void {
  viewMode.value = mode;
}

function setSelectedResidentIds(ids: Set<string>): void {
  selectedResidentIds.value = new Set(ids);
}

function resetFilters(): void {
  search.value = '';
  selectedSubSectorId.value = null;
  selectedResidentIds.value = new Set();
}

function getById(id: string): Resident | undefined {
  return residents.value.find((r) => r.id === id);
}

function toggleFavorite(id: string): void {
  const r = residents.value.find((x) => x.id === id);
  if (r) r.isFavorite = !r.isFavorite;
}

export function useResidents() {
  return {
    // state (read-only refs)
    residents,
    filtered,
    sectors,
    search,
    selectedSubSectorId,
    selectedResidentIds,
    viewMode,
    isFiltering,

    // actions
    setSearch,
    selectSubSector,
    setSelectedResidentIds,
    setViewMode,
    resetFilters,
    getById,
    toggleFavorite,
  };
}
