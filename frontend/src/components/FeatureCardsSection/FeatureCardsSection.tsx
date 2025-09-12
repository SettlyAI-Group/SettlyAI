import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material';
import FeatureCards from './FeatureCards/FeatureCards';

const ToolsContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.background.default,
  margin: '0 auto',
  padding: theme.spacing(8, 2),

  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(8, 4),
  },
}));

const HeaderContainer = styled('div')(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6), 
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2), 
}));

const FeatureCardsSection = () => {
  return (
    <ToolsContainer>
      <HeaderContainer>
        <Typography variant="h4">
          All-in-One Tools to Simplify Your Journey
        </Typography>
        <Subtitle variant="body1">
          Let's plan smarter: from viewing a home to securing a loan and optimizing your super
        </Subtitle>
      </HeaderContainer>
      <FeatureCards />
    </ToolsContainer>
  );
};

export default FeatureCardsSection;
