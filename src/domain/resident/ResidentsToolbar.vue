<script setup lang="ts">
import { markRaw } from 'vue';
import UiInput from '@/components/ui/UiInput.vue';
import UiButton from '@/components/ui/UiButton.vue';
import UiSegmentedControl from '@/components/ui/UiSegmentedControl.vue';
import IconSearch from '@/components/icons/IconSearch.vue';
import IconPlus from '@/components/icons/IconPlus.vue';
import IconList from '@/components/icons/IconList.vue';
import IconGrid from '@/components/icons/IconGrid.vue';
import type { ViewMode } from './types';

defineProps<{
  search: string;
  viewMode: ViewMode;
}>();

defineEmits<{
  (e: 'update:search', value: string): void;
  (e: 'update:viewMode', value: ViewMode): void;
  (e: 'create'): void;
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
      <UiSegmentedControl
        :model-value="viewMode"
        :options="viewOptions"
        @update:model-value="$emit('update:viewMode', $event as ViewMode)"
      />
      <UiButton variant="primary" size="m" @click="$emit('create')">
        <template #leading>
          <IconPlus :size="18" />
        </template>
        Nouveau résident
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

  &__search {
    flex: 1;
    max-width: 420px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--space-l);
  }
}
</style>
