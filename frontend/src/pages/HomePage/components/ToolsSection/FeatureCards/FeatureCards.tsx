import React from 'react';
import { Box, styled, Grid, Typography } from '@mui/material';
import { Home, AttachMoney, TrendingUp } from '@mui/icons-material';
import GlobalButton from '@/components/GlobalButton/GlobalButton';


const StyledCard = styled(Box)(({ theme }) => ({
  height: '300px',
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  borderRadius: '12px',
  padding: theme.spacing(5), 
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  cursor: 'pointer',
  flex: 1,
  '&:hover': {
    boxShadow: theme.shadows[3],
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '24px',
  background: theme.palette.primary.light,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const StyledIcon = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '24px',
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3), 
}));

const CardDescription = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '24px', 
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(4), 
  flex: 1,
}));


const featureCards = [
  {
    title: 'SettlyHome',
    description: "Whether you're exploring suburbs, planning your budget, or just figuring things out — Settly helps make it all easier.",
    icon: <Home />,
    ctaText: 'Let AI Guide me',
    onClick: () => console.log('Navigate to home features')
  },
  {
    title: 'SettlyLoan',
    description: 'Compare fixed vs variable, estimate repayments, and test loan stress scenarios.',
    icon: <AttachMoney />,
    ctaText: 'Simulate Loan',
    onClick: () => console.log('Navigate to loan calculator')
  },
  {
    title: 'SettlySuper',
    description: 'Use Your Super Wisely to Boost Your Home Plan',
    icon: <TrendingUp />,
    ctaText: 'Compare Super Strategy',
    onClick: () => console.log('Navigate to super optimization')
  }
];

const FeatureCards = () => (
  <Grid container spacing={4} justifyContent="center">
    {featureCards.map((card, index) => (
      <Grid size={{ xs: 12, sm: 12, md: 4 }} key={index}>
        <StyledCard onClick={card.onClick}>
          <IconContainer>
            <StyledIcon>
              {card.icon}
            </StyledIcon>
          </IconContainer>
          <CardTitle variant="h6">
            {card.title}
          </CardTitle>
          <CardDescription variant="body2">
            {card.description}
          </CardDescription>
          <GlobalButton
            onClick={(e) => {
              e.stopPropagation();
              card.onClick();
            }}
            variant="contained"
            width="full"
            height="50"
            style={{ alignSelf: 'flex-end' }}
          >
            {card.ctaText}
          </GlobalButton>
        </StyledCard>
      </Grid>
    ))}
  </Grid>
);

export default FeatureCards;