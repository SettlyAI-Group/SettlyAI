import React from 'react';
import {
  Box,
  Card,
  styled,
  Typography,
  useTheme,
  LinearProgress,
  Chip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';


export interface ICardConfig {
  id: string;
  title: string;
  value: string;
  maxValue: string;
  progressPercentage: number;
  label?: 'Low' | 'Medium' | 'High';
  color: 'success' | 'primary' | 'secondary';
}

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  minWidth: '280px',
  height: '160px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flexShrink: 0, 
  [theme.breakpoints.down('md')]: {
    minWidth: 'auto',
    width: '100%',
  },
}));

// define a single component to process multiple types of score cards
export const UniversalScoreCard: React.FC<{ config: ICardConfig }> = ({ config }) => {
  const theme = useTheme();
  
  const getColorValue = (colorType: string) => {
    switch (colorType) {
      case 'success':
        return theme.palette.success.main;
      case 'primary':
        return theme.palette.primary.main;
      case 'secondary':
        return theme.palette.secondary.main;
      default:
        return theme.palette.primary.main;
    }
  };

  // Function to generate card content based on config
  const generateCardContent = () => {
    return {
      header: (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing(2),
          }}
        >
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            {config.title}
          </Typography>
          <InfoIcon sx={{ color: 'text.disabled', fontSize: '1.2rem' }} />
        </Box>
      ),
      content: (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
          <Typography
            sx={{
              fontSize: '2.5rem',
              fontWeight: 600,
              lineHeight: 1,
              marginBottom: theme.spacing(2),
              color: getColorValue(config.color),
            }}
          >
            {config.value}
            <Typography
              component="span"
              variant="h5"
              sx={{ color: 'text.secondary', fontWeight: 400, ml: 0.5 }}
            >
              / {config.maxValue}
            </Typography>
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(1) }}>
            {config.label && (
              <Chip 
                label={config.label} 
                size="small" 
                sx={{ 
                  alignSelf: 'flex-start',
                  fontSize: '0.75rem',
                  height: '24px',
                  backgroundColor: config.color === 'success' ? theme.palette.success.light : theme.palette.grey[100],
                  color: config.color === 'success' ? theme.palette.success.dark : theme.palette.text.secondary,
                }} 
              />
            )}
            <LinearProgress
              variant="determinate"
              value={config.progressPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: `${getColorValue(config.color)}20`,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getColorValue(config.color),
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </Box>
      ),
    };
  };

  const cardContent = generateCardContent();

  return (
    <StyledCard>
      {cardContent.header}
      {cardContent.content}
    </StyledCard>
  );
};