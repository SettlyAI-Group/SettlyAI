import React from 'react';
import { Alert, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import LoanForm from '../../components/LoanDetalsForm/LoanForm';
import SimulationSummary from '../../components/SimulationSummary/SimulationSummary';
import StressSenario from '../../components/StressScenario/StressScenario';

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '1200px',
  margin: '0 auto',
}));

const LoanCalculatorPage = () => {
  const {} = useLoanCalculator();
  return <div>Loan Calculator is coming soon.</div>;
};

export default LoanCalculatorPage;
