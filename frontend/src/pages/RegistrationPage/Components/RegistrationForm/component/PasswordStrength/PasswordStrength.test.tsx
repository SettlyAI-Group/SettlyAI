import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  PasswordStrength,
  evaluatePassword,
  getStrength,
  defaultPasswordRules,
  type PasswordRule,
} from './PasswordStrength';

const theme = createTheme();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('PasswordStrength Utility Functions', () => {
  describe('getStrength', () => {
    it('should return weak strength for score <= 1', () => {
      const result0 = getStrength(0, 4);
      expect(result0.level).toBe('weak');
      expect(result0.text).toBe('Weak');
      expect(result0.value).toBe(0);

      const result1 = getStrength(1, 4);
      expect(result1.level).toBe('weak');
      expect(result1.text).toBe('Weak');
      expect(result1.value).toBe(25);
    });

    it('should return medium strength for score 2-3', () => {
      const result2 = getStrength(2, 4);
      expect(result2.level).toBe('medium');
      expect(result2.text).toBe('Medium');
      expect(result2.value).toBe(50);

      const result3 = getStrength(3, 4);
      expect(result3.level).toBe('medium');
      expect(result3.text).toBe('Medium');
      expect(result3.value).toBe(75);
    });

    it('should return strong strength for score = 4', () => {
      const result = getStrength(4, 4);
      expect(result.level).toBe('strong');
      expect(result.text).toBe('Strong');
      expect(result.value).toBe(100);
    });

    it('should calculate correct percentage values', () => {
      expect(getStrength(1, 3).value).toBe(33);
      expect(getStrength(2, 3).value).toBe(67);
      expect(getStrength(3, 3).value).toBe(100);
    });
  });

  describe('evaluatePassword', () => {
    it('should evaluate password against default rules', () => {
      const result = evaluatePassword('Abc123!@');
      expect(result.results).toHaveLength(4);
      expect(result.passedCount).toBe(4);
      expect(result.strength.level).toBe('strong');
    });

    it('should evaluate password against custom rules', () => {
      const customRules: PasswordRule[] = [{ code: 'test', label: 'Test rule', test: v => v.includes('test') }];
      const result = evaluatePassword('testpassword', customRules);
      expect(result.results).toHaveLength(1);
      expect(result.results[0].passed).toBe(true);
      expect(result.passedCount).toBe(1);
    });

    it('should return correct passed count', () => {
      const weakResult = evaluatePassword('abc');
      expect(weakResult.passedCount).toBe(0);

      const mediumResult = evaluatePassword('Abcdefgh1');
      expect(mediumResult.passedCount).toBe(3);
    });

    it('should handle empty password', () => {
      const result = evaluatePassword('');
      expect(result.passedCount).toBe(0);
      expect(result.strength.level).toBe('weak');
    });
  });

  describe('defaultPasswordRules', () => {
    it('should validate minimum length (8 characters)', () => {
      const lengthRule = defaultPasswordRules[0];
      expect(lengthRule.test('1234567')).toBe(false);
      expect(lengthRule.test('12345678')).toBe(true);
      expect(lengthRule.test('123456789')).toBe(true);
    });

    it('should validate uppercase and lowercase letters', () => {
      const caseRule = defaultPasswordRules[1];
      expect(caseRule.test('abcdefgh')).toBe(false);
      expect(caseRule.test('ABCDEFGH')).toBe(false);
      expect(caseRule.test('AbcDefgh')).toBe(true);
    });

    it('should validate at least one number', () => {
      const digitRule = defaultPasswordRules[2];
      expect(digitRule.test('abcdefgh')).toBe(false);
      expect(digitRule.test('abcdefg1')).toBe(true);
      expect(digitRule.test('1bcdefgh')).toBe(true);
    });

    it('should validate at least one special character', () => {
      const specialRule = defaultPasswordRules[3];
      expect(specialRule.test('Abcdefgh1')).toBe(false);
      expect(specialRule.test('Abcdefgh1!')).toBe(true);
      expect(specialRule.test('Abcd@fgh1')).toBe(true);
    });
  });
});

