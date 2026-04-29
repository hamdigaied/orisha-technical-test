<script setup lang="ts">
import IconBase from './IconBase.vue';
defineProps<{ size?: number | string }>();
</script>

<template>
  <IconBase :size="size" viewBox="210 0 24 24">
    <path
      d="M231 12C231 12.4134 230.663 12.75 230.25 12.75H222.75V20.25C222.75 20.6634 222.413 21 222 21C221.586 21 221.25 20.6634 221.25 20.25V12.75H213.75C213.336 12.75 213 12.4134 213 12C213 11.5856 213.336 11.25 213.75 11.25H221.25V3.75C221.25 3.33562 221.586 3 222 3C222.413 3 222.75 3.33562 222.75 3.75V11.25H230.25C230.663 11.25 231 11.5856 231 12Z"
    />
  </IconBase>
</template>
