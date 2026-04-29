<script setup lang="ts">
import UiAvatar from '@/components/ui/UiAvatar.vue';
import UiBadge from '@/components/ui/UiBadge.vue';
import { getResidentAvatarUrl } from './avatar';
import { stripGenderSuffix } from '@/lib/format';
import type { Resident } from './types';

defineProps<{
  residents: Resident[];
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();
</script>

<template>
  <ul class="grid">
    <li v-for="r in residents" :key="r.id">
      <button type="button" class="card" @click="$emit('select', r.id)">
        <div class="card__head">
          <UiAvatar :name="r.nomComplet" :src="getResidentAvatarUrl(r)" size="l" />
          <div class="card__identity">
            <strong>{{ stripGenderSuffix(r.nomComplet) }}</strong>
            <span class="muted">{{ r.nomNaissance }}</span>
            <span class="muted">{{ r.dateNaissance }} ({{ r.ageTexte }})</span>
            <span class="muted">INS {{ r.ins }}</span>
          </div>
        </div>
        <div class="card__footer">
          <UiBadge size="s">{{ r.chambre.libelleEtablissementChambre }}</UiBadge>
        </div>
      </button>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: var(--space-2xl);

  @include sm {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @include lg {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.card {
  width: 100%;
  text-align: left;
  background: var(--color-bg-surface);
  border-radius: var(--radius-l);
  box-shadow: var(--shadow-s);
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-l);
  transition:
    transform 120ms ease,
    box-shadow 120ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-m);
  }

  &__head {
    display: flex;
    gap: var(--space-l);
  }

  &__identity {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;

    strong {
      color: var(--color-text-primary);
      font-weight: var(--font-weight-semibold);
      line-height: var(--line-height-tight);
    }
  }

  &__footer {
    display: flex;
    justify-content: flex-start;
  }
}

.muted {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-s);
  line-height: var(--line-height-tight);
}
</style>
