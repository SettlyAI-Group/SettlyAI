import React from 'react';
import { Box, styled, Typography } from '@mui/material';
import { Home, AttachMoney, TrendingUp } from '@mui/icons-material';
import GlobalButton from '@/components/GlobalButton/GlobalButton';
import { useTheme } from '@mui/material/styles';

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
  width: theme.spacing(8),
  height: theme.spacing(8),
  borderRadius: '50%',
  background: theme.palette.primary.light,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.secondary.light,
}));

const StyledIcon = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.dark,
  fontSize: theme.spacing(6),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

}));

const CardTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
}));

const CardDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  flex: 1,
}));

const StyledGlobalButton = styled(GlobalButton)(({ theme }) => ({
  alignSelf: 'flex-end',
  minWidth: theme.spacing(56),
  minHeight: theme.spacing(8),
  backgroundColor: theme.palette.secondary.light,
  color: theme.palette.secondary.dark,
  borderRadius: theme.shape.borderRadius * 3,
}));

const featureCards = [
  {
    title: 'SettlyHome',
    description:
      "Whether you're exploring suburbs, planning your budget, or just figuring things out — Settly helps make it all easier.",
    icon: <Home />,
    ctaText: 'Let AI Guide me',
    onClick: () => console.log('Navigate to home features'),
  },
  {
    title: 'SettlyLoan',
    description:
      'Compare fixed vs variable, estimate repayments, and test loan stress scenarios.',
    icon: <AttachMoney />,
    ctaText: 'Simulate Loan',
    onClick: () => console.log('Navigate to loan calculator'),
  },
  {
    title: 'SettlySuper',
    description: 'Use Your Super Wisely to Boost Your Home Plan',
    icon: <TrendingUp />,
    ctaText: 'Compare Super Strategy',
    onClick: () => console.log('Navigate to super optimization'),
  },
];

const FlexContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  justifyContent: 'center',
  flexWrap: 'wrap',
}));

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  ctaText: string;
  onClick: () => void;
}

const ToolCard = ({ title, description, icon, ctaText, onClick }: ToolCardProps) => {
  const theme = useTheme();

  return (
    <StyledCard onClick={onClick}>
      <IconContainer>
        <StyledIcon>{icon}</StyledIcon>
      </IconContainer>

      <CardTitle variant="h5">{title}</CardTitle>
      <CardDescription variant="body2">{description}</CardDescription>

      <StyledGlobalButton
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        variant="contained"
      >
        {ctaText}
      </StyledGlobalButton>
    </StyledCard>
  );
};

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
