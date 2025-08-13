import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Banner from './Banner';
import theme from '@/styles/theme';

const meta: Meta<typeof Banner> = {
  title: 'Components/Banner',
  component: Banner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  args: {
    title: 'Welcome to Sydney, NSW 2000',
    description:
      'Smart data to help you decide — from affordability to growth to lifestyle.',
  },
};

export const NoDescription: Story = {
  args: {
    title: 'Welcome to Perth, WA 6000',
  },
};

