import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { describe, it, expect } from 'vitest';
import FeatureSection from './FeatureSection';

const renderWithProviders = (ui: React.ReactElement) => {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MemoryRouter>{ui}</MemoryRouter>
    </ThemeProvider>
  );
};

describe('FeatureSection', () => {
  it('shows title and subtitle', () => {
    renderWithProviders(<FeatureSection />);
    expect(screen.getByText(/All-in-One Tools to Simplify Your Journey/i)).toBeInTheDocument();
    expect(screen.getByText(/Let's plan smarter/i)).toBeInTheDocument();
  });

  it('renders the three feature links', () => {
    renderWithProviders(<FeatureSection />);
    expect(screen.getByRole('link', { name: /Let AI Guide me/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Simulate Loan/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Compare Super Strategy/i })).toBeInTheDocument();
  });
});
