<script setup lang="ts">
defineProps<{
  modelValue: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  /** Optional id; falls back to a label-less input. */
  inputId?: string;
  /** ARIA label when no visible label. */
  ariaLabel?: string;
  /** Bound error state — adds the error styling. */
  error?: boolean;
}>();
defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <div class="input" :data-error="error || undefined" :data-disabled="disabled || undefined">
    <span v-if="$slots.leading" class="input__icon input__icon--leading">
      <slot name="leading" />
    </span>
    <input
      :id="inputId"
      class="input__field"
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-label="ariaLabel"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="$slots.trailing" class="input__icon input__icon--trailing">
      <slot name="trailing" />
    </span>
  </div>
</template>

<style scoped lang="scss">
.input {
  display: flex;
  align-items: center;
  gap: var(--space-m);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-stroke-secondary);
  border-radius: var(--radius-m);
  padding: 0 var(--space-l);
  height: var(--size-m);
  transition: border-color 120ms ease;

  &:focus-within {
    border-color: var(--color-stroke-focus);
    box-shadow: 0 0 0 2px var(--color-module-primary-soft);
  }

  &[data-error] {
    border-color: var(--color-text-error);
    &:focus-within {
      box-shadow: 0 0 0 2px var(--red-50);
    }
  }

  &[data-disabled] {
    background: var(--color-bg-subtle);
    cursor: not-allowed;
  }

  &__field {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    font-size: var(--font-size-m);
    color: var(--color-text-primary);

    &::placeholder {
      color: var(--color-text-placeholder);
    }
    &:disabled {
      cursor: not-allowed;
    }
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    color: var(--color-text-tertiary);
    flex-shrink: 0;
  }
}
</style>
