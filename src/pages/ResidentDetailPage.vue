<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppLayout from '@/layouts/AppLayout.vue';
import ResidentHeader from '@/domain/resident/ResidentHeader.vue';
import UiPopover from '@/components/ui/UiPopover.vue';
import IconChevronDown from '@/components/icons/IconChevronDown.vue';
import { useResidents } from '@/domain/resident/useResidents';

interface SubItem {
  id: string;
  label: string;
}
interface Tab {
  id: string;
  label: string;
  items?: SubItem[];
  /** Default sub-item picked when the tab is selected without an explicit sub. */
  defaultSub?: string;
}

const TABS: Tab[] = [
  { id: 'synthese', label: 'Synthèse' },
  {
    id: 'soins',
    label: 'Soins',
    defaultSub: 'traitements',
    items: [
      { id: 'traitements', label: 'Traitements' },
      { id: 'prescriptions', label: 'Prescriptions' },
      { id: 'releves', label: 'Relevés' },
      { id: 'pharmacie', label: 'Pharmacie' },
    ],
  },
  { id: 'administratif', label: 'Administratif' },
  { id: 'alimentation', label: 'Alimentation' },
  { id: 'intendance', label: 'Intendance' },
  {
    id: 'autres',
    label: 'Autres',
    defaultSub: 'reunions',
    items: [
      { id: 'reunions', label: 'Réunions' },
      { id: 'evenements-indesirables', label: 'Événements indésirables' },
    ],
  },
];

const route = useRoute();
const router = useRouter();
const { getById } = useResidents();

const resident = computed(() => getById(String(route.params.id)));
const activeTabId = computed(() => String(route.query.tab ?? 'synthese'));
const activeTab = computed(() => TABS.find((t) => t.id === activeTabId.value) ?? TABS[0]!);
const activeSubId = computed(() => (route.query.sub ? String(route.query.sub) : null));
const activeSub = computed(
  () => activeTab.value.items?.find((s) => s.id === activeSubId.value) ?? null,
);

const breadcrumb = computed(() => {
  const base = [{ label: 'Résidence du centre ville' }, { label: 'Résidents', to: '/' }];
  if (!resident.value) return base;
  const trail: { label: string; to?: string }[] = [...base, { label: activeTab.value.label }];
  if (activeSub.value) trail.push({ label: activeSub.value.label });
  return trail;
});

/** One open-flag per submenu tab — keyed by tab id. */
const openMenus = ref<Record<string, boolean>>({});
function setMenuOpen(tabId: string, open: boolean): void {
  openMenus.value = { ...openMenus.value, [tabId]: open };
}

function selectTab(tab: Tab): void {
  if (tab.items?.length) {
    // Tab with submenu: if tab is already active, just toggle the menu;
    // otherwise activate the tab with its default sub and open the menu.
    if (activeTabId.value !== tab.id) {
      router.replace({ query: { tab: tab.id, sub: tab.defaultSub } });
    }
    setMenuOpen(tab.id, !openMenus.value[tab.id]);
    return;
  }
  router.replace({ query: { tab: tab.id } });
}

function selectSub(tab: Tab, sub: SubItem): void {
  router.replace({ query: { tab: tab.id, sub: sub.id } });
  setMenuOpen(tab.id, false);
}
</script>

<template>
  <AppLayout :breadcrumb="breadcrumb">
    <div v-if="resident" class="detail">
      <ResidentHeader :resident="resident" />

      <nav class="tabs" aria-label="Sections du dossier résident">
        <template v-for="tab in TABS" :key="tab.id">
          <UiPopover
            v-if="tab.items"
            :open="!!openMenus[tab.id]"
            align="start"
            @update:open="setMenuOpen(tab.id, $event)"
          >
            <template #trigger="{ toggle }">
              <button
                type="button"
                class="tabs__item"
                :data-active="activeTabId === tab.id"
                @click="activeTabId === tab.id ? toggle() : selectTab(tab)"
              >
                <span>{{ tab.label }}</span>
                <IconChevronDown
                  :size="14"
                  class="tabs__chevron"
                  :data-open="!!openMenus[tab.id]"
                />
              </button>
            </template>

            <ul class="tab-menu">
              <li v-for="item in tab.items" :key="item.id">
                <button
                  type="button"
                  class="tab-menu__item"
                  :data-active="activeSubId === item.id"
                  @click="selectSub(tab, item)"
                >
                  {{ item.label }}
                </button>
              </li>
            </ul>
          </UiPopover>

          <button
            v-else
            type="button"
            class="tabs__item"
            :data-active="activeTabId === tab.id"
            @click="selectTab(tab)"
          >
            <span>{{ tab.label }}</span>
          </button>
        </template>
      </nav>

      <div class="detail__body">
        <!--
          Per Figma, Synthèse and Soins/Traitements ship with empty bodies.
          When the test scope expands to include section content, render
          the matching feature component here keyed by activeTabId+activeSubId.
        -->
      </div>
    </div>
    <div v-else class="missing">
      <p>Résident introuvable.</p>
      <RouterLink to="/">Retour à la liste</RouterLink>
    </div>
  </AppLayout>
</template>

<style scoped lang="scss">
.detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  &__body {
    flex: 1;
    background: var(--color-bg-default);
  }
}

.tabs {
  display: flex;
  gap: var(--space-2xl);
  padding: 0 var(--space-2xl);
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-stroke-secondary);

  @include until-md {
    gap: var(--space-l);
    padding: 0 var(--space-l);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__item {
    display: inline-flex;
    align-items: center;
    gap: var(--space-s);
    padding: var(--space-l) 0;
    font-size: var(--font-size-m);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    white-space: nowrap;
    flex-shrink: 0;
    transition:
      color 120ms ease,
      border-color 120ms ease;

    &:hover {
      color: var(--color-text-primary);
    }

    &[data-active='true'] {
      color: var(--color-module-primary);
      border-bottom-color: var(--color-module-primary);
    }
  }

  &__chevron {
    transition: transform 150ms ease;
    &[data-open='true'] {
      transform: rotate(180deg);
    }
  }
}

.tab-menu {
  display: flex;
  flex-direction: column;
  min-width: 160px;

  &__item {
    width: 100%;
    text-align: left;
    padding: var(--space-m) var(--space-l);
    border-radius: var(--radius-xs);
    font-size: var(--font-size-m);
    color: var(--color-text-primary);
    transition: background-color 100ms ease;
    white-space: nowrap;

    &:hover {
      background: var(--color-bg-subtle);
    }

    &[data-active='true'] {
      color: var(--color-module-primary);
      font-weight: var(--font-weight-medium);
    }
  }
}

.missing {
  margin: auto;
  padding: var(--space-7xl);
  text-align: center;
  color: var(--color-text-secondary);

  a {
    display: inline-block;
    margin-top: var(--space-l);
    color: var(--color-module-primary);
    font-weight: var(--font-weight-medium);
  }
}
</style>
