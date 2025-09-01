import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material';
import HeroSection from './components/HeroSection';
import ToolsSection from './components/ToolsSection';
import { FeatureDetailSections } from './components/FeatureSections';

// Styled Components
const PageContainer = styled(Box)(() => ({}));

const HomePage = (): JSX.Element => {
  return (
    <PageContainer>
      <HeroSection />
      <ToolsSection />
      <FeatureDetailSections />
    </PageContainer>
  );
};


export default HomePage;