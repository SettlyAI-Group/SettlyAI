import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material';
import FeatureCardsSection from '../FeatureSections/FeatureCards';

// Styled Components - Tools Section
const ToolsContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1440px',
  height: '576px',
  background: '#F8F9FB',
  margin: '0 auto',
  marginTop: theme.spacing(-24), // Pull up much closer to HeroSection
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(8, 2), // Add more top padding to maintain internal spacing
  
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(8, 4),
    marginTop: theme.spacing(-4), // Less aggressive on larger screens
  },
}));

const ToolsTextContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4), // Reduce spacing between heading and cards
  maxWidth: '731px',
}));

const ToolsHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '36px',
  color: '#1f2937',
  width: '766px',
  height: '40px',
  margin: '0 auto',
  marginBottom: theme.spacing(7),
}));

const ToolsSubtitle = styled(Typography)(({ theme }) => ({
  color: '#6b7280',
  fontSize: '1rem',
  fontWeight: 400,
  width: '766px',
  height: '28px',
  margin: '0 auto',
  marginBottom: theme.spacing(13),
  lineHeight: 1.6,
}));

const ToolsSection = () => {
  return (
    <ToolsContainer>
      <ToolsTextContainer>
        <ToolsHeading variant="h4">
          All-in-One Tools to Simplify Your Journey
        </ToolsHeading>
        <ToolsSubtitle variant="body1">
          Let's plan smarter: from viewing a home to securing a loan and optimizing your super
        </ToolsSubtitle>
      </ToolsTextContainer>
      
      {/* Feature Cards Section */}
      <FeatureCardsSection />
    </ToolsContainer>
  );
};


export default ToolsSection;