/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    test: {
      include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
      globals: true,
      environment: 'jsdom',
      // setupFiles: ["./src/test/setup.ts"],
      reporters: ['verbose'],
      projects: [
        {
          extends: true,
          plugins: [
            // The plugin will run tests for the stories defined in your Storybook config
            // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
            storybookTest({
              configDir: path.join(dirname, '.storybook'),
            }),
          ],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: 'playwright',
              instances: [
                {
                  browser: 'chromium',
                },
              ],
            },
            setupFiles: ['.storybook/vitest.setup.ts'],
          },
        },
      ],
    },
    server: {
      proxy: isDev
        ? {
            '/api': {
              target: 'http://localhost:5100',
              changeOrigin: true,
              rewrite: path => path.replace(/^\/api/, '/api'),
            },
          }
        : undefined,
    },
  };
});
