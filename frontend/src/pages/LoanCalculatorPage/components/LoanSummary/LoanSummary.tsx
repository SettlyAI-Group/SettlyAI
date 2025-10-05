import { Grid } from '@mui/material';
import MetricCard from '../MetricCard';
import { toPercent, toCurrency, toCurrencyCeil } from '../../utils/format';
import type { LoanCalcResult } from '../../types/calculatorTypes';

interface Props {
  result: LoanCalcResult | null;
}

const LoanSummary = ({ result }: Props) => {
  // preformat the ceiled repayment so MetricCard renders it verbatim
  const repaymentCeiled = result ? toCurrencyCeil(result.paymentPerPeriod) : '—';

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 40 }}>
        <MetricCard label="Repayment per period" value={repaymentCeiled} />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <MetricCard label="Total Interest" value={result ? toCurrency(result.totalInterest) : '—'} />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <MetricCard label="Total Cost" value={result ? toCurrency(result.totalCost) : '—'} />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <MetricCard label="Income Ratio" value={result ? toPercent(result.incomeRatioPercent, 1) : '--'} />
      </Grid>
    </Grid>
  );
};

export default LoanSummary;
