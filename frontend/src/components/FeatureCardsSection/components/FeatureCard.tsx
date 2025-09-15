import { Box, styled, Typography, alpha } from '@mui/material';
import GlobalButton from '@/components/GlobalButton/GlobalButton';
import { Home, AttachMoney, TrendingUp } from '@mui/icons-material';

const CardContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  display: 'flex',
  flexdirection: 'column',
  maxWidth: '440px',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  gap: theme.spacing(3),
  boxShadow: theme.shadows[2],
  paddingInline: theme.spacing(5),
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  '&&': { borderRadius: theme.spacing(4) },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.secondary.light, 0.2),
}));

const CardLogo = styled(Box)(({ theme }) => ({
  color: theme.palette.secondary.dark,
  display: 'flex',
  alignItems: 'center',
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
  backgroundColor: alpha(theme.palette.secondary.light, 0.2),
  color: theme.palette.secondary.dark,
  borderRadius: theme.spacing(2),
}));

const FeatureCard = () => {
  return (
    <>
      <CardContainer>
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
        <CardButton>Let AI Guide me</CardButton>
      </CardContainer>

      <CardContainer>
        <LogoContainer>
          <CardLogo>
            <AttachMoney />
          </CardLogo>
        </LogoContainer>
        <CardTitle>SettlyLoan</CardTitle>
        <CardDescription>
          Compare fixed vs variable, estimate repayments, and test loan stress scenarios.
        </CardDescription>
        <CardButton>Simulate Loan</CardButton>
      </CardContainer>

      <CardContainer>
        <LogoContainer>
          <CardLogo>
            <TrendingUp />
          </CardLogo>
        </LogoContainer>
        <CardTitle>SettlySuper</CardTitle>
        <CardDescription>Use Your Super Wisely to Boost Your Home Plan</CardDescription>
        <CardButton>Compare Super Strategy</CardButton>
      </CardContainer>
    </>
  );
};

export default FeatureCard;
