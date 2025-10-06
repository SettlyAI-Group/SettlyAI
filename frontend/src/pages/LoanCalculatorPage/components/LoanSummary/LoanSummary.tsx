import { Grid } from '@mui/material';
import MetricCard from '../MetricCard';
import { toPercent, toCurrency, toCurrencyCeil } from '../../utils/format';
import type { LoanCalcResult, Frequency } from '../../types/calculatorTypes';

interface Props {
  result: LoanCalcResult | null;
  baseResult: LoanCalcResult | null;
  applyStressToSummary: boolean;
  frequency: Frequency;
}

const LoanSummary = ({ result, baseResult, applyStressToSummary, frequency }: Props) => {
  const repaymentCeiled = result ? toCurrencyCeil(result.paymentPerPeriod) : '--';
  const totalInterest = result ? toCurrency(result.totalInterest) : '--';
  const totalCost = result ? toCurrency(result.totalCost) : '--';
  const incomeRatio = result ? toPercent(result.incomeRatioPercent, 1) : '--';

  const showBaseComparison = applyStressToSummary && !!baseResult;

  const baseRepayment = showBaseComparison && baseResult ? toCurrencyCeil(baseResult.paymentPerPeriod) : null;
  const baseInterest = showBaseComparison && baseResult ? toCurrency(baseResult.totalInterest) : null;
  const baseCost = showBaseComparison && baseResult ? toCurrency(baseResult.totalCost) : null;
  const baseIncomeRatio = showBaseComparison && baseResult ? toPercent(baseResult.incomeRatioPercent, 1) : null;

  const repaymentLabel = `${frequency} Repayment`;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <MetricCard
          label={repaymentLabel}
          value={repaymentCeiled}
          secondary={baseRepayment ? `Base: ${baseRepayment}` : undefined}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MetricCard
          label="Total Interest"
          value={totalInterest}
          secondary={baseInterest ? `Base: ${baseInterest}` : undefined}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MetricCard label="Total Cost" value={totalCost} secondary={baseCost ? `Base: ${baseCost}` : undefined} />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MetricCard
          label="Income Ratio"
          value={incomeRatio}
          secondary={baseIncomeRatio ? `Base: ${baseIncomeRatio}` : undefined}
        />
      </Grid>
    </Grid>
  );
};

export default LoanSummary;
