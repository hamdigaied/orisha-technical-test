/**
 * Shared floating-element behavior for popover-like primitives.
 *
 * Handles:
 *  - Anchored positioning relative to a trigger element (below, with align)
 *  - Optional arrow x-offset (for tooltips with a tail centered on the trigger)
 *  - Outside-click and Escape dismissal
 *  - Reposition on window resize / scroll
 *
 * Each consumer (UiPopover, UiTooltip) supplies its own DOM and styling; this
 * composable only handles the geometry and lifecycle.
 */
import { nextTick, onBeforeUnmount, ref, watch, type Ref } from 'vue';

export interface FloatingPosition {
  top: number;
  left: number;
  /**
   * X offset (in px, from the floating element's own left edge) where an arrow
   * pointing at the trigger center should sit. Useful for tooltips.
   */
  arrowLeft: number;
}

export interface UseFloatingOptions {
  triggerEl: Ref<HTMLElement | null>;
  contentEl: Ref<HTMLElement | null>;
  open: Ref<boolean>;
  /** Called when the user dismisses (outside-click, ESC). */
  onDismiss: () => void;
  /** Horizontal alignment relative to the trigger. */
  align?: 'start' | 'end' | 'center';
  /** Pixel offset between trigger bottom and content top. */
  offset?: number;
  /** Edge margin so the floating element stays inside the viewport. */
  viewportMargin?: number;
}

export function useFloating(options: UseFloatingOptions): { position: Ref<FloatingPosition> } {
  const { triggerEl, contentEl, open, onDismiss } = options;
  const align = options.align ?? 'start';
  const offset = options.offset ?? 6;
  const viewportMargin = options.viewportMargin ?? 8;

  const position = ref<FloatingPosition>({ top: 0, left: 0, arrowLeft: 0 });

  function updatePosition(): void {
    if (!triggerEl.value || !contentEl.value) return;
    const trig = triggerEl.value.getBoundingClientRect();
    const cw = contentEl.value.offsetWidth;
    const triggerCenterX = trig.left + trig.width / 2 + window.scrollX;

    let desiredLeft: number;
    switch (align) {
      case 'end':
        desiredLeft = trig.right + window.scrollX - cw;
        break;
      case 'center':
        desiredLeft = triggerCenterX - cw / 2;
        break;
      case 'start':
      default:
        desiredLeft = trig.left + window.scrollX;
    }

    const minLeft = window.scrollX + viewportMargin;
    const maxLeft = window.scrollX + window.innerWidth - cw - viewportMargin;
    const left = Math.max(minLeft, Math.min(desiredLeft, maxLeft));
    const top = trig.bottom + window.scrollY + offset;

    position.value = {
      top,
      left,
      arrowLeft: triggerCenterX - left,
    };
  }

  function onDocumentClick(e: MouseEvent): void {
    if (!open.value) return;
    const t = e.target as Node;
    if (triggerEl.value?.contains(t) || contentEl.value?.contains(t)) return;
    onDismiss();
  }

  function onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && open.value) onDismiss();
  }

  function bind(): void {
    document.addEventListener('click', onDocumentClick, true);
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
  }

  function unbind(): void {
    document.removeEventListener('click', onDocumentClick, true);
    document.removeEventListener('keydown', onKeydown);
    window.removeEventListener('resize', updatePosition);
    window.removeEventListener('scroll', updatePosition, true);
  }

  watch(open, async (o) => {
    if (o) {
      await nextTick();
      updatePosition();
      bind();
    } else {
      unbind();
    }
  });

  onBeforeUnmount(unbind);

  return { position };
}
