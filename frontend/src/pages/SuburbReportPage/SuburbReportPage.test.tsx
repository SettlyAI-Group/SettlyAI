import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MetricCardsSection from './components/MetricCardsSection';

// Mock Swiper
vi.mock('swiper/react', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Swiper: ({ children }: any) => <div data-testid="swiper">{children}</div>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SwiperSlide: ({ children }: any) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}));

vi.mock('swiper/modules', () => ({ Navigation: 'Navigation' }));

// Mock MetricCard
vi.mock('./components/MetricCardsSection/components/MetricCard', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ title, value }: any) => (
    <div data-testid="metric-card">
      <span>{title}</span>
      <span>{value}</span>
    </div>
  ),
}));

const mockData = [
  {
    icon: <AccountBalanceIcon />,
    title: 'Test Card',
    value: '80%',
    subtitle: '12 months',
  },
];

const theme = createTheme();

describe('MetricCardsSection', () => {
  it('renders section title', () => {
    render(
      <ThemeProvider theme={theme}>
        <MetricCardsSection title="Test Section" data={mockData} />
      </ThemeProvider>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('renders metric cards', () => {
    render(
      <ThemeProvider theme={theme}>
        <MetricCardsSection title="Test Section" data={mockData} />
      </ThemeProvider>
    );

    expect(screen.getByTestId('metric-card')).toBeInTheDocument();
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });
});
