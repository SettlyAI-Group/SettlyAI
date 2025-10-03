import type { FC, ChangeEvent } from 'react';
import { Box, FormControl, FormHelperText, InputAdornment, MenuItem, TextField, Grid } from '@mui/material';
import type { LoanFormValues, Frequency, RepaymentChoice } from '../../types/calculatorTypes';

interface LoanDetailsFormProps {
  values: LoanFormValues;
  onChange: <K extends keyof LoanFormValues>(key: K, val: LoanFormValues[K]) => void;
  showErrors: boolean;
}

const LoanDetailsForm: FC<LoanDetailsFormProps> = ({ values, onChange, showErrors }) => {
  const handleNumericChange =
    (key: keyof Pick<LoanFormValues, 'loanAmount' | 'annualInterestRatePercent' | 'termYears' | 'netAnnualIncome'>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/,/g, '');
      if (rawValue === '' || (!isNaN(Number(rawValue)) && Number(rawValue) >= 0)) {
        onChange(key, rawValue === '' ? '' : Number(rawValue));
      }
    };

  const isFieldInvalid = (value: number | '') => showErrors && !(Number(value) > 0);

  return (
    <Box component="form" noValidate autoComplete="off">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            label="Loan Amount"
            value={values.loanAmount}
            onChange={handleNumericChange('loanAmount')}
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            error={isFieldInvalid(values.loanAmount)}
            helperText={isFieldInvalid(values.loanAmount) ? 'Enter a positive amount' : ' '}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            required
            label="Interest Rate"
            value={values.annualInterestRatePercent}
            onChange={handleNumericChange('annualInterestRatePercent')}
            InputProps={{ endAdornment: <InputAdornment position="end">% p.a.</InputAdornment> }}
            error={isFieldInvalid(values.annualInterestRatePercent)}
            helperText={isFieldInvalid(values.annualInterestRatePercent) ? 'Enter > 0' : ' '}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            required
            label="Loan Term"
            value={values.termYears}
            onChange={handleNumericChange('termYears')}
            InputProps={{ endAdornment: <InputAdornment position="end">years</InputAdornment> }}
            error={isFieldInvalid(values.termYears)}
            helperText={isFieldInvalid(values.termYears) ? 'Enter > 0' : ' '}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
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

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <TextField
              select
              label="Repayment Type"
              value={values.repaymentChoice}
              onChange={e => onChange('repaymentChoice', e.target.value as RepaymentChoice)}
            >
              <MenuItem value="PrincipalAndInterest">Principal &amp; Interest</MenuItem>
              <MenuItem value="InterestOnly_1">Interest Only — 1 Year</MenuItem>
              <MenuItem value="InterestOnly_2">Interest Only — 2 Years</MenuItem>
              <MenuItem value="InterestOnly_3">Interest Only — 3 Years</MenuItem>
              <MenuItem value="InterestOnly_4">Interest Only — 4 Years</MenuItem>
              <MenuItem value="InterestOnly_5">Interest Only — 5 Years</MenuItem>
            </TextField>
            <FormHelperText>P&amp;I or an initial Interest Only period.</FormHelperText>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Net Annual Income (Optional)"
            value={values.netAnnualIncome ?? ''}
            onChange={handleNumericChange('netAnnualIncome')}
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            helperText="Used to calculate your income ratio."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoanDetailsForm;
