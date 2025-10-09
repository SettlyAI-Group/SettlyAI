import { useState } from "react";
import { styled } from '@mui/material/styles';
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  Alert,
  IconButton,
} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { estimateSuper } from "../../../api/superEstimateApi";
import type { SuperEstimateRequestDto, SuperEstimateResponseDto } from "../../../api/superEstimateApi";

interface Props {
  onResult: (result: SuperEstimateResponseDto | null) => void;
}

const FormWrapper = styled('form')(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: 16,
  padding: theme.spacing(6),
  width: '100%',
  maxWidth: theme.spacing(224),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: 24,
  marginBottom: theme.spacing(6),
}));

const Row = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(8),
  marginBottom: theme.spacing(6),
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(4),
  },
}));

const InputGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  position: 'relative',
});

const HelperText = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  color: '#6b7280',
  marginTop: theme.spacing(1),
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  color: '#ef4444',
  marginTop: theme.spacing(0.5),
}));

const CheckboxWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(6),
}));

const FhssCard = styled(Box)(({ theme }) => ({
  maxWidth: theme.spacing(103),
  height: theme.spacing(31),
  borderRadius: 4,
  backgroundColor: '#EFF6FF',
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    height: 'auto',
    padding: theme.spacing(3),
  },
}));

const FhssCardText = styled(Typography)(({ theme }) => ({
  margin: 0,
  fontFamily: 'Inter, sans-serif',
  fontSize: 12,
  fontWeight: 500,
  color: '#1E40AF',
  lineHeight: 1.4,
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  [theme.breakpoints.down('sm')]: {
    fontSize: 11,
  },
}));

const ButtonWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
});

const SubmitButton = styled(Button)(({ theme }) => ({
  width: theme.spacing(43),
  height: theme.spacing(12),
  borderRadius: 24,
  background: 'linear-gradient(to right, #A855F7, #4C4CDC)',
  color: '#fff',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: 14,
  textTransform: 'none',
  '&:hover': {
    opacity: 0.9,
    background: 'linear-gradient(to right, #A855F7, #4C4CDC)',
  },
}));

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
  const [hoveredField, setHoveredField] = useState<string | null>(null);

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
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="subtitle2">
              Current Super Balance
            </Typography>
            <IconButton
              size="small"
              onMouseEnter={() => setHoveredField("balance")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <InfoOutlinedIcon fontSize="small" color="action" />
            </IconButton>
          </Box>
          <TextField
            name="balance"
            type="number"
            value={form.balance}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          {hoveredField === "balance" && (
            <HelperText>Enter your current superannuation balance</HelperText>
          )}
          {errors.balance && <ErrorText>{errors.balance}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              Annual Income
            </Typography>
            <IconButton
              size="small"
              onMouseEnter={() => setHoveredField("annualIncome")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <InfoOutlinedIcon fontSize="small" color="action" />
            </IconButton>
          </Box>
          <TextField
            name="annualIncome"
            type="number"
            value={form.annualIncome}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          {hoveredField === "annualIncome" && (
            <HelperText>Enter your yearly salary before tax</HelperText>
          )}
          {errors.annualIncome && <ErrorText>{errors.annualIncome}</ErrorText>}
        </InputGroup>
      </Row>

      {/* Second Row */}
      <Row>
        <InputGroup>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              Current Age
            </Typography>
            <IconButton
              size="small"
              onMouseEnter={() => setHoveredField("age")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <InfoOutlinedIcon fontSize="small" color="action" />
            </IconButton>
          </Box>
          <TextField
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          {hoveredField === "age" && (
            <HelperText>Your current age in years</HelperText>
          )}
          {errors.age && <ErrorText>{errors.age}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              Target Retirement Age
            </Typography>
            <IconButton
              size="small"
              onMouseEnter={() => setHoveredField("targetAge")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <InfoOutlinedIcon fontSize="small" color="action" />
            </IconButton>
          </Box>
          <TextField
            name="targetAge"
            type="number"
            value={form.targetAge}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          {hoveredField === "targetAge" && (
            <HelperText>
              Target retirement age must be greater than your current age
            </HelperText>
          )}
          {errors.targetAge && <ErrorText>{errors.targetAge}</ErrorText>}
        </InputGroup>
      </Row>

      {/* Third Row */}
      <Row>
        <InputGroup>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              Super Contribution Rate (%)
            </Typography>
            <IconButton
              size="small"
              onMouseEnter={() => setHoveredField("contributionRate")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <InfoOutlinedIcon fontSize="small" color="action" />
            </IconButton>
          </Box>
          <TextField
            name="contributionRate"
            type="number"
            value={form.contributionRate}
            onChange={handleChange}
            size="small"
            fullWidth
          />
          {hoveredField === "contributionRate" && (
            <HelperText>
              Percentage of income contributed to superannuation
            </HelperText>
          )}
          {errors.contributionRate && (
            <ErrorText>{errors.contributionRate}</ErrorText>
          )}
        </InputGroup>
      </Row>

      {/* FHSS */}
      <CheckboxWrapper>
        <Checkbox name="fhssSelected" checked={form.fhssSelected} onChange={handleChange} />
        <Typography sx={{ fontWeight: 500 }}>
          I want to explore withdrawing part of my super for home purchase under the FHSS scheme
        </Typography>
      </CheckboxWrapper>

      {form.fhssSelected && (
        <Row style={{ marginBottom: 24 }}>
          <InputGroup>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                Simulate FHSS withdrawal amount
              </Typography>
              <IconButton
                size="small"
                onMouseEnter={() => setHoveredField("fhssAmount")}
                onMouseLeave={() => setHoveredField(null)}
              >
                <InfoOutlinedIcon fontSize="small" color="action" />
              </IconButton>
            </Box>
            <TextField
              name="fhssAmount"
              type="number"
              value={form.fhssAmount ?? ""}
              onChange={handleChange}
              size="small"
              fullWidth
            />
            {hoveredField === "fhssAmount" && (
              <HelperText>
                Enter an amount up to $50,000. Actual eligibility depends on ATO rules.
              </HelperText>
            )}
            {errors.fhssAmount && <ErrorText>{errors.fhssAmount}</ErrorText>}

            <Box mt={2}>
              <FhssCard>
                <FhssCardText>
                  Cap Note: You may be able to withdraw up to $15,000 per financial year, with a total cap of $50,000.
                </FhssCardText>
                <FhssCardText>
                  Eligibility Note: Only personal voluntary contributions are eligible. Actual eligibility depends on ATO rules.
                </FhssCardText>
              </FhssCard>
            </Box>
          </InputGroup>
        </Row>
      )}

      <ButtonWrapper>
        <SubmitButton type="submit">Start My Plan</SubmitButton>
      </ButtonWrapper>
    </FormWrapper>
  );
}
