import React from 'react';
import { Box, styled } from '@mui/material';

const FlexContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  justifyContent: 'center',
  flexWrap: 'wrap',
}));

interface FeatureCardGridContainerProps {
  children: React.ReactNode;
}

const FeatureCardGridContainer = ({ children }: FeatureCardGridContainerProps) => {
  return <FlexContainer>{children}</FlexContainer>;
};

export default FeatureCardGridContainer;
