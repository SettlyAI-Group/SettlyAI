import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material';
import FeatureCards from './FeatureSections/FeatureCards';
const ToolsContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1440px',
  background: theme.palette.background.default,
  margin: '0 auto',
  padding: theme.spacing(8, 2),
  
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(8, 4),
  },
}));


const ToolsSection = () => {
  return (
    <ToolsContainer>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Typography variant="h4">
          All-in-One Tools to Simplify Your Journey
        </Typography>
        <Typography variant="body1" style={{ marginTop: '16px' }}>
          Let's plan smarter: from viewing a home to securing a loan and optimizing your super
        </Typography>
      </div>
      
      <FeatureCards />
    </ToolsContainer>
  );
};


export default ToolsSection;