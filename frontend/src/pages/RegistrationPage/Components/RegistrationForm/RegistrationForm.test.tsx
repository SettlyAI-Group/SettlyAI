import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RegistrationForm } from './RegistrationForm';

const theme = createTheme();

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/api/authApi', () => ({
  registerUser: vi.fn(),
}));

// Import the mocked function
import { registerUser as mockRegisterUser } from '@/api/authApi';
const mockRegisterUserFn = vi.mocked(mockRegisterUser);

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: {
        retry: false,
        // Suppress error logging in tests
        onError: () => {},
      },
    },
    // Suppress error boundary and logging for tests
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // Suppress error logging
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('RegistrationForm Component', () => {
  const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.type(screen.getByLabelText('Full Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password123!');
    await user.click(screen.getByRole('checkbox'));
  };

  // Suppress test warnings
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRegisterUserFn.mockClear();
    mockNavigate.mockClear();

    // Suppress console warnings during tests
    console.error = vi.fn();
    console.warn = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  });

  describe('Rendering', () => {
    it('should render form title', () => {
      render(
        <TestWrapper>
          <RegistrationForm />
        </TestWrapper>
      );

      expect(screen.getByText('Get Started for Free')).toBeInTheDocument();
    });

    it('should render form description', () => {
      render(
        <TestWrapper>
          <RegistrationForm />
        </TestWrapper>
      );

      expect(screen.getByText('Create your Settly AI account.')).toBeInTheDocument();
    });

    it('should render login link', () => {
      render(
        <TestWrapper>
          <RegistrationForm />
        </TestWrapper>
      );

      expect(screen.getByText('Already have an account?')).toBeInTheDocument();
      expect(screen.getByText('Log in here')).toBeInTheDocument();
    });

    it('should render all form fields and buttons', () => {
      render(
        <TestWrapper>
          <RegistrationForm />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    });

    it('should not show root error message initially', () => {
      render(
        <TestWrapper>
          <RegistrationForm />
        </TestWrapper>
      );

      expect(screen.queryByText(/registration failed/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Integration', () => {
    it('should allow user to fill all form fields', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <RegistrationForm />
        </TestWrapper>
      );

      const fullNameInput = screen.getByLabelText('Full Name');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const termsCheckbox = screen.getByRole('checkbox');

      await user.type(fullNameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'Password123!');
      await user.type(confirmPasswordInput, 'Password123!');
      await user.click(termsCheckbox);

      expect(fullNameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john@example.com');
      expect(passwordInput).toHaveValue('Password123!');
      expect(confirmPasswordInput).toHaveValue('Password123!');
      expect(termsCheckbox).toBeChecked();
    });

    it('should show password strength on password field focus', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <RegistrationForm />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');

      await user.click(passwordInput);
      await user.type(passwordInput, 'test');

      // Password strength component should be visible
      expect(screen.getByText(/password strength/i)).toBeInTheDocument();
    });

    it('should hide password strength on password field blur', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <RegistrationForm />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText('Password');
      const emailInput = screen.getByLabelText('Email');

      await user.click(passwordInput);
      await user.type(passwordInput, 'test');

      // Focus another field
      await user.click(emailInput);

      // Password strength should be hidden
      expect(screen.queryByText(/password strength/i)).not.toBeInTheDocument();
    });

    it('should prevent submission with invalid data', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <RegistrationForm />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: 'Create Account' });

      await user.click(submitButton);

      // Should show validation errors
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
      expect(mockRegisterUserFn).not.toHaveBeenCalled();
    });
  });

  describe('API Integration', () => {
    it('should submit form with valid data and navigate on success', async () => {
      const user = userEvent.setup();
      mockRegisterUserFn.mockResolvedValue({ id: 1, fullName: 'John Doe', email: 'john@example.com' });

      render(
        <TestWrapper>
          <RegistrationForm />
        </TestWrapper>
      );

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      await user.click(submitButton);

      expect(mockRegisterUserFn).toHaveBeenCalledWith({
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/verify-email');
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      let resolvePromise: (value?: unknown) => void;
      mockRegisterUserFn.mockImplementation(
        () =>
          new Promise(resolve => {
            resolvePromise = resolve;
          })
      );

      render(
        <TestWrapper>
          <RegistrationForm />
        </TestWrapper>
      );

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      await user.click(submitButton);

      // Should show loading spinner and form should be replaced by loading state
      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });

      // Form should not be visible during loading (replaced by loading spinner)
      expect(screen.queryByRole('button', { name: 'Create Account' })).not.toBeInTheDocument();

      // Resolve the promise to clean up
      resolvePromise!();
    });

    it('should handle email conflict error (409)', async () => {
      const user = userEvent.setup();
      const error = {
        response: { status: 409 },
      };
      mockRegisterUserFn.mockRejectedValue(error);

      render(
        <TestWrapper>
          <RegistrationForm />
        </TestWrapper>
      );

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('This email has already been registered')).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should handle general network error', async () => {
      const user = userEvent.setup();
      const error = {
        response: { status: 500 },
      };
      mockRegisterUserFn.mockRejectedValue(error);

      render(
        <TestWrapper>
          <RegistrationForm />
        </TestWrapper>
      );

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Registration failed, please try again later')).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should reset form after successful registration', async () => {
      const user = userEvent.setup();
      mockRegisterUserFn.mockResolvedValue({ id: 1, fullName: 'John Doe', email: 'john@example.com' });

      render(
        <TestWrapper>
          <RegistrationForm />
        </TestWrapper>
      );

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/verify-email');
      });

      // Form should be reset
      expect(screen.getByLabelText('Full Name')).toHaveValue('');
      expect(screen.getByLabelText('Email')).toHaveValue('');
      expect(screen.getByLabelText('Password')).toHaveValue('');
      expect(screen.getByLabelText('Confirm Password')).toHaveValue('');
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
  });

  describe('Edge Cases', () => {
    it('should handle API timeout errors', async () => {
      const user = userEvent.setup();
      const timeoutError = new Error('Network timeout');
      mockRegisterUserFn.mockRejectedValue(timeoutError);

      render(
        <TestWrapper>
          <RegistrationForm />
        </TestWrapper>
      );

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Registration failed, please try again later')).toBeInTheDocument();
      });
    });

    it('should handle form state when switching between loading and error states', async () => {
      const user = userEvent.setup();
      mockRegisterUserFn.mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper>
          <RegistrationForm />
        </TestWrapper>
      );

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      await user.click(submitButton);

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Registration failed, please try again later')).toBeInTheDocument();
      });

      // Form should be interactive again
      expect(submitButton).toBeEnabled();
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });
});
