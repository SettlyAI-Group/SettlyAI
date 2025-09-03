import React from 'react';
import { Box, styled, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { 
  Home as HomeIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as StockIcon
} from '@mui/icons-material';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactElement;
  route: string;
  ctaText: string;
}

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

const StyledHomeIcon = styled(HomeIcon)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.primary.main,
}));

const StyledAttachMoneyIcon = styled(AttachMoneyIcon)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.primary.main,
}));

const StyledStockIcon = styled(StockIcon)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.primary.main,
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
      description: 'Discover your perfect home with smart property insights and market analysis.',
      icon: <StyledHomeIcon />,
      route: '#home',
      ctaText: 'Explore Suburb & Homes'
    },
    {
      title: 'SettlyLoan',
      description: 'Get personalized loan recommendations and calculate your borrowing capacity.',
      icon: <StyledAttachMoneyIcon />,
      route: '#loan',
      ctaText: 'Calculate Loan'
    },
    {
      title: 'SettlySuper',
      description: 'Optimize your superannuation strategy for property investment and retirement.',
      icon: <StyledStockIcon />,
      route: '#super',
      ctaText: 'Optimize Super'
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
            <StyledCard onClick={() => handleCardClick(card.route)}>
              <IconContainer>
                {card.icon}
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
                  handleCardClick(card.route);
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
};

export default FeatureCardsSection;
