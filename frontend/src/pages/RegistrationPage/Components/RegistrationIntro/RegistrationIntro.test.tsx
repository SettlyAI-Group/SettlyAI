import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { RegistrationIntro } from './RegistrationIntro';

// Mock ArrowBackIcon
vi.mock('@mui/icons-material/ArrowBack', () => ({
  default: () => <div data-testid="arrow-back-icon">ArrowBackIcon</div>,
}));

const theme = createTheme();

// Test wrapper with required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </BrowserRouter>
);

describe('RegistrationIntro', () => {
  describe('Text Content Rendering', () => {
    it('should render the welcome title with correct heading element', () => {
      render(
        <TestWrapper>
          <RegistrationIntro />
        </TestWrapper>
      );

      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Welcome to Settly AI');
    });

    it('should render "Settly AI" text', () => {
      render(
        <TestWrapper>
          <RegistrationIntro />
        </TestWrapper>
      );

      expect(screen.getByText('Settly AI')).toBeInTheDocument();
    });

    it('should render the description text', () => {
      render(
        <TestWrapper>
          <RegistrationIntro />
        </TestWrapper>
      );

      expect(screen.getByText(/create your free account to unlock suburb insights/i)).toBeInTheDocument();
    });
  });

  describe('Navigation Link', () => {
    it('should render "Back to Log in" link', () => {
      render(
        <TestWrapper>
          <RegistrationIntro />
        </TestWrapper>
      );

      const link = screen.getByRole('link', { name: /back to log in/i });
      expect(link).toBeInTheDocument();
    });

    it('should have correct link destination to /login', () => {
      render(
        <TestWrapper>
          <RegistrationIntro />
        </TestWrapper>
      );

      const link = screen.getByRole('link', { name: /back to log in/i });
      expect(link).toHaveAttribute('href', '/login');
    });

    it('should display ArrowBackIcon', () => {
      render(
        <TestWrapper>
          <RegistrationIntro />
        </TestWrapper>
      );

      expect(screen.getByTestId('arrow-back-icon')).toBeInTheDocument();
    });
  });
});
