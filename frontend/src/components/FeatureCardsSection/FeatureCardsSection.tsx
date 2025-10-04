import { Box, Typography, styled } from '@mui/material';
import FeatureCards from './components/FeatureCards/FeatureCards';
import SupportCards from './components/SupportCards/SupportCards';

const Container = styled(Box)(({ theme }) => ({
  background: theme.palette.background.default,
  margin: '0 auto',
  padding: theme.spacing(8, 2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(8, 4),
  },
}));

const HeaderContainer = styled('div')(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(16),
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h3,                 
  color: theme.palette.text.primary,
}));

const HeaderSubtitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle1,           
  fontWeight: theme.typography.fontWeightRegular, 
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(6),
  marginInline: 'auto',   
  maxWidth: theme.spacing(192),
}));

const FeatureCardsSection = () => {
  return (
    <Container>
      <HeaderContainer>
        <HeaderTitle>
          All-in-One Tools to Simplify Your Journey
        </HeaderTitle>
        <HeaderSubtitle>
          Let's plan smarter: from viewing a home to securing a loan and optimizing your super
        </HeaderSubtitle>
      </HeaderContainer>
      <FeatureCards />

        <HeaderContainer>
        <HeaderTitle>
          Understand the Support Available to You
        </HeaderTitle>
        <HeaderSubtitle>
          We help you understand what's available – from First Home Owner Grants 
          to Super Saver Schemes. Always up to date, easy to understand
        </HeaderSubtitle>
      </HeaderContainer>
       <SupportCards />
    </Container>
  );
};

export default FeatureCardsSection;