<script setup lang="ts" generic="T extends string | number">
defineProps<{
  modelValue: T;
  options: { value: T; label?: string; ariaLabel?: string; icon?: unknown }[];
}>();
defineEmits<{
  (e: 'update:modelValue', value: T): void;
}>();
</script>

<template>
  <div class="segmented" role="tablist">
    <button
      v-for="opt in options"
      :key="String(opt.value)"
      type="button"
      role="tab"
      :aria-selected="modelValue === opt.value"
      :aria-label="opt.ariaLabel"
      class="segmented__item"
      :data-active="modelValue === opt.value"
      @click="$emit('update:modelValue', opt.value)"
    >
      <component :is="opt.icon" v-if="opt.icon" />
      <span v-if="opt.label">{{ opt.label }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.segmented {
  display: inline-flex;
  padding: var(--space-s);
  background: var(--color-bg-subtle);
  border-radius: var(--radius-m);
  gap: var(--space-xs);

  &__item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-m);
    height: var(--size-s);
    min-width: var(--size-s);
    padding: 0 var(--space-l);
    border-radius: var(--radius-s);
    font-size: var(--font-size-m);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-tertiary);
    transition:
      background-color 120ms ease,
      color 120ms ease;

    &[data-active='true'] {
      background: var(--color-bg-surface);
      color: var(--color-module-primary);
      box-shadow: var(--shadow-xs);
    }

    &:hover:not([data-active='true']) {
      color: var(--color-text-primary);
    }
  }
}
</style>
