<script setup lang="ts">
/**
 * Light, menu-shaped popover. Click-to-toggle.
 *
 * Wraps the trigger in an inline-flex span so we have a stable measurable
 * element. Uses `useFloating` for positioning and dismissal — distinct from
 * UiTooltip (dark, with arrow, hover-trigger).
 */
import { ref, toRef } from 'vue';
import { useFloating } from '@/lib/useFloating';

const props = withDefaults(
  defineProps<{
    open: boolean;
    align?: 'start' | 'end';
    offset?: number;
  }>(),
  { align: 'start', offset: 6 },
);

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const triggerEl = ref<HTMLElement | null>(null);
const contentEl = ref<HTMLElement | null>(null);

function close(): void {
  emit('update:open', false);
}
function toggle(): void {
  emit('update:open', !props.open);
}

const { position } = useFloating({
  triggerEl,
  contentEl,
  open: toRef(props, 'open'),
  onDismiss: close,
  align: props.align,
  offset: props.offset,
});
</script>

<template>
  <span ref="triggerEl" class="popover-trigger">
    <slot name="trigger" :toggle="toggle" :open="open" />
  </span>

  <Teleport to="body">
    <div
      v-if="open"
      ref="contentEl"
      class="popover"
      role="menu"
      :style="{ top: `${position.top}px`, left: `${position.left}px` }"
    >
      <slot :close="close" />
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.popover-trigger {
  display: inline-flex;
}

.popover {
  position: absolute;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-stroke-primary);
  border-radius: var(--radius-s);
  box-shadow: var(--shadow-m);
  padding: var(--space-s);
  min-width: 120px;
  z-index: 1000;
}
</style>
