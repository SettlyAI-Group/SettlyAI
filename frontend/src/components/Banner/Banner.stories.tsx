// Banner.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import Banner from './Banner';

const meta: Meta<typeof Banner> = {
  title: 'Components/Banner',
  component: Banner,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  args: {
    title: 'Welcome to Syndey, NSW 2000',
    description: 'Smart data to help you decide — from affordability to growth to lifestyle.',
  },
};
