<script setup lang="ts">
import IconCheck from '@/components/icons/IconCheck.vue';
import type { SectorGroup } from './types';

defineProps<{
  sectors: SectorGroup[];
  /** `null` means "all sub-sectors". */
  selectedSubSectorId: number | null;
}>();

defineEmits<{
  (e: 'select', subSectorId: number | null): void;
}>();
</script>

<template>
  <aside class="sidebar" aria-label="Filtres par secteur">
    <button
      type="button"
      class="sidebar__all"
      :data-active="selectedSubSectorId === null"
      @click="$emit('select', null)"
    >
      <span class="sidebar__all-label">Tous les secteurs</span>
      <span class="sidebar__indicator" :data-active="selectedSubSectorId === null">
        <IconCheck v-if="selectedSubSectorId === null" :size="14" />
      </span>
    </button>

    <div v-for="sector in sectors" :key="sector.id" class="sidebar__group">
      <h3 class="sidebar__group-title">{{ sector.label }}</h3>
      <ul>
        <li v-for="sub in sector.subSectors" :key="sub.id">
          <button
            type="button"
            class="sidebar__item"
            :data-active="selectedSubSectorId === sub.id"
            @click="$emit('select', sub.id)"
          >
            <span>{{ sub.label }}</span>
            <span class="sidebar__indicator" :data-active="selectedSubSectorId === sub.id">
              <IconCheck v-if="selectedSubSectorId === sub.id" :size="14" />
            </span>
          </button>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.sidebar {
  width: 240px;
  flex-shrink: 0;
  padding: var(--space-2xl) var(--space-xl);
  background: var(--color-bg-surface);
  border-right: 1px solid var(--color-stroke-secondary);
  overflow-y: auto;

  &__all {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-m) var(--space-l);
    border-radius: var(--radius-m);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    margin-bottom: var(--space-2xl);

    &[data-active='true'] {
      color: var(--color-module-primary);
    }
  }

  &__group {
    margin-bottom: var(--space-2xl);
  }

  &__group-title {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
    margin-bottom: var(--space-m);
    padding: 0 var(--space-l);
  }

  &__item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-m) var(--space-l);
    border-radius: var(--radius-m);
    font-size: var(--font-size-m);
    color: var(--color-text-primary);
    text-align: left;
    transition: background-color 120ms ease;

    &:hover {
      background: var(--color-bg-subtle);
    }
    &[data-active='true'] {
      color: var(--color-module-primary);
      font-weight: var(--font-weight-medium);
    }
  }

  &__indicator {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1.5px solid var(--color-stroke-primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition:
      background-color 120ms ease,
      border-color 120ms ease;

    &[data-active='true'] {
      background: var(--color-module-primary);
      border-color: var(--color-module-primary);
      color: var(--color-text-invert);
    }
  }
}
</style>
