import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { describe, it, expect } from 'vitest';
import FeatureCards from '.';

const renderWithProviders = (ui: React.ReactElement) => {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>{ui}</MemoryRouter>
    </ThemeProvider>
  );
};

describe('FeatureCards', () => {
  it('shows three card titles', () => {
    renderWithProviders(<FeatureCards />);
    expect(screen.getByText(/SettlyHome/i)).toBeInTheDocument();
    expect(screen.getByText(/SettlyLoan/i)).toBeInTheDocument();
    expect(screen.getByText(/SettlySuper/i)).toBeInTheDocument();
  });

  it('buttons are links with correct targets', () => {
    renderWithProviders(<FeatureCards />);
    expect(screen.getByRole('link', { name: /Let AI Guide me/i })).toHaveAttribute('href', '/chat');
    expect(screen.getByRole('link', { name: /Simulate Loan/i })).toHaveAttribute('href', '/loan-calculator');
    expect(screen.getByRole('link', { name: /Compare Super Strategy/i })).toHaveAttribute('href', '/super');
  });
});
