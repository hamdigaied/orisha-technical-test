<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number | string;
    /**
     * Default viewBox is 24×24. Individual icons override this to crop their
     * region from the original Figma sprite — keeps source paths verbatim.
     */
    viewBox?: string;
  }>(),
  { size: 20, viewBox: '0 0 24 24' },
);
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="viewBox"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <slot />
  </svg>
</template>
