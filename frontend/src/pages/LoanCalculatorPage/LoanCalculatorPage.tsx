import { useMemo, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Container, Paper, Grid, Typography, Stack } from '@mui/material';
import LoanDetailsForm from './components/LoanDetailsForm';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { useLoanCalculator } from './hooks/useLoanCalculator';
import type { LoanFormValues } from './types/calculatorTypes';
import LoanSummary from './components/LoanSummary/LoanSummary';
import StressScenario from './components/StressTestScenario/StressScenario';
import { annuityPaymentPerPeriod } from './utils/finance';
import { toCurrency } from './utils/format';

const initialValues: LoanFormValues = {
  loanAmount: 600000,
  annualInterestRatePercent: 6.5,
  termYears: 30,
  frequency: 'Monthly',
  repaymentChoice: 'PrincipalAndInterest',
  netAnnualIncome: 120000,
};

/**
 * Loan calculator page with clear UX:
 * - Summary dims when the form is changed, prompting user to recalculate.
 * - Stress card dims after a new base calc until slider is dragged again.
 * - When Apply is ON, the form is visually locked to avoid confusion.
 */
const LoanCalculatorPage: React.FC = () => {
  const [showErrors, setShowErrors] = useState(false);

  const {
    values,
    onChange,
    simulate,
    result,
    loading,
    error,

    // freshness / locking
    isFormStale,
    isStressStale,
    isFormLocked,

    // stress & summary
    summaryResult,
    stressRate,
    onStressRateChange,
    stressResult,
    stressLoading,
    applyStressToSummary,
    setApplyStressToSummary,
  } = useLoanCalculator(initialValues);

  // Validate fields
  const isFormValid = useMemo(
    () => Number(values.loanAmount) > 0 && Number(values.annualInterestRatePercent) > 0 && Number(values.termYears) > 0,
    [values]
  );

  // Handle calculate button
  const handleSimulate = async (): Promise<void> => {
    setShowErrors(true);
    if (isFormValid) await simulate();
  };

  // Interest-only helpers
  const isIo = values.repaymentChoice.startsWith('InterestOnly_');
  const ioYears = isIo ? Number(values.repaymentChoice.split('_')[1] ?? 0) : 0;

  // Estimated repayment after IO period (follows stress rate only when Apply is ON)
  const estimatedNextPmt = useMemo(() => {
    if (!isIo || !summaryResult) return null;
    const pniYears = Math.max(0, Number(values.termYears) - ioYears);
    if (pniYears === 0) return null;
    const effectiveRate = applyStressToSummary ? Number(stressRate) : Number(values.annualInterestRatePercent);
    return annuityPaymentPerPeriod(Number(values.loanAmount), effectiveRate, pniYears, values.frequency);
  }, [
    isIo,
    ioYears,
    values.loanAmount,
    values.termYears,
    values.frequency,
    values.annualInterestRatePercent,
    applyStressToSummary,
    stressRate,
    summaryResult,
  ]);

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h1" gutterBottom align="center">
          Loan Repayment Calculator
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Estimate your repayments and total loan cost. Adjust the details to see how they affect your budget.
        </Typography>

        <Grid container spacing={4}>
          {/* --- Left: Loan Details Form (lock when Apply is ON) --- */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              sx={{
                p: 3,
                opacity: isFormLocked ? 0.6 : 1,
                pointerEvents: isFormLocked ? 'none' : 'auto',
                transition: 'opacity 0.2s ease',
              }}
            >
              <Typography variant="h5" sx={{ mb: 6 }}>
                Loan Details
              </Typography>
              <LoanDetailsForm values={values} onChange={onChange} showErrors={showErrors} />
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSimulate}
                  disabled={loading}
                  sx={{ minWidth: 150 }}
                >
                  {loading ? <CircularProgress color="inherit" size={24} /> : 'Calculate'}
                </Button>
              </Box>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Paper>
          </Grid>

          {/* --- Right: Summary + Stress --- */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              sx={{
                p: 3,
                position: 'relative',
                transition: 'background-color 0.3s ease, opacity 0.2s ease',
                backgroundColor: applyStressToSummary
                  ? theme => theme.palette.action.hover
                  : theme => theme.palette.background.paper,
                border: theme =>
                  applyStressToSummary
                    ? `1px solid ${theme.palette.primary.light}`
                    : `1px solid ${theme.palette.divider}`,
                opacity: isFormStale && !loading ? 0.6 : 1,
              }}
            >
              {/* Stale overlay prompting user to recalc */}
              {isFormStale && !loading && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <Typography variant="caption" sx={{ bgcolor: 'background.paper', px: 1, py: 0.5, borderRadius: 1 }}>
                    Click <strong>Calculate</strong> to update
                  </Typography>
                </Box>
              )}

              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h5">Loan Summary</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: applyStressToSummary
                      ? theme => theme.palette.primary.light
                      : theme => theme.palette.grey[300],
                    color: applyStressToSummary
                      ? theme => theme.palette.primary.contrastText
                      : theme => theme.palette.text.secondary,
                  }}
                >
                  {applyStressToSummary
                    ? `Stress scenario (${stressRate.toFixed(1)}%)`
                    : `Base scenario (${values.annualInterestRatePercent}%)`}
                </Typography>
              </Stack>

              {!summaryResult && !loading && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 200,
                    color: 'text.secondary',
                  }}
                >
                  <Typography>Your calculation results will appear here.</Typography>
                </Box>
              )}

              {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
                  <CircularProgress />
                </Box>
              )}

              {summaryResult && (
                <>
                  <LoanSummary
                    result={summaryResult}
                    baseResult={result}
                    applyStressToSummary={applyStressToSummary}
                    frequency={values.frequency}
                  />

                  {isIo && estimatedNextPmt && (
                    <Alert severity="info" sx={{ mt: 3 }}>
                      After your {ioYears}-year interest-only period, your repayments will switch to Principal &
                      Interest. The estimated {values.frequency.toLowerCase()} repayment will be approximately{' '}
                      <strong>{toCurrency(estimatedNextPmt)}</strong> for the remaining term.
                    </Alert>
                  )}
                </>
              )}
            </Paper>

            {/* --- Stress Test Scenario (dim when stale, but keep slider active) --- */}
            <Paper
              sx={{
                p: 3,
                mt: 3,
                opacity: isStressStale && !stressLoading ? 0.6 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              <StressScenario
                calc={{
                  stressRate,
                  onStressRateChange,
                  stressResult,
                  stressLoading,
                  applyStressToSummary,
                  setApplyStressToSummary,
                }}
              />
              {isStressStale && !stressLoading && (
                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
                  Drag the slider to preview repayment at a different interest rate
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default LoanCalculatorPage;
