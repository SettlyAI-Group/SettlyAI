import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { FormInput } from './FormInput';

const theme = createTheme();

interface TestWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactNode | ((control: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (data: any) => void;
}

const TestWrapper = ({ 
  children, 
  defaultValues = {}, 
  onSubmit = vi.fn() 
}: TestWrapperProps) => {
  const { control, handleSubmit } = useForm({ defaultValues });
  
  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {typeof children === 'function' ? children(control) : children}
        <button type="submit">Submit</button>
      </form>
    </ThemeProvider>
  );
};

describe('FormInput Component', () => {
  describe('Basic Rendering', () => {
    it('should render input field with label', () => {
      render(
        <TestWrapper>
          {(control) => <FormInput name="testField" control={control} label="Test Label" />}
        </TestWrapper>
      );
      
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with placeholder text', () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormInput 
              name="testField" 
              control={control} 
              placeholder="Enter text" 
            />
          )}
        </TestWrapper>
      );
      
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render with default MUI TextField props', () => {
      render(
        <TestWrapper>
          {(control) => <FormInput name="testField" control={control} />}
        </TestWrapper>
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should forward TextField props correctly', () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormInput 
              name="testField" 
              control={control} 
              data-testid="custom-input"
              autoComplete="off"
            />
          )}
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-input')).toBeInTheDocument();
    });
  });

  describe('React Hook Form Integration', () => {
    it('should integrate with react-hook-form control', () => {
      render(
        <TestWrapper defaultValues={{ testField: 'initial' }}>
          {(control) => <FormInput name="testField" control={control} />}
        </TestWrapper>
      );
      
      expect(screen.getByDisplayValue('initial')).toBeInTheDocument();
    });

    it('should display field value from form state', () => {
      render(
        <TestWrapper defaultValues={{ email: 'test@example.com' }}>
          {(control) => <FormInput name="email" control={control} />}
        </TestWrapper>
      );
      
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });

    it('should update form state on input change', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          {(control) => <FormInput name="testField" control={control} />}
        </TestWrapper>
      );
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'new value');
      
      expect(input).toHaveValue('new value');
    });

    it('should handle form submission with field value', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();
      
      render(
        <TestWrapper onSubmit={onSubmit}>
          {(control) => <FormInput name="testField" control={control} />}
        </TestWrapper>
      );
      
      const input = screen.getByRole('textbox');
      const submitButton = screen.getByText('Submit');
      
      await user.type(input, 'test value');
      await user.click(submitButton);
      
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  describe('User Interaction', () => {
    it('should allow user to type in the input', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          {(control) => <FormInput name="testField" control={control} />}
        </TestWrapper>
      );
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello World');
      
      expect(input).toHaveValue('Hello World');
    });

    it('should handle focus and blur events', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          {(control) => <FormInput name="testField" control={control} />}
        </TestWrapper>
      );
      
      const input = screen.getByRole('textbox');
      
      await user.click(input);
      expect(input).toHaveFocus();
      
      await user.tab();
      expect(input).not.toHaveFocus();
    });

    it('should clear input when value is deleted', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper defaultValues={{ testField: 'initial text' }}>
          {(control) => <FormInput name="testField" control={control} />}
        </TestWrapper>
      );
      
      const input = screen.getByRole('textbox');
      await user.clear(input);
      
      expect(input).toHaveValue('');
    });

    it('should handle special keys (Enter, Tab, etc.)', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          {(control) => <FormInput name="testField" control={control} />}
        </TestWrapper>
      );
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'test');
      await user.keyboard('{Enter}');
      
      expect(input).toHaveValue('test');
    });
  });

  describe('Error Handling', () => {
    it('should display error state when field has error', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          {(control) => (
            <FormInput 
              name="testField" 
              control={control} 
              rules={{ required: 'This field is required' }}
            />
          )}
        </TestWrapper>
      );
      
      const submitButton = screen.getByText('Submit');
      
      await user.click(submitButton);
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should show error message in helperText', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          {(control) => (
            <FormInput 
              name="email" 
              control={control} 
              rules={{ 
                pattern: {
                  value: /^[^@]+@[^@]+\.[^@]+$/,
                  message: 'Invalid email format'
                }
              }}
            />
          )}
        </TestWrapper>
      );
      
      const input = screen.getByRole('textbox');
      const submitButton = screen.getByText('Submit');
      
      await user.type(input, 'invalid-email');
      await user.click(submitButton);
      
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });

    it('should apply error styling to input', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          {(control) => (
            <FormInput 
              name="testField" 
              control={control} 
              rules={{ required: 'Required' }}
            />
          )}
        </TestWrapper>
      );
      
      const submitButton = screen.getByText('Submit');
      await user.click(submitButton);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should prioritize error message over custom helperText', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          {(control) => (
            <FormInput 
              name="testField" 
              control={control} 
              rules={{ required: 'Field is required' }}
              helperText="Custom helper text"
            />
          )}
        </TestWrapper>
      );
      
      const submitButton = screen.getByText('Submit');
      await user.click(submitButton);
      
      expect(screen.getByText('Field is required')).toBeInTheDocument();
      expect(screen.queryByText('Custom helper text')).not.toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('should display custom helperText when no error', () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormInput 
              name="testField" 
              control={control} 
              helperText="This is helper text"
            />
          )}
        </TestWrapper>
      );
      
      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });

    it('should hide helperText when error is present', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          {(control) => (
            <FormInput 
              name="testField" 
              control={control} 
              rules={{ required: 'Field is required' }}
              helperText="Helper text"
            />
          )}
        </TestWrapper>
      );
      
      const submitButton = screen.getByText('Submit');
      await user.click(submitButton);
      
      expect(screen.getByText('Field is required')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });

    it('should handle helperText as React node', () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormInput 
              name="testField" 
              control={control} 
              helperText={<span data-testid="custom-helper">Custom helper</span>}
            />
          )}
        </TestWrapper>
      );
      
      expect(screen.getByTestId('custom-helper')).toBeInTheDocument();
      expect(screen.getByText('Custom helper')).toBeInTheDocument();
    });
  });

  describe('Validation Rules', () => {
    it('should apply validation rules from props', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          {(control) => (
            <FormInput 
              name="testField" 
              control={control} 
              rules={{ 
                minLength: {
                  value: 5,
                  message: 'Minimum 5 characters'
                }
              }}
            />
          )}
        </TestWrapper>
      );
      
      const input = screen.getByRole('textbox');
      const submitButton = screen.getByText('Submit');
      
      await user.type(input, 'abc');
      await user.click(submitButton);
      
      expect(screen.getByText('Minimum 5 characters')).toBeInTheDocument();
    });

    it('should trigger validation on input change', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          {(control) => (
            <FormInput 
              name="testField" 
              control={control} 
              rules={{ required: 'Required field' }}
            />
          )}
        </TestWrapper>
      );
      
      const input = screen.getByRole('textbox');
      const submitButton = screen.getByText('Submit');
      
      await user.click(submitButton);
      expect(screen.getByText('Required field')).toBeInTheDocument();
      
      await user.type(input, 'valid input');
      expect(screen.queryByText('Required field')).not.toBeInTheDocument();
    });

    it('should handle required field validation', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          {(control) => (
            <FormInput 
              name="testField" 
              control={control} 
              rules={{ required: 'This field is required' }}
            />
          )}
        </TestWrapper>
      );
      
      const submitButton = screen.getByText('Submit');
      await user.click(submitButton);
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should handle custom validation functions', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          {(control) => (
            <FormInput 
              name="testField" 
              control={control} 
              rules={{ 
                validate: (value) => 
                  value === 'admin' || 'Only admin is allowed'
              }}
            />
          )}
        </TestWrapper>
      );
      
      const input = screen.getByRole('textbox');
      const submitButton = screen.getByText('Submit');
      
      await user.type(input, 'user');
      await user.click(submitButton);
      
      expect(screen.getByText('Only admin is allowed')).toBeInTheDocument();
    });
  });



  describe('Edge Cases', () => {
    it('should handle undefined/null values', () => {
      render(
        <TestWrapper defaultValues={{ testField: undefined }}>
          {(control) => <FormInput name="testField" control={control} />}
        </TestWrapper>
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });

    it('should handle very long input values', async () => {
      const user = userEvent.setup();
      const longText = 'a'.repeat(1000);
      
      render(
        <TestWrapper>
          {(control) => <FormInput name="testField" control={control} />}
        </TestWrapper>
      );
      
      const input = screen.getByRole('textbox');
      await user.type(input, longText);
      
      expect(input).toHaveValue(longText);
    });

    it('should handle special characters in input', async () => {
      const user = userEvent.setup();
      const specialText = '!@#$%^&*()_+-=';
      
      render(
        <TestWrapper>
          {(control) => <FormInput name="testField" control={control} />}
        </TestWrapper>
      );
      
      const input = screen.getByRole('textbox');
      await user.type(input, specialText);
      
      expect(input).toHaveValue(specialText);
    });

    it('should handle rapid input changes', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          {(control) => <FormInput name="testField" control={control} />}
        </TestWrapper>
      );
      
      const input = screen.getByRole('textbox');
      
      await user.type(input, 'abc');
      await user.clear(input);
      await user.type(input, 'def');
      await user.clear(input);
      await user.type(input, 'final');
      
      expect(input).toHaveValue('final');
    });
  });

});