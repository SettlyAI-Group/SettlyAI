import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MetricCardsSection from './components/MetricCardsSection';
import Banner from './components/Banner';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

// Clear all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

describe('Banner Component', () => {
  it('should render section title, subtitle, and button', () => {
    render(
      <MemoryRouter>
        <Banner suburb="Point Cook" postcode="3030" state="VIC" />
      </MemoryRouter>
    );

    expect(screen.getByText(/Point Cook/)).toBeInTheDocument();
    expect(screen.getByText(/3030/)).toBeInTheDocument();
    expect(screen.getByText(/VIC/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('calls navigate(-1) when back button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Banner suburb="Point Cook" postcode="3030" state="VIC" />
      </MemoryRouter>
    );

    const backButton = screen.getByRole('button', { name: /back/i });

    await user.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});

describe('MetricCardsSection', () => {
  const mockData = [
    {
      icon: <AccountBalanceIcon />,
      title: 'Test Card',
      value: '80%',
      subtitle: '12 months',
    },
  ];

  it('renders section title', () => {
    render(<MetricCardsSection title="Test Section" data={mockData} />);

    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('renders metric cards', () => {
    render(<MetricCardsSection title="Test Section" data={mockData} />);

    expect(screen.getByTestId('metric-card')).toBeInTheDocument();
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });
});
