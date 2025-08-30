import React from 'react';
import {
  Box,
  LinearProgress,
  useMediaQuery,
  useTheme,
  styled,
  Typography,
  IconButton,
} from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material'; 

export interface IScoresCardsData {
  title: string;
  value: number;
  maxValue: number;
  showLevelText?: boolean;
  levelText?: string;
  showProgress?: boolean; 
  percent:number; 
  color: 'primary'|'success';
}

interface ICardsContainerProps {
  cardProps: IScoresCardsData[];
}

//outer wrapper of all cards
const CardsWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '&.desktop-mode': {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: theme.spacing(3),
  },
  '&.mobile-mode': {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
}));

//individual card 
const ScoreCardWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1.5),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  minHeight: theme.spacing(18),
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.light,
    boxShadow: theme.shadows[2],
  },
}));

const ScoreCard = ({title,value,maxValue,showLevelText,showProgress,levelText, color, percent}:IScoresCardsData) => {
  const theme = useTheme();
  return (
  <ScoreCardWrapper>
  {/* Header */}
  <Box display="flex" alignItems="center" justifyContent="space-between">
  <Typography variant="body1" color={theme.palette.text.secondary}>{title}</Typography>
  <IconButton size="small"> <InfoIcon fontSize="small" color="action" /></IconButton>
  </Box>
      
  {/* Value + MaxValue */}
  <Typography variant="h4" fontWeight={theme.typography.h4.fontWeight} 
   color={theme.palette[color].main}>{value}
  <Typography component="span" ml={1}>/{maxValue}</Typography></Typography>
        
  {/* Level Text */}
  {showLevelText && (<Typography 
    variant="body2" color={theme.palette[color].main} mt={1}> {levelText} </Typography>)} 

  {/* Progress Bar */}
  <Box mt={1}> 
    <LinearProgress variant="determinate" value={showProgress ? percent : 0}
    sx={{height: theme.spacing(1),borderRadius: theme.spacing(0.75),
    "& .MuiLinearProgress-track": {backgroundColor: theme.palette[color].light,},
    "& .MuiLinearProgress-bar": {backgroundColor: theme.palette[color].main,}, }}/>
  </Box> 
  </ScoreCardWrapper>
   );};
  

const CardsContainer: React.FC<ICardsContainerProps> = ({ cardProps }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const containerMode = isMobile ? 'mobile-mode' : 'desktop-mode';

  return (
    <CardsWrapper className={containerMode}>
      {cardProps.map((card, index) => (
        <ScoreCard key={index} {...card} />
      ))}
    </CardsWrapper>
  );
};

export default CardsContainer;
