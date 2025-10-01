import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { FREQUENCY_OPTIONS, IO_OPTIONS } from '../../constants/calculatorContants';
import type { FormState, IOYears, RepaymentFrequency } from '../../hooks/useLoanCalculator';
interface LoanDetailsFormProps {
  formState: FormState;
  onFormChange: (next: Partial<FormState>) => void;
  onPriceOrDepositChange: (next: Partial<FormState>) => void;
  onSimulate: () => void;
  isLoading?: boolean;
}

const LoanDetailsForm: React.FC<LoanDetailsFormProps> = ({
  formState,
  onFormChange,
  onPriceOrDepositChange,
  onSimulate,
  isLoading,
}) => {
  const ioHint =
    formState.ioYears > 0 ? `Interest-only for ${formState.ioYears} year(s), then switches to P&I.` : undefined;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Loan Details
        </Typography>

        <TextField
          fullWidth
          label="Property Price"
          type="number"
          margin="normal"
          value={formState.propertyPrice}
          onChange={e => onPriceOrDepositChange({ propertyPrice: Number(e.target.value) })}
          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
        />

        <TextField
          fullWidth
          label="Deposit Amount"
          type="number"
          margin="normal"
          value={formState.depositAmount}
          onChange={e => onPriceOrDepositChange({ depositAmount: Number(e.target.value) })}
          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
        />

        <TextField
          fullWidth
          label="Loan Amount"
          type="number"
          margin="normal"
          value={formState.loanAmount}
          onChange={e => onFormChange({ loanAmount: Number(e.target.value) })}
          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
          helperText="Automatically calculated, but can be overridden."
        />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Interest Rate"
              type="number"
              margin="normal"
              value={formState.annualInterestRate}
              onChange={e => onFormChange({ annualInterestRate: Number(e.target.value) })}
              InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Loan Term"
              type="number"
              margin="normal"
              value={formState.loanTermYears}
              onChange={e => onFormChange({ loanTermYears: Number(e.target.value) })}
              InputProps={{ endAdornment: <InputAdornment position="end">yrs</InputAdornment> }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Typography variant="caption" display="block" color="text.secondary">
              Repayment Frequency
            </Typography>
            <Select
              fullWidth
              value={formState.frequency}
              onChange={e => onFormChange({ frequency: e.target.value as RepaymentFrequency })}
            >
              {FREQUENCY_OPTIONS.map(f => (
                <MenuItem key={f} value={f}>
                  {f}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" display="block" color="text.secondary">
              Repayment Plan
            </Typography>
            <Select
              fullWidth
              value={formState.ioYears}
              onChange={e => onFormChange({ ioYears: Number(e.target.value) as IOYears })}
            >
              {IO_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            {ioHint && <FormHelperText>{ioHint}</FormHelperText>}
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Your Annual Pre-Tax Income"
          type="number"
          margin="normal"
          value={formState.annualIncomeBeforeTax}
          onChange={e => onFormChange({ annualIncomeBeforeTax: Number(e.target.value) })}
          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
        />

        <Box mt={2}>
          <Button variant="contained" color="primary" fullWidth onClick={onSimulate} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Simulate Loan'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoanDetailsForm;
