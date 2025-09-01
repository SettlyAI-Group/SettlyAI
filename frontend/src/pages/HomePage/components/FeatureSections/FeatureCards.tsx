import React from 'react';
import { Box, styled, Grid, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactElement;
  route: string;
  buttonText: string;
}

const CardsContainer = styled(Box)(() => ({
  width: '100%',
  maxWidth: 1200,
  marginLeft: 'auto',
  marginRight: 'auto',
}));

const FeatureCard = styled(Box)(({ theme }) => ({
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

const FeatureCardsSection = () => {

  const featureCards: FeatureCard[] = [
    {
      title: 'SettlyHome',
      description: "Whether you're exploring suburbs, planning your budget, or just figuring things out — Settly helps make it all easier.",
      icon: <HomeIcon />,
      route: '#home',
      buttonText: 'Let AI Guide me'
    },
    {
      title: 'SettlyLoan',
      description: 'Compare fixed vs variable, estimate repayments, and test loan stress scenarios.',
      icon: <AttachMoneyIcon />,
      route: '#loan',
      buttonText: 'Simulate Loan'
    },
    {
      title: 'SettlySuper',
      description: 'Use Your Super Wisely to Boost Your Home Plan',
      icon: <TrendingUpIcon />,
      route: '#super',
      buttonText: 'Compare Super Strategy'
    }
  ];

  const handleCardClick = (route: string) => {
    const sectionId = route.replace('#', '') + '-section';
    const element = document.getElementById(sectionId);
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <CardsContainer>
      <Grid container spacing={4} justifyContent="center">
        {featureCards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 12, md: 4 }} key={index}>
            <FeatureCard>
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
                onClick={() => handleCardClick(card.route)}
                variant="contained"
              >
                {card.buttonText}
              </ActionButton>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>
    </CardsContainer>
  );
};

export default FeatureCardsSection;