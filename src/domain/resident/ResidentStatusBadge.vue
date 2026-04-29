<script setup lang="ts">
import UiBadge from '@/components/ui/UiBadge.vue';
import type { SituationAdministrative } from './types';

defineProps<{
  status: SituationAdministrative;
}>();
</script>

<template>
  <UiBadge :color="status.couleur" size="s">{{ status.texte }}</UiBadge>
</template>
