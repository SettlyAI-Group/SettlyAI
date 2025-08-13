import type { Meta, StoryObj } from '@storybook/react';
import SearchInput from './SearchInput';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@/styles/theme';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
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

type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    placeholder: "Paste your property address or suburb to get insights...",
  },
};

export const WithCustomWidth: Story = {
  args: {
    placeholder: "Paste your property address or suburb to get insights...",
    width: "90%",
  },
};

export const WithPixelWidth: Story = {
  args: {
    placeholder: "Paste your property address or suburb to get insights...",
    width: 600,
  },
};
