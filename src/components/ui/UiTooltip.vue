<script setup lang="ts">
/**
 * Dark tooltip with arrow tail, distinct from UiPopover (light menu surface).
 *
 * Triggers on hover + focus (a11y) + click — click pins it open until a click
 * elsewhere or Escape. Hover/focus alone auto-dismiss when the cursor leaves
 * both the trigger and the body.
 *
 * Positioning is anchored below the trigger; the arrow centers on the
 * trigger's horizontal midpoint regardless of the tooltip's clamped width.
 */
import { computed, ref } from 'vue';
import { useFloating } from '@/lib/useFloating';

const props = withDefaults(
  defineProps<{
    offset?: number;
  }>(),
  { offset: 12 },
);

const triggerEl = ref<HTMLElement | null>(null);
const contentEl = ref<HTMLElement | null>(null);

const hovered = ref(false);
const pinned = ref(false);
const open = computed(() => hovered.value || pinned.value);

function show(): void {
  hovered.value = true;
}
function hide(): void {
  hovered.value = false;
}
function togglePinned(): void {
  pinned.value = !pinned.value;
}
function dismiss(): void {
  pinned.value = false;
  hovered.value = false;
}

const { position } = useFloating({
  triggerEl,
  contentEl,
  open,
  onDismiss: dismiss,
  align: 'center',
  offset: props.offset,
});
</script>

<template>
  <span
    ref="triggerEl"
    class="tooltip-trigger"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
    @click="togglePinned"
  >
    <slot name="trigger" />
  </span>

  <Teleport to="body">
    <div
      v-if="open"
      ref="contentEl"
      class="tooltip"
      role="tooltip"
      :style="{ top: `${position.top}px`, left: `${position.left}px` }"
      @mouseenter="show"
      @mouseleave="hide"
    >
      <span class="tooltip__arrow" :style="{ left: `${position.arrowLeft}px` }" />
      <div class="tooltip__body">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.tooltip-trigger {
  display: inline-flex;
}

.tooltip {
  position: absolute;
  z-index: 1100;
  background: var(--grey-900);
  color: var(--color-text-invert);
  border-radius: var(--radius-m);
  padding: var(--space-l) var(--space-xl);
  box-shadow: var(--shadow-m);
  font-size: var(--font-size-s);
  line-height: var(--line-height-base);
  max-width: 280px;

  &__arrow {
    position: absolute;
    top: -6px;
    width: 12px;
    height: 12px;
    background: var(--grey-900);
    transform: translateX(-50%) rotate(45deg);
    border-top-left-radius: 2px;
  }

  &__body {
    position: relative;
    z-index: 1;
  }
}
</style>
