<script setup lang="ts">
/**
 * Column-header filter content. Wrapped by a UiPopover at the call site.
 *
 * Stages its edits locally and only commits via @apply — the parent merges
 * the new Set into the global filter state on commit. @cancel reverts.
 */
import { computed, ref, watch } from 'vue';
import UiInput from '@/components/ui/UiInput.vue';
import UiButton from '@/components/ui/UiButton.vue';
import UiCheckbox from '@/components/ui/UiCheckbox.vue';
import IconSearch from '@/components/icons/IconSearch.vue';
import { stripGenderSuffix } from '@/lib/format';
import type { Resident } from './types';

const props = defineProps<{
  /** Visible whenever the popover is open — used to reset draft state. */
  open: boolean;
  residents: Resident[];
  /** The currently committed filter set. Used to seed the draft on open. */
  initialSelected: Set<string>;
}>();

const emit = defineEmits<{
  (e: 'apply', ids: Set<string>): void;
  (e: 'cancel'): void;
}>();

const search = ref('');
const draft = ref<Set<string>>(new Set());

watch(
  () => props.open,
  (open) => {
    if (open) {
      draft.value = new Set(props.initialSelected);
      search.value = '';
    }
  },
  { immediate: true },
);

const visibleResidents = computed<Resident[]>(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return props.residents;
  return props.residents.filter((r) =>
    `${r.nomComplet} ${r.nomNaissance} ${r.ins}`.toLowerCase().includes(q),
  );
});

const allChecked = computed(
  () =>
    visibleResidents.value.length > 0 && visibleResidents.value.every((r) => draft.value.has(r.id)),
);
const someChecked = computed(
  () => !allChecked.value && visibleResidents.value.some((r) => draft.value.has(r.id)),
);

function isChecked(id: string): boolean {
  return draft.value.has(id);
}

function toggle(id: string, value: boolean): void {
  const next = new Set(draft.value);
  if (value) next.add(id);
  else next.delete(id);
  draft.value = next;
}

function toggleAll(value: boolean): void {
  const next = new Set(draft.value);
  for (const r of visibleResidents.value) {
    if (value) next.add(r.id);
    else next.delete(r.id);
  }
  draft.value = next;
}
</script>

<template>
  <div class="filter-popover">
    <div class="filter-popover__search">
      <UiInput
        v-model="search"
        placeholder="Rechercher un résident"
        aria-label="Rechercher un résident"
      >
        <template #leading>
          <IconSearch :size="18" />
        </template>
      </UiInput>
    </div>

    <div class="filter-popover__all">
      <UiCheckbox
        :model-value="allChecked"
        :indeterminate="someChecked"
        label="Tout cocher"
        @update:model-value="toggleAll"
      />
    </div>

    <ul class="filter-popover__list" role="group" aria-label="Résidents">
      <li v-for="r in visibleResidents" :key="r.id">
        <UiCheckbox :model-value="isChecked(r.id)" @update:model-value="toggle(r.id, $event)">
          {{ stripGenderSuffix(r.nomComplet) }}
        </UiCheckbox>
      </li>
      <li v-if="visibleResidents.length === 0" class="filter-popover__empty">Aucun résultat</li>
    </ul>

    <footer class="filter-popover__footer">
      <UiButton variant="secondary" size="s" @click="emit('cancel')">Annuler</UiButton>
      <UiButton variant="primary" size="s" @click="emit('apply', draft)">Filtrer</UiButton>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.filter-popover {
  display: flex;
  flex-direction: column;
  gap: var(--space-l);
  padding: var(--space-l);
  width: 320px;
  max-width: 90vw;

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--space-l);
    max-height: 280px;
    overflow-y: auto;
    padding-right: var(--space-s);
  }

  &__empty {
    padding: var(--space-l);
    text-align: center;
    color: var(--color-text-tertiary);
    font-size: var(--font-size-s);
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-m);
    padding-top: var(--space-l);
    border-top: 1px solid var(--color-stroke-secondary);
  }
}
</style>
