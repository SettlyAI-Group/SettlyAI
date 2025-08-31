import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    // '@storybook/addon-vitest', // 暂时禁用，专注于 RTL 测试
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};
export default config;
