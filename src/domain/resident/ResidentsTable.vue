<script setup lang="ts">
import { ref } from 'vue';
import UiAvatar from '@/components/ui/UiAvatar.vue';
import UiPopover from '@/components/ui/UiPopover.vue';
import IconChevronRight from '@/components/icons/IconChevronRight.vue';
import IconFilter from '@/components/icons/IconFilter.vue';
import ResidentStatusBadge from './ResidentStatusBadge.vue';
import ResidentFilterPopover from './ResidentFilterPopover.vue';
import { getResidentAvatarUrl } from './avatar';
import { formatSectorPath, stripGenderSuffix } from '@/lib/format';
import { useResidents } from './useResidents';
import type { Resident } from './types';

defineProps<{
  /** Already-filtered list to display as rows. */
  residents: Resident[];
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();

// The filter popover operates on the *full* pool — not the already-filtered
// rows — so it can be used to add/remove residents that aren't currently
// visible. We tap straight into the store to avoid prop-drilling.
const { residents: allResidents, selectedResidentIds, setSelectedResidentIds } = useResidents();

const filterOpen = ref(false);

function applyFilter(ids: Set<string>): void {
  setSelectedResidentIds(ids);
  filterOpen.value = false;
}
function cancelFilter(): void {
  filterOpen.value = false;
}
</script>

<template>
  <div class="table-card">
    <div class="table-card__scroll">
      <table class="table">
      <thead>
        <tr>
          <th scope="col">
            <span class="th-with-icon">
              Résident
              <UiPopover v-model:open="filterOpen" align="start">
                <template #trigger="{ toggle }">
                  <button
                    type="button"
                    class="th-filter-btn"
                    :data-active="selectedResidentIds.size > 0 || undefined"
                    aria-label="Filtrer par résident"
                    @click="toggle"
                  >
                    <IconFilter :size="14" />
                  </button>
                </template>

                <ResidentFilterPopover
                  :open="filterOpen"
                  :residents="allResidents"
                  :initial-selected="selectedResidentIds"
                  @apply="applyFilter"
                  @cancel="cancelFilter"
                />
              </UiPopover>
            </span>
          </th>
          <th scope="col">Date de naissance</th>
          <th scope="col">INS</th>
          <th scope="col">Secteur</th>
          <th scope="col">Chambre</th>
          <th scope="col">Situation administrative</th>
          <th scope="col" class="table__chevron-col"><span class="visually-hidden">Voir</span></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="r in residents"
          :key="r.id"
          tabindex="0"
          @click="$emit('select', r.id)"
          @keydown.enter="$emit('select', r.id)"
          @keydown.space.prevent="$emit('select', r.id)"
        >
          <td>
            <div class="resident-cell">
              <UiAvatar :name="r.nomComplet" :src="getResidentAvatarUrl(r)" size="m" />
              <div class="resident-cell__text">
                <strong>{{ stripGenderSuffix(r.nomComplet) }}</strong>
                <span class="muted">{{ r.nomNaissance }}</span>
              </div>
            </div>
          </td>
          <td>
            <div class="stack">
              <strong>{{ r.ageTexte }}</strong>
              <span class="muted">{{ r.dateNaissance }}</span>
            </div>
          </td>
          <td>{{ r.ins }}</td>
          <td>{{ formatSectorPath(r.secteurSousSecteur.libelleComplet) }}</td>
          <td>{{ r.chambre.libelleEtablissementChambre }}</td>
          <td>
            <ResidentStatusBadge :status="r.situationAdministrative" />
          </td>
          <td class="table__chevron-col">
            <IconChevronRight :size="18" />
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.table-card {
  background: var(--color-bg-surface);
  border-radius: var(--radius-l);
  box-shadow: var(--shadow-s);
  overflow: hidden;

  &__scroll {
    @include until-md {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-m);

  @include until-md {
    min-width: 720px; // forces horizontal scroll instead of squeezing columns
  }

  thead th {
    text-align: left;
    padding: var(--space-l) var(--space-xl);
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-tertiary);
    border-bottom: 1px solid var(--color-stroke-secondary);
    background: var(--color-bg-default);
  }

  tbody tr {
    cursor: pointer;
    transition: background-color 100ms ease;

    &:hover {
      background: var(--color-bg-subtle);
    }
    &:not(:last-child) td {
      border-bottom: 1px solid var(--color-stroke-secondary);
    }
  }

  td {
    padding: var(--space-l) var(--space-xl);
    color: var(--color-text-primary);
    vertical-align: middle;
  }

  &__chevron-col {
    width: var(--size-m);
    text-align: right;
    color: var(--color-text-tertiary);
  }
}

.th-with-icon {
  display: inline-flex;
  align-items: center;
  gap: var(--space-m);
}

.th-filter-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xs);
  border-radius: var(--radius-xs);
  color: var(--color-text-tertiary);
  transition:
    color 100ms ease,
    background-color 100ms ease;

  &:hover {
    color: var(--color-text-primary);
    background: var(--color-bg-subtle);
  }
  &[data-active] {
    color: var(--color-module-primary);
    background: var(--color-module-primary-soft);
  }
}

.resident-cell {
  display: flex;
  align-items: center;
  gap: var(--space-l);

  &__text {
    display: flex;
    flex-direction: column;
    line-height: var(--line-height-tight);

    strong {
      color: var(--color-text-primary);
      font-weight: var(--font-weight-semibold);
    }
    .muted {
      font-size: var(--font-size-s);
    }
  }
}

.stack {
  display: flex;
  flex-direction: column;
  line-height: var(--line-height-tight);
}

.muted {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-s);
}

.visually-hidden {
  @include visually-hidden;
}
</style>
