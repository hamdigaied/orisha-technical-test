<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue';
import IconCheck from '@/components/icons/IconCheck.vue';
import IconClose from '@/components/icons/IconClose.vue';
import type { SectorGroup } from './types';

const props = defineProps<{
  sectors: SectorGroup[];
  /** `null` means "all sub-sectors". */
  selectedSubSectorId: number | null;
  /**
   * Open state of the mobile drawer. On desktop the sidebar is always
   * visible regardless of this prop.
   */
  open?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', subSectorId: number | null): void;
  (e: 'update:open', value: boolean): void;
}>();

function selectAndClose(id: number | null): void {
  emit('select', id);
  emit('update:open', false);
}

// Lock body scroll when the drawer is open on mobile.
watch(
  () => props.open,
  (open) => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
  },
);
onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = '';
});
</script>

<template>
  <div class="sidebar-host" :data-open="open || undefined">
    <div
      class="sidebar-host__backdrop"
      aria-hidden="true"
      @click="$emit('update:open', false)"
    />

    <aside class="sidebar" aria-label="Filtres par secteur">
      <header class="sidebar__header">
        <span class="sidebar__title">Filtres</span>
        <button
          type="button"
          class="sidebar__close"
          aria-label="Fermer les filtres"
          @click="$emit('update:open', false)"
        >
          <IconClose :size="18" />
        </button>
      </header>

      <button
        type="button"
        class="sidebar__all"
        :data-active="selectedSubSectorId === null"
        @click="selectAndClose(null)"
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
              @click="selectAndClose(sub.id)"
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
  </div>
</template>

<style scoped lang="scss">
.sidebar-host {
  display: contents;

  // Mobile: drawer overlay, hidden by default.
  @include until-md {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 50;
    pointer-events: none;
    visibility: hidden;
    transition: visibility 200ms;

    &[data-open] {
      pointer-events: auto;
      visibility: visible;
    }
  }

  &__backdrop {
    display: none;
    @include until-md {
      display: block;
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      opacity: 0;
      transition: opacity 200ms ease;

      .sidebar-host[data-open] & {
        opacity: 1;
      }
    }
  }
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  padding: var(--space-2xl) var(--space-xl);
  background: var(--color-bg-surface);
  border-right: 1px solid var(--color-stroke-secondary);
  overflow-y: auto;

  @include until-md {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: min(280px, 80vw);
    border-right: 1px solid var(--color-stroke-secondary);
    transform: translateX(-100%);
    transition: transform 220ms ease;

    .sidebar-host[data-open] & {
      transform: translateX(0);
    }
  }

  &__header {
    display: none;
    @include until-md {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: var(--space-l);
      margin-bottom: var(--space-l);
      border-bottom: 1px solid var(--color-stroke-secondary);
    }
  }

  &__title {
    font-size: var(--font-size-l);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-title);
  }

  &__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--size-s);
    height: var(--size-s);
    border-radius: var(--radius-s);
    color: var(--color-text-tertiary);

    &:hover {
      background: var(--color-bg-subtle);
      color: var(--color-text-primary);
    }
  }

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
