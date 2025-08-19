import React from 'react';
import {
  Box,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { UniversalScoreCard, type ICardConfig } from './components/ScoresCard';

interface ISafetyScoresSectionProps {
  title: string;
  cardsConfig: ICardConfig[];
}

const CardsGroupDesktop = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  alignItems: 'stretch',
  flexWrap: 'nowrap',
  overflow: 'auto',
}));

const CardsGroupMobile = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(4),
}));

const SafetyScoresSection: React.FC<ISafetyScoresSectionProps> = ({
  title,
  cardsConfig,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Stack direction="column" spacing={8} sx={{ overflow: 'hidden' }}>
      <Typography variant="h4">{title}</Typography>
      
      {!isSmallScreen ? (
        <CardsGroupDesktop>
          {cardsConfig.map((config) => (
            <UniversalScoreCard key={config.id} config={config} />
          ))}
        </CardsGroupDesktop>
      ) : (
        <CardsGroupMobile direction="column">
          {cardsConfig.map((config) => (
            <UniversalScoreCard key={config.id} config={config} />
          ))}
        </CardsGroupMobile>
      )}
    </Stack>
  );
};

export default SafetyScoresSection;