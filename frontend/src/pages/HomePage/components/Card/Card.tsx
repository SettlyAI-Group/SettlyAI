import React from 'react';
import {
  Card as MuiCard,
  CardContent,
  Typography,
  Box,
  Button,
  type TypographyProps,
  type ButtonProps
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

interface CardProps {
  title: string | React.ReactElement;
  description: string | React.ReactElement;
  icon: React.ReactElement<{ style?: React.CSSProperties; sx?: any }>;
  ctaText: string | React.ReactElement;
  onClick?: () => void;
  variant?: 'preview' | 'full';
}


/* ---------- Styled Components ---------- */

const FullCard = styled(MuiCard)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  borderRadius: '16px',
  border: 'none',
  padding: '32px'
}));

const FullCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  flexGrow: 1,
  padding: 0
});

const PreviewCard = styled(MuiCard)<{ clickable: boolean }>(({ theme, clickable }) => ({
  width: 380,
  height: 268,
  display: 'flex',
  flexDirection: 'column',
  cursor: clickable ? 'pointer' : 'default',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  borderRadius: '16px',
  border: 'none',
  transition: 'all 0.3s ease-in-out',
  '&:hover': clickable
    ? {
      boxShadow: theme.shadows[8],
      transform: 'translateY(-4px)'
    }
    : {}
}));

const PreviewCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  flexGrow: 1,
  padding: '32px'
});

const FullTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: '24px',
  fontWeight: 600,
  color: theme.palette.text.primary
}));

const FullDescription = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: '32px',
  color: theme.palette.text.secondary,
  maxWidth: '600px',
  marginLeft: 'auto',
  marginRight: 'auto'
}));

const PreviewTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: '24px',
  fontWeight: 600,
  color: theme.palette.text.primary,
  fontSize: '1.25rem'
}));

const PreviewDescription = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: '32px',
  flexGrow: 1,
  color: theme.palette.text.secondary,
  fontSize: '0.95rem',
  fontWeight: 400,
  lineHeight: 1.6
}));

const FullButton = styled(Button)<ButtonProps>({
  padding: '12px 32px',
  fontSize: '1rem',
  textTransform: 'none'
});

const PreviewButton = styled(Button)<ButtonProps>(({ theme }) => ({
  alignSelf: 'center',
  fontWeight: 500,
  color: theme.palette.primary.main,
  fontSize: '0.9rem',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.light
  }
}));

const IconWrapperFull = styled(Box)({
  marginBottom: '32px'
});

const IconWrapperPreview = styled(Box)({
  marginBottom: '24px'
});

/* ---------- Component ---------- */

const Card = ({
  title,
  description,
  icon,
  ctaText,
  onClick,
  variant = 'preview'
}: CardProps) => {
  const theme = useTheme();
  if (variant === 'full') {
    return (
      <FullCard>
        <FullCardContent>
        <IconWrapperFull>
          {React.isValidElement(icon) && icon.type === 'img'
            ? React.cloneElement(icon, { style: { width: 80, height: 80, ...(icon.props as any).style } })
            : React.cloneElement(icon, { style: { fontSize: 80, color: theme.palette.primary.main } })
          }
        </IconWrapperFull>


          <FullTitle variant="h2" component="h1">
            {title}
          </FullTitle>

          <FullDescription variant="h5">
            {description}
          </FullDescription>

          <FullButton variant="contained" size="large" onClick={onClick}>
            {ctaText}
          </FullButton>
        </FullCardContent>
      </FullCard>
    );
  }

  return (
    <PreviewCard clickable={!!onClick} onClick={onClick}>
      <PreviewCardContent>
        <IconWrapperPreview>
          {React.isValidElement(icon) && icon.type === 'img'
            ? React.cloneElement(icon, { style: { width: 48, height: 48, ...icon.props.style } })
            : React.cloneElement(icon, { style: { fontSize: 48, color: theme.palette.primary.main, ...(icon.props as any).style } })
          }
        </IconWrapperPreview>


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
