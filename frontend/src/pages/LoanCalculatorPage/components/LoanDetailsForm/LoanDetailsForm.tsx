import { useEffect, useState, type FC, type ChangeEvent, type FocusEvent } from 'react';
import { Box, FormControl, FormHelperText, InputAdornment, MenuItem, TextField, Grid } from '@mui/material';
import type { LoanFormValues, Frequency, RepaymentChoice } from '../../types/calculatorTypes';

interface LoanDetailsFormProps {
  values: LoanFormValues;
  onChange: <K extends keyof LoanFormValues>(key: K, val: LoanFormValues[K]) => void;
  showErrors: boolean;
}

const intPattern = /^\d*$/;
const decimalPattern = /^\d*([.]\d{0,4})?$/;

const LoanDetailsForm: FC<LoanDetailsFormProps> = ({ values, onChange, showErrors }) => {
  // local text states for decimal fields
  const [rateText, setRateText] = useState<string>(
    values.annualInterestRatePercent === '' ? '' : String(values.annualInterestRatePercent ?? '')
  );
  const [incomeText, setIncomeText] = useState<string>(
    values.netAnnualIncome === '' ? '' : String(values.netAnnualIncome ?? '')
  );

  // keep local state in sync if parent changes (e.g., reset)
  useEffect(() => {
    setRateText(values.annualInterestRatePercent === '' ? '' : String(values.annualInterestRatePercent ?? ''));
  }, [values.annualInterestRatePercent]);

  useEffect(() => {
    setIncomeText(values.netAnnualIncome === '' ? '' : String(values.netAnnualIncome ?? ''));
  }, [values.netAnnualIncome]);

  const commitDecimal = (key: 'annualInterestRatePercent' | 'netAnnualIncome') => (e: FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, '.').trim();
    if (raw === '') {
      onChange(key, '' as LoanFormValues[typeof key]);
      return;
    }
    if (decimalPattern.test(raw)) {
      onChange(key, Number(raw) as LoanFormValues[typeof key]);
    } else {
      // revert to last committed valid value
      if (key === 'annualInterestRatePercent')
        setRateText(values.annualInterestRatePercent === '' ? '' : String(values.annualInterestRatePercent ?? ''));
      else setIncomeText(values.netAnnualIncome === '' ? '' : String(values.netAnnualIncome ?? ''));
    }
  };

  const onLoanAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value.replace(/,/g, '');
    if (s === '') {
      onChange('loanAmount', '' as LoanFormValues['loanAmount']);
      return;
    }
    if (intPattern.test(s)) {
      onChange('loanAmount', Number(s) as LoanFormValues['loanAmount']);
    }
  };

  const onTermYearsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value.replace(/,/g, '');
    if (s === '') {
      onChange('termYears', '' as LoanFormValues['termYears']);
      return;
    }
    if (intPattern.test(s)) {
      onChange('termYears', Number(s) as LoanFormValues['termYears']);
    }
  };

  const onRateTyping = (e: ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value.replace(/,/g, '.');
    if (s === '' || decimalPattern.test(s)) setRateText(s);
  };

  const onIncomeTyping = (e: ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value.replace(/,/g, '.');
    if (s === '' || decimalPattern.test(s)) setIncomeText(s);
  };

  const isFieldInvalid = (value: number | '') => showErrors && !(Number(value) > 0);

  return (
    <Box component="form" noValidate autoComplete="off">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Loan Amount"
            type="text"
            value={values.loanAmount ?? ''}
            onChange={onLoanAmountChange}
            inputProps={{ inputMode: 'numeric', pattern: '\\d*' }}
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            error={isFieldInvalid(values.loanAmount)}
            helperText={isFieldInvalid(values.loanAmount) ? 'Enter a positive amount' : ' '}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Interest Rate"
            type="text"
            value={rateText}
            onChange={onRateTyping}
            onBlur={commitDecimal('annualInterestRatePercent')}
            inputProps={{ inputMode: 'decimal' }}
            InputProps={{ endAdornment: <InputAdornment position="end">% p.a.</InputAdornment> }}
            error={isFieldInvalid(values.annualInterestRatePercent)}
            helperText={isFieldInvalid(values.annualInterestRatePercent) ? 'Enter > 0' : ' '}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Loan Term"
            type="text"
            value={values.termYears ?? ''}
            onChange={onTermYearsChange}
            inputProps={{ inputMode: 'numeric', pattern: '\\d*' }}
            InputProps={{ endAdornment: <InputAdornment position="end">years</InputAdornment> }}
            error={isFieldInvalid(values.termYears)}
            helperText={isFieldInvalid(values.termYears) ? 'Enter > 0' : ' '}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <TextField
              select
              label="Repayment Frequency"
              value={values.frequency}
              onChange={e => onChange('frequency', e.target.value as Frequency)}
            >
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="Fortnightly">Fortnightly</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
            </TextField>
            <FormHelperText>Choose how often you make repayments.</FormHelperText>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <TextField
              select
              label="Repayment Type"
              value={values.repaymentChoice}
              onChange={e => onChange('repaymentChoice', e.target.value as RepaymentChoice)}
            >
              <MenuItem value="PrincipalAndInterest">Principal &amp; Interest</MenuItem>
              <MenuItem value="InterestOnly_1">Interest Only â€?1 Year</MenuItem>
              <MenuItem value="InterestOnly_2">Interest Only â€?2 Years</MenuItem>
              <MenuItem value="InterestOnly_3">Interest Only â€?3 Years</MenuItem>
              <MenuItem value="InterestOnly_4">Interest Only â€?4 Years</MenuItem>
              <MenuItem value="InterestOnly_5">Interest Only â€?5 Years</MenuItem>
            </TextField>
            <FormHelperText>P&amp;I or an initial Interest Only period.</FormHelperText>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Net Annual Income (Optional)"
            type="text"
            value={incomeText}
            onChange={onIncomeTyping}
            onBlur={commitDecimal('netAnnualIncome')}
            inputProps={{ inputMode: 'decimal' }}
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            helperText="Used to calculate your income ratio."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoanDetailsForm;

