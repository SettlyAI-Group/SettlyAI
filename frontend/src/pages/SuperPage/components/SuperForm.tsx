import { useState } from "react";
import { styled } from '@mui/material/styles';
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  Alert,
} from "@mui/material";
import { estimateSuper } from "../../../api/superEstimateApi";
import type { SuperEstimateRequestDto, SuperEstimateResponseDto } from "../../../api/superEstimateApi";

interface Props {
  onResult: (result: SuperEstimateResponseDto | null) => void;
}

const FormWrapper = styled('form')({
  backgroundColor: '#ffffff',
  borderRadius: 16,
  padding: 24,
  width: '100%',
  maxWidth: 896,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
});

const FormTitle = styled(Typography)({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: 24,
  marginBottom: 24,
});

const Row = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 32,
  marginBottom: 24,
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: { 
    flexDirection: 'column',
    gap: 16,
  },
}));

const InputGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});

const HelperText = styled(Typography)({
  fontSize: 12,
  color: '#6b7280',
  marginTop: 4,
});

const ErrorText = styled(Typography)({
  fontSize: 12,
  color: '#ef4444',
  marginTop: 2,
});

const CheckboxWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 24,
  flexWrap: 'wrap',
});

const SubmitButton = styled(Button)({
  width: 172,
  height: 48,
  borderRadius: 24,
  background: 'linear-gradient(to right, #3b82f6, #6366f1)',
  color: '#fff',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: 14,
  textTransform: 'none',
  '&:hover': {
    opacity: 0.9,
    background: 'linear-gradient(to right, #3b82f6, #6366f1)',
  },
});

export default function SuperForm({ onResult }: Props) {
  const [form, setForm] = useState<SuperEstimateRequestDto>({
    balance: 20000,
    annualIncome: 80000,
    age: 30,
    targetAge: 65,
    contributionRate: 12,
    fhssSelected: false,
    fhssAmount: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (form.age <= 0) errs.age = "Age must be greater than 0";
    if (form.targetAge <= form.age)
      errs.targetAge = "Target retirement age must be greater than your current age";
    if (form.contributionRate < 0 || form.contributionRate > 100)
      errs.contributionRate = "Contribution rate must be between 0 and 100";
    if (form.balance < 0) errs.balance = "Balance cannot be negative";
    if (form.annualIncome < 0) errs.annualIncome = "Annual income cannot be negative";
    if (form.fhssSelected) {
      if (form.fhssAmount === undefined || form.fhssAmount === null)
        errs.fhssAmount = "FHSS Amount cannot be empty";
      else if (form.fhssAmount < 0)
        errs.fhssAmount = "FHSS Amount cannot be negative";
      else if (form.fhssAmount > 50000)
        errs.fhssAmount = "FHSS Amount cannot be greater than 50,000";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      onResult(null);
      return;
    }

    try {
      const result = await estimateSuper(form);
      onResult(result);
    } catch (err: any) {
      setApiError(err.message || "An unexpected error occurred");
      onResult(null);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      <FormTitle>Enter Your Super Details</FormTitle>

      {/* First Row */}
      <Row>
        <InputGroup>
          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Current Super Balance</Typography>
          <TextField
            name="balance"
            type="number"
            value={form.balance}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          <HelperText>Enter your current superannuation balance</HelperText>
          {errors.balance && <ErrorText>{errors.balance}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Annual Income</Typography>
          <TextField
            name="annualIncome"
            type="number"
            value={form.annualIncome}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          {errors.annualIncome && <ErrorText>{errors.annualIncome}</ErrorText>}
        </InputGroup>
      </Row>

      {/* Second Row */}
      <Row>
        <InputGroup>
          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Current Age</Typography>
          <TextField
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          {errors.age && <ErrorText>{errors.age}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Target Retirement Age</Typography>
          <TextField
            name="targetAge"
            type="number"
            value={form.targetAge}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          {errors.targetAge && <ErrorText>{errors.targetAge}</ErrorText>}
          <HelperText>Target retirement age must be greater than your current age</HelperText>
        </InputGroup>
      </Row>

      {/* Third Row */}
      <Row>
        <InputGroup>
          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Super Contribution Rate (%)</Typography>
          <TextField
            name="contributionRate"
            type="number"
            value={form.contributionRate}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          {errors.contributionRate && <ErrorText>{errors.contributionRate}</ErrorText>}
          <HelperText>Percentage of income contributed to superannuation</HelperText>
        </InputGroup>
      </Row>

      {/* FHSS */}
      <CheckboxWrapper>
        <Checkbox name="fhssSelected" checked={form.fhssSelected} onChange={handleChange} />
        <Typography sx={{ fontWeight: 500 }}>FHSS withdrawal</Typography>
      </CheckboxWrapper>

      {form.fhssSelected && (
        <Row style={{ marginBottom: 24 }}>
          <InputGroup>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>FHSS Amount</Typography>
            <TextField
              name="fhssAmount"
              type="number"
              value={form.fhssAmount ?? ""}
              onChange={handleChange}
              size="small"
              fullWidth
            />
            {errors.fhssAmount && <ErrorText>{errors.fhssAmount}</ErrorText>}
          </InputGroup>
        </Row>
      )}

      <SubmitButton type="submit">Start My Plan</SubmitButton>
    </FormWrapper>
  );
}
