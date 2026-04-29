import pluginVue from 'eslint-plugin-vue';
import vueTsConfig from '@vue/eslint-config-typescript';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**', '*.fig'],
  },
  ...pluginVue.configs['flat/recommended'],
  ...vueTsConfig(),
  skipFormatting,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off', // optional props don't need ceremonial defaults
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineProps', 'defineEmits', 'defineExpose', 'defineSlots'],
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
];
