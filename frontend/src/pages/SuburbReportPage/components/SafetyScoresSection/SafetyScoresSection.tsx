import { Box, styled, Typography } from '@mui/material';
import ScoresCardsContainer, { type IScoresCardsDto } from './components/ScoresCardsContainer';

interface ISafetyScoresSectionProps {
  title: string;
  CardProps: IScoresCardsDto[];
}

const SectionWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  flexDirection: 'column',
  gap: theme.spacing(8),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: 0,
  color: theme.palette.text.primary,
}));

const SafetyScoresSection = ({ title, CardProps }: ISafetyScoresSectionProps) => {
  return (
    <SectionWrapper>
      <SectionTitle variant="h4">{title}</SectionTitle>
      <ScoresCardsContainer cardProps={CardProps} />
    </SectionWrapper>
  );
};

export default SafetyScoresSection;
