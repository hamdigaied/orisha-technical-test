<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 's' | 'm' | 'l';

withDefaults(
  defineProps<{
    variant?: Variant;
    size?: Size;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    /** Render as an icon-only square (still accessible — pass aria-label). */
    iconOnly?: boolean;
  }>(),
  { variant: 'primary', size: 'm', type: 'button' },
);
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="btn"
    :data-variant="variant"
    :data-size="size"
    :data-icon-only="iconOnly || undefined"
  >
    <slot name="leading" />
    <span v-if="$slots.default" class="btn__label"><slot /></span>
    <slot name="trailing" />
  </button>
</template>

<style scoped lang="scss">
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-m);
  border-radius: var(--radius-pill);
  font-weight: var(--font-weight-semibold);
  transition:
    background-color 120ms ease,
    color 120ms ease,
    border-color 120ms ease;

  &[data-size='s'] {
    height: var(--size-s);
    padding: 0 var(--space-l);
    font-size: var(--font-size-s);
  }
  &[data-size='m'] {
    height: var(--size-m);
    padding: 0 var(--space-xl);
    font-size: var(--font-size-m);
  }
  &[data-size='l'] {
    height: var(--size-l);
    padding: 0 var(--space-2xl);
    font-size: var(--font-size-l);
  }

  &[data-icon-only='true'] {
    padding: 0;
    aspect-ratio: 1 / 1;
    border-radius: var(--radius-m);
  }

  &[data-variant='primary'] {
    background: var(--color-module-primary);
    color: var(--color-text-invert);
    &:hover:not(:disabled) {
      background: var(--color-module-primary-hover);
    }
  }
  &[data-variant='secondary'] {
    background: var(--color-bg-surface);
    color: var(--color-text-primary);
    border: 1px solid var(--color-stroke-primary);
    &:hover:not(:disabled) {
      background: var(--color-bg-subtle);
    }
  }
  &[data-variant='ghost'] {
    background: transparent;
    color: var(--color-module-primary);
    &:hover:not(:disabled) {
      background: var(--color-module-primary-soft);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &__label {
    line-height: 1;
  }
}
</style>
