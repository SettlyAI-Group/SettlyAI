import React from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { 
  Home as HomeIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as StockIcon
} from '@mui/icons-material';
import Card from './Card';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactElement;
  route: string;
  ctaText: string;
}

const FeatureCardsSection: React.FC = () => {

  const featureCards: FeatureCard[] = [
    {
      title: 'SettlyHome',
      description: 'Discover your perfect home with smart property insights and market analysis.',
      icon: <HomeIcon sx={{ fontSize: 48, color: '#6366f1' }} />, // Purple icon
      route: '#home',
      ctaText: 'Explore Suburb & Homes'
    },
    {
      title: 'SettlyLoan',
      description: 'Get personalized loan recommendations and calculate your borrowing capacity.',
      icon: <AttachMoneyIcon sx={{ fontSize: 48, color: '#6366f1' }} />, // Purple icon
      route: '#loan',
      ctaText: 'Calculate Loan'
    },
    {
      title: 'SettlySuper',
      description: 'Optimize your superannuation strategy for property investment and retirement.',
      icon: <StockIcon sx={{ fontSize: 48, color: '#6366f1' }} />,
      route: '#super',
      ctaText: 'Optimize Super'
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
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}> {/* Responsive container */}
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
    </Box>
  );
};

export default FeatureCardsSection;