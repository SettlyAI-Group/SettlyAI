import { Grid } from '@mui/material';
import MetricCard from '../MetricCard';
import { toCurrency, toPercent } from '../../utils/format';
import type { LoanCalcResult } from '../../types/calculatorTypes';

interface Props {
  result: LoanCalcResult | null;
}

const LoanSummary = ({ result }: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <MetricCard label="Repayment per period" value={result ? toCurrency(result.paymentPerPeriod) : '—'} />
      </Grid>
      <Grid item xs={12} md={4}>
        <MetricCard label="Total Interest" value={result ? toCurrency(result.totalInterest) : '—'} />
      </Grid>
      <Grid item xs={12} md={4}>
        <MetricCard label="Total Cost" value={result ? toCurrency(result.totalCost) : '—'} />
      </Grid>
      <Grid item xs={12} md={4}>
        <MetricCard label="Income Ratio" value={result ? toPercent(result.incomeRatioPercent, 1) : '—'} />
      </Grid>
    </Grid>
  );
};

export default LoanSummary;
