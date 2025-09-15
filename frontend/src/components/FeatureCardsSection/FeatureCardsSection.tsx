import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material';

const SectionContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.background.default,
  width: '100%',
  display: 'flex',
  textalign: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  paddingInline: theme.spacing(20),
  paddingTop: theme.spacing(20),
}));

const MainTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h3,
  maxWidth: '100%',
  paddingBottom: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    maxwidth: 760,
  },
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle1,
  color: theme.palette.text.secondary,
  maxwidth: '100%',
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('md')]: {
    maxwidth: 800,
  },
}));

const CardsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  borderColor: 'black',
}));

const FeatureCardsSection = () => {
  return (
    <SectionContainer>
      <MainTitle>All-in-One Tools to Simplify Your Journey</MainTitle>
      <SubTitle>Let's plan smarter: from viewing a home to securing a loan and optimizing your super</SubTitle>
      <CardsContainer></CardsContainer>
    </SectionContainer>
  );
};

export default FeatureCardsSection;
