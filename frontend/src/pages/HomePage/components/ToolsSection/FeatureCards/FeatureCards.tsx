import React from 'react';
import { Box, styled, Grid, Typography } from '@mui/material';
import { Home, AttachMoney, TrendingUp } from '@mui/icons-material';
import GlobalButton from '@/components/GlobalButton/GlobalButton';


const StyledCard = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(5), 
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  cursor: 'pointer',
  flex: 1,
  '&:hover': {
    boxShadow: theme.shadows[3],
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: theme.spacing(6),
  height: theme.spacing(6),
  borderRadius: theme.spacing(3),
  background: theme.palette.primary.light,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const StyledIcon = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: theme.typography.h6.fontSize,
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3), 
}));

const CardDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(4), 
  flex: 1,
}));


const featureCards = [
  {
    title: 'SettlyHome',
    description: "Whether you're exploring suburbs, planning your budget, or just figuring things out — Settly helps make it all easier.",
    icon: <Home />,
    ctaText: 'Let AI Guide me',
    onClick: () => console.log('Navigate to home features')
  },
  {
    title: 'SettlyLoan',
    description: 'Compare fixed vs variable, estimate repayments, and test loan stress scenarios.',
    icon: <AttachMoney />,
    ctaText: 'Simulate Loan',
    onClick: () => console.log('Navigate to loan calculator')
  },
  {
    title: 'SettlySuper',
    description: 'Use Your Super Wisely to Boost Your Home Plan',
    icon: <TrendingUp />,
    ctaText: 'Compare Super Strategy',
    onClick: () => console.log('Navigate to super optimization')
  }
];

const FlexContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  justifyContent: 'center',
  flexWrap: 'wrap',
}));

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  ctaText: string;
  onClick: () => void;
}

const FeatureCard = ({ title, description, icon, ctaText, onClick }: FeatureCardProps) => (
  <StyledCard onClick={onClick}>
    <IconContainer>
      <StyledIcon>
        {icon}
      </StyledIcon>
    </IconContainer>
    <CardTitle variant="h5">
      {title}
    </CardTitle>
    <CardDescription variant="body2">
      {description}
    </CardDescription>
    <GlobalButton
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      variant="contained"
      width="full"
      height="50"
      style={{ alignSelf: 'flex-end' }}
    >
      {ctaText}
    </GlobalButton>
  </StyledCard>
);

const FeatureCardsSection = () => (
  <FlexContainer>
    {featureCards.map((card, index) => (
      <FeatureCard
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