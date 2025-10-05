import { useMemo, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Container, Paper, Grid, Typography } from '@mui/material';
import LoanDetailsForm from './components/LoanDetailsForm';
import MetricCard from './components/MetricCard';
import { toCurrency, toPercent } from './utils/format';
import { annuityPaymentPerPeriod } from './utils/finance';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { useLoanCalculator } from './hooks/useLoanCalculator';
import type { LoanFormValues } from './types/calculatorTypes';

const initialValues: LoanFormValues = {
  loanAmount: 600000,
  annualInterestRatePercent: 6.5,
  termYears: 30,
  frequency: 'Monthly',
  repaymentChoice: 'PrincipalAndInterest',
  netAnnualIncome: 120000,
};

const LoanCalculatorPage = () => {
  const [showErrors, setShowErrors] = useState(false);
  const { values, onChange, simulate, result, loading, error } = useLoanCalculator(initialValues);

  const isFormValid = useMemo(
    () => Number(values.loanAmount) > 0 && Number(values.annualInterestRatePercent) > 0 && Number(values.termYears) > 0,
    [values]
  );

  const handleSimulate = async () => {
    setShowErrors(true);
    if (isFormValid) await simulate();
  };

  const isIo = values.repaymentChoice.startsWith('InterestOnly_');
  const ioYears = isIo ? Number(values.repaymentChoice.split('_')[1] ?? 0) : 0;

  // Estimate the repayment once the interest-only period ends
  const estimatedNextPmt = useMemo(() => {
    if (!isIo || !result) return null;
    const pniYears = Math.max(0, Number(values.termYears) - ioYears);
    if (pniYears === 0) return null;
    return annuityPaymentPerPeriod(
      Number(values.loanAmount),
      Number(values.annualInterestRatePercent),
      pniYears,
      values.frequency
    );
  }, [result, values, isIo, ioYears]);

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
          {/* --- Left: Form --- */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 6 }}>
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

          {/* --- Right: Summary --- */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 3, backgroundColor: 'background.paper' }}>
              <Typography variant="subtitle2" sx={{ mb: 6 }}>
                Loan Summary
              </Typography>

              {!result && !loading && (
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

              {result && (
                <>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <MetricCard
                        label={`${values.frequency} Repayment`}
                        value={toCurrency(result.paymentPerPeriod)}
                        secondary={isIo ? `During ${ioYears}-year interest-only period` : undefined}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <MetricCard
                        label="Debt-to-Income Ratio"
                        value={result.incomeRatioPercent > 0 ? toPercent(result.incomeRatioPercent, 1) : 'N/A'}
                        tooltip="The percentage of your income used for loan repayments. Only calculated if income is provided."
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <MetricCard label="Total Interest Payable" value={toCurrency(result.totalInterest)} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <MetricCard label="Total Loan Cost" value={toCurrency(result.totalCost)} />
                    </Grid>
                  </Grid>

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
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default LoanCalculatorPage;
