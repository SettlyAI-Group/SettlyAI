import React from 'react';
import { 
  Card as MuiCard, 
  CardContent, 
  Typography, 
  Box,
  Button
} from '@mui/material';

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  ctaText: string;
  onClick?: () => void;
  variant?: 'preview' | 'full';
}

const Card: React.FC<CardProps> = ({ 
  title, 
  description, 
  icon, 
  ctaText, 
  onClick,
  variant = 'preview' 
}) => {
  if (variant === 'full') {
    // Full version for detailed content (used in separate pages)
    return (
      <MuiCard
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          borderRadius: '16px',
          border: 'none',
          p: 4,
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            flexGrow: 1,
            p: 0,
          }}
        >
          <Box sx={{ mb: 4 }}>
            {React.isValidElement(icon) && icon.type === 'img' 
              ? React.cloneElement(icon, { style: { width: 80, height: 80, ...icon.props.style } })
              : React.cloneElement(icon, { sx: { fontSize: 80, color: 'primary.main' } })
            }
          </Box>
          
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              mb: 3,
              fontWeight: 600,
              color: '#1f2937'
            }}
          >
            {title}
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4,
              color: '#6b7280',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            {description}
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            onClick={onClick}
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '1rem',
              textTransform: 'none'
            }}
          >
            {ctaText}
          </Button>
        </CardContent>
      </MuiCard>
    );
  }

  // Preview version for homepage cards
  return (
    <MuiCard
      onClick={onClick}
      sx={{
        width: 380,
        height: 268,
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        borderRadius: '16px',
        border: 'none',
        transition: 'all 0.3s ease-in-out',
        '&:hover': onClick ? {
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-4px)'
        } : {}
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          flexGrow: 1,
          p: '32px'
        }}
      >
        <Box sx={{ mb: 3 }}>
          {React.isValidElement(icon) && icon.type === 'img' 
            ? React.cloneElement(icon, { style: { width: 48, height: 48, ...icon.props.style } })
            : React.cloneElement(icon, { sx: { fontSize: 48, color: '#6366f1' } })
          }
        </Box>
        
        <Typography 
          variant="h5" 
          component="h3" 
          sx={{ 
            mb: 3,
            fontWeight: 600,
            color: '#1f2937',
            fontSize: '1.25rem'
          }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            flexGrow: 1,
            color: '#6b7280',
            fontSize: '0.95rem',
            fontWeight: 400,
            lineHeight: 1.6
          }}
        >
          {description}
        </Typography>
        
        <Button
          variant="text"
          sx={{ 
            alignSelf: 'center',
            fontWeight: 500,
            color: '#6366f1',
            fontSize: '0.9rem',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.05)'
            }
          }}
        >
          {ctaText}
        </Button>
      </CardContent>
    </MuiCard>
  );
};

export default Card;