<script setup lang="ts">
import IconChevronRight from '@/components/icons/IconChevronRight.vue';

defineProps<{
  /** Breadcrumb segments. Last item is rendered as the active item. */
  breadcrumb: { label: string; to?: string }[];
}>();
</script>

<template>
  <div class="app-layout">
    <header class="app-layout__topbar">
      <div class="app-layout__module-band" aria-hidden="true" />
      <nav class="app-layout__breadcrumb" aria-label="Fil d'Ariane">
        <ol>
          <li v-for="(item, i) in breadcrumb" :key="i" :data-active="i === breadcrumb.length - 1">
            <RouterLink v-if="item.to && i < breadcrumb.length - 1" :to="item.to">
              {{ item.label }}
            </RouterLink>
            <span v-else>{{ item.label }}</span>
            <IconChevronRight v-if="i < breadcrumb.length - 1" :size="14" class="separator" />
          </li>
        </ol>
      </nav>
    </header>

    <main class="app-layout__main">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-default);
  overflow-x: hidden; // contain any horizontal overflow so the sticky topbar stays viewport-width

  &__topbar {
    background: var(--color-bg-surface);
    border-bottom: 1px solid var(--color-stroke-secondary);
    position: sticky;
    top: 0;
    z-index: 10;
    width: 100%;
  }

  &__module-band {
    height: 8px;
    background: var(--color-module-primary);
  }

  &__breadcrumb {
    padding: var(--space-l) var(--space-2xl);
    font-size: var(--font-size-s);
    color: var(--color-text-tertiary);

    @include until-md {
      padding: var(--space-m) var(--space-l);
    }

    ol {
      display: flex;
      align-items: center;
      gap: var(--space-s);
      flex-wrap: wrap;
    }

    li {
      display: inline-flex;
      align-items: center;
      gap: var(--space-s);

      a {
        color: var(--color-text-tertiary);
        &:hover {
          color: var(--color-text-secondary);
        }
      }

      &[data-active='true'] {
        color: var(--color-text-link);
        font-weight: var(--font-weight-medium);
      }
    }

    .separator {
      color: var(--color-text-tertiary);
      opacity: 0.5;
    }
  }

  &__main {
    flex: 1;
    min-height: 0;
    display: flex;
  }
}
</style>
