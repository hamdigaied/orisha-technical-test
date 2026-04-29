<script setup lang="ts">
import { markRaw } from 'vue';
import UiInput from '@/components/ui/UiInput.vue';
import UiButton from '@/components/ui/UiButton.vue';
import UiSegmentedControl from '@/components/ui/UiSegmentedControl.vue';
import IconSearch from '@/components/icons/IconSearch.vue';
import IconPlus from '@/components/icons/IconPlus.vue';
import IconList from '@/components/icons/IconList.vue';
import IconGrid from '@/components/icons/IconGrid.vue';
import IconFilter from '@/components/icons/IconFilter.vue';
import type { ViewMode } from './types';

defineProps<{
  search: string;
  viewMode: ViewMode;
}>();

defineEmits<{
  (e: 'update:search', value: string): void;
  (e: 'update:viewMode', value: ViewMode): void;
  (e: 'create'): void;
  (e: 'open-filters'): void;
}>();

const viewOptions = [
  { value: 'list' as const, ariaLabel: 'Vue liste', icon: markRaw(IconList) },
  { value: 'grid' as const, ariaLabel: 'Vue trombinoscope', icon: markRaw(IconGrid) },
];
</script>

<template>
  <div class="toolbar">
    <div class="toolbar__search">
      <UiInput
        :model-value="search"
        placeholder="Rechercher un résident ou un INS"
        aria-label="Rechercher un résident"
        @update:model-value="$emit('update:search', $event)"
      >
        <template #leading>
          <IconSearch :size="18" />
        </template>
      </UiInput>
    </div>

    <div class="toolbar__actions">
      <button
        type="button"
        class="toolbar__filters-btn"
        aria-label="Ouvrir les filtres"
        @click="$emit('open-filters')"
      >
        <IconFilter :size="18" />
        <span>Filtres</span>
      </button>

      <UiSegmentedControl
        :model-value="viewMode"
        :options="viewOptions"
        @update:model-value="$emit('update:viewMode', $event as ViewMode)"
      />
      <UiButton variant="primary" size="m" @click="$emit('create')">
        <template #leading>
          <IconPlus :size="18" />
        </template>
        <span class="toolbar__create-label">Nouveau résident</span>
      </UiButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);

  @include until-md {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-l);
  }

  &__search {
    flex: 1;
    max-width: 420px;

    @include until-md {
      max-width: none;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--space-l);

    @include until-md {
      gap: var(--space-m);
      flex-wrap: wrap;
    }
  }

  &__filters-btn {
    display: none; // desktop has the persistent sidebar — no need for the button
    align-items: center;
    gap: var(--space-m);
    height: var(--size-m);
    padding: 0 var(--space-l);
    border-radius: var(--radius-m);
    border: 1px solid var(--color-stroke-primary);
    background: var(--color-bg-surface);
    color: var(--color-text-primary);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-m);

    @include until-md {
      display: inline-flex;
    }

    &:hover {
      background: var(--color-bg-subtle);
    }
  }

  // The "Nouveau résident" label collapses to icon-only on very narrow screens.
  &__create-label {
    @media (max-width: 480px) {
      @include visually-hidden;
    }
  }
}
</style>
