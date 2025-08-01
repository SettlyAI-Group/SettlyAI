/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

// https://vite.dev/config/
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
