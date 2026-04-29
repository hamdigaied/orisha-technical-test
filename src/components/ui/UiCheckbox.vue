<script setup lang="ts">
/**
 * Accessible checkbox that mirrors the Figma DS variants:
 * unchecked / checked / indeterminate / disabled.
 *
 * Visual hides the native input but keeps it in the tab order so screen
 * readers and keyboard users get full functionality.
 */
import { useTemplateRef, watch } from 'vue';
import IconCheck from '@/components/icons/IconCheck.vue';

const props = defineProps<{
  modelValue: boolean;
  /** Renders the indeterminate "−" mark — overrides the checkmark visually. */
  indeterminate?: boolean;
  label?: string;
  disabled?: boolean;
  inputId?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const inputEl = useTemplateRef<HTMLInputElement>('inputEl');

// `indeterminate` is a property, not an attribute — has to be set via JS.
watch(
  () => props.indeterminate,
  (v) => {
    if (inputEl.value) inputEl.value.indeterminate = !!v;
  },
  { immediate: true },
);
</script>

<template>
  <label
    class="checkbox"
    :data-checked="modelValue || undefined"
    :data-indeterminate="indeterminate || undefined"
    :data-disabled="disabled || undefined"
  >
    <input
      :id="inputId"
      ref="inputEl"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="checkbox__input"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="checkbox__box" aria-hidden="true">
      <IconCheck v-if="modelValue && !indeterminate" :size="14" />
      <span v-else-if="indeterminate" class="checkbox__dash" />
    </span>
    <span v-if="label || $slots.default" class="checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped lang="scss">
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--space-m);
  cursor: pointer;
  user-select: none;
  font-size: var(--font-size-m);
  color: var(--color-text-primary);

  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &__input {
    @include visually-hidden;
  }

  &__box {
    width: 18px;
    height: 18px;
    border-radius: var(--radius-xs);
    border: 1.5px solid var(--color-stroke-primary);
    background: var(--color-bg-surface);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-invert);
    flex-shrink: 0;
    transition:
      background-color 120ms ease,
      border-color 120ms ease;
  }

  &__dash {
    width: 10px;
    height: 2px;
    background: currentColor;
    border-radius: 1px;
  }

  &[data-checked] &__box,
  &[data-indeterminate] &__box {
    background: var(--color-module-primary);
    border-color: var(--color-module-primary);
  }

  &__input:focus-visible + &__box {
    box-shadow: 0 0 0 2px var(--color-module-primary-soft);
  }

  &:hover:not([data-disabled]) &__box {
    border-color: var(--color-module-primary);
  }

  &__label {
    line-height: var(--line-height-tight);
  }
}
</style>
