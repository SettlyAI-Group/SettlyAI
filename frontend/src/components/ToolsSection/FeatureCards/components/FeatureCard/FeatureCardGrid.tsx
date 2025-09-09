import React from 'react';
import { Box, styled, Typography } from '@mui/material';
import GlobalButton from '@/components/GlobalButton/GlobalButton';
import { useTheme } from '@mui/material/styles';

const FlexContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  justifyContent: 'center',
  flexWrap: 'wrap',
}));

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

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  ctaText: string;
  onClick: () => void;
}

const FeatureCard = ({ title, description, icon, ctaText, onClick }: FeatureCardProps) => {
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

export default FeatureCard;
export { FlexContainer };
