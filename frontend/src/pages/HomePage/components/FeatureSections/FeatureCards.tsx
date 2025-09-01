import React from 'react';
import { Box, styled, Grid, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Card from '../Card';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactElement;
  route: string;
  ctaText: React.ReactElement;
}

const CardsContainer = styled(Box)(() => ({
  width: '100%',
  maxWidth: 1200,
  marginLeft: 'auto',
  marginRight: 'auto',
}));


const FeatureCardsSection = () => {

  const featureCards: FeatureCard[] = [
    {
      title: 'SettlyHome',
      description: 'Explore smart suburbs picks and lifestyle-friendly neighbourhoods.',
      icon: <HomeIcon style={{ fontSize: 48 }} />,
      route: '#home',
      ctaText: (
        <Typography component="span" style={{ color: 'black' }}>
          Explore Suburb & Homes <ArrowForwardIcon fontSize="small" />
        </Typography>
      )
    },
    {
      title: 'SettlyLoan',
      description: 'Compare fixed vs variable, estimate repayments, and test loan stress scenarios.',
      icon: <AttachMoneyIcon style={{ fontSize: 48 }} />,
      route: '#loan',
      ctaText: (
        <Typography component="span" style={{ color: 'black' }}>
          Simulate Loan <ArrowForwardIcon fontSize="small" />
        </Typography>
      )
    },
    {
      title: 'SettlySuper',
      description: 'Use your Super Wisely to Boost Your Home Plan',
      icon: <TrendingUpIcon style={{ fontSize: 48 }} />,
      route: '#super',
      ctaText: (
        <Typography component="span" style={{ color: 'black' }}>
          Compare Super Strategy <ArrowForwardIcon fontSize="small" />
        </Typography>
      )
    }
  ];
  const handleCardClick = (route: string) => {
    // Extract section name from route (e.g., '#home' -> 'home')
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
            <Card
              title={card.title}
              description={card.description}
              icon={card.icon}
              ctaText={card.ctaText}
              onClick={() => handleCardClick(card.route)}
              variant="preview"
            />
          </Grid>
        ))}
      </Grid>
    </CardsContainer>
  );
};

export default FeatureCardsSection;