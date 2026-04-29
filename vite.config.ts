import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Auto-inject SCSS-only helpers (mixins, breakpoints) into every <style scss>.
        // Design tokens are CSS custom properties (see src/styles/tokens.css) — not SCSS.
        additionalData: `@use "@/styles/breakpoints" as *;`,
      },
    },
  },
});
