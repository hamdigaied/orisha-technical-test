<script setup lang="ts">
import { computed } from 'vue';
import { tintBackground } from '@/lib/color';

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info';

const props = withDefaults(
  defineProps<{
    /** Semantic preset. Ignored if `color` is provided. */
    tone?: Tone;
    /**
     * Arbitrary hex color from data (e.g. `situationAdministrative.couleur`).
     * The badge is rendered as a tinted background with the color as the text/dot.
     */
    color?: string;
    /** Show a leading dot. */
    dot?: boolean;
    size?: 's' | 'm';
  }>(),
  { tone: 'neutral', size: 'm', dot: false },
);

const accent = computed<string>(() => {
  if (props.color) return props.color;
  switch (props.tone) {
    case 'primary':
      return 'var(--color-module-primary)';
    case 'success':
      return 'var(--green-700)';
    case 'warning':
      return 'var(--orange-700)';
    case 'error':
      return 'var(--red-700)';
    case 'info':
      return 'var(--blue-700)';
    case 'neutral':
    default:
      return 'var(--grey-700)';
  }
});

const background = computed<string>(() => {
  if (props.color) return tintBackground(props.color, 0.18);
  switch (props.tone) {
    case 'primary':
      return 'var(--color-module-primary-soft)';
    case 'success':
      return 'var(--green-50)';
    case 'warning':
      return 'var(--orange-50)';
    case 'error':
      return 'var(--red-50)';
    case 'info':
      return 'var(--blue-50)';
    case 'neutral':
    default:
      return 'var(--grey-100)';
  }
});
</script>

<template>
  <span class="badge" :data-size="size" :style="{ '--badge-bg': background, '--badge-fg': accent }">
    <span v-if="dot" class="badge__dot" />
    <slot />
  </span>
</template>

<style scoped lang="scss">
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-m);
  background: var(--badge-bg);
  color: var(--badge-fg);
  border-radius: var(--radius-pill);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;

  &[data-size='s'] {
    padding: 2px var(--space-m);
    font-size: var(--font-size-xs);
    line-height: 16px;
  }
  &[data-size='m'] {
    padding: var(--space-s) var(--space-l);
    font-size: var(--font-size-s);
    line-height: 18px;
  }

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }
}
</style>
