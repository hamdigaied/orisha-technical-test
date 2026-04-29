# Orisha — Test Front-end · Liste des résidents

Vue 3 integration of the Figma file `Orisha - Test Front-end.fig`, driven by `src/assets/data.json` (50 residents).

## Stack

Vue 3 (`<script setup>`) · Vite · TypeScript · Vue Router · SCSS (mixins) + CSS custom properties (tokens) · Vitest · ESLint + Prettier.

## Run

```bash
nvm use 22          # or Node ≥ 20
npm install
npm run dev         # http://localhost:5173
```

## Commands

```bash
npm run dev          # start dev server
npm run build        # vue-tsc + vite build
npm run preview      # serve the production build
npm run type-check   # vue-tsc --noEmit
npm test             # vitest run
npm run test:watch   # vitest watch mode
npm run lint         # eslint .
npm run lint:fix     # eslint . --fix
npm run format       # prettier --write .
npm run format:check # prettier --check .
```

## Architecture

Domain-driven layout — code grouped by **what it represents**, not by file type.

```
src/
├── main.ts                       # createApp + router + global styles
├── App.vue                       # <RouterView />
├── router.ts
│
├── styles/
│   ├── tokens.css                # 3-tier design tokens (Primitives → Semantic → Module)
│   ├── reset.css
│   └── _breakpoints.scss         # SCSS mixins, auto-injected into every <style scss>
│
├── lib/                          # framework-agnostic helpers
│   ├── format.ts                 # name parsing, sector path formatting
│   ├── color.ts                  # color-mix tinting for status badges
│   └── useFloating.ts            # shared positioning/dismissal for popover-likes
│
├── components/
│   ├── ui/                       # design system — stateless, prop-driven
│   │   ├── UiAvatar.vue
│   │   ├── UiBadge.vue
│   │   ├── UiButton.vue
│   │   ├── UiCheckbox.vue
│   │   ├── UiInput.vue
│   │   ├── UiPopover.vue
│   │   ├── UiSegmentedControl.vue
│   │   └── UiTooltip.vue
│   └── icons/                    # one SFC per glyph (paths from Figma sprite)
│
├── domain/
│   └── resident/                 # everything resident-specific
│       ├── types.ts
│       ├── data.ts               # data source (JSON today, HTTP tomorrow)
│       ├── filter.ts             # pure filterResidents + groupSectors (unit-tested)
│       ├── avatar.ts             # gender + id → /avatars/*.png mapping
│       ├── useResidents.ts       # composable store
│       └── *.vue                 # feature components (table, grid, sidebar, header…)
│
├── layouts/
│   └── AppLayout.vue             # purple module band + breadcrumb + slot
│
└── pages/
    ├── ResidentsListPage.vue     # list / trombinoscope / empty (3 states, 1 page)
    └── ResidentDetailPage.vue    # header + tab nav (Synthèse / Soins / …)
```

**Layering rules**

1. `lib/` has no Vue dependency — pure functions, fully unit-testable.
2. `components/ui/` is stateless. Props in, events out. Never reads from `domain/`.
3. `domain/resident/` owns the model. May compose `ui/`, never the reverse.
4. `pages/` wires `domain/` + `layouts/` + the router. No inline business logic.
5. Tokens flow one way: `tokens.css` → components consume `var(--…)`. No hardcoded hex except `UiBadge.color` (situation color comes from data).
