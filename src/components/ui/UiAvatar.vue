<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { getInitials } from '@/lib/format';

const props = withDefaults(
  defineProps<{
    /** Display name — used for initials fallback and the alt text. */
    name: string;
    /** Optional photo URL. If absent or fails to load, initials render instead. */
    src?: string | null;
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  }>(),
  { size: 'm' },
);

const initials = computed(() => getInitials(props.name));
const imageFailed = ref(false);
const showImage = computed(() => !!props.src && !imageFailed.value);

// Reset the failed flag when the URL changes — a different image could succeed.
watch(
  () => props.src,
  () => {
    imageFailed.value = false;
  },
);
</script>

<template>
  <span class="avatar" :data-size="size" role="img" :aria-label="name">
    <img v-if="showImage" :src="src!" :alt="name" loading="lazy" @error="imageFailed = true" />
    <span v-else class="avatar__initials">{{ initials }}</span>
  </span>
</template>

<style scoped lang="scss">
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-pill);
  background: var(--color-bg-subtle);
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-semibold);
  flex-shrink: 0;
  overflow: hidden;
  user-select: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &[data-size='xs'] {
    width: var(--size-xs);
    height: var(--size-xs);
    font-size: 10px;
  }
  &[data-size='s'] {
    width: var(--size-s);
    height: var(--size-s);
    font-size: var(--font-size-xs);
  }
  &[data-size='m'] {
    width: var(--size-m);
    height: var(--size-m);
    font-size: var(--font-size-m);
  }
  &[data-size='l'] {
    width: var(--size-l);
    height: var(--size-l);
    font-size: var(--font-size-l);
  }
  &[data-size='xl'] {
    width: 64px;
    height: 64px;
    font-size: var(--font-size-xl);
  }
}
</style>
