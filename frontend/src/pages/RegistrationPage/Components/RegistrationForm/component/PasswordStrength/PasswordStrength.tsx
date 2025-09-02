import { Stack, Typography, LinearProgress } from '@mui/material';

export type PasswordRule = {
  code: string;
  label: string;
  test: (v: string) => boolean;
};

export const defaultPasswordRules: PasswordRule[] = [
  { code: 'len', label: 'At least 8 characters', test: v => v.length >= 8 },
  {
    code: 'cases',
    label: 'Includes uppercase and lowercase letters',
    test: v => /[a-z]/.test(v) && /[A-Z]/.test(v),
  },
  {
    code: 'digit',
    label: 'Includes at least one number',
    test: v => /\d/.test(v),
  },
  {
    code: 'special',
    label: 'Includes at least one special character',
    test: v => /[^A-Za-z0-9]/.test(v),
  },
];

export function getStrength(score: number, total: number) {
  if (score <= 1)
    return {
      text: 'Weak',
      level: 'weak' as const,
      value: Math.round((score / total) * 100),
    };
  if (score <= 3)
    return {
      text: 'Medium',
      level: 'medium' as const,
      value: Math.round((score / total) * 100),
    };
  return {
    text: 'Strong',
    level: 'strong' as const,
    value: Math.round((score / total) * 100),
  };
}

export function evaluatePassword(value: string, rules: PasswordRule[] = defaultPasswordRules) {
  const results = rules.map(r => ({ ...r, passed: r.test(value) }));
  const passedCount = results.reduce((n, r) => n + (r.passed ? 1 : 0), 0);
  const strength = getStrength(passedCount, rules.length);
  return { results, passedCount, strength };
}

interface PasswordStrengthProps {
  value: string;
  rules?: PasswordRule[];
  showMeter?: boolean;
  compact?: boolean;
}

export const PasswordStrength = ({
  value,
  rules = defaultPasswordRules,
  showMeter = true,
  compact = false,
}: PasswordStrengthProps) => {
  const { results, strength } = evaluatePassword(value, rules);
  const hasValue = (value?.trim()?.length ?? 0) > 0;

  const colorMap: Record<typeof strength.level, 'error' | 'warning' | 'success'> = {
    weak: 'error',
    medium: 'warning',
    strong: 'success',
  };

  const titleVariant = compact ? 'body2' : 'subtitle2';
  const itemVariant = compact ? 'caption' : 'body2';
  const gapY = compact ? 0.25 : 0.5;

  return (
    <Stack spacing={gapY}>
      {showMeter && hasValue && (
        <Stack spacing={0.5}>
          <Typography variant={titleVariant} color={colorMap[strength.level]}>
            Password Strength: {strength.text}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={strength.value}
            sx={{
              height: compact ? 4 : 6,
              borderRadius: 999,
            }}
          />
        </Stack>
      )}

      <Stack spacing={0.25}>
        {results.map(r => (
          <Typography key={r.code} variant={itemVariant} color={r.passed ? 'success.main' : 'error.main'}>
            {r.passed ? '✓' : '✗'} {r.label}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
};
