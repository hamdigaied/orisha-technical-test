<script setup lang="ts">
import { computed } from 'vue';
import UiAvatar from '@/components/ui/UiAvatar.vue';
import UiBadge from '@/components/ui/UiBadge.vue';
import UiTooltip from '@/components/ui/UiTooltip.vue';
import IconMars from '@/components/icons/IconMars.vue';
import IconVenus from '@/components/icons/IconVenus.vue';
import { getResidentAvatarUrl } from './avatar';
import { getGenderFromName, stripGenderSuffix } from '@/lib/format';
import type { Resident } from './types';

const props = defineProps<{
  resident: Resident;
}>();

const gender = computed(() => getGenderFromName(props.resident.nomComplet));
const cleanName = computed(() => stripGenderSuffix(props.resident.nomComplet));
const physician = computed(() => props.resident.attendingPhysician);
</script>

<template>
  <header class="resident-header">
    <UiAvatar :name="resident.nomComplet" :src="getResidentAvatarUrl(resident)" size="xl" />
    <div class="resident-header__body">
      <h1 class="resident-header__name">{{ cleanName }}</h1>
      <div class="resident-header__chips">
        <UiBadge size="s">GIR 1</UiBadge>
        <span class="chip-inline">
          <component :is="gender === 'F' ? IconVenus : IconMars" :size="14" />
          {{ resident.ageTexte }}
          <span class="muted">({{ resident.dateNaissance }})</span>
        </span>
        <UiBadge size="s">CH. {{ resident.chambre.libelleEtablissementChambre }}</UiBadge>

        <UiTooltip v-if="physician">
          <template #trigger>
            <button type="button" class="doctor-trigger">
              <span class="chip-label">Médecin traitant</span>
              <UiBadge size="s">{{ physician.shortName }}</UiBadge>
            </button>
          </template>

          <p class="doctor-card__title">Médecin traitant</p>
          <p class="doctor-card__name">{{ physician.fullName }}</p>
          <a :href="`tel:${physician.phone.replace(/\s/g, '')}`" class="doctor-card__phone">
            {{ physician.phone }}
          </a>
        </UiTooltip>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.resident-header {
  display: flex;
  align-items: center;
  gap: var(--space-xl);
  padding: var(--space-xl) var(--space-2xl);
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-stroke-secondary);

  @include until-md {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-l);
    padding: var(--space-l);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
    min-width: 0;
  }

  &__name {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-title);

    @include until-md {
      font-size: var(--font-size-l);
    }
  }

  &__chips {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-m);
  }
}

.chip-inline {
  display: inline-flex;
  align-items: center;
  gap: var(--space-s);
  font-size: var(--font-size-s);
  color: var(--color-text-secondary);
}

.chip-label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-semibold);
}

.muted {
  color: var(--color-text-tertiary);
}

.doctor-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--space-m);
  padding: 0;
  border-radius: var(--radius-s);
  cursor: pointer;
}

.doctor-card {
  &__title {
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-invert);
    margin-bottom: var(--space-xs);
  }

  &__name {
    font-size: var(--font-size-s);
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 2px;
  }

  &__phone {
    display: block;
    font-size: var(--font-size-s);
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;

    &:hover {
      color: var(--color-text-invert);
    }
  }
}
</style>