describe('PasswordStrength Component', () => {
  describe('Basic Rendering', () => {
    it('should render password rules list', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="test" />
        </TestWrapper>
      );

      expect(screen.getByText(/At least 8 characters/)).toBeInTheDocument();
      expect(screen.getByText(/Includes uppercase and lowercase letters/)).toBeInTheDocument();
      expect(screen.getByText(/Includes at least one number/)).toBeInTheDocument();
      expect(screen.getByText(/Includes at least one special character/)).toBeInTheDocument();
    });

    it('should not render meter when showMeter is false', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="Abc123!@" showMeter={false} />
        </TestWrapper>
      );

      expect(screen.queryByText(/Password Strength:/)).not.toBeInTheDocument();
    });

    it('should not render meter when value is empty', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="" showMeter={true} />
        </TestWrapper>
      );

      expect(screen.queryByText(/Password Strength:/)).not.toBeInTheDocument();
    });

    it('should render meter when showMeter is true and value exists', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="Abc123!@" showMeter={true} />
        </TestWrapper>
      );

      expect(screen.getByText(/Password Strength:/)).toBeInTheDocument();
    });
  });

  describe('Password Rules Display', () => {
    it('should show checkmark for passed rules', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="Abcdefgh1!" />
        </TestWrapper>
      );

      const passedRules = screen.getAllByText(/✓/);
      expect(passedRules).toHaveLength(4);
    });

    it('should show cross for failed rules', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="abc" />
        </TestWrapper>
      );

      const failedRules = screen.getAllByText(/✗/);
      expect(failedRules).toHaveLength(4);
    });

    it('should display correct rule labels', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="test" />
        </TestWrapper>
      );

      expect(screen.getByText('✗ At least 8 characters')).toBeInTheDocument();
      expect(screen.getByText('✗ Includes uppercase and lowercase letters')).toBeInTheDocument();
      expect(screen.getByText('✗ Includes at least one number')).toBeInTheDocument();
      expect(screen.getByText('✗ Includes at least one special character')).toBeInTheDocument();
    });

    it('should apply success color to passed rules', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="Abcdefgh1!" />
        </TestWrapper>
      );

      const passedRule = screen.getByText('✓ At least 8 characters');
      expect(passedRule).toHaveStyle({ color: 'rgb(46, 125, 50)' });
    });

    it('should apply error color to failed rules', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="abc" />
        </TestWrapper>
      );

      const failedRule = screen.getByText('✗ At least 8 characters');
      expect(failedRule).toHaveStyle({ color: 'rgb(211, 47, 47)' });
    });
  });

  describe('Strength Meter Display', () => {
    it('should display "Weak" strength with error color', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="abcdefgh" />
        </TestWrapper>
      );

      const strengthText = screen.getByText('Password Strength: Weak');
      expect(strengthText).toBeInTheDocument();
      expect(strengthText).toHaveStyle({ color: 'rgb(211, 47, 47)' });
    });

    it('should display "Medium" strength with warning color', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="Abcdefgh1" />
        </TestWrapper>
      );

      const strengthText = screen.getByText('Password Strength: Medium');
      expect(strengthText).toBeInTheDocument();
      expect(strengthText).toHaveStyle({ color: 'rgb(237, 108, 2)' });
    });

    it('should display "Strong" strength with success color', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="Abcdefgh1!" />
        </TestWrapper>
      );

      const strengthText = screen.getByText('Password Strength: Strong');
      expect(strengthText).toBeInTheDocument();
      expect(strengthText).toHaveStyle({ color: 'rgb(46, 125, 50)' });
    });

    it('should display correct progress bar value', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="Abcdefgh1" />
        </TestWrapper>
      );

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    });
  });

  describe('Component Props', () => {
    it('should accept custom password rules', () => {
      const customRules: PasswordRule[] = [{ code: 'custom', label: 'Must contain xyz', test: v => v.includes('xyz') }];

      render(
        <TestWrapper>
          <PasswordStrength value="test" rules={customRules} />
        </TestWrapper>
      );

      expect(screen.getByText(/Must contain xyz/)).toBeInTheDocument();
      expect(screen.queryByText(/At least 8 characters/)).not.toBeInTheDocument();
    });

    it('should render in compact mode', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="Abc123!@" compact={true} />
        </TestWrapper>
      );

      expect(screen.getByText('Password Strength: Strong')).toBeInTheDocument();
    });

    it('should handle showMeter prop correctly', () => {
      const { rerender } = render(
        <TestWrapper>
          <PasswordStrength value="Abc123!@" showMeter={false} />
        </TestWrapper>
      );

      expect(screen.queryByText(/Password Strength:/)).not.toBeInTheDocument();

      rerender(
        <TestWrapper>
          <PasswordStrength value="Abc123!@" showMeter={true} />
        </TestWrapper>
      );

      expect(screen.getByText(/Password Strength:/)).toBeInTheDocument();
    });
  });

  describe('Password Scenarios', () => {
    it('should handle very weak password (no rules passed)', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="abc" />
        </TestWrapper>
      );

      expect(screen.getByText('Password Strength: Weak')).toBeInTheDocument();
      expect(screen.getAllByText(/✗/)).toHaveLength(4);
    });

    it('should handle weak password (1 rule passed)', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="abcdefgh" />
        </TestWrapper>
      );

      expect(screen.getByText('Password Strength: Weak')).toBeInTheDocument();
      expect(screen.getAllByText(/✓/)).toHaveLength(1);
      expect(screen.getAllByText(/✗/)).toHaveLength(3);
    });

    it('should handle medium password (2-3 rules passed)', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="Abcdefgh1" />
        </TestWrapper>
      );

      expect(screen.getByText('Password Strength: Medium')).toBeInTheDocument();
      expect(screen.getAllByText(/✓/)).toHaveLength(3);
      expect(screen.getAllByText(/✗/)).toHaveLength(1);
    });

    it('should handle strong password (all rules passed)', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="Abcdefgh1!" />
        </TestWrapper>
      );

      expect(screen.getByText('Password Strength: Strong')).toBeInTheDocument();
      expect(screen.getAllByText(/✓/)).toHaveLength(4);
      expect(screen.queryByText(/✗/)).not.toBeInTheDocument();
    });

    it('should handle empty/whitespace password', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="   " />
        </TestWrapper>
      );

      expect(screen.queryByText(/Password Strength:/)).not.toBeInTheDocument();
      expect(screen.getAllByText(/✗/)).toHaveLength(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined value', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="" />
        </TestWrapper>
      );

      expect(screen.queryByText(/Password Strength:/)).not.toBeInTheDocument();
      expect(screen.getAllByText(/✗/)).toHaveLength(4);
    });

    it('should handle very long password', () => {
      const longPassword = 'A'.repeat(1000) + 'b1!';
      render(
        <TestWrapper>
          <PasswordStrength value={longPassword} />
        </TestWrapper>
      );

      expect(screen.getByText('Password Strength: Strong')).toBeInTheDocument();
    });

    it('should handle special characters in password', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="Abcd@#$%^&*()" />
        </TestWrapper>
      );

      expect(screen.getByText('✓ Includes at least one special character')).toBeInTheDocument();
    });

    it('should handle non-English characters', () => {
      render(
        <TestWrapper>
          <PasswordStrength value="AÄÖÜß123!" />
        </TestWrapper>
      );

      expect(screen.getByText('Password Strength: Medium')).toBeInTheDocument();
    });
  });
});
