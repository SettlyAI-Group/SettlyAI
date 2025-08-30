import { Box,styled,Typography,} from '@mui/material';
import ScoresCardsContainer, { type IScoresCardsData } from './CardsContainer';

interface ISafetyScoresSectionProps {
  title: string;
  CardProps: IScoresCardsData[];
}
// parent wrapper - whole SafetyScoresSection
const SectionWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  }));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: 0,
  fontWeight: theme.typography.h3.fontWeight,
  color: theme.palette.text.primary,
}));

const SafetyScoresSection = ({ title, CardProps }:ISafetyScoresSectionProps) =>{
  return (
    <SectionWrapper>
      {/* header：title section */}
      <SectionTitle variant="h3">{title}</SectionTitle>

  {/* child container：scorescards layout（includes individual cards component） */}
    <ScoresCardsContainer cardProps={CardProps} /></SectionWrapper>
  );
}; 

export default SafetyScoresSection;