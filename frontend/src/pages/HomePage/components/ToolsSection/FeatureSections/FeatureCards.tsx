import React from 'react';
import { Box, styled, Grid, Typography, Button } from '@mui/material';
import { Home, AttachMoney, TrendingUp } from '@mui/icons-material';

const CardsContainer = styled(Box)(() => ({
  width: '100%',
  maxWidth: 1200,
  marginLeft: 'auto',
  marginRight: 'auto',
}));

const StyledCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '380px',
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
  '&:hover': {
    boxShadow: theme.shadows[3],
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '24px',
  background: '#E5F0FF',
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
  color: '#6B7280',
  marginBottom: theme.spacing(4), 
  flex: 1,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  boxSizing: 'border-box',
  width: '220px',
  height: '48px',
  background: '#E5F0FF',
  boxShadow: theme.shadows[2],
  borderRadius: '8px',
  color: theme.palette.primary.main,
  fontWeight: 500,
  textTransform: 'none',
  fontSize: '14px',
  alignSelf: 'flex-end',
  '&:hover': {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
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
  <CardsContainer>
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
            <ActionButton
              onClick={(e) => {
                e.stopPropagation();
                card.onClick();
              }}
              variant="contained"
            >
              {card.ctaText}
            </ActionButton>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  </CardsContainer>
);

export default FeatureCards;
