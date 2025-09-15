import { Box, styled, Typography, alpha } from '@mui/material';
import GlobalButton from '@/components/GlobalButton/GlobalButton';
import { Home, AttachMoney, TrendingUp } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const CardGroupContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(4),
  alignItems: 'stretch',
  gridTemplateColumns: '1fr',
  justifyItems: 'stretch',
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
    gap: theme.spacing(12),
  },
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '100%',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  gap: theme.spacing(3),
  boxShadow: theme.shadows[2],
  paddingInline: theme.spacing(5),
  alignItems: 'flex-start',
  textAlign: 'left',
  '&&': { borderRadius: theme.spacing(4) },
  [theme.breakpoints.up('lg')]: {
    maxWidth: '420px',
  },
}));

const CardLogo = styled(Box)(({ theme }) => ({
  color: theme.palette.secondary.dark,
  display: 'flex',
  alignItems: 'center',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.secondary.light, 0.1),
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
}));

const CardDescription = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle1,
  color: theme.palette.text.secondary,
}));

const CardButton = styled(GlobalButton)(({ theme }) => ({
  ...theme.typography.p1,
  alignSelf: 'flex-end',
  minWidth: '200px',
  height: '40px',
  backgroundColor: alpha(theme.palette.secondary.light, 0.1),
  color: theme.palette.secondary.dark,
  borderRadius: theme.spacing(2),
  marginTop: 'auto',
  boxShadow: theme.shadows[2],
}));

const FeatureCards = () => {
  return (
    <CardGroupContainer>
      <FeatureCard>
        <LogoContainer>
          <CardLogo>
            <Home />
          </CardLogo>
        </LogoContainer>
        <CardTitle>SettlyHome</CardTitle>
        <CardDescription>
          Whether you’re exploring suburbs, planning your budget, or just figuring things out — Settly helps make it all
          easier.
        </CardDescription>
        <CardButton component={RouterLink} to="/chat">
          Let AI Guide me
        </CardButton>
      </FeatureCard>

      <FeatureCard>
        <LogoContainer>
          <CardLogo>
            <AttachMoney />
          </CardLogo>
        </LogoContainer>
        <CardTitle>SettlyLoan</CardTitle>
        <CardDescription>
          Compare fixed vs variable, estimate repayments, and test loan stress scenarios.
        </CardDescription>
        <CardButton component={RouterLink} to="/loan-calculator">
          Simulate Loan
        </CardButton>
      </FeatureCard>

      <FeatureCard>
        <LogoContainer>
          <CardLogo>
            <TrendingUp />
          </CardLogo>
        </LogoContainer>
        <CardTitle>SettlySuper</CardTitle>
        <CardDescription>Use Your Super Wisely to Boost Your Home Plan.</CardDescription>
        <CardButton component={RouterLink} to="/super">
          Compare Super Strategy
        </CardButton>
      </FeatureCard>
    </CardGroupContainer>
  );
};

export default FeatureCards;
