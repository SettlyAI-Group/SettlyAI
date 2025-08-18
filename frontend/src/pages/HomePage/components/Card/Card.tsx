import React from 'react';
import { 
  Card as MuiCard, 
  CardContent, 
  Typography, 
  Box,
  Button,
  styled
} from '@mui/material';

interface ICardProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  ctaText: string;
  onClick?: () => void;
  variant?: 'preview' | 'full';
}

const FullCard = styled(MuiCard)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  borderRadius: theme.spacing(2),
  border: 'none',
  padding: theme.spacing(4),
}));

const PreviewCard = styled(MuiCard)<{ hasOnClick?: boolean }>(({ theme, hasOnClick }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: hasOnClick ? 'pointer' : 'default',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  borderRadius: theme.spacing(2),
  border: 'none',
  transition: 'all 0.3s ease-in-out',
  '&:hover': hasOnClick ? {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-4px)'
  } : {}
}));

const FullCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  flexGrow: 1,
  padding: 0,
}));

const PreviewCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  flexGrow: 1,
  padding: theme.spacing(4),
}));

const IconBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const FullIconBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const FullTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const PreviewTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 600,
  color: theme.palette.text.primary,
  fontSize: '1.25rem',
}));

const FullDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
  maxWidth: '600px',
  margin: `0 auto ${theme.spacing(4)}px auto`,
}));

const PreviewDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  flexGrow: 1,
  color: theme.palette.text.secondary,
  fontSize: '0.95rem',
  fontWeight: 400,
  lineHeight: 1.6,
}));

const FullButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  fontSize: '1rem',
  textTransform: 'none',
}));

const PreviewButton = styled(Button)(({ theme }) => ({
  alignSelf: 'center',
  fontWeight: 500,
  color: theme.palette.primary.main,
  fontSize: '0.9rem',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Card: React.FC<ICardProps> = ({ 
  title, 
  description, 
  icon, 
  ctaText, 
  onClick,
  variant = 'preview' 
}) => {
  if (variant === 'full') {
    return (
      <FullCard>
        <FullCardContent>
          <FullIconBox>
            {React.cloneElement(icon, { sx: { fontSize: 80, color: 'primary.main' } })}
          </FullIconBox>
          
          <FullTitle variant="h2" component="h1">
            {title}
          </FullTitle>
          
          <FullDescription variant="h5">
            {description}
          </FullDescription>
          
          <FullButton
            variant="contained"
            size="large"
            onClick={onClick}
          >
            {ctaText}
          </FullButton>
        </FullCardContent>
      </FullCard>
    );
  }

  return (
    <PreviewCard onClick={onClick} hasOnClick={!!onClick}>
      <PreviewCardContent>
        <IconBox>
          {React.cloneElement(icon, { sx: { fontSize: 48, color: 'primary.main' } })}
        </IconBox>
        
        <PreviewTitle variant="h5" component="h3">
          {title}
        </PreviewTitle>
        
        <PreviewDescription variant="body1">
          {description}
        </PreviewDescription>
        
        <PreviewButton variant="text">
          {ctaText}
        </PreviewButton>
      </PreviewCardContent>
    </PreviewCard>
  );
};

export default Card;