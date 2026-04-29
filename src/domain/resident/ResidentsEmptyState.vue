<script setup lang="ts">
import IconRefresh from '@/components/icons/IconRefresh.vue';

defineEmits<{
  (e: 'reset'): void;
}>();
</script>

<template>
  <div class="empty">
    <p class="empty__message">Aucun résident ne correspond à votre recherche</p>
    <button type="button" class="empty__reset" @click="$emit('reset')">
      <IconRefresh :size="16" />
      <span>Réinitialiser la recherche</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-l);
  padding: var(--space-7xl) var(--space-xl);
  text-align: center;

  &__message {
    color: var(--color-text-secondary);
    font-size: var(--font-size-m);
  }

  &__reset {
    display: inline-flex;
    align-items: center;
    gap: var(--space-m);
    color: var(--color-module-primary);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-m);

    &:hover {
      color: var(--color-module-primary-hover);
    }
  }
}
</style>
