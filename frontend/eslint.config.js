// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import testingLibrary from 'eslint-plugin-testing-library';
import pluginJestDom from 'eslint-plugin-jest-dom';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  {
    ignores: ['dist/**', '.dist/**', 'node_modules/**', 'build/**', 'coverage/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    files: ['**/*.{jsx,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    ...pluginReact.configs.flat.recommended,
  },
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
    },
  },
  // TanStack Query plugin configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@tanstack/query': tanstackQuery,
    },
    extends: tanstackQuery.configs['flat/recommended'],
  },
  // Testing Library plugin configuration
  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    ...testingLibrary.configs['flat/react'],
  },
  // Jest DOM plugin configuration
  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    ...pluginJestDom.configs['flat/recommended'],
  },
  prettierConfig,
]);
