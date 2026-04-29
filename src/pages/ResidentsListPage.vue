<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '@/layouts/AppLayout.vue';
import SectorsSidebar from '@/domain/resident/SectorsSidebar.vue';
import ResidentsToolbar from '@/domain/resident/ResidentsToolbar.vue';
import ResidentsTable from '@/domain/resident/ResidentsTable.vue';
import ResidentsGrid from '@/domain/resident/ResidentsGrid.vue';
import ResidentsEmptyState from '@/domain/resident/ResidentsEmptyState.vue';
import { useResidents } from '@/domain/resident/useResidents';

const router = useRouter();
const {
  filtered,
  sectors,
  search,
  selectedSubSectorId,
  viewMode,
  setSearch,
  selectSubSector,
  setViewMode,
  resetFilters,
} = useResidents();

const count = computed(() => filtered.value.length);
const hasResults = computed(() => count.value > 0);

function goToResident(id: string): void {
  router.push({ name: 'resident-detail', params: { id }, query: { tab: 'synthese' } });
}
</script>

<template>
  <AppLayout :breadcrumb="[{ label: 'Résidence du centre ville' }, { label: 'Résidents' }]">
    <div class="residents">
      <SectorsSidebar
        :sectors="sectors"
        :selected-sub-sector-id="selectedSubSectorId"
        @select="selectSubSector"
      />

      <section class="residents__main">
        <header class="residents__header">
          <h1>Tous les résidents</h1>
          <p class="residents__count">{{ count }} résident{{ count > 1 ? 's' : '' }}</p>
        </header>

        <ResidentsToolbar
          :search="search"
          :view-mode="viewMode"
          @update:search="setSearch"
          @update:view-mode="setViewMode"
        />

        <ResidentsTable
          v-if="hasResults && viewMode === 'list'"
          :residents="filtered"
          @select="goToResident"
        />
        <ResidentsGrid
          v-else-if="hasResults && viewMode === 'grid'"
          :residents="filtered"
          @select="goToResident"
        />
        <ResidentsEmptyState v-else @reset="resetFilters" />
      </section>
    </div>
  </AppLayout>
</template>

<style scoped lang="scss">
.residents {
  flex: 1;
  display: flex;
  min-height: 0;

  &__main {
    flex: 1;
    min-width: 0;
    padding: var(--space-2xl);
    overflow-y: auto;
  }

  &__header {
    margin-bottom: var(--space-2xl);
    display: flex;
    flex-direction: column;
    gap: var(--space-s);

    h1 {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-title);
      letter-spacing: -0.01em;
    }
  }

  &__count {
    color: var(--color-text-tertiary);
    font-size: var(--font-size-m);
  }
}
</style>
