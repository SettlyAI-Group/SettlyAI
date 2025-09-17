import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { FormCheckbox } from './FormCheckbox';

const theme = createTheme();

interface TestWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactNode | ((control: any, methods: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validationRules?: Record<string, any>;
}

const TestWrapper = ({ children, defaultValues = {}, onSubmit = vi.fn(), validationRules = {} }: TestWrapperProps) => {
  const methods = useForm({ defaultValues });
  const { control, handleSubmit } = methods;

  // Register fields with validation rules
  Object.entries(validationRules).forEach(([fieldName, rules]) => {
    methods.register(fieldName, rules);
  });

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {typeof children === 'function' ? children(control, methods) : children}
        <button type="submit">Submit</button>
      </form>
    </ThemeProvider>
  );
};

describe('FormCheckbox Component', () => {
  describe('Rendering', () => {
    it('should render checkbox with label', () => {
      render(
        <TestWrapper>
          {control => <FormCheckbox name="testCheckbox" control={control} label="Test Label" />}
        </TestWrapper>
      );

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('should render with React node as label', () => {
      render(
        <TestWrapper>
          {control => (
            <FormCheckbox
              name="testCheckbox"
              control={control}
              label={<span data-testid="custom-label">Custom Label</span>}
            />
          )}
        </TestWrapper>
      );

      expect(screen.getByTestId('custom-label')).toBeInTheDocument();
      expect(screen.getByText('Custom Label')).toBeInTheDocument();
    });

    it('should render with default unchecked state', () => {
      render(
        <TestWrapper>
          {control => <FormCheckbox name="testCheckbox" control={control} label="Test Checkbox" />}
        </TestWrapper>
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should render with checked state from form values', () => {
      render(
        <TestWrapper defaultValues={{ testCheckbox: true }}>
          {control => <FormCheckbox name="testCheckbox" control={control} label="Test Checkbox" />}
        </TestWrapper>
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
  });

  describe('Interaction', () => {
    it('should update form state on checkbox change', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper defaultValues={{ terms: false }}>
          {control => <FormCheckbox name="terms" control={control} label="I agree" />}
        </TestWrapper>
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it('should handle form submission with checkbox value', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();

      render(
        <TestWrapper onSubmit={onSubmit}>
          {control => <FormCheckbox name="terms" control={control} label="I agree" />}
        </TestWrapper>
      );

      const checkbox = screen.getByRole('checkbox');
      const submitButton = screen.getByText('Submit');

      await user.click(checkbox);
      await user.click(submitButton);

      expect(onSubmit).toHaveBeenCalled();
    });

    it('should toggle checkbox state on click', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>{control => <FormCheckbox name="testCheckbox" control={control} label="Toggle me" />}</TestWrapper>
      );

      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('should handle label click to toggle checkbox', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>{control => <FormCheckbox name="testCheckbox" control={control} label="Click me" />}</TestWrapper>
      );

      const checkbox = screen.getByRole('checkbox');
      const label = screen.getByText('Click me');

      expect(checkbox).not.toBeChecked();
      await user.click(label);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Error Handling', () => {
    it('should display error state when field has error', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper
          validationRules={{
            terms: { required: 'You must agree to terms' },
          }}
        >
          {control => <FormCheckbox name="terms" control={control} label="I agree to terms" />}
        </TestWrapper>
      );

      const submitButton = screen.getByText('Submit');
      await user.click(submitButton);

      expect(screen.getByText('You must agree to terms')).toBeInTheDocument();
    });

    it('should show error message in helper text', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper
          validationRules={{
            terms: { required: 'Terms must be accepted' },
          }}
        >
          {control => <FormCheckbox name="terms" control={control} label="Accept terms" />}
        </TestWrapper>
      );

      const submitButton = screen.getByText('Submit');
      await user.click(submitButton);

      const helperText = screen.getByText('Terms must be accepted');
      expect(helperText).toBeInTheDocument();
    });

    it('should not show helper text when no error', () => {
      render(<TestWrapper>{control => <FormCheckbox name="terms" control={control} label="I agree" />}</TestWrapper>);

      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe('Validation Rules', () => {
    it('should handle required field validation', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper
          validationRules={{
            required: { required: 'This field is required' },
          }}
        >
          {control => <FormCheckbox name="required" control={control} label="Required checkbox" />}
        </TestWrapper>
      );

      const submitButton = screen.getByText('Submit');
      await user.click(submitButton);

      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should trigger validation on checkbox change', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper
          validationRules={{
            terms: { required: 'Must agree' },
          }}
        >
          {control => <FormCheckbox name="terms" control={control} label="Agree to terms" />}
        </TestWrapper>
      );

      const submitButton = screen.getByText('Submit');
      const checkbox = screen.getByRole('checkbox');

      await user.click(submitButton);
      expect(screen.getByText('Must agree')).toBeInTheDocument();

      await user.click(checkbox);
      expect(screen.queryByText('Must agree')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined/null values', () => {
      render(
        <TestWrapper defaultValues={{ testCheckbox: undefined }}>
          {control => <FormCheckbox name="testCheckbox" control={control} label="Test Checkbox" />}
        </TestWrapper>
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should handle empty string values', () => {
      render(
        <TestWrapper defaultValues={{ testCheckbox: '' }}>
          {control => <FormCheckbox name="testCheckbox" control={control} label="Test Checkbox" />}
        </TestWrapper>
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });
  });
});
