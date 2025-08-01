// Banner.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import Banner from './Banner';
import bgImage from '@/assets/images/BannerBg.jpg';

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
    description:
      'Smart data to help you decide — from affordability to growth to lifestyle.',
    withBackButton: true,
    backgroundImage: bgImage,
    withSearchSection: true,
  },
};
export const withNoBackButton: Story = {
  args: {
    title: 'Welcome to Syndey, NSW 2000',
    description:
      'Smart data to help you decide — from affordability to growth to lifestyle.',
    withBackButton: false,
    backgroundImage: bgImage,
    withSearchSection: true,
  },
};

export const withNoSearchSection: Story = {
  args: {
    title: 'Welcome to Syndey, NSW 2000',
    description:
      'Smart data to help you decide — from affordability to growth to lifestyle.',
    withBackButton: true,
    backgroundImage: bgImage,
    withSearchSection: false,
  },
};
