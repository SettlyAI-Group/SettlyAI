/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

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
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.stories.*', // 排除 Storybook 文件
      ],
      globals: true,
      environment: 'jsdom',
      // setupFiles: ["./src/test/setup.ts"], // 保持原来的注释状态
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
