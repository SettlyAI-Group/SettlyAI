import React from 'react';
import { Box, styled } from '@mui/material';
import ToolCard from './ToolCard';
import { featureCards } from './toolCardsData';

const FlexContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  justifyContent: 'center',
  flexWrap: 'wrap',
}));

const FeatureCardsSection = () => (
  <FlexContainer>
    {featureCards.map((card, index) => (
      <ToolCard
        key={index}
        title={card.title}
        description={card.description}
        icon={card.icon}
        ctaText={card.ctaText}
        onClick={card.onClick}
      />
    ))}
  </FlexContainer>
);

export default FeatureCardsSection;
