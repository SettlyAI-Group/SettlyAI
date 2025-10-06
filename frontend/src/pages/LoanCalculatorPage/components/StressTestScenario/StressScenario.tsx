import { Box, FormControlLabel, Slider, Stack, Switch, Typography } from '@mui/material';
import { toCurrencyCeil, toPercent } from '../../utils/format';

type Props = {
  // The minimum surface of fields consumed from useLoanCalculator
  calc: {
    stressRate: number;
    onStressRateChange: (rate: number) => void;
    stressResult: { paymentPerPeriod: number } | null;
    stressLoading: boolean;
    applyStressToSummary: boolean;
    setApplyStressToSummary: (v: boolean) => void;
  };
};

/**
 * Stress Test Scenario
 * - Lets the user override the interest rate via a slider (stress rate).
 * - Shows the stressed monthly repayment.
 * - Optional toggle to apply the stress result to the Loan Summary panel.
 */
const StressScenario = ({ calc }: Props) => {
  const { stressRate, onStressRateChange, stressResult, stressLoading, applyStressToSummary, setApplyStressToSummary } =
    calc;

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">Stress Test Scenario</Typography>

      {/* Slider area */}
      <Box px={2}>
        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
          Stress Interest Rate: {toPercent(stressRate)}
        </Typography>

        <Slider
          // You can tune min/max/step to match your product requirements
          min={0}
          max={15}
          step={0.1}
          value={stressRate}
          onChange={(_, v) => onStressRateChange(v as number)}
          valueLabelDisplay="auto"
          aria-label="Stress interest rate"
          disabled={stressLoading}
        />
      </Box>

      {/* Stressed repayment preview */}
      <Box
        sx={{
          borderRadius: 2,
          p: 2,
          bgcolor: 'background.paper',
          textAlign: 'center',
          border: theme => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5 }}>
          Monthly Repayment Under Stress
        </Typography>
        <Typography variant="h5">{stressResult ? toCurrencyCeil(stressResult.paymentPerPeriod) : '—'}</Typography>
      </Box>

      {/* Toggle to apply stress result to the main Loan Summary */}
      <FormControlLabel
        control={<Switch checked={applyStressToSummary} onChange={(_, c) => setApplyStressToSummary(c)} />}
        label={
          <Typography variant="body2">
            Apply stress rate to Loan Summary{' '}
            <Typography component="span" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
              (toggle to preview full impact)
            </Typography>
          </Typography>
        }
      />
    </Stack>
  );
};

export default StressScenario;
